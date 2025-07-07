// src/components/booking/TimeSlotPicker.tsx
import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import { AccessTime, CheckCircle } from '@mui/icons-material';
import { formatDateBulgarian, generateTimeSlots, isBookableDate } from '../../utils/dateHelpers';
import { TEXTS } from '../../utils/constants';
import type { TimeSlot } from '../../types/booking';

interface TimeSlotPickerProps {
    selectedDate: Date | null;
    selectedTime?: string;
    onTimeSelect: (time: string) => void;
    existingBookings?: string[];
    loading?: boolean;
    className?: string;
}

const TimeSlotPicker = ({
    selectedDate,
    selectedTime,
    onTimeSelect,
    existingBookings = [],
    loading = false,
    className,
}: TimeSlotPickerProps) => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    // Generate time slots when date changes
    useEffect(() => {
        if (selectedDate && isBookableDate(selectedDate)) {
            const slots = generateTimeSlots(selectedDate, existingBookings);
            setTimeSlots(slots);
        } else {
            setTimeSlots([]);
        }
    }, [selectedDate, existingBookings]);

    // Group time slots by morning/afternoon
    const groupedSlots = useMemo(() => {
        const morning: TimeSlot[] = [];
        const afternoon: TimeSlot[] = [];

        timeSlots.forEach(slot => {
            const hour = parseInt(slot.time.split(':')[0]);
            if (hour < 12) {
                morning.push(slot);
            } else {
                afternoon.push(slot);
            }
        });

        return { morning, afternoon };
    }, [timeSlots]);

    // Count available slots
    const availableCount = timeSlots.filter(slot => slot.available).length;
    const totalCount = timeSlots.length;

    if (!selectedDate) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }} className={className}>
                <AccessTime sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    {TEXTS.selectDate}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    Моля изберете дата, за да видите свободните часове
                </Typography>
            </Paper>
        );
    }

    if (!isBookableDate(selectedDate)) {
        return (
            <Paper elevation={2} sx={{ p: 3 }} className={className}>
                <Alert severity="info">
                    Избраната дата не е работен ден или е в миналото.
                    Моля изберете друга дата (понеделник - петък).
                </Alert>
            </Paper>
        );
    }

    if (loading) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }} className={className}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                    Зареждане на свободни часове...
                </Typography>
            </Paper>
        );
    }

    // Time slot button component
    const TimeSlotButton = ({ slot }: { slot: TimeSlot }) => {
        const isSelected = selectedTime === slot.time;
        const isAvailable = slot.available;

        return (
            <Button
                variant={isSelected ? 'contained' : isAvailable ? 'outlined' : 'text'}
                onClick={() => isAvailable && onTimeSelect(slot.time)}
                disabled={!isAvailable}
                sx={{
                    minHeight: 48,
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400,
                    borderColor: isAvailable ? 'primary.main' : 'text.disabled',
                    color: isSelected
                        ? 'white'
                        : isAvailable
                            ? 'primary.main'
                            : 'text.disabled',
                    bgcolor: isSelected
                        ? 'primary.main'
                        : 'transparent',
                    '&:hover': {
                        bgcolor: isSelected
                            ? 'primary.dark'
                            : isAvailable
                                ? 'primary.light'
                                : 'transparent',
                    },
                    '&:disabled': {
                        borderColor: 'text.disabled',
                        color: 'text.disabled',
                    },
                }}
                startIcon={isSelected ? <CheckCircle /> : <AccessTime />}
            >
                {slot.time}
            </Button>
        );
    };

    // Time slot group component
    const TimeSlotGroup = ({
        title,
        slots,
        icon
    }: {
        title: string;
        slots: TimeSlot[];
        icon?: React.ReactNode;
    }) => {
        if (slots.length === 0) return null;

        const availableInGroup = slots.filter(slot => slot.available).length;

        return (
            <Box mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        {icon}
                        <Typography variant="subtitle1" fontWeight="600">
                            {title}
                        </Typography>
                    </Box>
                    <Chip
                        label={`${availableInGroup}/${slots.length} свободни`}
                        size="small"
                        color={availableInGroup > 0 ? 'success' : 'default'}
                        variant="outlined"
                    />
                </Box>

                <Grid container spacing={1.5}>
                    {slots.map((slot) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot.time}>
                            <TimeSlotButton slot={slot} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Paper elevation={2} sx={{ p: 3 }} className={className}>
            {/* Header */}
            <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                    {TEXTS.availableTimes}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {formatDateBulgarian(selectedDate, 'EEEE, dd MMMM yyyy')}
                </Typography>

                {/* Availability summary */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        {availableCount} от {totalCount} часа са свободни
                    </Typography>

                    {selectedTime && (
                        <Chip
                            label={`Избран час: ${selectedTime}`}
                            color="primary"
                            size="small"
                            icon={<CheckCircle />}
                        />
                    )}
                </Box>
            </Box>

            {/* Time slots */}
            {timeSlots.length === 0 ? (
                <Alert severity="warning">
                    Няма налични часове за избраната дата.
                </Alert>
            ) : (
                <Box>
                    <TimeSlotGroup
                        title="Сутрешни часове"
                        slots={groupedSlots.morning}
                        icon={<AccessTime sx={{ color: 'warning.main' }} />}
                    />

                    <TimeSlotGroup
                        title="Следобедни часове"
                        slots={groupedSlots.afternoon}
                        icon={<AccessTime sx={{ color: 'info.main' }} />}
                    />
                </Box>
            )}

            {/* Legend */}
            <Box mt={3} pt={2} borderTop={1} borderColor="divider">
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Легенда:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                            Избран час
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                            Свободен час
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                            Зает час
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Selected time confirmation */}
            {selectedTime && (
                <Box
                    mt={3}
                    p={2}
                    bgcolor="primary.light"
                    borderRadius={1}
                    textAlign="center"
                >
                    <Typography variant="subtitle2" color="primary.dark">
                        ✓ Избрахте час: {selectedTime} на {formatDateBulgarian(selectedDate, 'dd.MM.yyyy')}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default TimeSlotPicker;