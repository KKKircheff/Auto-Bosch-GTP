import { type ReactNode, useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Campaign as CampaignIcon,
    Event as EventIcon,
    Logout as LogoutIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const drawerWidth = 240;

interface AdminLayoutProps {
    children: ReactNode;
}

interface NavItem {
    label: string;
    path: string;
    icon: ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Към сайта', path: '/', icon: <HomeIcon /> },
    { label: 'Информация', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Настройки', path: '/admin/settings', icon: <SettingsIcon /> },
    { label: 'Съобщения', path: '/admin/messages', icon: <CampaignIcon /> },
    { label: 'Записвания', path: '/admin/appointments', icon: <EventIcon /> },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileOpen(false); // Close mobile drawer after navigation
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Admin Panel
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'white' : 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Изход" />
                    </ListItemButton>
                </ListItem>
            </List>
            {user && (
                <Box sx={{ p: 2, mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                        Влязъл като:
                    </Typography>
                    <Typography variant="body2" noWrap>
                        {user.email}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Auto Bosch GTP - Администрация
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer - Mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Drawer - Desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
                open
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Container maxWidth="xl" sx={{ mt: 2 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
