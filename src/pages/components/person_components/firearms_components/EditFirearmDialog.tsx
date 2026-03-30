import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Button,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export type EditFormType = {
  faid: string;
  serial_no: string;
  make: string;
  model: string;
  kind: string;
  caliber: string;
  disposition: string;
  validated: string;
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Edit Firearm
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="FAID"
              fullWidth
              value={editForm.faid}
              onChange={(e) => onChange("faid", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Serial No."
              fullWidth
              value={editForm.serial_no}
              onChange={(e) => onChange("serial_no", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Make"
              fullWidth
              value={editForm.make}
              onChange={(e) => onChange("make", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Model"
              fullWidth
              value={editForm.model}
              onChange={(e) => onChange("model", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Kind"
              fullWidth
              value={editForm.kind}
              onChange={(e) => onChange("kind", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Caliber"
              fullWidth
              value={editForm.caliber}
              onChange={(e) => onChange("caliber", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Disposition"
              select
              fullWidth
              value={editForm.disposition}
              onChange={(e) => onChange("disposition", e.target.value)}
            >
              <MenuItem value="ON_STOCK">ON_STOCK</MenuItem>
              <MenuItem value="FOR_RELEASE">FOR_RELEASE</MenuItem>
              <MenuItem value="ISSUED">ISSUED</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Validated"
              fullWidth
              value={editForm.validated}
              onChange={(e) => onChange("validated", e.target.value)}
            />
          </Grid>
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