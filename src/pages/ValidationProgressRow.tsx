import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorageIcon from "@mui/icons-material/Storage";
import GridOnIcon from "@mui/icons-material/GridOn";
import app from "../http_settings";

type DashboardResp = {
  guns_count: number;
  total_validated: number;
  issued_count: number;
  issued_validated: number;
  on_stock_count: number;
  on_stock_validated: number;
};

export default function ValidationProgressColumn() {
  const [total, setTotal] = useState<number>(0);
  const [totalValidated, setTotalValidated] = useState<number>(0);

  const [issuedCount, setIssuedCount] = useState<number>(0);
  const [issuedValidated, setIssuedValidated] = useState<number>(0);

  const [onStockCount, setOnStockCount] = useState<number>(0);
  const [onStockValidated, setOnStockValidated] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await app.get<DashboardResp>("/api/dashboard/");
        setTotal(res.data.guns_count ?? 0);
        setTotalValidated(res.data.total_validated ?? 0);

        setIssuedCount(res.data.issued_count ?? 0);
        setIssuedValidated(res.data.issued_validated ?? 0);

        setOnStockCount(res.data.on_stock_count ?? 0);
        setOnStockValidated(res.data.on_stock_validated ?? 0);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Stack spacing={2}>
        <ProgressCard
          title="Total Firearms"
          value={totalValidated}
          total={total}
          icon={<CheckCircleIcon sx={{ fontSize: 46, color: "rgba(255,255,255,0.9)" }} />}
          bg="#20c4c8"
        />

        <ProgressCard
          title="Issued Firearms"
          value={issuedValidated}
          total={issuedCount}
          icon={<StorageIcon sx={{ fontSize: 46, color: "rgba(255,255,255,0.9)" }} />}
          bg="#1f7bbd"
        />

        <ProgressCard
          title="On Stock Firearms"
          value={onStockValidated}
          total={onStockCount}
          icon={<GridOnIcon sx={{ fontSize: 46, color: "rgba(255,255,255,0.9)" }} />}
          bg="#f7a84a"
        />
      </Stack>
    </Box>
  );
}

function ProgressCard({
  title,
  value,
  total,
  icon,
  bg,
}: {
  title: string;
  value?: number;
  total?: number;
  icon: React.ReactNode;
  bg: string;
}) {
  const safeValue = Number.isFinite(value as number) ? (value as number) : 0;
  const safeTotal = Number.isFinite(total as number) ? (total as number) : 0;

  const remaining = Math.max(safeTotal - safeValue, 0);
  const pct = safeTotal > 0 ? Math.round((safeValue / safeTotal) * 100) : 0;

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          bgcolor: bg,
          color: "#fff",
          px: 2.2,
          py: 1.8,
          display: "flex",
          alignItems: "center",
          gap: 2,
          minHeight: 92,
        }}
      >
        <Box sx={{ display: "grid", placeItems: "center", width: 60, height: 60 }}>
          {icon}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{title}</Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
              {safeValue} / {safeTotal}
            </Typography>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <StripedProgress value={pct} />
          </Box>

          <Typography sx={{ fontSize: 12, opacity: 0.9, textAlign: "right", mt: 0.5 }}>
            Remaining: {remaining}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function StripedProgress({ value }: { value: number }) {
  return (
    <Box sx={{ position: "relative" }}>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 14,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.25)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: "rgba(255, 82, 82, 0.95)",
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            width: `${value}%`,
            height: "100%",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 10px, rgba(255,255,255,0.05) 10px 20px)",
          }}
        />
      </Box>
    </Box>
  );
}