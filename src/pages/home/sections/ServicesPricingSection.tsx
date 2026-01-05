import { Grid, Typography, Skeleton, Stack, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, formatDualPrice } from '../../../utils/constants';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';
import SectionTitle from '../../../components/common/typography/SectionTitle.component';

export const ServicesPricingSection = () => {
    const navigate = useNavigate();
    const { settings, loading, error } = useBusinessSettings();

    // Use Firebase settings only - no hardcoded fallback
    const prices = settings?.prices;
    const onlineDiscount = settings?.onlineDiscount;

    return (
        <Container maxWidth='xl' >
            <SectionTitle>
                Услуги и Цени
            </SectionTitle>

            {error && !loading && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Проблем с интернет връзката. Цените не могат да бъдат заредени.
                </Alert>
            )}

            <Typography variant="body2" color="secondary" pb={6} textAlign="center" sx={{ fontWeight: 600 }}>
                {loading ? (
                    <Skeleton variant="text" width={400} sx={{ mx: 'auto' }} />
                ) : onlineDiscount ? (
                    `При онлайн записване ${formatDualPrice(onlineDiscount)} отстъпка от посочените цени`
                ) : (
                    'Моля, опитайте отново след малко'
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
                            onClick={() => !loading && prices && navigate(`/booking?vehicleType=${key}`)}
                            sx={{
                                cursor: loading || !prices ? 'default' : 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': loading || !prices ? {} : {
                                    borderColor: 'info.dark',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            <Typography>{label}</Typography>
                            {loading ? (
                                <Skeleton variant="text" width={120} />
                            ) : prices ? (
                                <Typography fontWeight="bold">{formatDualPrice(prices[key as keyof typeof prices])}</Typography>
                            ) : (
                                <Typography color="text.secondary" fontStyle="italic">Цени недостъпни</Typography>
                            )}
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
