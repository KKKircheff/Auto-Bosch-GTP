import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TEXTS, CONTACT_INFO, VEHICLE_TYPES, PRICING, formatDualPrice } from '../utils/constants';
import { AnnouncementBanner } from '../components/common/AnnouncementBanner';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Announcements above hero */}
            <AnnouncementBanner position="above-hero" />

            {/* Hero Section */}
            <Stack direction={'column'} spacing={4} alignItems="center" justifyContent='center' py={8} >
                <Typography variant="h2" component="h1" gutterBottom color="secondary.main" textAlign={{ xs: 'center' }}>
                    {TEXTS.siteName}
                </Typography>
                <Typography variant="h5" color="text.secondary" pb={4} textAlign={{ xs: 'center' }}>
                    {TEXTS.siteTagline}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/booking')}
                    sx={{ px: 4, py: 2, width: 250 }}
                >
                    {TEXTS.bookAppointment}
                </Button>
            </Stack>

            {/* Services & Pricing Section */}
            <Box pb={6}>
                <Typography variant="h4" component="h2" gutterBottom textAlign="center" pb={4}>
                    {TEXTS.services} и {TEXTS.pricing}
                </Typography>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2} mt={3}>
                    {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                        <Box
                            key={key}
                            display="flex"
                            justifyContent="space-between"
                            p={2} border={1}
                            borderColor="grey.300"
                            borderRadius={1}
                            onClick={() => navigate(`/booking?vehicleType=${key}`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Typography>{label}</Typography>
                            <Typography fontWeight="bold">{formatDualPrice(PRICING[key as keyof typeof PRICING])}</Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant="body2" color="primary" pt={6} textAlign="center">
                    При онлайн записване {formatDualPrice(PRICING.onlineDiscount)} отстъпка от посочените цени
                </Typography>
            </Box>

            {/* Announcements below hero */}
            <AnnouncementBanner position="below-hero" />

            {/* Contact Section */}
            <Box textAlign="center" pb={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {TEXTS.contact}
                </Typography>
                <Typography
                    variant="body1"
                    mb={1}
                    onClick={() => window.open('https://maps.app.goo.gl/g15n75P7BaCqae3u7', '_blank', 'noopener,noreferrer')}
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    📍 {CONTACT_INFO.address}
                </Typography>
                <Typography
                    variant="body1"
                    mb={1}
                    onClick={() => window.open(`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`)}
                >
                    📞 {CONTACT_INFO.phone}
                </Typography>
                <Typography variant="body1">
                    ✉️ {CONTACT_INFO.email}
                </Typography>
            </Box>
        </Container>
    );
};

export default HomePage;