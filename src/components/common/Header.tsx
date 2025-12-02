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
        <AppBar
            position="static"
            elevation={1}
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                px: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ px: 0 }}>
                {/* Logo */}
                <IconButton
                    edge="start"
                    onClick={() => navigate('/')}
                    sx={{
                        pr: 3,
                        pl: 3,
                        color: 'text.primary',
                    }}
                >
                    <DirectionsCar />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer', color: 'text.primary' }}
                    onClick={() => navigate('/')}
                >
                    Ауто Бош Сервиз Бургас
                </Typography>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{
                            fontWeight: isActive('/') ? 700 : 500,
                            color: isActive('/') ? 'secondary.main' : 'text.primary',
                            position: 'relative',
                            '&::after': isActive('/') ? {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 3,
                                bgcolor: 'secondary.main',
                                borderRadius: '2px 2px 0 0',
                            } : {},
                        }}
                    >
                        Начало
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/booking')}
                        sx={{
                            fontWeight: isActive('/booking') ? 700 : 500,
                            color: isActive('/booking') ? 'secondary.main' : 'text.primary',
                            position: 'relative',
                            '&::after': isActive('/booking') ? {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 3,
                                bgcolor: 'secondary.main',
                                borderRadius: '2px 2px 0 0',
                            } : {},
                        }}
                    >
                        Запази час
                    </Button>

                    {user ? (
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ color: 'text.primary' }}
                        >
                            Изход
                        </Button>
                    ) : (
                        <></>
                    )}
                </Box>

                {/* Mobile Navigation */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        onClick={handleMobileMenuOpen}
                        sx={{ color: 'text.primary' }}
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
                            Запази час
                        </MenuItem>
                        {user && (
                            <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>
                                Изход
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;