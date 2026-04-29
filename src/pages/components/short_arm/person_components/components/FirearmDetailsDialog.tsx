import React, { useEffect, useState } from "react";
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
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import app from "../../../../../http_settings";

import { ToastContainer, toast } from "react-toastify";

import { getGun, getLatestIssuedImages, getGunId } from "../../utils/firearmRow";
import ParUploadDialog from "./ParUploadDialog";
import FirearmDialog from "./FirearmDialog";
import ParImagesDialog from "./ParImagesDialog";

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
    setSelectedRow: React.Dispatch<React.SetStateAction<any | null>>;
    onOpenPar: (row: any) => void;
    onOpenEdit: () => void;
    onDelete: () => void;
    onOpenTurnIn: (row: any) => void;
    deleteLoading: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    onRefresh?: () => Promise<void> | void;
};

const FirearmDetailsDialog: React.FC<Props> = ({
    open,
    onClose,
    selectedRow,
    setSelectedRow,
    onOpenPar,
    onOpenEdit,
    onDelete,
    onOpenTurnIn,
    deleteLoading,
    isAdmin,
    isSuperAdmin,
    onRefresh,
}) => {
    const detailGun = getGun(selectedRow);
    const detailImages = selectedRow ? getLatestIssuedImages(selectedRow) : [];
    const canTurnIn = !!getGunId(selectedRow);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [openFullDetails, setOpenFullDetails] = useState(false);
    const [fullDetailsRow, setFullDetailsRow] = useState<any>(null);
    const [imageOpen, setImageOpen] = useState(false);
    const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

    const handleUploadSubmit = async (files: File[], date: any) => {
        const gunId = getGunId(selectedRow);
        if (!gunId) return;

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("img", file);
            
        });
        formData.append("date", date);

        console.log(formData)
        try {
            const response = await app.post(
                `/api/guns/${gunId}/upload_par/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // update current modal row immediately
            setSelectedRow(response.data);

            setUploadOpen(false);

            // optional: refresh parent table/list too
            if (onRefresh) {
                await onRefresh();
            }
        } catch (error: any) {
            console.error("Upload failed:", error?.response?.data || error.message);
        }
    };

    const handleOpenFullDetails = async (gun: any) => {
        try {
            console.log(detailGun)
            setOpenFullDetails(true);
        } catch (err) {
            console.error(err);
        }
    };

    const openImageModal = (urls?: string[] | null) => {
        console.log(urls)
        const safe = (urls ?? []).filter(Boolean);

        if (!safe.length) {
            toast.info("No image available.");
            return;
        }

        setSelectedImageUrls(safe.slice(0, 2));
        setImageOpen(true);
    };

    return (
        <>
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
                                    <DetailItem
                                        label="Unit"
                                        value={selectedRow?.issued_to?.unit ?? "-"}
                                    />
                                    <DetailItem
                                        label="Sub Unit"
                                        value={selectedRow?.issued_to?.sub_unit ?? "-"}
                                    />
                                    {/* <DetailItem
                                        label="Station"
                                        value={selectedRow?.issued_to?.station ?? "-"}
                                    />
                                    <DetailItem
                                        label="Issuing Unit"
                                        value={selectedRow?.issued_to?.issued_unit ?? "-"}
                                    /> */}

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Firearm Information
                                    </Typography>

                                    {/* <DetailItem label="FAID" value={detailGun?.faid ?? "-"} /> */}
                                    <DetailItem
                                        label="Serial No."
                                        value={
                                            detailGun?.serial_no ? (
                                                <span
                                                    onClick={() => handleOpenFullDetails(detailGun)}
                                                    style={{
                                                        color: "#1976d2",
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    {detailGun.serial_no}
                                                </span>
                                            ) : (
                                                "-"
                                            )
                                        }
                                    />
                                    <DetailItem label="Make" value={detailGun?.make ?? "-"} />
                                    <DetailItem label="Type" value={detailGun?.type ?? "-"} />
                                    {/* <DetailItem label="Kind" value={detailGun?.kind ?? "-"} /> */}
                                    <DetailItem
                                        label="Caliber"
                                        value={detailGun?.caliber ?? "-"}
                                    />
                                    {/* <DetailItem
                                        label="Validated"
                                        value={detailGun?.validated ?? "-"}
                                    /> */}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        p: 2,
                                        border: "1px solid rgba(0,0,0,0.12)",
                                        borderRadius: 2,
                                        minHeight: 300,
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {/*  */}
                                    {((isAdmin || isSuperAdmin) && selectedRow.history.length === 0) && (
                                        <Tooltip title="Upload PAR image">
                                            <IconButton
                                                onClick={() => setUploadOpen(true)}
                                                sx={{
                                                    position: "absolute",
                                                    top: 12,
                                                    right: 12,
                                                    border: "1px solid rgba(0,0,0,0.12)",
                                                    backgroundColor: "#fff",
                                                    "&:hover": {
                                                        backgroundColor: "#f5f5f5",
                                                    },
                                                }}
                                            >
                                                <UploadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        PAR Images
                                    </Typography>

                                    {detailImages.length === 0 ? (
                                        <Typography>No image available.</Typography>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {detailImages.map((url: string, idx: number) => (
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

                            {/* <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={onDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </Button> */}
                        </Stack>
                    )}
                </DialogActions>
            </Dialog>

            <ParUploadDialog
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onUpload={handleUploadSubmit}
            />

            <FirearmDialog
                open={openFullDetails}
                onClose={() => setOpenFullDetails(false)}
                selectedRow={detailGun}
                onOpenImage={openImageModal}
            />

            <ParImagesDialog
                open={imageOpen}
                onClose={() => setImageOpen(false)}
                selectedImages={selectedImageUrls}
            />
        </>
    );
};

export default FirearmDetailsDialog;