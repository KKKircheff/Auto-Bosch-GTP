import { useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import CalendarPicker from './CalendarPicker';
import TimeSlotPicker from './TimeSlotPicker';
import { getNextAvailableDate } from '../../utils/dateHelpers';
import { TEXTS } from '../../utils/constants';

interface BookingCalendarProps {
    onDateTimeSelect?: (date: Date, time: string) => void;
    existingBookings?: Record<string, string[]>; // date -> array of booked times
    appointmentCounts?: Record<string, number>; // date -> count of appointments
}

const BookingCalendar = ({
    onDateTimeSelect,
    existingBookings = {},
    appointmentCounts = {}
}: BookingCalendarProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(getNextAvailableDate());
    const [selectedTime, setSelectedTime] = useState<string>('');

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(''); // Reset time when date changes
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate && onDateTimeSelect) {
            onDateTimeSelect(selectedDate, time);
        }
    };

    // Get existing bookings for selected date
    const selectedDateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const existingBookingsForDate = existingBookings[selectedDateKey] || [];

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box mb={4} textAlign="center">
                <Typography variant="h4" component="h2" gutterBottom>
                    {TEXTS.selectDate}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Изберете дата и час за вашия технически преглед
                </Typography>
            </Box>

            <Stack
                direction={'column'}
                gap={4}
                alignItems="start"
            >
                {/* Calendar */}
                <CalendarPicker
                    selectedDate={selectedDate || undefined}
                    onDateSelect={handleDateSelect}
                    appointmentCounts={appointmentCounts}
                />

                {/* Time slots */}
                <TimeSlotPicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                    existingBookings={existingBookingsForDate}
                />
            </Stack>

            {/* Selection summary */}
            {selectedDate && selectedTime && (
                <Box
                    mt={4}
                    p={3}
                    bgcolor="success.light"
                    borderRadius={2}
                    textAlign="center"
                >
                    <Typography variant="h6" color="success.dark" gutterBottom>
                        ✓ Избрана дата и час
                    </Typography>
                    <Typography variant="body1" color="success.dark">
                        {selectedDate.toLocaleDateString('bg-BG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} в {selectedTime}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default BookingCalendar;