import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    format,
    startOfWeek,
    addDays,
    addWeeks,
    isSameDay,
    isToday,
    isBefore,
    startOfDay,
} from 'date-fns';
import { getAvailableSlots } from '../../services/appointmentService';
import { formatTimeSlot, isWorkingDay } from '../../utils/helpers';
import type { TimeSlot } from '../../types/appointment';

interface AppointmentCalendarProps {
    onSlotSelect?: (datetime: Date) => void;
    selectedSlot?: Date | null;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    onSlotSelect,
    selectedSlot,
}) => {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
    const workingDays = weekDays.filter(isWorkingDay);

    const loadTimeSlots = async () => {
        setLoading(true);
        setError(null);

        try {
            const startDate = currentWeek;
            const endDate = addDays(currentWeek, 6);
            const slots = await getAvailableSlots(startDate, endDate);
            setTimeSlots(slots);
        } catch (err) {
            setError('Failed to load available time slots');
            console.error('Error loading time slots:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimeSlots();
    }, [currentWeek]);

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => addWeeks(prev, -1));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => addWeeks(prev, 1));
    };

    const getTimeSlotsForDay = (date: Date) => {
        return timeSlots.filter(slot => isSameDay(slot.datetime, date));
    };

    const isSlotSelected = (datetime: Date) => {
        return selectedSlot && isSameDay(datetime, selectedSlot) &&
            datetime.getTime() === selectedSlot.getTime();
    };

    const isPastSlot = (datetime: Date) => {
        return isBefore(datetime, new Date());
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Button
                    onClick={handlePreviousWeek}
                    disabled={isBefore(addWeeks(currentWeek, -1), startOfDay(new Date()))}
                >
                    Previous Week
                </Button>

                <Typography variant="h6">
                    {format(currentWeek, 'dd MMM')} - {format(addDays(currentWeek, 6), 'dd MMM yyyy')}
                </Typography>

                <Button onClick={handleNextWeek}>
                    Next Week
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                {workingDays.map((day) => {
                    const daySlots = getTimeSlotsForDay(day);
                    const availableSlots = daySlots.filter(slot => slot.available && !isPastSlot(slot.datetime));

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={day.toISOString()}>
                            <Card variant="outlined">
                                <CardContent sx={{ p: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        textAlign="center"
                                        mb={1}
                                        color={isToday(day) ? 'primary' : 'textPrimary'}
                                        fontWeight={isToday(day) ? 'bold' : 'normal'}
                                    >
                                        {format(day, 'EEE dd/MM')}
                                    </Typography>

                                    <Box display="flex" flexDirection="column" gap={0.5}>
                                        {availableSlots.length === 0 ? (
                                            <Chip
                                                label="No slots"
                                                size="small"
                                                variant="outlined"
                                                disabled
                                            />
                                        ) : (
                                            availableSlots.map((slot) => (
                                                <Chip
                                                    key={slot.datetime.toISOString()}
                                                    label={formatTimeSlot(slot.datetime)}
                                                    size="small"
                                                    clickable
                                                    color={isSlotSelected(slot.datetime) ? 'primary' : 'default'}
                                                    variant={isSlotSelected(slot.datetime) ? 'filled' : 'outlined'}
                                                    onClick={() => onSlotSelect?.(slot.datetime)}
                                                />
                                            ))
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};