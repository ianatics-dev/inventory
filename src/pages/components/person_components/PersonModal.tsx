import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

import { FIXED_UNIT, SUB_UNITS, STATIONS } from "../../../data/personModalOption";
import app from "../../../http_settings";
import { logActivity } from "../utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (issuedGunRow: any) => void; // ✅ return updated gun row
};

type FormData = {
  rank: string;
  full_name: string;

  unit: string;
  sub_unit: string;
  station: string;
  issued_unit: string;

  gun_id: string;

  // auto-filled
  faid: string;
  serial_number: string;
  firearm_info: string;
  status: string;
  validated: string;

  date: string; // optional yyyy-mm-dd
  imgs: File[]; // ✅ 0..2
};

type GunFromApi = {
  id: number;
  faid: string;
  serial_no: string;
  make: string;
  model: string;
  kind: string;
  caliber: string;
  status: string;
  validated: string;
  disposition: "ON_STOCK" | "FOR_RELEASE" | "ISSUED";
};

type GunOption = {
  gun_id: number;
  label: string;

  faid: string;
  serial_no: string;
  make: string;
  model: string;
  kind: string;
  caliber: string;
  status: string;
  validated: string;
  disposition: string;
};

const RANK_OPTIONS = [
  "PGEN", "PMGEN", "PBGEN", "PCOL", "PLTCOL", "PMAJ", "PCPT", "PLT",
  "PEMS", "PCMS", "PSMS", "PMSg", "PSSg", "PCpl", "Pat",
];

const initialForm: FormData = {
  rank: "",
  full_name: "",

  unit: FIXED_UNIT,
  sub_unit: "",
  station: "",
  issued_unit: "",

  gun_id: "",

  faid: "",
  serial_number: "",
  firearm_info: "",
  status: "",
  validated: "",

  date: "",
  imgs: [],
};

export default function CreatePersonModal({ open, onClose, onCreated }: Props) {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [gunOptions, setGunOptions] = useState<GunOption[]>([]);
  const [loadingGuns, setLoadingGuns] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openFilePicker = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!open) return;

    const fetchAvailableGuns = async () => {
      try {
        setLoadingGuns(true);
        const res = await app.get<GunFromApi[]>("/api/guns/");
        const all = Array.isArray(res.data) ? res.data : [];
        const available = all.filter(
          (g) => g.disposition === "ON_STOCK" || g.disposition === "FOR_RELEASE"
        );

        const mapped: GunOption[] = available.map((g) => ({
          gun_id: g.id,
          faid: g.faid,
          serial_no: g.serial_no,
          make: g.make,
          model: g.model,
          kind: g.kind,
          caliber: g.caliber,
          status: g.status,
          validated: g.validated,
          disposition: g.disposition,
          label: `${g.faid} • ${g.serial_no} • ${g.make} ${g.model} (${g.disposition})`,
        }));

        setGunOptions(mapped);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load guns list.");
        setGunOptions([]);
      } finally {
        setLoadingGuns(false);
      }
    };

    fetchAvailableGuns();
  }, [open]);

  useEffect(() => {
    if (!open) setFormData(initialForm);
  }, [open]);

  const selectedGunOption = useMemo(() => {
    if (!formData.gun_id) return null;
    return gunOptions.find((o) => String(o.gun_id) === String(formData.gun_id)) ?? null;
  }, [formData.gun_id, gunOptions]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGunChange = (_: any, opt: GunOption | null) => {
    setFormData((prev) => ({
      ...prev,
      gun_id: opt ? String(opt.gun_id) : "",

      faid: opt?.faid ?? "",
      serial_number: opt?.serial_no ?? "",
      firearm_info: opt ? `${opt.make} / ${opt.model} / ${opt.kind} / ${opt.caliber}` : "",
      status: opt?.status ?? "",
      validated: opt?.validated ?? "",
    }));
  };

  // ✅ accepts 1 or 2 images
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 2) {
      toast.error("Only 1 or 2 images allowed.");
      setFormData((p) => ({ ...p, imgs: files.slice(0, 2) }));
      return;
    }
    setFormData((p) => ({ ...p, imgs: files }));
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!formData.rank) return toast.error("Rank is required.");
    if (!formData.full_name.trim()) return toast.error("Full Name is required.");
    if (!formData.sub_unit) return toast.error("Sub Unit is required.");
    if (!formData.station) return toast.error("Station is required.");
    if (!formData.issued_unit) return toast.error("Issued Unit is required.");
    if (!formData.gun_id) return toast.error("Please select a gun.");

    try {
      setSaving(true);

      const gunId = Number(formData.gun_id);

      const fd = new FormData();
      fd.append("rank", formData.rank);
      fd.append("name", formData.full_name.trim());
      fd.append("unit", formData.unit);
      fd.append("sub_unit", formData.sub_unit);
      fd.append("station", formData.station);
      fd.append("issued_unit", formData.issued_unit);

      if (formData.date) fd.append("date", formData.date);

      // check if no image
      if (formData.imgs?.length === 0) {
        return toast.error("Must Upload Image");
      }

      // ✅ IMPORTANT: append "img" multiple times (1 or 2)
      if (formData.imgs?.length) {
        formData.imgs.forEach((file) => fd.append("img", file));
      }

      const res = await app.post(`/api/guns/${gunId}/issue/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Firearm issued!");
      onCreated?.(res.data);
      onClose();
      setFormData(initialForm);

      const username = localStorage.getItem("username")
      const user_id = localStorage.getItem("id")

      logActivity({
        action: "CREATE",
        module: "Add New Record (Issue Firearm)",
        description: `User "${username}" successfully issued a firearm`,
        target_id: user_id,
        target_name: username
      });

    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        (err?.response?.data ? JSON.stringify(err.response.data) : "Failed to issue firearm.");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Record (Issue Firearm)</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Rank"
              name="rank"
              value={formData.rank}
              onChange={handleFieldChange}
            >
              {RANK_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleFieldChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Unit" name="unit" value={formData.unit} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Sub Unit"
              name="sub_unit"
              value={formData.sub_unit}
              onChange={handleFieldChange}
            >
              {SUB_UNITS.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Station"
              name="station"
              value={formData.station}
              onChange={handleFieldChange}
            >
              {STATIONS.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issued Unit"
              name="issued_unit"
              value={formData.issued_unit}
              onChange={handleFieldChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={gunOptions}
              value={selectedGunOption}
              loading={loadingGuns}
              onChange={handleGunChange}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                String(option.gun_id) === String(value.gun_id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Gun"
                  placeholder="Search gun..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingGuns ? <CircularProgress size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Issued (optional)"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFieldChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="FAID" value={formData.faid} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Serial Number" value={formData.serial_number} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Firearm Info" value={formData.firearm_info} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Status" value={formData.status} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Validated" value={formData.validated} disabled />
          </Grid>

          {/* ✅ Upload 1-2 images */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issuance Images (1–2 optional)"
              value={formData.imgs.length ? formData.imgs.map((f) => f.name).join(", ") : ""}
              placeholder="Upload 1 or 2 images..."
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={openFilePicker} edge="end">
                      <CloudUploadIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onClick={openFilePicker}
            />

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}