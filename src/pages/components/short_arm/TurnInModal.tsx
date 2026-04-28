import React, { useMemo, useRef, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import app from "../../../http_settings";

type Props = {
    open: boolean;
    onClose: () => void;
    gunId: number | string | null;
    faid?: string;
    onSuccess?: () => void; // refresh/remove row
};

export default function TurnInModal({ open, onClose, gunId, faid, onSuccess }: Props) {
    const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [files, setFiles] = useState<File[]>([]);
    const [saving, setSaving] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const reset = () => {
        setDate(new Date().toISOString().slice(0, 10));
        setFiles([]);
        setSaving(false);
    };

    const handleClose = () => {
        if (saving) return;
        reset();
        onClose();
    };

    const pickFiles = () => inputRef.current?.click();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = Array.from(e.target.files ?? []);
        if (!list.length) return;

        const next = [...files, ...list].slice(0, 2); // ✅ max 2
        setFiles(next);

        // allow selecting same file again
        e.target.value = "";
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const canSubmit = useMemo(() => {
        return !!gunId && !!date && files.length >= 1; // ✅ require at least 1 photo
    }, [gunId, date, files.length]);

    const handleSubmit = async () => {
        if (!gunId) return toast.error("Missing gun id.");
        if (files.length === 0) return toast.error("Please upload at least 1 image.");
        if (files.length > 2) return toast.error("Max 2 images only.");

        try {
            setSaving(true);

            const fd = new FormData();
            fd.append("date", date);

            // ✅ backend expects images[] (recommended)
            files.forEach((f) => fd.append("images", f));

            // ✅ IMPORTANT: do NOT manually set Content-Type for FormData in Axios;
            // Axios will set the boundary automatically.
            fd.append("gun", String(gunId));
            await app.post(`/api/guns/${gunId}/turn_in/`, fd);

            toast.success("Turn-in saved. Firearm is now ON_STOCK.");
            onSuccess?.();
            reset();
            onClose();
        } catch (err: any) {
            console.error(err);
            const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Turn-in failed.";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    Turn-In Firearm
                    {faid ? (
                        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                            FAID: {faid}
                        </Typography>
                    ) : null}
                </Box>
                <IconButton onClick={handleClose} disabled={saving}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            type="date"
                            fullWidth
                            label="Date Turned In"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            onClick={pickFiles}
                            disabled={saving || files.length >= 2}
                            fullWidth
                            sx={{ py: 1.2 }}
                        >
                            Upload 1–2 Images
                        </Button>

                        <input
                            ref={inputRef}
                            hidden
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onFileChange}
                        />

                        <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.75 }}>
                            You can upload 1 or 2 photos only.
                        </Typography>

                        {files.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                                {files.map((f, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            border: "1px solid rgba(0,0,0,0.12)",
                                            borderRadius: 1,
                                            px: 1.5,
                                            py: 1,
                                            mt: 1,
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {f.name}
                                        </Typography>
                                        <Button size="small" color="error" onClick={() => removeFile(idx)} disabled={saving}>
                                            Remove
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={saving}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit || saving}>
                    {saving ? "Saving..." : "Save Turn-In"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}