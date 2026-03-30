import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import {
    Button,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";

import { useHistory } from "react-router-dom";
import routers from "../routes";

import { ReactComponent as StorageIcon } from "../assets/storage-svgrepo-com.svg";
import { ReactComponent as DashboardIcon } from "../assets/dashboard-svgrepo-com.svg";
import { ReactComponent as PersonIcon } from "../assets/person-male-svgrepo-com.svg";
import { ReactComponent as ActivityLog } from "../assets/ChatGPT Image Mar 24, 2026, 08_12_50 AM.svg";

const drawerWidth = 240;
const defaultTheme = createTheme();

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
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
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
    const [username, setUsername] = useState<any>();

    const history = useHistory();

    useEffect(() => {
        const role = localStorage.getItem("role");
        setIsSuperAdmin(role === "super_admin");
        const user = localStorage.getItem("username")
        setUsername(user)
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: "24px" }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: "36px",
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Firearms Inventory
                        </Typography>
                        <Typography
                            sx={{
                                mr: 2
                            }}
                        >
                            User : {username}
                        </Typography>
                        <IconButton color="inherit" onClick={handleClick}>
                            {/* <Badge badgeContent={4} color="secondary"> */}
                            <Badge color="secondary">
                                <AccountCircleIcon />
                            </Badge>
                        </IconButton>

                        <Popover
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            <Button onClick={handleLogout}>Logout</Button>
                        </Popover>
                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>

                    <Divider />

                    <List component="nav">
                        <ListItemButton onClick={() => history.push("/admin/dashboard")}>
                            <ListItemIcon>
                                <DashboardIcon width={28} height={30} />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>

                        <ListItemButton onClick={() => history.push("/admin/issued")}>
                            <ListItemIcon>
                                <PersonIcon width={28} height={30} />
                            </ListItemIcon>
                            <ListItemText primary="All Issued Firearms" />
                        </ListItemButton>

                        <ListItemButton onClick={() => history.push("/admin/firearms")}>
                            <ListItemIcon>
                                <StorageIcon width={28} height={30} />
                            </ListItemIcon>
                            <ListItemText primary="On Stock Firearms" />
                        </ListItemButton>

                        {isSuperAdmin && (
                            <ListItemButton onClick={() => history.push("/admin/users")}>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        )}
                        {isSuperAdmin && (
                            <ListItemButton onClick={() => history.push("/admin/activity_log")}>
                                <ListItemIcon>
                                    <ActivityLog width={30} height={40} />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        )}
                    </List>
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Toolbar />
                    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                        {routers()}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}