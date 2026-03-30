import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
import app from "../../http_settings";
import { logActivity } from "./utils";

type ActivityRow = {
  id: number;
  username: string;
  role: string;
  action: string;
  module: string;
  description: string;
  target_id?: string;
  target_name?: string;
  ip_address?: string;
  created_at: string;
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <GridToolbarExport
            csvOptions={{
              fileName: "Activity Logs",
              utf8WithBom: true,
            }}
            printOptions={{
              disableToolbarButton: false,
            }}
          />
        </Box>

        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          <GridToolbarQuickFilter
            debounceMs={300}
            placeholder="Search…"
            sx={{ "& .MuiInputBase-input": { width: 280, py: 0.5 } }}
          />
        </Paper>
      </Box>
    </GridToolbarContainer>
  );
}

export default function ActivityLogTable() {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await app.get("/api/activity-logs/");
      setRows(res.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    logActivity({
      action: "VIEW",
      module: "Activity Logs",
      description: "Viewed Activity Logs table",
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "username", headerName: "Username", width: 160 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "action", headerName: "Action", width: 120 },
    { field: "module", headerName: "Module", width: 180 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 280 },
    { field: "target_name", headerName: "Target", width: 180 },
    { field: "ip_address", headerName: "IP Address", width: 150 },
    {
      field: "created_at",
      headerName: "Date / Time",
      width: 220,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Activity Logs
        </Typography>

        <Box sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            slots={{ toolbar: CustomToolbar }}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}