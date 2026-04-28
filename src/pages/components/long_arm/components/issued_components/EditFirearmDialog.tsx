import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

type EditFormType = {
  full_name: string;
  unit: string;
  sub_unit: string;
//   station: string;
//   issued_unit: string;
//   faid: string;
  serial_no: string;
  make: string;
  type: string;
//   kind: string;
  caliber: string;
//   validated: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  editForm: EditFormType;
  editSaving: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
};

const EditFirearmDialog: React.FC<Props> = ({
  open,
  onClose,
  editForm,
  editSaving,
  onChange,
  onSubmit,
}) => {

    useEffect(() => {
        console.log(editForm)
    }, [])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Edit Firearm Details
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              fullWidth
              value={editForm.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Unit"
              fullWidth
              value={editForm.unit}
              onChange={(e) => onChange("unit", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Sub Unit"
              fullWidth
              value={editForm.sub_unit}
              onChange={(e) => onChange("sub_unit", e.target.value)}
            />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Station"
              fullWidth
              value={editForm.station}
              onChange={(e) => onChange("station", e.target.value)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Issuing Unit"
              fullWidth
              value={editForm.issued_unit}
              onChange={(e) => onChange("issued_unit", e.target.value)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <TextField label="FAID" fullWidth value={editForm.faid} disabled />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <TextField label="Serial No." fullWidth value={editForm.serial_no} disabled />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Make" fullWidth value={editForm.make} disabled />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Model" fullWidth value={editForm.type} disabled />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <TextField label="Kind" fullWidth value={editForm.kind} disabled />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <TextField label="Caliber" fullWidth value={editForm.caliber} disabled />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <TextField label="Validated" fullWidth value={editForm.validated} disabled />
          </Grid> */}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onSubmit}
          disabled={editSaving}
        >
          {editSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFirearmDialog;