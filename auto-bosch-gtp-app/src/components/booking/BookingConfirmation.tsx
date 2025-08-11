// src/components/booking/BookingConfirmation.tsx
import {
    Box,
    Typography,
    Button,
    Stack,
    Divider,
    Grid,
    Chip,
    Alert,
    Card,
    CardContent,
    alpha,
    Container,
} from '@mui/material';
import {
    Event,
    AccessTime,
    Person,
    Phone,
    Email,
    DirectionsCar,
    Receipt,
    CheckCircle,
} from '@mui/icons-material';
import { formatDateBulgarian } from '../../utils/dateHelpers';
import { TEXTS, VEHICLE_TYPES, calculatePriceWithCurrencies, CONTACT_INFO, shadow1 } from '../../utils/constants';
import type { BookingFormSchema } from '../../types/booking';
import { theme } from '../../theme/theme';

interface BookingConfirmationProps {
    formData: BookingFormSchema;
    onSubmit?: () => void;
    onEdit?: (step: number) => void;
    loading?: boolean;
}

const BookingConfirmation = ({
    formData,
    onSubmit,
    onEdit,
    loading = false,
}: BookingConfirmationProps) => {
    const priceInfo = formData.vehicleType ? calculatePriceWithCurrencies(formData.vehicleType, true) : null;

    // Format vehicle details
    const formatVehicleDetails = () => {
        const parts: string[] = [VEHICLE_TYPES[formData.vehicleType]];
        if (formData.vehicleBrand) {
            parts.push(formData.vehicleBrand);
        }
        if (formData.is4x4) {
            parts.push('4x4');
        }
        return parts.join(' - ');
    };

    return (
        <Container maxWidth='xl'>
            <Stack spacing={6} width={'100%'}>
                {/* Header */}
                <Box textAlign="center">
                    {/* <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} /> */}
                    <Typography variant="h4" gutterBottom>
                        {TEXTS.bookingDetails}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Моля прегледайте данните преди потвърждение
                    </Typography>
                </Box>

                {/* Appointment Details */}
                <Card sx={{ boxShadow: shadow1 }}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Event color="primary" />
                                <Typography variant="h6">Дата и час на прегледа</Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Event sx={{ color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Дата
                                            </Typography>
                                            <Typography variant="h6">
                                                {formatDateBulgarian(formData.appointmentDate, 'EEEE, dd MMMM yyyy')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <AccessTime sx={{ color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Час
                                            </Typography>
                                            <Typography variant="h6">
                                                {formData.appointmentTime}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {onEdit && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onEdit(0)}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    Редактирай дата и час
                                </Button>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Customer Details */}
                <Card sx={{ boxShadow: shadow1 }}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Person color="primary" />
                                <Typography variant="h6">Данни на клиента</Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Person sx={{ color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Име и фамилия
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.customerName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Phone sx={{ color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Телефон
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {formData.email && (
                                    <Grid size={{ xs: 12 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Email sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Имейл
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formData.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            {onEdit && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onEdit(1)}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    Редактирай данни
                                </Button>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Vehicle Details */}
                <Card sx={{ boxShadow: shadow1 }}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <DirectionsCar color="primary" />
                                <Typography variant="h6">Превозно средство</Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" pb={1.5}>
                                            Регистрационен номер
                                        </Typography>
                                        <Chip
                                            label={formData.registrationPlate}
                                            variant="outlined"
                                            size="medium"
                                            sx={{ fontWeight: 'bold', fontSize: '1rem', borderRadius: 1, }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Тип и марка
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatVehicleDetails()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {formData.notes && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Бележки
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.notes}
                                    </Typography>
                                </Box>
                            )}

                            {onEdit && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onEdit(1)}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    Редактирай превозно средство
                                </Button>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Price Summary */}
                {priceInfo && (
                    <Card sx={{ bgcolor: alpha(theme.palette.primary.light, 0.2), boxShadow: shadow1 }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Receipt color="primary" />
                                    <Typography variant="h6" color="primary.dark">
                                        Обобщение на цената
                                    </Typography>
                                </Box>

                                <Stack spacing={1}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body1">
                                            Базова цена:
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {priceInfo.basePriceFormatted}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body1" color="success.dark">
                                            Отстъпка при онлайн записване:
                                        </Typography>
                                        <Typography variant="body1" color="success.dark" fontWeight={600}>
                                            -{priceInfo.discountFormatted}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6" color="primary.dark">
                                            Крайна цена:
                                        </Typography>
                                        <Typography variant="h6" color="primary.dark" fontWeight={700}>
                                            {priceInfo.finalPriceFormatted}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {/* Important Information */}
                <Alert severity="warning" sx={{ bgcolor: theme.palette.warning.light, boxShadow: shadow1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Важна информация:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>Моля пристигнете 10 минути преди назначения час</li>
                        <li>Носете със себе си документи за превозното средство</li>
                        <li>За отмяна или промяна се свържете с нас на {CONTACT_INFO.phone}</li>
                        <li>Плащането се извършва в автосервиза след прегледа</li>
                    </ul>
                </Alert>

                {/* Contact Information */}
                <Card sx={{ bgcolor: 'grey.50', boxShadow: shadow1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Контакти за връзка
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Phone sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Телефон
                                        </Typography>
                                        <Typography variant="body1">
                                            {CONTACT_INFO.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Email sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Имейл
                                        </Typography>
                                        <Typography variant="body1">
                                            {CONTACT_INFO.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Адрес
                                    </Typography>
                                    <Typography variant="body1">
                                        {CONTACT_INFO.address}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Box textAlign="center" pt={2}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onSubmit}
                        disabled={loading}
                        startIcon={<CheckCircle />}
                        sx={{
                            px: 4,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                        }}
                    >
                        {loading ? 'Записването се обработва...' : TEXTS.confirmBooking}
                    </Button>

                    <Typography variant="body2" color="text.secondary" mt={2}>
                        С натискане на бутона потвърждавате записването си
                    </Typography>
                </Box>
            </Stack>
        </Container>
    );
};

export default BookingConfirmation;