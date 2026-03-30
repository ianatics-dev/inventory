// on_stock.tsx  (All Firearms)
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Title from "./Title";
import { Box, Button } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

import ImportFileModal from "./person_components/ImportFile";
import CreateIssuanceModal from "./person_components/RankModal";
// ✅ Import RankTable from correct file
import RankTable from "./person_components/firearms_components/RankTable";

import app from "../../http_settings";

import { ReactComponent as AddIcon } from "../../assets/add-circle-svgrepo-com.svg";
import { ReactComponent as UploadIcon } from "../../assets/upload-svgrepo-com.svg";

export default function OnStock() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [value] = useState("1");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState<any>(false);

  useEffect(() => {
    app.get(`/api/guns/`).then((res: any) => {
      setRows(res.data);
    });

    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    setIsAdmin(isAdmin)
    const isSuperAdmin = role === "super_admin";
    setSuperIsAdmin(isSuperAdmin)
  }, []);

  const handleImport = async (file: File) => {
    // ignore import for now as you said
    // console.log("Uploading file:", file);

    const fd = new FormData();
    fd.append("file", file);

    await app.post("/api/import-guns/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // refresh table
    window.location.reload();
  };

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <TabPanel value="1">
            <React.Fragment>
              <Title>All Firearms</Title>

              {(isAdmin || isSuperAdmin) && (
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                  <Button variant="contained" onClick={() => setModalOpen(true)}>
                    <AddIcon width={30} height={30} />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setImportModalOpen(true)}
                    sx={{ ml: 2 }}
                  >
                    <UploadIcon width={30} height={30} />
                  </Button>
                </Box>
              )}

              {/* ✅ now rows are guns directly */}
              <RankTable rows={rows} setRows={setRows} />
            </React.Fragment>
          </TabPanel>
        </TabContext>
      </Box>

      <CreateIssuanceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(createdGunRow: any) => {
          // ✅ add new gun row instantly
          setRows((prev: any[]) => [createdGunRow, ...prev]);
        }}
      />

      <ImportFileModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />
    </Grid>
  );
}

