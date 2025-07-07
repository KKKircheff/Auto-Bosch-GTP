import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Paper,
    Alert,
} from '@mui/material';
import { BookingForm } from '../components/BookingForm/BookingForm';
import { AppointmentCalendar } from '../components/Calendar/AppointmentCalendar';
import { BUSINESS_HOURS, MAX_BOOKING_WEEKS, SLOT_DURATION_MINUTES } from '../utils/constants';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    const handleBookingSuccess = (appointmentId: string) => {
        navigate(`/confirmation/${appointmentId}`);
    };

    const handleSlotSelect = (datetime: Date) => {
        setSelectedSlot(datetime);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
                    Резервирай час за преглед
                </Typography>
                {/* <Typography
                    variant="h6"
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Професионални технически прегледи на автомобили
                </Typography> */}

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Работно време:</strong> Понеделник - Петък, {BUSINESS_HOURS.START} - {BUSINESS_HOURS.END} |
                        <strong> Дати резервация:</strong> До {MAX_BOOKING_WEEKS} седмици предварително |
                        <strong> Слот за преглед:</strong> {SLOT_DURATION_MINUTES} минутни
                    </Typography>
                </Alert>
            </Box>

            <Grid container spacing={4}>
                {/* Форма за резервация */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <BookingForm onBookingSuccess={handleBookingSuccess} />
                </Grid>

                {/* Календар */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Свободни часове
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Изберете времеви интервал от календара по-долу, след което попълнете формата за резервация.
                        </Typography>

                        <AppointmentCalendar
                            onSlotSelect={handleSlotSelect}
                            selectedSlot={selectedSlot}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};