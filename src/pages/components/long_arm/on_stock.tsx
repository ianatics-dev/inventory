// src/pages/on_stock.tsx
import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Title from "../Title";
import { Box, Button } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

import ImportFileModal from "./ImportFile";
import CreateIssuanceModal from "./FirearmsModal";
// import RankTable from "./firearms_components/RankTable";
// import RankTable from "./components/person_components/firearms_components/RankTable";
import FirearmsTable from "./components/firearms_components/FirearmsTable";

import app from "../../../http_settings";

import { ReactComponent as AddIcon } from "../../../assets/add-circle-svgrepo-com.svg";
import { ReactComponent as UploadIcon } from "../../../assets/upload-svgrepo-com.svg";

export default function LongArmOnStock() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [value] = useState("1");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchGuns = useCallback(async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await app.get("/api/guns/", {
        params: {
          page: currentPage + 1,
          page_size: currentPageSize,
          disposition: "ISSUED",
          type: "",
        },
      });

      setRows(Array.isArray(res.data?.results) ? res.data.results : []);
      setCount(typeof res.data?.count === "number" ? res.data.count : 0);
    } catch (err) {
      console.error(err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const fetchRows = async () => {
    try {
      setLoading(true);

      const res = await app.get("/api/guns/", {
        params: {
          // disposition: "ISSUED",
          type: "Others",
          page: page + 1, // DRF pagination starts at 1
          page_size: pageSize,
          search: search,
        },
      });

      setRows(res.data.results ?? []);
      setCount(res.data.count ?? 0);
    } catch (err) {
      console.error(err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setSuperIsAdmin(role === "super_admin");
  }, []);

  useEffect(() => {
      fetchRows();
    }, [page, pageSize, search]);

  const handleImport = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    await app.post("/api/import-guns/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchGuns(page, pageSize);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0); // reset to first page when searching
  }

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <TabPanel value="1">
            <>
              <Title>All Firearms</Title>

              {(isAdmin || isSuperAdmin) && (
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                  <Button variant="contained" onClick={() => setModalOpen(true)}>
                    <AddIcon width={30} height={30} />
                  </Button>

                  {/* <Button
                    variant="contained"
                    onClick={() => setImportModalOpen(true)}
                    sx={{ ml: 2 }}
                  >
                    <UploadIcon width={30} height={30} />
                  </Button> */}
                </Box>
              )}

              <FirearmsTable
                rows={rows}
                count={count}
                loading={loading}
                page={page}
                pageSize={pageSize}
                // onPaginationChange={(newPage, newPageSize) => {
                //   setPage(newPage);
                //   setPageSize(newPageSize);
                // }}
                onRefresh={() => fetchGuns(page, pageSize)}
                onSearchChange={handleSearchChange}
                onPaginationChange={handlePaginationChange}
                searchText={search}
              />
            </>
          </TabPanel>
        </TabContext>
      </Box>

      <CreateIssuanceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          fetchGuns(page, pageSize);
        }}
      />

      {/* <ImportFileModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      /> */}
    </Grid>
  );
}