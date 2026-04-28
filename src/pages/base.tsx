import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import {
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Collapse,
  Avatar,
  Chip,
  Stack,
  Popover,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useHistory, useLocation } from "react-router-dom";
import routers from "../routes";
import app from "../http_settings";

const drawerWidth = 260;
const collapsedWidth = 78;

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f172a",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Arial", sans-serif`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface DrawerProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "rgba(15, 23, 42, 0.92)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    overflowX: "hidden",
    width: drawerWidth,
    background: "linear-gradient(180deg, #0f172a 0%, #111827 55%, #020617 100%)",
    color: "#fff",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "12px 0 30px rgba(15,23,42,0.18)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      width: collapsedWidth,
    }),
  },
}));

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export default function Base() {
  const [open, setOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [username, setUsername] = useState("");

  const [issuedMenuOpen, setIssuedMenuOpen] = useState(false);
  const [stockMenuOpen, setStockMenuOpen] = useState(false);

  const [problemCount, setProblemCount] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("username");

    setIsSuperAdmin(role === "super_admin");
    setUsername(user || "User");

    if (location.pathname.startsWith("/admin/issued")) {
      setIssuedMenuOpen(true);
      setOpen(true);
    }

    if (location.pathname.startsWith("/admin/firearms")) {
      setStockMenuOpen(true);
      setOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const [issuedRes, unsvcRes, berRes] = await Promise.allSettled([
        app.get("/api/guns/", {
          params: {
            disposition: "ISSUED",
            page: 1,
            page_size: 1,
          },
        }),
        app.get("/api/guns/", {
          params: {
            status: "UNSVC",
            page: 1,
            page_size: 1,
          },
        }),
        app.get("/api/guns/", {
          params: {
            status: "BER",
            page: 1,
            page_size: 1,
          },
        }),
      ]);

      if (issuedRes.status === "fulfilled") {
        setIssuedCount(Number(issuedRes.value.data?.count ?? 0));
      }

      const unsvc =
        unsvcRes.status === "fulfilled"
          ? Number(unsvcRes.value.data?.count ?? 0)
          : 0;

      const ber =
        berRes.status === "fulfilled"
          ? Number(berRes.value.data?.count ?? 0)
          : 0;

      setProblemCount(unsvc + ber);
    } catch (error) {
      console.error("Badge count error:", error);
    }
  };

  const toggleDrawer = () => {
    setOpen((prev) => {
      const next = !prev;

      if (!next) {
        setIssuedMenuOpen(false);
        setStockMenuOpen(false);
      }

      return next;
    });
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleIssuedMenuToggle = () => {
    if (!open) {
      setOpen(true);
      setIssuedMenuOpen(true);
      return;
    }

    setIssuedMenuOpen((prev) => !prev);
  };

  const handleStockMenuToggle = () => {
    if (!open) {
      setOpen(true);
      setStockMenuOpen(true);
      return;
    }

    setStockMenuOpen((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname === path;
  const isPathIncluded = (path: string) => location.pathname.startsWith(path);

  const openPopover = Boolean(anchorEl);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ minHeight: 66, px: 3 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{
                mr: 2,
                width: 42,
                height: 42,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.08)",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.16)",
                  transform: "scale(1.06)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                component="h1"
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.4px",
                  lineHeight: 1.1,
                }}
              >
                Firearms Inventory
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.65,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Inventory Monitoring System
              </Typography>
            </Box>

            <Chip
              label={`User : ${username}`}
              sx={{
                mr: 1.5,
                color: "#fff",
                fontWeight: 800,
                bgcolor: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />

            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.08)",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.16)",
                  transform: "scale(1.06)",
                },
              }}
            >
              <AccountCircleIcon />
            </IconButton>

            <Popover
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 18px 40px rgba(15,23,42,0.22)",
                },
              }}
            >
              <Box sx={{ p: 2, minWidth: 220 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Avatar sx={{ bgcolor: "#0f172a" }}>
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>

                  <Box>
                    <Typography sx={{ fontWeight: 900 }}>{username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Account
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 800,
                    textTransform: "none",
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              minHeight: 66,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
            }}
          >
            {open && (
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                  PARDS
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.55 }}>
                  Admin Panel
                </Typography>
              </Box>
            )}

            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.08)",
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.16)",
                  transform: "scale(1.06)",
                },
              }}
            >
              <ChevronLeftIcon
                sx={{
                  transform: open ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "0.2s",
                }}
              />
            </IconButton>
          </Toolbar>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <List
            component="nav"
            sx={{
              px: 1.2,
              py: 2,
            }}
          >
            <NavItem
              open={open}
              active={isActive("/admin/dashboard")}
              label="Dashboard"
              icon={<DashboardRoundedIcon />}
              onClick={() => history.push("/admin/dashboard")}
            />

            <NavItem
              open={open}
              active={isPathIncluded("/admin/issued")}
              label="All Issued Firearms"
              icon={<AssignmentIndRoundedIcon />}
              badgeCount={issuedCount}
              onClick={handleIssuedMenuToggle}
              endIcon={issuedMenuOpen ? <ExpandLess /> : <ExpandMore />}
            />

            {open && (
              <Collapse in={issuedMenuOpen} timeout="auto" unmountOnExit>
                <SubNavItem
                  active={isActive("/admin/issued/long-arm")}
                  label="Long Arm"
                  onClick={() => history.push("/admin/issued/long-arm")}
                />

                <SubNavItem
                  active={isActive("/admin/issued/short-arm")}
                  label="Short Arm"
                  onClick={() => history.push("/admin/issued/short-arm")}
                />
              </Collapse>
            )}

            <NavItem
              open={open}
              active={isPathIncluded("/admin/firearms")}
              label="All Firearms"
              icon={<Inventory2RoundedIcon />}
              badgeCount={problemCount}
              badgeColor="error"
              onClick={handleStockMenuToggle}
              endIcon={stockMenuOpen ? <ExpandLess /> : <ExpandMore />}
            />

            {open && (
              <Collapse in={stockMenuOpen} timeout="auto" unmountOnExit>
                <SubNavItem
                  active={isActive("/admin/firearms/long-arm")}
                  label="Long Arm"
                  onClick={() => history.push("/admin/firearms/long-arm")}
                />

                <SubNavItem
                  active={isActive("/admin/firearms/short-arm")}
                  label="Short Arm"
                  onClick={() => history.push("/admin/firearms/short-arm")}
                />
              </Collapse>
            )}

            {isSuperAdmin && (
              <NavItem
                open={open}
                active={isActive("/admin/users")}
                label="Users"
                icon={<GroupsRoundedIcon />}
                onClick={() => history.push("/admin/users")}
              />
            )}

            {isSuperAdmin && (
              <NavItem
                open={open}
                active={isActive("/admin/activity_log")}
                label="Activity Log"
                icon={<TimelineRoundedIcon />}
                onClick={() => history.push("/admin/activity_log")}
              />
            )}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            background:
              "radial-gradient(circle at top left, rgba(15,23,42,0.08), transparent 35%), #f8fafc",
          }}
        >
          <Toolbar sx={{ minHeight: 66 }} />

          <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            {routers()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function NavItem({
  open,
  active,
  label,
  icon,
  onClick,
  endIcon,
  badgeCount,
  badgeColor = "primary",
}: {
  open: boolean;
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  endIcon?: React.ReactNode;
  badgeCount?: number;
  badgeColor?: "primary" | "secondary" | "error" | "warning" | "success";
}) {
  const content = (
    <ListItemButton
      onClick={onClick}
      sx={{
        mb: 0.7,
        px: 1.5,
        minHeight: 50,
        borderRadius: 3,
        justifyContent: open ? "initial" : "center",
        bgcolor: active ? "rgba(59,130,246,0.18)" : "transparent",
        color: active ? "#fff !important" : "rgba(255,255,255,0.72)",
        border: active
          ? "1px solid rgba(96,165,250,0.35)"
          : "1px solid transparent",
        boxShadow: active ? "0 10px 24px rgba(37,99,235,0.18)" : "none",
        transition: "0.2s ease",

        "&:hover": {
          bgcolor: active
            ? "rgba(59,130,246,0.24)"
            : "rgba(255,255,255,0.08)",
          color: "#fff",
          transform: "translateX(4px)",
        },

        "&:hover .nav-icon": {
          transform: "scale(1.18)",
          filter: "drop-shadow(0 0 8px rgba(96,165,250,0.75))",
          color: "#60a5fa",
        },

        ...(active && {
          "& .nav-icon": {
            color: "#60a5fa",
            filter: "drop-shadow(0 0 8px rgba(96,165,250,0.6))",
          },
        }),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: open ? 42 : "auto",
          justifyContent: "center",
          color: "inherit",
        }}
      >
        <Box
          className="nav-icon"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s ease",
            "& svg": {
              fontSize: 24,
            },
          }}
        >
          {icon}
        </Box>
      </ListItemIcon>

      {open && (
        <>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: active ? 900 : 700,
              fontSize: 14,
            }}
          />

          {endIcon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 1,
                color: "inherit",
              }}
            >
              {endIcon}
            </Box>
          )}
        </>
      )}
    </ListItemButton>
  );

  if (!open) {
    return (
      <Tooltip title={label} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
}

function SubNavItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        ml: 2.2,
        pl: 2,
        pr: 1,
        mb: 0.4,
        minHeight: 40,
        borderRadius: 2.5,
        bgcolor: active ? "rgba(59,130,246,0.20)" : "transparent",
        color: active ? "#fff !important" : "rgba(255,255,255,0.62)",
        transition: "0.2s ease",

        "&:hover": {
          bgcolor: "rgba(255,255,255,0.08)",
          color: "#fff",
          transform: "translateX(4px)",
        },

        "&:hover svg": {
          color: "#60a5fa",
          filter: "drop-shadow(0 0 6px rgba(96,165,250,0.65))",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 24, color: "inherit" }}>
        <CircleRoundedIcon
          sx={{
            fontSize: 8,
            color: active ? "#60a5fa" : "inherit",
          }}
        />
      </ListItemIcon>

      <ListItemText
        primary={label}
        primaryTypographyProps={{
          noWrap: true,
          fontSize: 13,
          fontWeight: active ? 900 : 700,
        }}
      />
    </ListItemButton>
  );
}