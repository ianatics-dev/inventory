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
  Paper,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export type EditFormType = {
  // faid: string;
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
};

type Props = {
  open: boolean;
  onClose: () => void;
  editForm: any;
  // setEditForm: any,
  editSaving: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
};



const EditFirearmDialog: React.FC<Props> = ({
  open,
  onClose,
  editForm,
  // setEditForm,
  editSaving,
  onChange,
  onSubmit,
}) => {

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
          Edit Firearm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the firearm information below.
        </Typography>
      </DialogTitle>

      <DialogContent dividers>

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
              value={editForm.serial_no}
              onChange={(e) => onChange("serial_no", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
              value={editForm.make}
              onChange={(e) => onChange("make", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
              value={editForm.type}
              onChange={(e) => onChange("type", e.target.value)}
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
              value={editForm.caliber}
              onChange={(e) => onChange("caliber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Property No."
              value={editForm.property_no}
              onChange={(e) => onChange("property_no", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Acquisition Date"
                InputLabelProps={{ shrink: true }}
              value={editForm.acquisition_date}
              onChange={(e) =>
                onChange("acquisition_date", e.target.value)
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
              value={editForm.acquisition_cost}
              onChange={(e) =>
                onChange("acquisition_cost", e.target.value)
              }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cost of Repair"
                type="number"
              value={editForm.cost_of_repair}
              onChange={(e) => onChange("cost_of_repair", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Depreciated Value"
                type="number"
              value={editForm.current_depreciated_value}
              onChange={(e) =>
                onChange("current_depreciated_value", e.target.value)
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
              value={editForm.source}
              onChange={(e) => onChange("source", e.target.value)}
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
              // value={form.guns.status}
              // onChange={(e) => setGunsField("status", e.target.value)}
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
                qtyValue={editForm.balance_qty}
                qtyOnChange={(value) => onChange("balance_qty", value)}
                valueLabel="Balance Value"
                valueValue={editForm.balance_value}
                valueOnChange={(value) => onChange("balance_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="On Hand"
                qtyLabel="On Hand Qty"
                qtyValue={editForm.on_hand_qty}
                qtyOnChange={(value) => onChange("on_hand_qty", value)}
                valueLabel="On Hand Value"
                valueValue={editForm.on_hand_value}
                valueOnChange={(value) => onChange("on_hand_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="Short"
                qtyLabel="Short Qty"
                qtyValue={editForm.short_qty}
                qtyOnChange={(value) => onChange("short_qty", value)}
                valueLabel="Short Value"
                valueValue={editForm.short_value}
                valueOnChange={(value) => onChange("short_value", value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SummaryBlock
                title="Over"
                qtyLabel="Over Qty"
                qtyValue={editForm.over_qty}
                qtyOnChange={(value) => onChange("over_qty", value)}
                valueLabel="Over Value"
                valueValue={editForm.over_value}
                valueOnChange={(value) => onChange("over_value", value)}
              />
            </Grid>
          </Grid>
        </Paper>
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