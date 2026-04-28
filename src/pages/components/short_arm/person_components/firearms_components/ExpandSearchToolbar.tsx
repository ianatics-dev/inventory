import React from "react";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarProps,
} from "@mui/x-data-grid";
import { Box, Paper, TextField } from "@mui/material";

type ExpandSearchToolbarProps = GridToolbarProps & {
  searchText?: string;
  onSearchChange?: (value: string) => void;
};
// T6368-22CK05728 PCOL SILAGAN JULIUS EGOS
const ExpandSearchToolbar: React.FC<ExpandSearchToolbarProps> = ({
  searchText = "",
  onSearchChange,
}) => {
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <GridToolbarExport
            csvOptions={{
              fileName: "Issued Firearms",
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
            minWidth: 280,
          }}
        >
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Search…"
            value={searchText}
            onChange={(e) => onSearchChange?.(e.target.value)}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiInputBase-input": {
                py: 0.5,
              },
            }}
          />
        </Paper>
      </Box>
    </GridToolbarContainer>
  );
};

export default ExpandSearchToolbar;