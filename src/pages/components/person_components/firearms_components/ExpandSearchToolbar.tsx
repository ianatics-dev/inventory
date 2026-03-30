import React from "react";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";

const ExpandSearchToolbar = () => {
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
              fileName: "firearms",
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
};

export default ExpandSearchToolbar;