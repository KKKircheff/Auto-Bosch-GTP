import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TEXTS, CONTACT_INFO, VEHICLE_TYPES, PRICING } from '../utils/constants';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Hero Section */}
            <Box textAlign="center" mb={6}>
                <Typography variant="h2" component="h1" gutterBottom color="primary">
                    {TEXTS.siteName}
                </Typography>
                <Typography variant="h5" color="text.secondary" mb={4}>
                    {TEXTS.siteTagline}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/booking')}
                    sx={{ px: 4, py: 2 }}
                >
                    {TEXTS.bookAppointment}
                </Button>
            </Box>

            {/* Services & Pricing Section */}
            <Box mb={6}>
                <Typography variant="h4" component="h2" gutterBottom textAlign="center">
                    {TEXTS.services} и {TEXTS.pricing}
                </Typography>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2} mt={3}>
                    {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                        <Box key={key} display="flex" justifyContent="space-between" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                            <Typography>{label}</Typography>
                            <Typography fontWeight="bold">{PRICING[key as keyof typeof PRICING]} лв</Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant="body2" color="primary" mt={2} textAlign="center">
                    При онлайн записване {PRICING.onlineDiscount} лв отстъпка от посочените цени
                </Typography>
            </Box>

            {/* Contact Section */}
            <Box textAlign="center">
                <Typography variant="h4" component="h2" gutterBottom>
                    {TEXTS.contact}
                </Typography>
                <Typography variant="body1" mb={1}>
                    📍 {CONTACT_INFO.address}
                </Typography>
                <Typography variant="body1" mb={1}>
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