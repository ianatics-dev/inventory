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
  LinearProgress,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import StoreIcon from "@mui/icons-material/Store";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import TablePagination from "@mui/material/TablePagination";

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

import app from "../http_settings";

type ChartItem = { name: string; value: number };
type IssuedYearItem = {
  year: string;
  issued: number;
};

type DashboardStats = {
  total: number;
  issued: number;
  onStock: number;
  problem: number;
};

type IssuedSampleRow = {
  id: number;
  serial_no: string;
  type: string;
  make: string;
  issued_to: string;
  rank?: string;
  unit: string;
  sub_unit: string;
  date_issued: string;
};

type AcquisitionYearItem = {
  year: string;
  count: number;
};

// const issuedMonthly: IssuedYearItem[] = [
//   { month: "2020", issued: 40 },
//   { month: "2021", issued: 28 },
//   { month: "2022", issued: 36 },
//   { month: "2023", issued: 22 },
//   { month: "2024", issued: 31 },
//   { month: "2025", issued: 45 },
// ];

type AcquisitionRow = {
  id: number;
  serial_no: string;
  type: string;
  make: string;
  caliber: string;
  property_no: string;
  acquisition_date: string | null;
  status: string;
  disposition: string;
};

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
];

const issuedDetailsByYear: Record<string, IssuedSampleRow[]> = {
  "2020": [],
  "2021": [],
  "2022": [],
  "2023": [],
  "2024": [],
  "2025": [],
};

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
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const othersValue = rest.reduce((sum, x) => sum + x.value, 0);

  return othersValue > 0 ? [...top, { name: "Others", value: othersValue }] : top;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function Dashboard() {
  const [shortArm, setShortArm] = useState<ChartItem[]>([]);
  const [longArm, setLongArm] = useState<ChartItem[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    issued: 0,
    onStock: 0,
    problem: 0,
  });

  const [openShortModal, setOpenShortModal] = useState(false);
  const [openLongModal, setOpenLongModal] = useState(false);

  const [openIssuedModal, setOpenIssuedModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedYearRows, setSelectedYearRows] = useState<IssuedSampleRow[]>([]);

  const [issuedMonthly, setIssuedMonthly] = useState<IssuedYearItem[]>([]);

  const [shortArmAcquisition, setShortArmAcquisition] = useState<AcquisitionYearItem[]>([]);
  const [longArmAcquisition, setLongArmAcquisition] = useState<AcquisitionYearItem[]>([]);

  const [openAcquisitionModal, setOpenAcquisitionModal] = useState(false);
  const [acquisitionTitle, setAcquisitionTitle] = useState("");
  const [acquisitionRows, setAcquisitionRows] = useState<AcquisitionRow[]>([]);


  const [acquisitionPage, setAcquisitionPage] = useState(0);
  const [acquisitionPageSize, setAcquisitionPageSize] = useState(10);
  const [acquisitionCount, setAcquisitionCount] = useState(0);
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] = useState("");
  const [selectedAcquisitionType, setSelectedAcquisitionType] = useState<"short" | "long">("short");


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [

          shortRes,
          longRes,
          gunsRes,
          issuedSummaryRes,
          shortAcquisitionRes,
          longAcquisitionRes,

        ] = await Promise.allSettled([
          app.get("/api/short_arm_pie/"),
          app.get("/api/long_arm_pie/"),
          app.get("/api/dashboard/"),
          app.get("/api/issued-summary-by-year/"),
          app.get("/api/short-arm-acquisition-summary/"),
          app.get("/api/long-arm-acquisition-summary/"),
        ]);

        if (shortRes.status === "fulfilled") {
          setShortArm(normalizeChartData(shortRes.value.data));
        }

        if (longRes.status === "fulfilled") {
          setLongArm(normalizeChartData(longRes.value.data));
        }

        if (gunsRes.status === "fulfilled") {
          const data = gunsRes.value.data;
          console.log(data)
          setStats({
            total: Number(data?.guns_count ?? data?.guns_count ?? 0),
            issued: Number(data?.issued ?? data?.issued_count ?? 0),
            onStock: Number(data?.on_stock ?? data?.on_stock_count ?? 0),
            problem: Number(data?.problem ?? data?.unsvc_count ?? data?.ber_count ?? 0),
          });
        }

        if (issuedSummaryRes.status === "fulfilled") {
          const data = issuedSummaryRes.value.data;

          setIssuedMonthly(
            data.map((item: any) => ({
              year: String(item.year),
              issued: Number(item.issued || 0),
            }))
          );
        }

        if (shortAcquisitionRes.status === "fulfilled") {
          setShortArmAcquisition(
            shortAcquisitionRes.value.data.map((item: any) => ({
              year: String(item.year),
              count: Number(item.count || 0),
            }))
          );
        }

        if (longAcquisitionRes.status === "fulfilled") {
          setLongArmAcquisition(
            longAcquisitionRes.value.data.map((item: any) => ({
              year: String(item.year),
              count: Number(item.count || 0),
            }))
          );
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboard();
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

  const handleBarClick = async (data: any) => {
    const year = data?.year;
    if (!year) return;

    setSelectedYear(year);
    setSelectedYearRows([]);
    setOpenIssuedModal(true);

    try {
      const res = await app.get(`/api/issued-details-by-year/${year}/`);
      setSelectedYearRows(res.data || []);
    } catch (error) {
      console.error("Failed to fetch issued details:", error);
      setSelectedYearRows([]);
    }
  };

  const handleAcquisitionBarClick = async (
    armType: "short" | "long",
    data: any
  ) => {
    const yearLabel = data?.year;
    if (!yearLabel) return;

    const yearParam = yearLabel === "No Date" ? "no-date" : yearLabel;

    setSelectedAcquisitionType(armType);
    setSelectedAcquisitionYear(yearParam);
    setAcquisitionPage(0);
    setAcquisitionPageSize(10);

    setAcquisitionTitle(
      `${armType === "short" ? "Short Arm" : "Long Arm"} Acquisition - ${yearLabel}`
    );

    setAcquisitionRows([]);
    setOpenAcquisitionModal(true);

    fetchAcquisitionDetails(armType, yearParam, 0, 10);
  };

  const fetchAcquisitionDetails = async (
    armType: "short" | "long",
    yearParam: string,
    page = 0,
    pageSize = 10
  ) => {
    try {
      const endpoint =
        armType === "short"
          ? `/api/short-arm-acquisition-details/${yearParam}/`
          : `/api/long-arm-acquisition-details/${yearParam}/`;

      const res = await app.get(endpoint, {
        params: {
          page: page + 1,
          page_size: pageSize,
        },
      });

      setAcquisitionRows(res.data.results || []);
      setAcquisitionCount(res.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch acquisition details:", error);
      setAcquisitionRows([]);
      setAcquisitionCount(0);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HeroDashboard stats={stats} />
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Total Short Firearms"
            subtitle="Distribution by type"
            data={shortArmGrouped}
            allCount={shortArm.length}
            onClick={() => {
              if (shortArmAllSorted.length > 0) setOpenShortModal(true);
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Total Long Firearms"
            subtitle="Distribution by type"
            data={longArmGrouped}
            allCount={longArm.length}
            onClick={() => {
              if (longArmAllSorted.length > 0) setOpenLongModal(true);
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 4,
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
                  onClick={(chartState: any) => {
                    if (!chartState?.activeLabel) return;

                    const selected = issuedMonthly.find(
                      (item) => item.year === chartState.activeLabel
                    );

                    if (selected) {
                      handleBarClick(selected);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.12)" }} />

                  <Bar
                    dataKey="issued"
                    fill="#6a1b9a"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Typography variant="caption" color="text.secondary">
              Click a bar to view issued data for that year
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <AcquisitionBarCard
            title="Short Arm Acquisition Summary"
            subtitle="Short firearms by acquisition year"
            data={shortArmAcquisition}
            onBarClick={(data) => handleAcquisitionBarClick("short", data)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AcquisitionBarCard
            title="Long Arm Acquisition Summary"
            subtitle="Long firearms by acquisition year"
            data={longArmAcquisition}
            onBarClick={(data) => handleAcquisitionBarClick("long", data)}
          />
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

      <IssuedModal
        open={openIssuedModal}
        onClose={() => setOpenIssuedModal(false)}
        selectedYear={selectedYear}
        rows={selectedYearRows}
      />

      <AcquisitionDetailsModal
        open={openAcquisitionModal}
        onClose={() => setOpenAcquisitionModal(false)}
        title={acquisitionTitle}
        rows={acquisitionRows}
        count={acquisitionCount}
        page={acquisitionPage}
        pageSize={acquisitionPageSize}
        onPageChange={(newPage) => {
          setAcquisitionPage(newPage);
          fetchAcquisitionDetails(
            selectedAcquisitionType,
            selectedAcquisitionYear,
            newPage,
            acquisitionPageSize
          );
        }}
        onPageSizeChange={(newPageSize) => {
          setAcquisitionPageSize(newPageSize);
          setAcquisitionPage(0);
          fetchAcquisitionDetails(
            selectedAcquisitionType,
            selectedAcquisitionYear,
            0,
            newPageSize
          );
        }}
      />
    </Box>
  );
}

function HeroDashboard({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: "Total Firearms",
      value: stats.total,
      subtitle: "Complete inventory count",
      percent: 100,
      icon: <InventoryIcon />,
      color: "#1976d2",
      bg: "linear-gradient(135deg, #1565c0, #42a5f5)",
    },
    {
      title: "Issued Firearms",
      value: stats.issued,
      subtitle: `${percent(stats.issued, stats.total)}% of total inventory`,
      percent: percent(stats.issued, stats.total),
      icon: <AssignmentTurnedInIcon />,
      color: "#6a1b9a",
      bg: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
    },
    {
      title: "On Stock",
      value: stats.onStock,
      subtitle: `${percent(stats.onStock, stats.total)}% available`,
      percent: percent(stats.onStock, stats.total),
      icon: <StoreIcon />,
      color: "#2e7d32",
      bg: "linear-gradient(135deg, #2e7d32, #66bb6a)",
    },
    {
      title: "Unserviceable / BER Items",
      value: stats.problem,
      subtitle: "UNSVC / BER monitoring",
      percent: percent(stats.problem, stats.total),
      icon: <WarningAmberIcon />,
      color: "#c62828",
      bg: "linear-gradient(135deg, #c62828, #ef5350)",
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 5,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: -120,
          right: -80,
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1}
        sx={{ mb: 2.5, position: "relative", zIndex: 1 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Firearms Inventory Overview
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            Live summary of issued, available, and monitored firearms
          </Typography>
        </Box>

        <Chip
          icon={<TrendingUpIcon />}
          label="Inventory Monitoring"
          sx={{
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.12)",
            fontWeight: 800,
          }}
        />
      </Stack>

      <Grid container spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                color: "#fff",
                background: card.bg,
                minHeight: 165,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": { fontSize: 30 },
                  }}
                >
                  {card.icon}
                </Box>

                <Typography sx={{ fontWeight: 900, fontSize: 13 }}>
                  {card.percent}%
                </Typography>
              </Stack>

              <Box>
                <Typography sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
                  {card.value.toLocaleString()}
                </Typography>
                <Typography sx={{ fontWeight: 800, mt: 0.8 }}>{card.title}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {card.subtitle}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={card.percent}
                sx={{
                  height: 7,
                  borderRadius: 99,
                  bgcolor: "rgba(255,255,255,0.25)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#fff",
                    borderRadius: 99,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function ChartCard({
  title,
  subtitle,
  data,
  allCount,
  onClick,
}: {
  title: string;
  subtitle: string;
  data: ChartItem[];
  allCount: number;
  onClick: () => void;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 4,
        height: 420,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
      onClick={onClick}
    >
      <Header title={title} subtitle={subtitle} />
      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ flex: 1, minHeight: 0 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend verticalAlign="bottom" height={44} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="85%"
                paddingAngle={2}
                minAngle={3}
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

      {allCount > 6 && (
        <Typography variant="caption" color="text.secondary">
          Showing top 6 + Others. Click to view all.
        </Typography>
      )}
    </Paper>
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
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: 450 }}>
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
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: 450 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Categories</Typography>

          <Box sx={{ height: 360, overflow: "auto", pr: 1 }}>
            <List dense>
              {data.map((item, idx) => (
                <ListItem key={`${item.name}-${idx}`} sx={{ py: 0.5 }}>
                  <ColorDot color={COLORS[idx % COLORS.length]} />
                  <ListItemText primary={<RowLabel label={item.name} value={item.value} />} />
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

function IssuedModal({
  open,
  onClose,
  selectedYear,
  rows,
}: {
  open: boolean;
  onClose: () => void;
  selectedYear: string;
  rows: IssuedSampleRow[];
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Issued Firearms Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Issued data for year {selectedYear}
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell sx={{ fontWeight: 800 }}>FAID</TableCell> */}
                <TableCell sx={{ fontWeight: 800 }}>Serial No</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Make</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Issued To</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Sub Unit</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Date Issued</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.serial_no}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.make}</TableCell>
                    <TableCell>
                      {row.rank ? `${row.rank} ${row.issued_to}` : row.issued_to}
                    </TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.sub_unit}</TableCell>
                    <TableCell>{row.date_issued}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No issued data found for {selectedYear}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Dialog>
  );
}

function AcquisitionDetailsModal({
  open,
  onClose,
  title,
  rows,
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  rows: AcquisitionRow[];
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total records: {count}
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Serial No</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Make</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Caliber</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Property No</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Acquisition Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Disposition</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.serial_no || "-"}</TableCell>
                    <TableCell>{row.type || "-"}</TableCell>
                    <TableCell>{row.make || "-"}</TableCell>
                    <TableCell>{row.caliber || "-"}</TableCell>
                    <TableCell>{row.property_no || "-"}</TableCell>
                    <TableCell>{row.acquisition_date || "No Date"}</TableCell>
                    <TableCell>{row.status || "-"}</TableCell>
                    <TableCell>{row.disposition || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No firearm records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(event) => {
              onPageSizeChange(parseInt(event.target.value, 10));
            }}
          />
        </Paper>
      </Box>
    </Dialog>
  );
}


function AcquisitionBarCard({
  title,
  subtitle,
  data,
  onBarClick,
}: {
  title: string;
  subtitle: string;
  data: AcquisitionYearItem[];
  onBarClick: (data: AcquisitionYearItem) => void;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 4,
        height: 420,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header title={title} subtitle={subtitle} />

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ flex: 1, minHeight: 0, cursor: "pointer" }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              onClick={(chartState: any) => {
                if (!chartState?.activeLabel) return;

                const selected = data.find(
                  (item) => item.year === chartState.activeLabel
                );

                if (selected) {
                  onBarClick(selected);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.12)" }} />

              <Bar
                dataKey="count"
                name="Firearms"
                fill="#1976d2"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage message="No acquisition data available" />
        )}
      </Box>

      <Typography variant="caption" color="text.secondary">
        Click a column to view firearm records. Blank dates are grouped as No Date.
      </Typography>
    </Paper>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack spacing={0.5} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "4px",
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

      <Typography sx={{ fontSize: 13, fontWeight: 900 }}>{value}</Typography>
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