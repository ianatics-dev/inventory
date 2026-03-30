import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import app from "../../../http_settings";
import { logActivity } from "../utils";

type GunsForm = {
  faid: string;
  serial_no: string;
  make: string;
  model: string;
  kind: string;
  caliber: string;
  status: string;
  validated: "Yes" | "No";
};

type CreateGunForm = {
  disposition: "ON_STOCK" | "FOR_RELEASE";
  guns: GunsForm;
};

type CreateGunModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (createdGun: any) => void;
};

const initialState: CreateGunForm = {
  disposition: "ON_STOCK",
  guns: {
    faid: "",
    serial_no: "",
    make: "",
    model: "",
    kind: "",
    caliber: "",
    status: "",
    validated: "No",
  },
};

export default function CreateIssuanceModal({
  open,
  onClose,
  onCreated,
}: CreateGunModalProps) {
  const [form, setForm] = useState<CreateGunForm>(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) setForm(initialState);
  }, [open]);

  const handleClose = () => {
    setForm(initialState);
    onClose();
  };

  const setGunsField = (key: keyof GunsForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      guns: { ...prev.guns, [key]: value as any },
    }));
  };

  const canSubmit = useMemo(() => {
    return (
      form.guns.faid.trim() !== "" &&
      form.guns.serial_no.trim() !== "" &&
      form.guns.make.trim() !== "" &&
      form.guns.model.trim() !== "" &&
      form.disposition !== undefined
    );
  }, [form]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("faid", form.guns.faid);
      fd.append("serial_no", form.guns.serial_no);
      fd.append("make", form.guns.make);
      fd.append("model", form.guns.model);
      fd.append("kind", form.guns.kind);
      fd.append("caliber", form.guns.caliber);
      fd.append("status", form.guns.status);
      fd.append(
        "validated",
        form.guns.validated === "Yes" ? "Validated" : "Not Validated"
      );
      fd.append("disposition", form.disposition);

      const res = await app.post("/api/guns/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const username = localStorage.getItem("username");
      const user_id = localStorage.getItem("id");

      logActivity({
        action: "CREATE",
        module: "Add New Record (Firearms)",
        description: `User "${username}" successfully added a firearm`,
        target_id: user_id,
        target_name: username
      });

      toast.success("Firearm added");
      onCreated?.(res.data);
      handleClose();
    } catch (e) {
      console.error(e);
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Firearm</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="FAID"
              value={form.guns.faid}
              onChange={(e) => setGunsField("faid", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Serial No."
              value={form.guns.serial_no}
              onChange={(e) => setGunsField("serial_no", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              value={form.guns.make}
              onChange={(e) => setGunsField("make", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              value={form.guns.model}
              onChange={(e) => setGunsField("model", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kind"
              value={form.guns.kind}
              onChange={(e) => setGunsField("kind", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Caliber"
              value={form.guns.caliber}
              onChange={(e) => setGunsField("caliber", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Status"
              value={form.guns.status}
              onChange={(e) => setGunsField("status", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Validated"
              value={form.guns.validated}
              onChange={(e) => setGunsField("validated", e.target.value)}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>

          {/* ✅ Disposition dropdown (backend values) */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Disposition"
              value={form.disposition}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  disposition: e.target.value as CreateGunForm["disposition"],
                }))
              }
            >
              <MenuItem value="ON_STOCK">ON STOCK</MenuItem>
              <MenuItem value="FOR_RELEASE">FOR-RELEASE</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}