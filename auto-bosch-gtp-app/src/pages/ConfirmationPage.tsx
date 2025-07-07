import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Chip,
    Divider,
} from '@mui/material';
import {
    CheckCircle,
    CalendarToday,
    DirectionsCar,
    Phone,
    Email,
    ArrowBack,
} from '@mui/icons-material';
import { getAppointmentById } from '../services/appointmentService';
import { formatDateTime } from '../utils/helpers';
import { SERVICE_TYPE_OPTIONS } from '../types/appointment';
import type { Appointment } from '../types/appointment';

export const ConfirmationPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAppointment = async () => {
            if (!appointmentId) {
                setError('Невалиден номер на резервацията');
                setLoading(false);
                return;
            }

            try {
                const apt = await getAppointmentById(appointmentId);
                if (!apt) {
                    setError('Резервацията не е намерена');
                } else {
                    setAppointment(apt);
                }
            } catch (err) {
                setError('Грешка при зареждане на детайлите за резервацията');
                console.error('Грешка при зареждане на резервацията:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAppointment();
    }, [appointmentId]);

    const getServiceTypeLabel = (serviceType: string) => {
        return SERVICE_TYPE_OPTIONS.find(option => option.value === serviceType)?.label || serviceType;
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !appointment) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    {error || 'Резервацията не е намерена'}
                </Alert>
                <Box mt={2}>
                    <Button
                        component={RouterLink}
                        to="/"
                        startIcon={<ArrowBack />}
                        variant="contained"
                    >
                        Назад към резервации
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box textAlign="center" mb={3}>
                    <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        Резервацията е потвърдена!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Вашият час е успешно резервиран.
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    {/* Детайли за резервацията */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Детайли за резервацията
                            </Typography>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Дата и час
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDateTime(appointment.appointmentDateTime)}
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Тип услуга
                                </Typography>
                                <Chip
                                    label={getServiceTypeLabel(appointment.vehicleInfo.serviceType)}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Цена
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {appointment.price} BGN
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Информация за автомобила и контакт */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Информация за автомобила
                            </Typography>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Регистрационен номер
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {appointment.customerInfo.registrationPlate}
                                </Typography>
                            </Box>

                            {appointment.vehicleInfo.brand && (
                                <Box mb={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Марка {appointment.vehicleInfo.model && 'и модел'}
                                    </Typography>
                                    <Typography variant="body1">
                                        {appointment.vehicleInfo.brand}
                                        {appointment.vehicleInfo.model && ` ${appointment.vehicleInfo.model}`}
                                    </Typography>
                                </Box>
                            )}

                            {appointment.vehicleInfo.is4x4 && (
                                <Box mb={2}>
                                    <Chip label="4x4 / AWD" size="small" color="info" />
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Информация за контакт
                            </Typography>

                            <Box mb={1}>
                                <Box display="flex" alignItems="center">
                                    <Phone fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        {appointment.customerInfo.phoneNumber}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Box display="flex" alignItems="center">
                                    <Email fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        {appointment.customerInfo.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        <strong>Важно:</strong> Моля, пристигнете 10 минути преди уречения час.
                        На имейл адреса Ви е изпратен имейл за потвърждение с всички подробности.
                    </Typography>
                </Alert>

                <Box textAlign="center">
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        size="large"
                        startIcon={<ArrowBack />}
                    >
                        Резервирай друг час
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};