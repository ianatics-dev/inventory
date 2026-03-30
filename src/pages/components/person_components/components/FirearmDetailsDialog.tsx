import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
    IconButton,
    Box,
    Divider,
    Button,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { getGun, getLatestIssuedImages, getGunId } from "../utils/firearmRow";
import UploadIcon from "@mui/icons-material/Upload";

const DetailItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>{value || "-"}</Typography>
    </Box>
);

type Props = {
    open: boolean;
    onClose: () => void;
    selectedRow: any | null;
    onOpenPar: (row: any) => void;
    onOpenEdit: () => void;
    onDelete: () => void;
    onOpenTurnIn: (row: any) => void;
    deleteLoading: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
};

const FirearmDetailsDialog: React.FC<Props> = ({
    open,
    onClose,
    selectedRow,
    onOpenPar,
    onOpenEdit,
    onDelete,
    onOpenTurnIn,
    deleteLoading,
    isAdmin,
    isSuperAdmin
}) => {
    const detailGun = getGun(selectedRow);
    const detailImages = selectedRow ? getLatestIssuedImages(selectedRow) : [];
    const canTurnIn = !!getGunId(selectedRow);

    const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        console.log("Selected files:", files);

        // 👉 You can connect this to your API (same as turn_in logic)
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Firearm Details
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {!selectedRow ? (
                    <Typography>No data selected.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: "1px solid rgba(0,0,0,0.12)",
                                    borderRadius: 2,
                                    height: "100%",
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Issued Information
                                </Typography>

                                <DetailItem
                                    label="Name"
                                    value={
                                        selectedRow?.full_name ??
                                        selectedRow?.issued_to?.full_name ??
                                        "-"
                                    }
                                />
                                <DetailItem label="Unit" value={selectedRow?.issued_to?.unit ?? "-"} />
                                <DetailItem label="Sub Unit" value={selectedRow?.issued_to?.sub_unit ?? "-"} />
                                <DetailItem label="Station" value={selectedRow?.issued_to?.station ?? "-"} />
                                <DetailItem label="Issuing Unit" value={selectedRow?.issued_to?.issued_unit ?? "-"} />

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Firearm Information
                                </Typography>

                                <DetailItem label="FAID" value={detailGun?.faid ?? "-"} />
                                <DetailItem label="Serial No." value={detailGun?.serial_no ?? "-"} />
                                <DetailItem label="Make" value={detailGun?.make ?? "-"} />
                                <DetailItem label="Model" value={detailGun?.model ?? "-"} />
                                <DetailItem label="Kind" value={detailGun?.kind ?? "-"} />
                                <DetailItem label="Caliber" value={detailGun?.caliber ?? "-"} />
                                <DetailItem label="Validated" value={detailGun?.validated ?? "-"} />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: "1px solid rgba(0,0,0,0.12)",
                                    borderRadius: 2,
                                    minHeight: 300,
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                {/* Upload Button */}
                                

                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    PAR Images
                                </Typography>

                                {detailImages.length === 0 ? (
                                    <Typography>No image available.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {detailImages.map((url, idx) => (
                                            <Grid item xs={12} md={6} key={idx}>
                                                <Box
                                                    component="img"
                                                    src={url}
                                                    alt={`PAR ${idx + 1}`}
                                                    onClick={() => onOpenPar(selectedRow)}
                                                    sx={{
                                                        width: "100%",
                                                        height: 430,
                                                        objectFit: "contain",
                                                        borderRadius: 1,
                                                        border: "1px solid rgba(0,0,0,0.12)",
                                                        background: "#fff",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                }}
            >
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>

                {(isAdmin || isSuperAdmin) && (
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<AssignmentReturnIcon />}
                            onClick={() => selectedRow && onOpenTurnIn(selectedRow)}
                            disabled={!canTurnIn}
                        >
                            Turn In
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={onOpenEdit}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={onDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default FirearmDetailsDialog;