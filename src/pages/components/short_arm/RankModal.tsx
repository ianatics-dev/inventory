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
  Divider,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import app from "../../../http_settings";
import { logActivity } from "../utils";

type GunsForm = {
  // faid: string;
  serial_no: string;
  make: string;
  type: string;
  caliber: string;
  property_no: string;
  acquisition_date: string;
  acquisition_cost: string;
  cost_of_repair: string;
  current_depreciated_value: string;
  source: string;
  status: string;
  validated: "Yes" | "No";
  balance_qty: string;
  balance_value: string;
  on_hand_qty: string;
  on_hand_value: string;
  short_qty: string;
  short_value: string;
  over_qty: string;
  over_value: string;
};

type CreateGunForm = {
  // disposition: "ON_STOCK" | "FOR_RELEASE";
  guns: GunsForm;
};

type CreateGunModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (createdGun: any) => void;
};

const initialState: CreateGunForm = {
  // disposition: "ON_STOCK",
  guns: {
    // faid: "",
    serial_no: "",
    make: "",
    type: "",
    caliber: "",
    property_no: "",
    acquisition_date: "",
    acquisition_cost: "",
    cost_of_repair: "",
    current_depreciated_value: "",
    source: "PROCURED",
    status: "",
    validated: "No",
    balance_qty: "",
    balance_value: "",
    on_hand_qty: "",
    on_hand_value: "",
    short_qty: "",
    short_value: "",
    over_qty: "",
    over_value: "",
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
      // form.guns.faid.trim() !== "" &&
      form.guns.serial_no.trim() !== "" &&
      form.guns.make.trim() !== "" &&
      form.guns.type.trim() !== ""
    );
  }, [form]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      console.log(form)

      const fd = new FormData();

      // fd.append("faid", form.guns.faid);
      fd.append("serial_no", form.guns.serial_no);

      fd.append("make", form.guns.type);
      // fd.append("kind", form.guns.kind);
      fd.append("type", form.guns.type);
      fd.append("caliber", form.guns.caliber);
      fd.append("property_no", form.guns.property_no);
      fd.append("acquisition_date", form.guns.acquisition_date);
      fd.append("acquisition_cost", form.guns.acquisition_cost);
      fd.append("cost_of_repair", form.guns.cost_of_repair);
      fd.append(
        "current_depreciated_value",
        form.guns.current_depreciated_value
      );
      fd.append("source", form.guns.source);
      fd.append("status", form.guns.status);
      // fd.append(
      //   "validated",
      //   form.guns.validated === "Yes" ? "Validated" : "Not Validated"
      // );
      fd.append("balance_qty", form.guns.balance_qty);
      fd.append("balance_value", form.guns.balance_value);
      fd.append("on_hand_qty", form.guns.on_hand_qty);
      fd.append("on_hand_value", form.guns.on_hand_value);
      fd.append("short_qty", form.guns.short_qty);
      fd.append("short_value", form.guns.short_value);
      fd.append("over_qty", form.guns.over_qty);
      fd.append("over_value", form.guns.over_value);
      // fd.append("disposition", form.disposition);

      const res = await app.post("/api/guns/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      for (let [key, value] of fd.entries()) {
        console.log(`${key}: ${value}`);
      }

      const username = localStorage.getItem("username");
      const user_id = localStorage.getItem("id");

      logActivity({
        action: "CREATE",
        module: "Add New Record (Firearms)",
        description: `User "${username}" successfully added a firearm`,
        target_id: user_id,
        target_name: username,
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

  const SectionTitle = ({ title }: { title: string }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Divider />
    </Box>
  );

  const SummaryBlock = ({
    title,
    qtyLabel,
    qtyValue,
    qtyOnChange,
    valueLabel,
    valueValue,
    valueOnChange,
  }: {
    title: string;
    qtyLabel: string;
    qtyValue: string;
    qtyOnChange: (value: string) => void;
    valueLabel: string;
    valueValue: string;
    valueOnChange: (value: string) => void;
  }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
      >
        {title}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={qtyLabel}
            type="number"
            value={qtyValue}
            onChange={(e) => qtyOnChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={valueLabel}
            type="number"
            value={valueValue}
            onChange={(e) => valueOnChange(e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "92vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Add New Firearm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the firearm information below.
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 3,
          backgroundColor: "#f8f9fb",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fff",
          }}
        >
          <SectionTitle title="Basic Information" />

          <Grid container spacing={2.5}>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="FAID"
                value={form.guns.faid}
                onChange={(e) => setGunsField("faid", e.target.value)}
              />
            </Grid> */}

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
                label="Type"
                value={form.guns.type}
                onChange={(e) => setGunsField("type", e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kind"
                value={form.guns.kind}
                onChange={(e) => setGunsField("kind", e.target.value)}
              />
            </Grid> */}

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
                label="Property No."
                value={form.guns.property_no}
                onChange={(e) => setGunsField("property_no", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Acquisition Date"
                InputLabelProps={{ shrink: true }}
                value={form.guns.acquisition_date}
                onChange={(e) =>
                  setGunsField("acquisition_date", e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <SectionTitle title="Financial Details" />
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Acquisition Cost"
                type="number"
                value={form.guns.acquisition_cost}
                onChange={(e) =>
                  setGunsField("acquisition_cost", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cost of Repair"
                type="number"
                value={form.guns.cost_of_repair}
                onChange={(e) => setGunsField("cost_of_repair", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Depreciated Value"
                type="number"
                value={form.guns.current_depreciated_value}
                onChange={(e) =>
                  setGunsField("current_depreciated_value", e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <SectionTitle title="Status & Source" />
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Source"
                value={form.guns.source}
                onChange={(e) => setGunsField("source", e.target.value)}
              >
                <MenuItem value="PROCURED">PROCURED</MenuItem>
                <MenuItem value="DONATED">DONATED</MenuItem>
                <MenuItem value="TRANSFERRED">TRANSFERRED</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                value={form.guns.status}
                onChange={(e) => setGunsField("status", e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <SectionTitle title="Inventory Summary" />
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="Balance"
                qtyLabel="Balance Qty"
                qtyValue={form.guns.balance_qty}
                qtyOnChange={(value) => setGunsField("balance_qty", value)}
                valueLabel="Balance Value"
                valueValue={form.guns.balance_value}
                valueOnChange={(value) => setGunsField("balance_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="On Hand"
                qtyLabel="On Hand Qty"
                qtyValue={form.guns.on_hand_qty}
                qtyOnChange={(value) => setGunsField("on_hand_qty", value)}
                valueLabel="On Hand Value"
                valueValue={form.guns.on_hand_value}
                valueOnChange={(value) => setGunsField("on_hand_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="Short"
                qtyLabel="Short Qty"
                qtyValue={form.guns.short_qty}
                qtyOnChange={(value) => setGunsField("short_qty", value)}
                valueLabel="Short Value"
                valueValue={form.guns.short_value}
                valueOnChange={(value) => setGunsField("short_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="Over"
                qtyLabel="Over Qty"
                qtyValue={form.guns.over_qty}
                qtyOnChange={(value) => setGunsField("over_qty", value)}
                valueLabel="Over Value"
                valueValue={form.guns.over_value}
                valueOnChange={(value) => setGunsField("over_value", value)}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fff",
        }}
      >
        <Button onClick={handleClose} disabled={saving} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}