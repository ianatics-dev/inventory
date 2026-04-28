// src/pages/PersonDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Title from "../Title";
import { Box, Button } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

// import PersonTable from "../person_components/components/PersonTable";
import PersonTable from "./person_components/components/PersonTable";
import CreatePersonModal from "./PersonModal";
import ImportFileModal from "./ImportFile";

import app from "../../../http_settings";
import { ReactComponent as AddIcon } from "../../../assets/add-circle-svgrepo-com.svg";
import { ReactComponent as UploadIcon } from "../../../assets/upload-svgrepo-com.svg";
import { logActivity } from "../utils";

export default function PersonDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [issuedRows, setIssuedRows] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);

  const [page, setPage] = useState(0); // DataGrid page starts at 0
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState(false);

  const [value] = useState("1");
  const [search, setSearch] = useState("");


  const fetchIssued = useCallback(async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      // preferred endpoint if you already have it in backend
      const res = await app.get("/api/guns/issued/", {
        params: {
          page: currentPage + 1,
          page_size: currentPageSize,
          disposition: "ISSUED",
          type: "Pistol",
        },
      });

      setIssuedRows(Array.isArray(res.data?.results) ? res.data.results : []);
      setCount(typeof res.data?.count === "number" ? res.data.count : 0);
    } catch (e) {
      try {
        // fallback: filter from /api/guns/
        const res2 = await app.get("/api/guns/", {
          params: {
            page: currentPage + 1,
            page_size: currentPageSize,
            disposition: "ISSUED",
            type: "Pistol",
          },
        });

        const results = Array.isArray(res2.data?.results) ? res2.data.results : [];
        const issued = results.filter(
          (g: any) => g.issued_to !== null
        );

        setIssuedRows(results);
        setCount(typeof res2.data?.count === "number" ? res2.data.count : issued.length);
      } catch (err) {
        console.error(err);
        setIssuedRows([]);
        setCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const fetchRows = async () => {
    try {
      setLoading(true);

      const res = await app.get("/api/guns/", {
        params: {
          disposition: "ISSUED",
          type: "Pistol",
          page: page + 1, // DRF pagination starts at 1
          page_size: pageSize,
          search: search,
        },
      });

      setIssuedRows(res.data.results ?? []);
      setCount(res.data.count ?? 0);
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
    fetchRows();
  }, [page, pageSize, search]);

  const handleImport = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await app.post("/api/import-issued-excel/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data);
      fetchIssued(page, pageSize);
    } catch (err: any) {
      console.error(err?.response?.data || err);
    }
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearchChange = (value: string) => {
    console.log(value)
    setSearch(value);
    setPage(0); // reset to first page when searching
  }

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <TabPanel value="1">
            <>
              <Title>All Issued Firearms</Title>

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

              <PersonTable
                rows={issuedRows}
                count={count}
                loading={loading}
                page={page}
                pageSize={pageSize}
                // onPaginationChange={(newPage, newPageSize) => {
                //   setPage(newPage);
                //   setPageSize(newPageSize);
                // }}
                onRefresh={() => fetchIssued(page, pageSize)}
                onSearchChange={handleSearchChange}
                onPaginationChange={handlePaginationChange}
                searchText={search}
              />
            </>
          </TabPanel>
        </TabContext>
      </Box>

      <CreatePersonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          fetchIssued(page, pageSize);
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