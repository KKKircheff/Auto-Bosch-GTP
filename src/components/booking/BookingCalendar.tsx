import { useEffect, useRef } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import CalendarPicker from './CalendarPicker';
import { getNextAvailableDate } from '../../utils/dateHelpers';
import { useBookingContext } from '../../contexts/BookingContext';
import TimeSlotPicker from './TimeSlotPicker';
import SectionTitle from '../common/typography/SectionTitle.component';

interface BookingCalendarProps {
    onDateTimeSelect?: (date: Date, time: string) => void;
    onTimeSlotSelect?: () => void; // New prop for scroll callback
}

const BookingCalendar = ({ onDateTimeSelect, onTimeSlotSelect }: BookingCalendarProps) => {
    const timeSlotRef = useRef<HTMLDivElement>(null);

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

        // Scroll to time slots immediately
        setTimeout(() => {
            timeSlotRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 100);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);

        // Call the original callback
        if (selectedDate && onDateTimeSelect) {
            onDateTimeSelect(selectedDate, time);
        }

        // Scroll to navigation after time selection
        if (onTimeSlotSelect) {
            onTimeSlotSelect();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box mb={4} textAlign="center">
                <SectionTitle pb={3}>
                    Изберете дата
                </SectionTitle>
                <Typography variant="body1" color="text.secondary">
                    Изберете дата и час за вашия технически преглед
                </Typography>
            </Box>

            <Stack direction='column'
                gap={4}
                alignItems="start"
                width={'100%'}
            >
                <CalendarPicker
                    selectedDate={selectedDate || undefined}
                    onDateSelect={handleDateSelect}
                    appointmentCounts={appointmentCounts}
                />

                <Box ref={timeSlotRef} minWidth={'100%'}>
                    <TimeSlotPicker
                        selectedDate={selectedDate}
                        selectedTime={selectedTime || undefined}
                        onTimeSelect={handleTimeSelect}
                        timeSlots={timeSlots}
                        loading={timeSlotsLoading}
                        error={timeSlotsError}
                        onRefresh={refreshTimeSlots}
                    />
                </Box>
            </Stack>
        </Container>
    );
};

export default BookingCalendar;