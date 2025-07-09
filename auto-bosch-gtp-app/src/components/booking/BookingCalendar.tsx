import { Box, Container, Stack, Typography } from '@mui/material';
import { useBookingContext } from '../../contexts/BookingContext';
import { TEXTS } from '../../utils/constants';
import TimeSlotPicker from './TimeSlotPicker';
import CalendarPicker from './CalendarPicker';

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
                spacing={4}
                pb={2}
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
        </Container>
    );
};

export default BookingCalendar;