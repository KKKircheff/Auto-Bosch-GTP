import {
    AppBar,
    Link,
    Box,
    Stack,
    IconButton,
    Typography,
    Fade
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import RedButton from '../common/buttons/RedButton';
import { CONTACT_INFO } from '../../utils/constants';
import { BlackButton } from '../common/buttons';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

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
        <>
            {/* NAVBAR */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    px: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'white',
                    boxShadow: 'none'
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, py: 3 }}
                >
                    <WarehouseOutlinedIcon
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'secondary.main',
                            cursor: 'pointer',
                            fontSize: { xs: '1.8rem', md: '2rem' }
                        }}
                    />

                    {/* Phone */}
                    <Link
                        href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                        sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        <PhoneOutlinedIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                        <Typography
                            fontSize={{ xs: '1rem', md: '1.5rem' }}
                            fontWeight={600}
                        >
                            {CONTACT_INFO.phone}
                        </Typography>
                    </Link>

                    {/* Desktop buttons */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        <RedButton
                            variant={isActive('/') ? 'contained' : 'outlined'}
                            size="medium"
                            onClick={() => navigate('/')}
                            sx={{ minWidth: '140px' }}
                            startIcon={<HomeOutlinedIcon />}
                        >
                            Начало
                        </RedButton>

                        <RedButton
                            variant={isActive('/booking') ? 'contained' : 'outlined'}
                            size="medium"
                            onClick={() => navigate('/booking')}
                            sx={{ minWidth: '140px' }}
                            startIcon={<CalendarMonthOutlinedIcon />}
                        >
                            Запази час
                        </RedButton>

                        {!user && (
                            <BlackButton
                                variant="outlined"
                                size="medium"
                                onClick={() => navigate('/admin/login')}
                                sx={{ minWidth: '140px' }}
                                startIcon={<PersonOutlineIcon />}
                            >
                                Профил
                            </BlackButton>
                        )}

                        {user && (
                            <>
                                <BlackButton
                                    variant="contained"
                                    size="medium"
                                    onClick={() => navigate('/admin/dashboard')}
                                    sx={{ minWidth: '140px' }}
                                    startIcon={<SettingsOutlinedIcon />}
                                >
                                    Настройки
                                </BlackButton>

                                <BlackButton
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleLogout}
                                    sx={{ minWidth: '140px' }}
                                    startIcon={<LogoutOutlinedIcon />}
                                >
                                    Изход
                                </BlackButton>
                            </>
                        )}
                    </Stack>

                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            position: 'relative',
                            zIndex: 2001
                        }}
                    >
                        <IconButton
                            onClick={() => setMenuOpen(!menuOpen)}
                            sx={{
                                width: 40,
                                height: 40,
                                p: 0,
                                position: 'relative'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 24,
                                    height: 18,
                                    position: 'relative'
                                }}
                            >
                                {/* TOP BAR */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: 3,
                                        bgcolor: menuOpen ? 'primary.contrastText' : 'info.dark',
                                        borderRadius: 1,
                                        transition: '0.3s',
                                        transformOrigin: 'center',
                                        transform: menuOpen
                                            ? 'translateY(7.5px) rotate(45deg)'
                                            : 'none'
                                    }}
                                />

                                {/* MIDDLE BAR */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 7.5,
                                        left: 0,
                                        width: '100%',
                                        height: 3,
                                        bgcolor: menuOpen ? 'primary.contrastText' : 'info.dark',
                                        borderRadius: 1,
                                        transition: '0.3s',
                                        opacity: menuOpen ? 0 : 1
                                    }}
                                />

                                {/* BOTTOM BAR */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: 3,
                                        bgcolor: menuOpen ? 'primary.contrastText' : 'info.dark',
                                        borderRadius: 1,
                                        transition: '0.3s',
                                        transformOrigin: 'center',
                                        transform: menuOpen
                                            ? 'translateY(-7.5px) rotate(-45deg)'
                                            : 'none'
                                    }}
                                />
                            </Box>
                        </IconButton>
                    </Box>



                </Stack>
            </AppBar>

            {/* FULL-SCREEN OVERLAY MOBILE MENU */}
            <Fade in={menuOpen}>
                <Box
                    onClick={() => setMenuOpen(false)}
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Stack spacing={3} textAlign="center">
                        <Typography
                            onClick={() => navigate('/')}
                            sx={{ fontSize: '1.8rem', color: 'white', cursor: 'pointer' }}
                        >
                            Начало
                        </Typography>

                        <Typography
                            onClick={() => navigate('/booking')}
                            sx={{ fontSize: '1.8rem', color: 'white', cursor: 'pointer' }}
                        >
                            Запази час
                        </Typography>

                        {!user && (
                            <Typography
                                onClick={() => navigate('/admin/login')}
                                sx={{ fontSize: '1.8rem', color: 'white', cursor: 'pointer' }}
                            >
                                Профил
                            </Typography>
                        )}

                        {user && (
                            <>
                                <Typography
                                    onClick={() => navigate('/admin/dashboard')}
                                    sx={{ fontSize: '1.8rem', color: 'white', cursor: 'pointer' }}
                                >
                                    Настройки
                                </Typography>

                                <Typography
                                    onClick={handleLogout}
                                    sx={{ fontSize: '1.8rem', color: 'white', cursor: 'pointer' }}
                                >
                                    Изход
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Box>
            </Fade>
        </>
    );
};

export default Navbar;
