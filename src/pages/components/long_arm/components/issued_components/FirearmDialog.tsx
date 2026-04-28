import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type HistoryRow = {
  id?: number | string;
  date?: string;
  event_type?: string;
  disposition?: string;
  image_urls?: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedRow: any | null;
  onOpenImage: (urls?: string[] | null) => void;
//   onOpenEdit: () => void;
//   onDelete: () => void;
//   deleteLoading: boolean;
//   isAdmin: boolean;
//   isSuperAdmin: boolean;
};

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

const SummaryBox = ({
  title,
  rows,
  minHeight = 210,
}: {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
  minHeight?: number;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        backgroundColor: "#fafafa",
        overflow: "hidden",
        minHeight,
        height: "100%",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Box>
        {rows.length === 0 ? (
          <Typography sx={{ p: 2 }}>No data available.</Typography>
        ) : (
          rows.map((row, index) => (
            <Box
              key={`${title}-${row.label}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom:
                  index !== rows.length - 1
                    ? "1px solid rgba(0,0,0,0.12)"
                    : "none",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRight: "1px solid rgba(0,0,0,0.12)",
                  backgroundColor: "#fcfcfc",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  {row.label}
                </Typography>
              </Box>

              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {row.value ?? "-"}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

const FirearmDialog: React.FC<Props> = ({
  open,
  onClose,
  selectedRow,
  onOpenImage,
//   onOpenEdit,
//   onDelete,
//   deleteLoading,
//   isAdmin,
//   isSuperAdmin,
}) => {
  const balanceRows = [
    { label: "Quantity", value: selectedRow?.balance_qty ?? 0 },
    { label: "Value", value: selectedRow?.balance_value ?? "0.00" },
  ];

  const onHandRows = [
    { label: "Quantity", value: selectedRow?.on_hand_qty ?? 0 },
    { label: "Value", value: selectedRow?.on_hand_value ?? "0.00" },
  ];

  const shortRows = [
    { label: "Quantity", value: selectedRow?.short_qty ?? 0 },
    { label: "Value", value: selectedRow?.short_value ?? "0.00" },
  ];

  const overRows = [
    { label: "Quantity", value: selectedRow?.over_qty ?? 0 },
    { label: "Value", value: selectedRow?.over_value ?? "0.00" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          Firearm Details
          {selectedRow?.faid ? (
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
              FAID: {selectedRow.faid}
            </Typography>
          ) : null}
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!selectedRow ? (
          <Typography>No data selected.</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* LEFT SIDE */}
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
                  Firearm Information
                </Typography>

                <DetailItem label="Serial No." value={selectedRow?.serial_no} />
                <DetailItem label="Make" value={selectedRow?.make} />
                <DetailItem label="Type" value={selectedRow?.type} />
                <DetailItem label="Caliber" value={selectedRow?.caliber} />
                <DetailItem label="Property No." value={selectedRow?.property_no} />
                <DetailItem
                  label="Acquisition Date"
                  value={selectedRow?.acquisition_date}
                />
                <DetailItem
                  label="Acquisition Cost"
                  value={selectedRow?.acquisition_cost}
                />
                <DetailItem
                  label="Cost of Repair"
                  value={selectedRow?.cost_of_repair}
                />
                <DetailItem
                  label="Current Depreciated Value"
                  value={selectedRow?.current_depreciated_value}
                />
                <DetailItem label="Source" value={selectedRow?.source} />
                <DetailItem label="Status" value={selectedRow?.status} />

                <Divider sx={{ my: 2 }} />
              </Box>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* HISTORY */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: 2,
                      minHeight: 300,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      History
                    </Typography>

                    {!selectedRow?.history || selectedRow.history.length === 0 ? (
                      <Typography>No history available.</Typography>
                    ) : (
                      <Box sx={{ maxHeight: 260, overflow: "auto" }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Event</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Disposition</TableCell>
                              <TableCell sx={{ fontWeight: 700, width: 150 }}>
                                Image
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {selectedRow.history.map((h: HistoryRow, index: number) => (
                              <TableRow key={h.id ?? index}>
                                <TableCell>{h.date ?? "-"}</TableCell>
                                <TableCell>{h.event_type ?? "-"}</TableCell>
                                <TableCell>{h.disposition ?? "-"}</TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<ImageIcon />}
                                    onClick={() => onOpenImage(h.image_urls)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* SECOND ROW - 3 BOXES */}
                <Grid item xs={12} md={4}>
                  <SummaryBox title="Balance" rows={balanceRows} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <SummaryBox title="On Hand" rows={onHandRows} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <SummaryBox title="Short" rows={shortRows} />
                </Grid>

                {/* LAST BOX BELOW */}
                <Grid item xs={12}>
                  <SummaryBox title="Over" rows={overRows} minHeight={160} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      {/* <DialogActions
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

      </DialogActions> */}
    </Dialog>
  );
};

export default FirearmDialog;