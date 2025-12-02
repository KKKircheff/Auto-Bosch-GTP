import { Box, Typography, Divider, Stack, Skeleton } from '@mui/material';
import { CONTACT_INFO } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';

const Footer = () => {
    const navigate = useNavigate();
    const { settings, loading } = useBusinessSettings();

    // Use Firebase settings if available, otherwise fallback to constants
    const contact = settings?.contact || CONTACT_INFO;

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'info.dark',
                // bgcolor: 'red',
                px: 3,
                py: 6,
                mt: 'auto',
                borderTop: 1
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'center', md: 'flex-start' }}
                gap={2}
                maxWidth={'xl'}
                mx='auto'
            >
                {/* Company Info */}
                <Box textAlign={{ xs: 'center', md: 'left' }}>
                    <Typography variant="h6" gutterBottom color='primary.contrastText'>
                        Ауто Бош Сервиз Бургас
                    </Typography>
                    <Typography variant="body2" color='primary.contrastText'>
                        ГОДИШНИ ТЕХНИЧЕСКИ ПРЕГЛЕДИ
                    </Typography>
                </Box>

                {/* Contact Info */}
                <Box textAlign={{ xs: 'center', md: 'right' }}>
                    <Typography variant="subtitle2" gutterBottom color='primary.contrastText'>
                        Контакти
                    </Typography>
                    {loading ? (
                        <>
                            <Skeleton variant="text" width={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: { xs: 'auto', md: 0 } }} />
                            <Skeleton variant="text" width={180} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: { xs: 'auto', md: 0 } }} />
                            <Skeleton variant="text" width={220} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: { xs: 'auto', md: 0 } }} />
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="body2"
                                color='primary.contrastText'
                                onClick={() => window.open('https://maps.app.goo.gl/g15n75P7BaCqae3u7', '_blank', 'noopener,noreferrer')}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                {contact.address}
                            </Typography>
                            <Typography
                                variant="body2"
                                color='primary.contrastText'
                                onClick={() => window.open(`tel:${contact.phone.replace(/\s+/g, '')}`)}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                {contact.phone}
                            </Typography>
                            <Typography variant="body2" color='primary.contrastText'>
                                {contact.email}
                            </Typography>
                        </>
                    )}
                </Box>
            </Stack>

            <Divider sx={{ my: 2, borderColor: 'text.secondary' }} />

            <Typography variant="body2" color='primary.contrastText' textAlign="center" onClick={() => navigate('/admin/login')} sx={{ cursor: 'default' }}>
                © {new Date().getFullYear()} Ауто Бош Сервиз Бургас. Всички права запазени.
            </Typography>
        </Box>
    );
};

export default Footer;