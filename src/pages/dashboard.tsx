import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  Divider,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import ValidationProgressRow from "./ValidationProgressRow";
import app from "../http_settings";

type ChartItem = { name: string; value: number };
type IssuedYearItem = { month: string; issued: number };

type IssuedSampleRow = {
  id: number;
  faid: string;
  serial_no: string;
  firearm_type: string;
  issued_to: string;
  unit: string;
  date_issued: string;
};

const issuedMonthly: IssuedYearItem[] = [
  { month: "2020", issued: 40 },
  { month: "2021", issued: 28 },
  { month: "2022", issued: 36 },
  { month: "2023", issued: 22 },
  { month: "2024", issued: 31 },
  { month: "2025", issued: 45 },
];

const COLORS = [
  "#1976d2",
  "#6a1b9a",
  "#2e7d32",
  "#ed6c02",
  "#00838f",
  "#c62828",
  "#8e24aa",
  "#f9a825",
  "#1565c0",
  "#6d4c41",
  "#3949ab",
  "#7b1fa2",
  "#00897b",
  "#ef6c00",
  "#5d4037",
  "#455a64",
  "#c0ca33",
  "#8d6e63",
];

function normalizeChartData(input: any): ChartItem[] {
  const raw = Array.isArray(input)
    ? input
    : Array.isArray(input?.data)
    ? input.data
    : Array.isArray(input?.results)
    ? input.results
    : [];

  return raw
    .map((item: any) => {
      const name =
        item?.name ??
        item?.kind ??
        item?.type ??
        item?.category ??
        item?.firearm_type ??
        item?.label ??
        "";

      const rawValue =
        item?.value ??
        item?.count ??
        item?.total ??
        item?.qty ??
        item?.issued ??
        0;

      const value = Number(rawValue);

      return {
        name: String(name).trim(),
        value: Number.isFinite(value) ? value : 0,
      };
    })
    .filter((item: ChartItem) => item.name && item.value > 0);
}

function groupTopN(data: ChartItem[], topN = 6): ChartItem[] {
  const cleaned = (data || []).filter(
    (x) => x && typeof x.value === "number" && x.value > 0 && !!x.name
  );

  const sorted = [...cleaned].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const othersValue = rest.reduce((sum, x) => sum + x.value, 0);

  return othersValue > 0 ? [...top, { name: "Others", value: othersValue }] : top;
}

const issuedDetailsByYear: Record<string, IssuedSampleRow[]> = {
  "2020": [
    {
      id: 1,
      faid: "FA-2020-001",
      serial_no: "SN2020001",
      firearm_type: "M16",
      issued_to: "PCMS Juan Dela Cruz",
      unit: "Station 1",
      date_issued: "2020-02-10",
    },
    {
      id: 2,
      faid: "FA-2020-002",
      serial_no: "SN2020002",
      firearm_type: "GLOCK",
      issued_to: "PSSg Pedro Santos",
      unit: "Station 2",
      date_issued: "2020-06-15",
    },
  ],
  "2021": [
    {
      id: 3,
      faid: "FA-2021-001",
      serial_no: "SN2021001",
      firearm_type: "M4",
      issued_to: "PCpl Maria Reyes",
      unit: "Station 3",
      date_issued: "2021-03-22",
    },
    {
      id: 4,
      faid: "FA-2021-002",
      serial_no: "SN2021002",
      firearm_type: "PIETRO BERETTA",
      issued_to: "Pat Jose Ramirez",
      unit: "Station 4",
      date_issued: "2021-08-09",
    },
  ],
  "2022": [
    {
      id: 5,
      faid: "FA-2022-001",
      serial_no: "SN2022001",
      firearm_type: "SMG",
      issued_to: "PCpl Ana Lopez",
      unit: "Station 5",
      date_issued: "2022-01-11",
    },
    {
      id: 6,
      faid: "FA-2022-002",
      serial_no: "SN2022002",
      firearm_type: "TAURUS",
      issued_to: "PMSg Carlo Vega",
      unit: "Station 6",
      date_issued: "2022-10-03",
    },
  ],
  "2023": [
    {
      id: 7,
      faid: "FA-2023-001",
      serial_no: "SN2023001",
      firearm_type: "GALIL",
      issued_to: "PSSg Mark Flores",
      unit: "Station 7",
      date_issued: "2023-04-19",
    },
    {
      id: 8,
      faid: "FA-2023-002",
      serial_no: "SN2023002",
      firearm_type: "CANIK",
      issued_to: "PCpl Leo Bautista",
      unit: "Station 8",
      date_issued: "2023-12-01",
    },
  ],
  "2024": [
    {
      id: 9,
      faid: "FA-2024-001",
      serial_no: "SN2024001",
      firearm_type: "M16",
      issued_to: "Pat Nina Cruz",
      unit: "Station 9",
      date_issued: "2024-05-14",
    },
    {
      id: 10,
      faid: "FA-2024-002",
      serial_no: "SN2024002",
      firearm_type: "JERICHO",
      issued_to: "PMSg Ryan Torres",
      unit: "Station 10",
      date_issued: "2024-11-25",
    },
  ],
  "2025": [
    {
      id: 11,
      faid: "FA-2025-001",
      serial_no: "SN2025001",
      firearm_type: "M4",
      issued_to: "PSSg Ian Autentico",
      unit: "Station 11",
      date_issued: "2025-01-20",
    },
    {
      id: 12,
      faid: "FA-2025-002",
      serial_no: "SN2025002",
      firearm_type: "PIETRO BERETTA",
      issued_to: "PCpl John Ramos",
      unit: "Station 12",
      date_issued: "2025-02-18",
    },
    {
      id: 13,
      faid: "FA-2025-003",
      serial_no: "SN2025003",
      firearm_type: "GLOCK",
      issued_to: "Pat Kevin Lim",
      unit: "Station 13",
      date_issued: "2025-03-06",
    },
  ],
};

export default function Dashboard() {
  const [shortArm, setShortArm] = useState<ChartItem[]>([]);
  const [longArm, setLongArm] = useState<ChartItem[]>([]);

  const [openShortModal, setOpenShortModal] = useState(false);
  const [openLongModal, setOpenLongModal] = useState(false);

  const [openIssuedModal, setOpenIssuedModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedYearRows, setSelectedYearRows] = useState<IssuedSampleRow[]>([]);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const [shortRes, longRes] = await Promise.allSettled([
          app.get("/api/short_arm_pie/"),
          app.get("/api/long_arm_pie/"),
        ]);

        if (shortRes.status === "fulfilled") {
          setShortArm(normalizeChartData(shortRes.value.data));
        } else {
          console.error("short_arm_pie error:", shortRes.reason);
          setShortArm([]);
        }

        if (longRes.status === "fulfilled") {
          setLongArm(normalizeChartData(longRes.value.data));
        } else {
          console.error("long_arm_pie error:", longRes.reason);
          setLongArm([]);
        }
      } catch (err) {
        console.error(err);
        setShortArm([]);
        setLongArm([]);
      }
    };

    fetchCharts();
  }, []);

  const shortArmGrouped = useMemo(() => groupTopN(shortArm, 6), [shortArm]);
  const longArmGrouped = useMemo(() => groupTopN(longArm, 6), [longArm]);

  const shortArmAllSorted = useMemo(
    () => [...shortArm].sort((a, b) => b.value - a.value),
    [shortArm]
  );

  const longArmAllSorted = useMemo(
    () => [...longArm].sort((a, b) => b.value - a.value),
    [longArm]
  );

  const handleBarClick = (data: any) => {
    if (!data?.month) return;

    const year = data.month;
    setSelectedYear(year);
    setSelectedYearRows(issuedDetailsByYear[year] || []);
    setOpenIssuedModal(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Header title="Inventory Overview" />
            <Divider sx={{ my: 1.5 }} />
            <ValidationProgressRow />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              height: 420,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
            }}
            onClick={() => {
              if (shortArmAllSorted.length > 0) setOpenShortModal(true);
            }}
          >
            <Header title="Total Short Firearms" subtitle="Distribution by type" />
            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ flex: 1, minHeight: 0 }}>
              {shortArmGrouped.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={44} />
                    <Pie
                      data={shortArmGrouped}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="85%"
                      paddingAngle={2}
                      minAngle={3}
                    >
                      {shortArmGrouped.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartMessage message="No short firearms data available" />
              )}
            </Box>

            {shortArm.length > 6 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Showing top 6 + Others (click to view all)
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              height: 420,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
            }}
            onClick={() => {
              if (longArmAllSorted.length > 0) setOpenLongModal(true);
            }}
          >
            <Header title="Total Long Firearms" subtitle="Distribution by type" />
            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ flex: 1, minHeight: 0 }}>
              {longArmGrouped.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={44} />
                    <Pie
                      data={longArmGrouped}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="85%"
                      paddingAngle={2}
                      minAngle={3}
                    >
                      {longArmGrouped.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartMessage message="No long firearms data available" />
              )}
            </Box>

            {longArm.length > 6 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Showing top 6 + Others (click to view all)
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              height: 420,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Header title="Issued Summary" subtitle="Issued firearms per year" />
            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issuedMonthly}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="issued"
                    fill="#6a1b9a"
                    radius={[8, 8, 0, 0]}
                    onClick={handleBarClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Click a bar to view sample issued data for that year
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <ChartModal
        open={openShortModal}
        onClose={() => setOpenShortModal(false)}
        title="Total Short Firearms"
        subtitle="All categories"
        data={shortArmAllSorted}
      />

      <ChartModal
        open={openLongModal}
        onClose={() => setOpenLongModal(false)}
        title="Total Long Firearms"
        subtitle="All categories"
        data={longArmAllSorted}
      />

      <Dialog
        open={openIssuedModal}
        onClose={() => setOpenIssuedModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Issued Firearms Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sample issued data for year {selectedYear}
            </Typography>
          </Box>

          <IconButton onClick={() => setOpenIssuedModal(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>FAID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Serial No</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Issued To</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date Issued</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedYearRows.length > 0 ? (
                  selectedYearRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.faid}</TableCell>
                      <TableCell>{row.serial_no}</TableCell>
                      <TableCell>{row.firearm_type}</TableCell>
                      <TableCell>{row.issued_to}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.date_issued}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No sample data found for {selectedYear}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Dialog>
    </Box>
  );
}

function ChartModal({
  open,
  onClose,
  title,
  subtitle,
  data,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: ChartItem[];
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box
        sx={{
          p: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
        }}
      >
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: 450 }}>
          <Box sx={{ height: "100%" }}>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="88%"
                    paddingAngle={1}
                    minAngle={1}
                  >
                    {data.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage message="No data available" />
            )}
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 2, height: 450, overflow: "hidden" }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Categories</Typography>

          <Box sx={{ height: 360, overflow: "auto", pr: 1 }}>
            <List dense>
              {data.map((item, idx) => (
                <ListItem key={`${item.name}-${idx}`} sx={{ py: 0.5 }}>
                  <ColorDot color={COLORS[idx % COLORS.length]} />
                  <ListItemText
                    primary={<RowLabel label={item.name} value={item.value} />}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Total categories: {data.length}
          </Typography>
        </Paper>
      </Box>
    </Dialog>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack spacing={0.5} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <Box
      sx={{
        width: 9,
        height: 9,
        borderRadius: "3px",
        bgcolor: color,
        mr: 1.2,
        flexShrink: 0,
      }}
    />
  );
}

function RowLabel({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 900 }}>
        {value}
      </Typography>
    </Box>
  );
}

function EmptyChartMessage({ message }: { message: string }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}