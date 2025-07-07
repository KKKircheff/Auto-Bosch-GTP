import { Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { TEXTS } from '../utils/constants';
import BookingCalendar from '../components/booking/BookingCalendar';

const BookingPage = () => {
    const [selectedDateTime, setSelectedDateTime] = useState<{
        date: Date;
        time: string;
    } | null>(null);

    // Mock data for demonstration
    const mockExistingBookings = {
        '2025-07-08': ['09:00', '10:30', '14:00'], // Example: July 8th has bookings at these times
        '2025-07-09': ['11:00', '15:30'],
        '2025-07-10': ['08:30', '13:00', '16:30'],
    };

    const mockAppointmentCounts = {
        '2025-07-08': 3,
        '2025-07-09': 2,
        '2025-07-10': 3,
        '2025-07-11': 1,
    };

    const handleDateTimeSelect = (date: Date, time: string) => {
        setSelectedDateTime({ date, time });
        console.log('Selected:', { date, time });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {TEXTS.bookingTitle}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    {TEXTS.bookingSubtitle}
                </Typography>
            </Box>

            <BookingCalendar
                onDateTimeSelect={handleDateTimeSelect}
                existingBookings={mockExistingBookings}
                appointmentCounts={mockAppointmentCounts}
            />

            {/* Show selection for debugging */}
            {selectedDateTime && (
                <Box mt={4} p={2} bgcolor="grey.100" borderRadius={1}>
                    <Typography variant="subtitle2">
                        Debug: Selected {selectedDateTime.date.toISOString().split('T')[0]} at {selectedDateTime.time}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default BookingPage;