import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Avatar,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import SecurityIcon from "@mui/icons-material/Security";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import img from "../assets/viber_image_2023-09-11_18-36-47-771.jpg";
import logo from "../assets/viber_image_2023-09-11_18-36-46-801.png";

// ✅ keep backend login commented for now
import app from "../http_settings";
import { logActivity } from "./components/utils";

type TabKey = "home" | "services" | "features" | "contact";
type LoginForm = { email: string; password: string };

const Landing: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState<TabKey>("home");

  // login modal states
  const [openLogin, setOpenLogin] = useState(false);
  const [spin, setSpin] = useState(false);
  const [errText, setErrText] = useState<string>("");

  const form = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  // ✅ TEMP USERS (mock accounts)
  const TEMP_USERS = [
    {
      email: "admin@test.com",
      password: "admin123",
      role: "admin" as const,
      unit: "HQ",
      id: "TEMP_ADMIN_001",
    },
    // {
    //   email: "user@test.com",
    //   password: "user123",
    //   role: "user" as const,
    //   unit: "Station 1",
    //   id: "TEMP_USER_001",
    // },
  ];

  const sections = useMemo(
    () =>
      [
        { key: "home", label: "HOME" },
        { key: "services", label: "SERVICES" },
        { key: "features", label: "FEATURES" },
        { key: "contact", label: "CONTACT" },
      ] as { key: TabKey; label: string }[],
    []
  );

  const handleNavClick = (key: TabKey) => {
    setTab(key);
    const el = document.getElementById(key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ TEMP onSubmit (no backend)
  // const onSubmit = (data: LoginForm) => {
  //   setSpin(true);
  //   setErrText("");

  //   // simulate loading
  //   setTimeout(() => {
  //     const found = TEMP_USERS.find(
  //       (u) => u.email === data.email && u.password === data.password
  //     );

  //     if (!found) {
  //       setSpin(false);
  //       setErrText("Invalid email or password. Try admin@test.com/admin123 or user@test.com/user123");
  //       reset({ ...data, password: "" });
  //       return;
  //     }

  //     // mimic backend response tokens
  //     localStorage.setItem("access_token", `temp_access_${found.role}`);
  //     localStorage.setItem("refresh_token", `temp_refresh_${found.role}`);
  //     localStorage.setItem("unit", found.unit);
  //     localStorage.setItem("id", found.id);
  //     localStorage.setItem("role", found.role);
  //     localStorage.setItem("email", found.email);

  //     setSpin(false);
  //     setOpenLogin(false);
  //     reset({ email: found.email, password: "" });

  //     // if (found.role === "user") history.push("/user");
  //     if (found.role === "admin") history.push("/admin/dashboard");
  //   }, 700);
  // };
  const onSubmit = async (data: LoginForm) => {
    try {
      setSpin(true);
      setErrText("");

      const res = await app.post("/api/accounts/login/", {
        email: data.email,
        password: data.password,
      });

      const user = res.data;

      localStorage.setItem("access_token", user.access);
      localStorage.setItem("refresh_token", user.refresh);
      localStorage.setItem("unit", user.unit || "");
      localStorage.setItem("id", String(user.id));
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("username", user.username);
      localStorage.setItem("access", user.access);

      // const test = await app.post("/api/accounts/users/create-viewer/", {
      //   username: "superadmin1",
      //   email: "superadmin1@test.com",
      //   password: "superadmin123",
      //   first_name: "Super",
      //   last_name: "Admin",
      //   role: "superadmin",
      //   unit: "RSAO",
      // });

      // console.log(test)

      setSpin(false);
      setOpenLogin(false);
      reset({ email: user.email, password: "" });

      // if (user.role === "viewer") {
      // history.push("/user");   
      // } else if (user.role === "admin") {
      //   history.push("/admin/dashboard");
      // }

      history.push("/admin/dashboard");

      logActivity({
        action: "LOGIN",
        module: "Authentication",
        description: `User "${user.username}" logged in successfully`,
        target_id: user.id,
        target_name: user.username
      });
    } catch (error: any) {
      setSpin(false);
      setErrText(
        error?.response?.data?.detail || "Invalid email or password."
      );
      reset({ ...data, password: "" });
    }
  };

  // small “illustration” images (temporary)
  const pics = {
    audit:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60",
    inventory:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=60",
    secure:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=60",
    support:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=60",
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0b1220" }}>
      {/* Top Nav */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src={logo} alt="Logo" sx={{ width: 40, height: 40 }} />
            <Typography sx={{ color: "#fff", fontWeight: 900, letterSpacing: 1 }}>
              FIMS
            </Typography>
            <Chip
              size="small"
              label="Firearms Inventory Management System"
              sx={{
                ml: 1,
                display: { xs: "none", md: "inline-flex" },
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </Stack>

          <Box sx={{ flex: 1 }} />

          <Tabs
            value={tab}
            onChange={(_, v) => handleNavClick(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 800,
                letterSpacing: 0.8,
                fontSize: 13,
              },
              "& .MuiTabs-indicator": { height: 3, borderRadius: 999 },
              display: { xs: "none", md: "flex" },
            }}
          >
            {sections.map((s) => (
              <Tab key={s.key} value={s.key} label={s.label} />
            ))}
          </Tabs>

          <Button
            onClick={() => setOpenLogin(true)}
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ borderRadius: 999, px: 2.2, fontWeight: 800, textTransform: "none" }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        id="home"
        sx={{
          pt: { xs: 10, md: 12 },
          minHeight: { xs: "92vh", md: "100vh" },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.70), rgba(11,18,32,0.95)), url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 1000,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: { xs: 36, sm: 52, md: 64 },
              lineHeight: 1,
              textShadow: "0 12px 40px rgba(0,0,0,0.6)",
            }}
          >
            Firearms Inventory
            <br />
            Management System
          </Typography>
          <Grid container spacing={3} alignItems="center">
            {/* LEFT */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<SecurityIcon />}
                    label="Secure Access"
                    sx={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                  <Chip
                    icon={<Inventory2Icon />}
                    label="Inventory Tracking"
                    sx={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                  <Chip
                    icon={<AssessmentIcon />}
                    label="Audit Reports"
                    sx={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                </Stack> */}

                {/* <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 1000,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    fontSize: { xs: 36, sm: 52, md: 64 },
                    lineHeight: 1,
                    textShadow: "0 12px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  Firearms Inventory
                  <br />
                  Management System
                </Typography> */}

                {/* <Typography sx={{ color: "rgba(255,255,255,0.88)", maxWidth: 650 }}>
                  Manage firearm issuance, track stock, store history logs, and create audit-ready
                  reports — designed for clarity and accountability.
                </Typography> */}
                {/* <Button
                  size="large"
                  variant="contained"
                  onClick={() => setOpenLogin(true)}
                  sx={{ borderRadius: 999, fontWeight: 900, px: 3 }}
                >
                  Go to Login
                </Button> */}
                {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1 }}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => setOpenLogin(true)}
                    sx={{ borderRadius: 999, fontWeight: 900, px: 3 }}
                  >
                    Go to Login
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={() => handleNavClick("features")}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 900,
                      px: 3,
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.55)",
                      "&:hover": { borderColor: "#fff" },
                    }}
                  >
                    View Features
                  </Button>
                </Stack> */}
              </Stack>
            </Grid>

            {/* RIGHT: glass card */}
            {/* <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(12px)",
                  color: "#fff",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <CloudDoneIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
                        Quick Overview
                      </Typography>
                      <Typography sx={{ opacity: 0.9, fontSize: 13 }}>
                        What you can do in the system
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

                  <Stack spacing={1.2}>
                    {[
                      {
                        icon: <Inventory2Icon />,
                        title: "Track inventory",
                        sub: "On-stock / issued / history",
                      },
                      { icon: <AssessmentIcon />, title: "Generate reports", sub: "Audit-ready summaries" },
                      { icon: <SecurityIcon />, title: "Role-based access", sub: "Admin & User permissions" },
                      { icon: <SupportAgentIcon />, title: "Easy monitoring", sub: "Searchable tables & filters" },
                    ].map((x, idx) => (
                      <Stack key={idx} direction="row" spacing={1.4} alignItems="center">
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.16)",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {x.icon}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 900, fontSize: 14 }}>{x.title}</Typography>
                          <Typography sx={{ opacity: 0.9, fontSize: 12 }}>{x.sub}</Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* BODY */}
      {/* <Box sx={{ bgcolor: "#0b1220" }}>
        <Container maxWidth="lg" sx={{ py: 7 }}>
          SERVICES
          <Box id="services" sx={{ scrollMarginTop: 90 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ color: "#fff", fontWeight: 1000, fontSize: 28 }}>
                Services
              </Typography>
              <Chip
                size="small"
                label="What we provide"
                sx={{
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            </Stack>

            <Grid container spacing={2.5} sx={{ mt: 2 }}>
              {[
                {
                  title: "Inventory Monitoring",
                  desc: "See current stock, issuance status, and availability in real time.",
                  icon: <Inventory2Icon />,
                  img: pics.inventory,
                },
                {
                  title: "Audit & Reporting",
                  desc: "Generate summaries and logs for verification and compliance.",
                  icon: <AssessmentIcon />,
                  img: pics.audit,
                },
                {
                  title: "Secure Access",
                  desc: "Role-based access control with token-based authentication.",
                  icon: <SecurityIcon />,
                  img: pics.secure,
                },
              ].map((s, idx) => (
                <Grid key={idx} item xs={12} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                    }}
                  >
                    <Box
                      sx={{
                        height: 150,
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(11,18,32,0.85)), url(${s.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.16)",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          {s.icon}
                        </Avatar>
                        <Typography sx={{ fontWeight: 1000, letterSpacing: 0.4 }}>
                          {s.title}
                        </Typography>
                      </Stack>
                    </Box>

                    <CardContent>
                      <Typography sx={{ opacity: 0.9 }}>{s.desc}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                        <Chip size="small" label="Fast" sx={{ background: "rgba(255,255,255,0.10)", color: "#fff" }} />
                        <Chip size="small" label="Organized" sx={{ background: "rgba(255,255,255,0.10)", color: "#fff" }} />
                        <Chip size="small" label="Reliable" sx={{ background: "rgba(255,255,255,0.10)", color: "#fff" }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.12)" }} />

          FEATURES
          <Box id="features" sx={{ scrollMarginTop: 90 }}>
            <Typography sx={{ color: "#fff", fontWeight: 1000, fontSize: 28 }}>
              Features
            </Typography>

            <Grid container spacing={2.5} sx={{ mt: 2 }}>
              {[
                { title: "Role-based Access", desc: "Admin and User permissions for safety and control.", icon: <SecurityIcon /> },
                { title: "History + Attachments", desc: "Keep issuance history and view attached documents/images.", icon: <CloudDoneIcon /> },
                { title: "Searchable Tables", desc: "Quick filters, pagination, and clean data views.", icon: <Inventory2Icon /> },
                { title: "Support & Monitoring", desc: "Easy monitoring and workflow clarity for staff.", icon: <SupportAgentIcon /> },
              ].map((f, idx) => (
                <Grid key={idx} item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      p: 2.2,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.14)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        width: 44,
                        height: 44,
                        mb: 1.5,
                      }}
                    >
                      {f.icon}
                    </Avatar>
                    <Typography sx={{ fontWeight: 1000 }}>{f.title}</Typography>
                    <Typography sx={{ opacity: 0.88, mt: 0.5, fontSize: 13 }}>
                      {f.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 4,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                overflow: "hidden",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 1000, fontSize: 20 }}>
                    Built for clarity and audit readiness
                  </Typography>
                  <Typography sx={{ opacity: 0.9, mt: 1 }}>
                    Organize records, track movement, and keep history logs in one place —
                    faster searching, cleaner reporting, and more reliable monitoring.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: 190,
                      borderRadius: 3,
                      backgroundImage: `linear-gradient(to right, rgba(11,18,32,0.95), rgba(11,18,32,0.35)), url(${pics.support})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.12)" }} />

          CONTACT
          <Box id="contact" sx={{ scrollMarginTop: 90 }}>
            <Typography sx={{ color: "#fff", fontWeight: 1000, fontSize: 28 }}>
              Contact
            </Typography>

            <Grid container spacing={2.5} sx={{ mt: 2 }}>
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#fff",
                  }}
                >
                  <Typography sx={{ fontWeight: 1000 }}>Office Details</Typography>
                  <Typography sx={{ opacity: 0.9, mt: 1 }}>
                    Address: (put your address here)
                    <br />
                    Phone: (put your phone here)
                    <br />
                    Email: (put your email here)
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }} flexWrap="wrap">
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 999, fontWeight: 900 }}
                      onClick={() => setOpenLogin(true)}
                    >
                      Login Now
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: 999,
                        color: "#fff",
                        borderColor: "rgba(255,255,255,0.45)",
                        "&:hover": { borderColor: "#fff" },
                        fontWeight: 900,
                      }}
                      onClick={() => handleNavClick("home")}
                    >
                      Back to Top
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2.5,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#fff",
                  }}
                >
                  <Typography sx={{ fontWeight: 1000 }}>Support</Typography>
                  <Typography sx={{ opacity: 0.9, mt: 1 }}>
                    Need help? Contact the system administrator for access and concerns.
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      height: 180,
                      borderRadius: 3,
                      backgroundImage: `linear-gradient(to bottom, rgba(11,18,32,0.15), rgba(11,18,32,0.9)), url(${pics.support})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>

        Footer
        <Box sx={{ py: 3, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
          <Container maxWidth="lg">
            <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              © {new Date().getFullYear()} Firearms Inventory Management System
            </Typography>
          </Container>
        </Box>
      </Box> */}

      {/* ✅ LOGIN MODAL */}
      <Dialog
        open={openLogin}
        onClose={() => {
          setOpenLogin(false);
          setErrText("");
          reset({ password: "" });
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="img" src={logo} alt="logo" sx={{ width: 28, height: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 1000, lineHeight: 1.2 }}>Login</Typography>
            {/* <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              Temporary login (backend disabled)
            </Typography> */}
          </Box>
          <IconButton
            onClick={() => {
              setOpenLogin(false);
              setErrText("");
              reset({ password: "" });
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(25,118,210,0.10), rgba(156,39,176,0.06))",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography sx={{ fontWeight: 900 }}>Temporary Accounts</Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              Admin: <b>admin@test.com</b> / <b>admin123</b>
              <br />
              User: <b>user@test.com</b> / <b>user123</b>
            </Typography>
          </Box> */}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                // type="email"
                fullWidth
                {...register("email", { required: "Email is Required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register("password", { required: "Password is Required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              {errText ? (
                <Typography sx={{ color: "error.main", fontSize: 13 }}>{errText}</Typography>
              ) : null}

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ borderRadius: 2, fontWeight: 900 }}
                disabled={spin}
              >
                Login {spin ? <CircularProgress size={20} sx={{ ml: 1 }} /> : null}
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setOpenLogin(false);
                  setErrText("");
                  reset({ password: "" });
                }}
                sx={{ fontWeight: 800 }}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Typography sx={{ fontSize: 12, color: "text.secondary", flex: 1 }}>
            Tip: Replace temporary login with your API call later.
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Landing;