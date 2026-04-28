// src/pages/PersonDashboard.tsx
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

import IssuedTable from "./components/issued_components/IssuedTable";
import CreateIssuedModal from "./IssuedModal";

import app from "../../../http_settings";
import { ReactComponent as AddIcon } from "../../../assets/add-circle-svgrepo-com.svg";
import { logActivity } from "../utils";

export default function IssuedDashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const [issuedRows, setIssuedRows] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState(false);

  const [value] = useState("1");
  const [search, setSearch] = useState("");

  const fetchRows = async (
    currentPage = page,
    currentPageSize = pageSize,
    currentSearch = search
  ) => {
    try {
      setLoading(true);

      const res = await app.get("/api/guns/", {
        params: {
          disposition: "ISSUED",
          type: "Others",
          page: currentPage + 1,
          page_size: currentPageSize,
          search: currentSearch,
        },
      });

      setIssuedRows(Array.isArray(res.data?.results) ? res.data.results : []);
      setCount(typeof res.data?.count === "number" ? res.data.count : 0);
    } catch (err) {
      console.error(err);
      setIssuedRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    setIsAdmin(role === "admin");
    setSuperIsAdmin(role === "super_admin");

    logActivity({
      action: "VIEW",
      module: "Issued Firearms",
      description: "Viewed Issued Firearms table",
    });
  }, []);

  useEffect(() => {
    fetchRows(page, pageSize, search);
  }, [page, pageSize, search]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <TabPanel value="1">
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  All Issued Firearms
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Manage and monitor all currently issued firearms
                </Typography>
              </Box>

              {(isAdmin || isSuperAdmin) && (
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: 2.3,
                    py: 1.1,
                    fontWeight: 800,
                    minWidth: 56,
                    boxShadow: "0 8px 20px rgba(25,118,210,0.3)",
                  }}
                >
                  <AddIcon width={26} height={26} />
                </Button>
              )}
            </Box>

            <IssuedTable
              rows={issuedRows}
              count={count}
              loading={loading}
              page={page}
              pageSize={pageSize}
              onRefresh={() => fetchRows(page, pageSize, search)}
              onSearchChange={handleSearchChange}
              onPaginationChange={handlePaginationChange}
              searchText={search}
            />
          </TabPanel>
        </TabContext>
      </Box>

      <CreateIssuedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          fetchRows(page, pageSize, search);
        }}
      />
    </Grid>
  );
}