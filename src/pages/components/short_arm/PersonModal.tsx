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
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

import { FIXED_UNIT, SUB_UNITS } from "../../../data/personModalOption";
import app from "../../../http_settings";
import { logActivity } from "../utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (issuedGunRow: any) => void;
};

type FormData = {
  rank: string;
  name: string;
  unit: string;
  sub_unit: string;
  gun_id: string;
  property_no: string;
  serial_number: string;
  firearm_info: string;
  status: string;
  disposition: string;
  date: string;
  imgs: File[];
};

type GunFromApi = {
  id: number;
  serial_no: string | null;
  make: string | null;
  type: string | null;
  caliber: string | null;
  property_no: string | null;
  status: string | null;
  disposition: string | null;
  issued_to?: any | null;
};

type GunOption = {
  gun_id: number;
  serial_no: string;
  make: string;
  type: string;
  caliber: string;
  property_no: string;
  status: string;
  disposition: string;
};

const RANK_OPTIONS = [
  "PGEN",
  "PMGEN",
  "PBGEN",
  "PCOL",
  "PLTCOL",
  "PMAJ",
  "PCPT",
  "PLT",
  "PEMS",
  "PCMS",
  "PSMS",
  "PMSg",
  "PSSg",
  "PCpl",
  "Pat",
];

const initialForm: FormData = {
  rank: "",
  name: "",
  unit: FIXED_UNIT,
  sub_unit: "",
  gun_id: "",
  property_no: "",
  serial_number: "",
  firearm_info: "",
  status: "",
  disposition: "",
  date: "",
  imgs: [],
};

export default function CreatePersonModal({ open, onClose, onCreated }: Props) {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [gunOptions, setGunOptions] = useState<GunOption[]>([]);
  const [loadingGuns, setLoadingGuns] = useState(false);
  const [saving, setSaving] = useState(false);

  const [gunInputValue, setGunInputValue] = useState("");
  const [visibleGunCount, setVisibleGunCount] = useState(4);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setFormData(initialForm);
      setGunOptions([]);
      setGunInputValue("");
      setVisibleGunCount(4);
      return;
    }

    const fetchAvailableGuns = async () => {
      try {
        setLoadingGuns(true);

        // If your backend already supports this query param, use this:
        // const res = await app.get("/api/guns/?disposition=ON_STOCK");
        // console.log(res)
        const res = await app.get("/api/available_guns/");
        const raw = res.data;

        const rows: GunFromApi[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.results)
          ? raw.results
          : [];

        // const available = rows.filter(
        //   (g) => g.disposition === "ON_STOCK" && g.issued_to === null
        // );

        const mapped: GunOption[] = raw.map((g: any) => ({
          gun_id: g.id,
          serial_no: g.serial_no || "",
          make: g.make || "",
          type: g.type || "",
          caliber: g.caliber || "",
          property_no: g.property_no || "",
          status: g.status || "",
          disposition: g.disposition || "",
        }));

        console.log(mapped)

        setGunOptions(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load ON_STOCK firearms.");
        setGunOptions([]);
      } finally {
        setLoadingGuns(false);
      }
    };

    fetchAvailableGuns();
  }, [open]);

  const selectedGunOption = useMemo(() => {
    if (!formData.gun_id) return null;
    return (
      gunOptions.find((o) => String(o.gun_id) === String(formData.gun_id)) ?? null
    );
  }, [formData.gun_id, gunOptions]);

  const filteredGunOptions = useMemo(() => {
    const keyword = gunInputValue.trim().toLowerCase();

    if (!keyword) return gunOptions;

    return gunOptions.filter((gun) => {
      const text = [
        gun.serial_no,
        gun.make,
        gun.type,
        gun.caliber,
        gun.property_no,
        gun.status,
        gun.disposition,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [gunOptions, gunInputValue]);

  const visibleGunOptions = useMemo(() => {
    return filteredGunOptions.slice(0, visibleGunCount);
  }, [filteredGunOptions, visibleGunCount]);

  const handleLoadMoreGuns = () => {
    setVisibleGunCount((prev) => {
      if (prev >= filteredGunOptions.length) return prev;
      return prev + 4;
    });
  };

  const GunListboxComponent = React.forwardRef<HTMLUListElement, any>(
    function GunListbox(props, ref) {
      const { children, ...other } = props;

      const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const listboxNode = event.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = listboxNode;

        const reachedBottom = scrollTop + clientHeight >= scrollHeight - 10;

        if (reachedBottom) {
          handleLoadMoreGuns();
        }

        if (typeof other.onScroll === "function") {
          other.onScroll(event);
        }
      };

      return (
        <ul
          {...other}
          ref={ref}
          onScroll={handleScroll}
          style={{
            maxHeight: 220,
            overflowY: "auto",
            margin: 0,
            padding: 0,
            ...other.style,
          }}
        >
          {children}
        </ul>
      );
    }
  );

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGunChange = (_: any, opt: GunOption | null) => {
    setFormData((prev) => ({
      ...prev,
      gun_id: opt ? String(opt.gun_id) : "",
      property_no: opt?.property_no ?? "",
      serial_number: opt?.serial_no ?? "",
      firearm_info: opt ? `${opt.make} / ${opt.type} / ${opt.caliber}` : "",
      status: opt?.status ?? "",
      disposition: opt?.disposition ?? "",
    }));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length > 2) {
      toast.error("Only 1 or 2 images are allowed.");
      setFormData((prev) => ({
        ...prev,
        imgs: files.slice(0, 2),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imgs: files,
    }));
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!formData.rank) {
      toast.error("Rank is required.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!formData.unit.trim()) {
      toast.error("Unit is required.");
      return;
    }

    if (!formData.sub_unit) {
      toast.error("Sub Unit is required.");
      return;
    }

    if (!formData.gun_id) {
      toast.error("Please select a firearm.");
      return;
    }

    if (formData.imgs.length === 0) {
      toast.error("Please upload at least 1 image.");
      return;
    }

    try {
      setSaving(true);

      const gunId = Number(formData.gun_id);

      const fd = new FormData();
      fd.append("rank", formData.rank);
      fd.append("name", formData.name.trim());
      fd.append("unit", formData.unit.trim());
      fd.append("sub_unit", formData.sub_unit);

      if (formData.date) {
        fd.append("date", formData.date);
      }

      formData.imgs.forEach((file) => {
        fd.append("img", file);
      });

      const res = await app.post(`/api/guns/${gunId}/issue/`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Firearm issued successfully.");
      onCreated?.(res.data);
      onClose();
      setFormData(initialForm);

      const username = localStorage.getItem("username");
      const user_id = localStorage.getItem("id");

      logActivity({
        action: "CREATE",
        module: "Add New Record (Issue Firearm)",
        description: `User "${username}" successfully issued a firearm`,
        target_id: user_id,
        target_name: username,
      });
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.detail ||
        (err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to issue firearm.");

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
              {RANK_OPTIONS.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleFieldChange}
            />
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
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={visibleGunOptions}
              value={selectedGunOption}
              loading={loadingGuns}
              inputValue={gunInputValue}
              onInputChange={(_, value) => {
                setGunInputValue(value);
                setVisibleGunCount(4);
              }}
              onOpen={() => {
                setVisibleGunCount(4);
              }}
              onChange={handleGunChange}
              filterOptions={(x) => x}
              disablePortal
              ListboxComponent={GunListboxComponent}
              getOptionLabel={(option) =>
                `${option.serial_no} - ${option.make} / ${option.type} / ${option.caliber}`
              }
              isOptionEqualToValue={(option, value) =>
                String(option.gun_id) === String(value.gun_id)
              }
              renderOption={(props, option) => (
                <li {...props} key={option.gun_id}>
                  <Box>
                    <Typography variant="body2">
                      {option.serial_no} - {option.make} / {option.type} / {option.caliber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Property No: {option.property_no || "-"} | Status: {option.status} |{" "}
                      {option.disposition}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Gun"
                  placeholder="Search ON_STOCK firearm..."
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
              label="Date Issued"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFieldChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Property No"
              value={formData.property_no}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Serial Number"
              value={formData.serial_number}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Firearm Info"
              value={formData.firearm_info}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Status"
              value={formData.status}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Disposition"
              value={formData.disposition}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Issuance Images"
              value={
                formData.imgs.length
                  ? formData.imgs.map((file) => file.name).join(", ")
                  : ""
              }
              placeholder="Upload 1 or 2 images"
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

            {formData.imgs.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Selected: {formData.imgs.length} file(s)
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}