import { useEffect } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import CalendarPicker from './CalendarPicker';
import { getNextAvailableDate } from '../../utils/dateHelpers';
import { useBookingContext } from '../../contexts/BookingContext';
import { TEXTS } from '../../utils/constants';
import TimeSlotPicker from './TimeSlotPicker';

interface BookingCalendarProps {
    onDateTimeSelect?: (date: Date, time: string) => void;
}

const BookingCalendar = ({ onDateTimeSelect }: BookingCalendarProps) => {
    const {
        selectedDate,
        selectedTime,
        setSelectedDate,
        setSelectedTime,
        timeSlots,
        timeSlotsLoading,
        timeSlotsError,
        appointmentCounts,
        refreshTimeSlots,
    } = useBookingContext();

    // Set initial date if none selected
    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(getNextAvailableDate());
        }
    }, [selectedDate, setSelectedDate]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate && onDateTimeSelect) {
            onDateTimeSelect(selectedDate, time);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box mb={4} textAlign="center">
                <Typography variant="h4" component="h2" gutterBottom>
                    {TEXTS.selectDate}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Изберете дата и час за вашия технически преглед
                </Typography>
            </Box>

            <Stack direction='column'
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
                    selectedTime={selectedTime || undefined}
                    onTimeSelect={handleTimeSelect}
                    timeSlots={timeSlots}
                    loading={timeSlotsLoading}
                    error={timeSlotsError}
                    onRefresh={refreshTimeSlots}
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