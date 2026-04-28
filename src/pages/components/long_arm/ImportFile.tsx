import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import app from "../../../http_settings";

type ImportFileModalProps = {
  open: boolean;
  onClose: () => void;
    onImport: (file: File) => void;
};

const ImportFileModal: React.FC<ImportFileModalProps> = ({
  open,
  onClose,
    onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files)
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Import File</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            border: "2px dashed #9c27b0",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />
          <UploadFileIcon sx={{ fontSize: 40, color: "#9c27b0" }} />
          <Typography mt={1}>
            {selectedFile
              ? selectedFile.name
              : "Click to select CSV or Excel file"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!selectedFile}
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportFileModal;