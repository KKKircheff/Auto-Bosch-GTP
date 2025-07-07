import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, DirectionsCar } from '@mui/icons-material';
import { TEXTS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                {/* Logo */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    <DirectionsCar />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    {TEXTS.siteName}
                </Typography>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ fontWeight: isActive('/') ? 'bold' : 'normal' }}
                    >
                        Начало
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/booking')}
                        sx={{ fontWeight: isActive('/booking') ? 'bold' : 'normal' }}
                    >
                        {TEXTS.bookAppointment}
                    </Button>

                    {user ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/admin/dashboard')}
                                sx={{ fontWeight: isActive('/admin/dashboard') ? 'bold' : 'normal' }}
                            >
                                {TEXTS.adminDashboard}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                {TEXTS.logout}
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            onClick={() => navigate('/admin/login')}
                            sx={{ fontWeight: isActive('/admin/login') ? 'bold' : 'normal' }}
                        >
                            {TEXTS.adminLogin}
                        </Button>
                    )}
                </Box>

                {/* Mobile Navigation */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        color="inherit"
                        onClick={handleMobileMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={mobileMenuAnchor}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                    >
                        <MenuItem onClick={() => { navigate('/'); handleMobileMenuClose(); }}>
                            Начало
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/booking'); handleMobileMenuClose(); }}>
                            {TEXTS.bookAppointment}
                        </MenuItem>
                        {user ? (
                            <>
                                <MenuItem onClick={() => { navigate('/admin/dashboard'); handleMobileMenuClose(); }}>
                                    {TEXTS.adminDashboard}
                                </MenuItem>
                                <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>
                                    {TEXTS.logout}
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={() => { navigate('/admin/login'); handleMobileMenuClose(); }}>
                                {TEXTS.adminLogin}
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;