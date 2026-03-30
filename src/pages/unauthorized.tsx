import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useHistory } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const history = useHistory();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f6fa",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <LockIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />

        <Typography variant="h2" fontWeight="bold" color="error.main">
          403
        </Typography>

        <Typography variant="h6" sx={{ mt: 1 }}>
          Access Denied
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You don’t have permission to access this page.
          <br />
          Please contact your administrator if you think this is a mistake.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            onClick={() => history.push("/dashboard")}
          >
            Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Unauthorized;