import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import routers from '../routes';
import LanguageIcon from '@mui/icons-material/Language';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';



interface CopyrightProps {
    children: React.ReactNode;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop: string) => prop !== 'open',
})(({ theme, open }: { theme: any; open: boolean }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop: string) => prop !== 'open' })(
    ({ theme, open }: { theme: any; open: boolean }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
    const [open, setOpen] = React.useState<boolean>(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const id = open ? 'simple-popover' : undefined;
    const openPopover = Boolean(anchorEl);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open} theme={undefined}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography> */}
                        <IconButton color="inherit" onClick={handleClick}>
                            <Badge badgeContent={4} color="secondary">
                                <AccountCircleIcon />
                            </Badge>
                        </IconButton>
                        <Popover
                            id={id}
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
                            <Button href='/' onClick={() => localStorage.clear()}>
                                Logout
                            </Button>
                        </Popover>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} theme={undefined}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <>
                            <Link href="/admin/dashboard" underline="none">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                </ListItemButton>
                            </Link>
                            <Link href="/admin/person" underline="none">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonAddAlt1Icon />
                                    </ListItemIcon>
                                    <ListItemText primary="Person" />
                                </ListItemButton>
                            </Link>
                            <Link href="/admin/geofence" underline="none">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LanguageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Geofencing" />
                                </ListItemButton>
                            </Link>
                            <Link href="/admin/track_person" underline="none">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonSearchIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Find Person" />
                                </ListItemButton>
                            </Link>
                            <Link href="/admin/deploy" underline="none">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <RocketLaunchIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Deployed Units" />
                                </ListItemButton>
                            </Link>
                            
                        </>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme: any) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        {routers()}
                        {/* <Copyright sx={{ pt: 4 }} /> */}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}