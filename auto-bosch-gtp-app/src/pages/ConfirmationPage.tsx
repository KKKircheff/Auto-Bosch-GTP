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
                setError('Invalid appointment ID');
                setLoading(false);
                return;
            }

            try {
                const apt = await getAppointmentById(appointmentId);
                if (!apt) {
                    setError('Appointment not found');
                } else {
                    setAppointment(apt);
                }
            } catch (err) {
                setError('Failed to load appointment details');
                console.error('Error loading appointment:', err);
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
                    {error || 'Appointment not found'}
                </Alert>
                <Box mt={2}>
                    <Button
                        component={RouterLink}
                        to="/"
                        startIcon={<ArrowBack />}
                        variant="contained"
                    >
                        Back to Booking
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
                        Booking Confirmed!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your appointment has been successfully scheduled.
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    {/* Appointment Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Appointment Details
                            </Typography>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Date & Time
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDateTime(appointment.appointmentDateTime)}
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Service Type
                                </Typography>
                                <Chip
                                    label={getServiceTypeLabel(appointment.vehicleInfo.serviceType)}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Price
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {appointment.price} BGN
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Vehicle & Contact Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Vehicle Information
                            </Typography>

                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Registration Plate
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {appointment.customerInfo.registrationPlate}
                                </Typography>
                            </Box>

                            {appointment.vehicleInfo.brand && (
                                <Box mb={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Brand {appointment.vehicleInfo.model && '& Model'}
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
                                Contact Information
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
                        <strong>Important:</strong> Please arrive 10 minutes before your scheduled time.
                        A confirmation email has been sent to your email address with all the details.
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
                        Book Another Appointment
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};