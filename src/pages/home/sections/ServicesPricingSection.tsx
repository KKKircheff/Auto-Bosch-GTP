import { Grid, Typography, Skeleton, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, PRICING, formatDualPrice } from '../../../utils/constants';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';
import SectionTitle from '../../../components/common/typography/SectionTitle.component';

export const ServicesPricingSection = () => {
    const navigate = useNavigate();
    const { settings, loading } = useBusinessSettings();

    // Use Firebase settings if available, otherwise fallback to constants
    const prices = settings?.prices || PRICING;
    const onlineDiscount = settings?.onlineDiscount ?? PRICING.onlineDiscount;

    return (
        <Container maxWidth='xl' >
            <SectionTitle>
                Услуги и Цени
            </SectionTitle>
            <Typography variant="body2" color="secondary" pb={6} textAlign="center" sx={{ fontWeight: 600 }}>
                {loading ? (
                    <Skeleton variant="text" width={400} sx={{ mx: 'auto' }} />
                ) : (
                    `При онлайн записване ${formatDualPrice(onlineDiscount)} отстъпка от посочените цени`
                )}
            </Typography>
            <Grid container spacing={2} pb={6}>
                {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems={'center'}
                            p={2}
                            px={{ xs: 1, md: 2 }}
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
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
