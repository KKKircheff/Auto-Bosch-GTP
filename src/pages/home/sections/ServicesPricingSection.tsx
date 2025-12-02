import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, PRICING, formatDualPrice } from '../../../utils/constants';

export const ServicesPricingSection = () => {
    const navigate = useNavigate();

    return (
        <Box pb={6}>
            <Typography variant="h4" component="h2" gutterBottom textAlign="center" pb={4}>
                Услуги и Цени
            </Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2} mt={3}>
                {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                    <Box
                        key={key}
                        display="flex"
                        justifyContent="space-between"
                        p={2.5}
                        border={1}
                        borderColor="grey.300"
                        borderRadius={3}
                        onClick={() => navigate(`/booking?vehicleType=${key}`)}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                borderColor: 'info.dark',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        <Typography>{label}</Typography>
                        <Typography fontWeight="bold">{formatDualPrice(PRICING[key as keyof typeof PRICING])}</Typography>
                    </Box>
                ))}
            </Box>
            <Typography variant="body2" color="secondary" pt={6} textAlign="center" sx={{ fontWeight: 600 }}>
                При онлайн записване {formatDualPrice(PRICING.onlineDiscount)} отстъпка от посочените цени
            </Typography>
        </Box>
    );
};
