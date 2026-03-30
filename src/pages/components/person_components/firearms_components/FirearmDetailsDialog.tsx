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

type GenericRow = {
  id?: number | string;
  col1?: string;
  col2?: string;
  col3?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedRow: any | null;
  onOpenImage: (urls?: string[] | null) => void;
  onOpenEdit: () => void;
  onDelete: () => void;
  deleteLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
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

const SmallTableCard = ({
  title,
  rows,
  headers,
}: {
  title: string;
  rows?: GenericRow[];
  headers: [string, string, string];
}) => {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        minHeight: 230,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {!rows || rows.length === 0 ? (
        <Typography>No data available.</Typography>
      ) : (
        <Box sx={{ maxHeight: 220, overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{headers[0]}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{headers[1]}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{headers[2]}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id ?? index}>
                  <TableCell>{row.col1 ?? "-"}</TableCell>
                  <TableCell>{row.col2 ?? "-"}</TableCell>
                  <TableCell>{row.col3 ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

const FirearmDetailsDialog: React.FC<Props> = ({
  open,
  onClose,
  selectedRow,
  onOpenImage,
  onOpenEdit,
  onDelete,
  deleteLoading,
  isAdmin,
  isSuperAdmin,
}) => {
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

                <DetailItem label="FAID" value={selectedRow?.faid} />
                <DetailItem label="Serial No." value={selectedRow?.serial_no} />
                <DetailItem label="Make" value={selectedRow?.make} />
                <DetailItem label="Model" value={selectedRow?.model} />
                <DetailItem label="Kind" value={selectedRow?.kind} />
                <DetailItem label="Caliber" value={selectedRow?.caliber} />
                <DetailItem label="Disposition" value={selectedRow?.disposition} />
                <DetailItem label="Validated" value={selectedRow?.validated} />

                <Divider sx={{ my: 2 }} />
              </Box>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* TOP HISTORY */}
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

                {/* BOTTOM LEFT TABLE */}
                <Grid item xs={12} >
                  <SmallTableCard
                    title="Table 1"
                    headers={["Column 1", "Column 2", "Column 3"]}
                    rows={selectedRow?.tableOneData || []}
                  />
                </Grid>

                {/* BOTTOM RIGHT TABLE */}
                <Grid item xs={12}>
                  <SmallTableCard
                    title="Table 2"
                    headers={["Column 1", "Column 2", "Column 3"]}
                    rows={selectedRow?.tableTwoData || []}
                  />
                </Grid>
              </Grid>
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
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onOpenEdit}
              disabled={!selectedRow}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              disabled={!selectedRow || deleteLoading}
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