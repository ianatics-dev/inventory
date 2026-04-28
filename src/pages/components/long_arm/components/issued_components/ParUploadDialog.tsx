import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type Props = {
    open: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void | Promise<void>;
};

const ParUploadDialog: React.FC<Props> = ({ open, onClose, onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(["", ""]);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleOpenFilePicker = (slotIndex: number) => {
        setActiveSlot(slotIndex);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || activeSlot === null) return;

        setSelectedFiles((prev) => {
            const updated = [...prev];
            updated[activeSlot] = file;
            return updated;
        });

        event.target.value = "";
    };

    const handleUpload = async () => {
        const filesToUpload = selectedFiles.filter((file): file is File => file !== null);
        if (filesToUpload.length === 0) return;

        try {
            setUploading(true);
            await onUpload(filesToUpload);
            handleClose();
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFiles([null, null]);
        setPreviewUrls(["", ""]);
        setActiveSlot(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onClose();
    };

    useEffect(() => {
        const urls = selectedFiles.map((file) => (file ? URL.createObjectURL(file) : ""));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [selectedFiles]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Import File
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                    }}
                >
                    {[0, 1].map((slotIndex) => {
                        const image = previewUrls[slotIndex];

                        return (
                            <Box
                                key={slotIndex}
                                onClick={() => handleOpenFilePicker(slotIndex)}
                                sx={{
                                    border: "2px dashed #9c27b0",
                                    borderRadius: 2,
                                    height: 180,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    position: "relative",
                                    "&:hover": {
                                        backgroundColor: "rgba(156, 39, 176, 0.04)",
                                    },
                                }}
                            >
                                {image ? (
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`preview-${slotIndex}`}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            backgroundColor: "#fafafa",
                                        }}
                                    />
                                ) : (
                                    <Box textAlign="center">
                                        <UploadFileIcon
                                            sx={{ fontSize: 40, color: "#9c27b0" }}
                                        />
                                        <Typography variant="body2">
                                            Click to select image
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={selectedFiles.every((file) => file === null) || uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ParUploadDialog;