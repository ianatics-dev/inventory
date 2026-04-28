import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedImages: string[];
};

const ParImagesDialog: React.FC<Props> = ({ open, onClose, selectedImages }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        PAR Image
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {selectedImages.length === 0 ? (
          <Typography>No image available.</Typography>
        ) : (
          <Grid container spacing={2}>
            {selectedImages.map((url, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Box
                  component="img"
                  src={url}
                  alt={`PAR ${idx + 1}`}
                  sx={{
                    width: "100%",
                    height: 420,
                    objectFit: "contain",
                    borderRadius: 1,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#fff",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParImagesDialog;