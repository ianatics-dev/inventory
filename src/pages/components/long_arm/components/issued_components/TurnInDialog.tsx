import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Stack,
  TextField,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { getGun } from "../../utils/firearmRow";

type Props = {
  open: boolean;
  onClose: () => void;
  row: any | null;
  turnInDate: string;
  setTurnInDate: React.Dispatch<React.SetStateAction<string>>;
  turnInFiles: File[];
  turnInFileError: string;
  turnInSaving: boolean;
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

const TurnInDialog: React.FC<Props> = ({
  open,
  onClose,
  row,
  turnInDate,
  setTurnInDate,
  turnInFiles,
  turnInFileError,
  turnInSaving,
  onPickFiles,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Turn In Firearm
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Typography sx={{ fontWeight: 700 }}>
            FAID: {getGun(row)?.faid ?? "-"}
          </Typography>

          <TextField
            label="Date (optional)"
            type="date"
            value={turnInDate}
            onChange={(e) => setTurnInDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Box>
            <Button
              variant={turnInFileError ? "contained" : "outlined"}
              color={turnInFileError ? "error" : "primary"}
              startIcon={<CloudUploadIcon />}
              component="label"
            >
              Upload 1–2 Images
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={onPickFiles}
              />
            </Button>

            <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.8 }}>
              Selected:{" "}
              {turnInFiles.length
                ? turnInFiles.map((f) => f.name).join(", ")
                : "none"}
            </Typography>

            {turnInFileError && (
              <Typography sx={{ mt: 1, fontSize: 13, color: "error.main" }}>
                {turnInFileError}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={turnInSaving}
            startIcon={<AssignmentReturnIcon />}
          >
            {turnInSaving ? "Saving..." : "Confirm Turn In"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TurnInDialog;