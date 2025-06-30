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
                    Vehicle Check Booking
                </Typography>
                <Typography
                    variant="h6"
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Professional vehicle inspections in Sofia, Bulgaria
                </Typography>

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Operating Hours:</strong> Monday to Friday, 09:00 - 17:00 |
                        <strong> Booking Window:</strong> Up to 8 weeks in advance |
                        <strong> Time Slots:</strong> 15-minute intervals
                    </Typography>
                </Alert>
            </Box>

            <Grid container spacing={4}>
                {/* Booking Form */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <BookingForm onBookingSuccess={handleBookingSuccess} />
                </Grid>

                {/* Calendar */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Available Time Slots
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Select a time slot from the calendar below, then fill out the booking form.
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