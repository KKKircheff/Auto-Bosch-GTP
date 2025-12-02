import { Box, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, PRICING, formatDualPrice } from '../../../utils/constants';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';

export const ServicesPricingSection = () => {
    const navigate = useNavigate();
    const { settings, loading } = useBusinessSettings();

    // Use Firebase settings if available, otherwise fallback to constants
    const prices = settings?.prices || PRICING;
    const onlineDiscount = settings?.onlineDiscount ?? PRICING.onlineDiscount;

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
                        onClick={() => !loading && navigate(`/booking?vehicleType=${key}`)}
                        sx={{
                            cursor: loading ? 'default' : 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': loading ? {} : {
                                borderColor: 'info.dark',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        <Typography>{label}</Typography>
                        {loading ? (
                            <Skeleton variant="text" width={120} />
                        ) : (
                            <Typography fontWeight="bold">{formatDualPrice(prices[key as keyof typeof prices])}</Typography>
                        )}
                    </Box>
                ))}
            </Box>
            <Typography variant="body2" color="secondary" pt={6} textAlign="center" sx={{ fontWeight: 600 }}>
                {loading ? (
                    <Skeleton variant="text" width={400} sx={{ mx: 'auto' }} />
                ) : (
                    `При онлайн записване ${formatDualPrice(onlineDiscount)} отстъпка от посочените цени`
                )}
            </Typography>
        </Box>
    );
};
