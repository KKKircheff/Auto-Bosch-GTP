// src/components/booking/CalendarPicker.tsx
import { useState, useMemo, useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Button,
    Stack,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { addMonths, subMonths, startOfMonth, isAfter } from 'date-fns';
import {
    formatDateBulgarian,
    generateCalendarDays,
    generateCalendarWeeks,
    getAvailableMonths,
    isBookableDate,
    getMaxBookingDate,
    BULGARIAN_DAYS_SHORT,
    isMonthWithinBookingWindow,
} from '../../utils/dateHelpers';
import { type CalendarDay, type CalendarWeek } from '../../types/booking'
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import { GradientCard } from '../common/cards';

interface CalendarPickerProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
    appointmentCounts?: Record<string, number>;
    className?: string;
}

const CalendarPicker = ({
    selectedDate,
    onDateSelect,
    appointmentCounts,
    className
}: CalendarPickerProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { settings } = useBusinessSettings();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const availableMonths = getAvailableMonths(settings?.bookingWindowWeeks);

    // Touch handling for mobile swipe navigation
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isMobile) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = Math.abs(touchStartY.current - touchEndY);

        // Only process horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > 50 && deltaY < 100) {
            if (deltaX > 0 && canGoNext) {
                // Swipe left - go to next month
                handleNextMonth();
            } else if (deltaX < 0 && canGoPrevious) {
                // Swipe right - go to previous month
                handlePreviousMonth();
            }
        }
    };

    // Generate calendar data
    const currentMonthData = useMemo(() => {
        const days = generateCalendarDays(currentMonth, selectedDate, appointmentCounts, settings?.workingDays, settings?.closedDays);
        return generateCalendarWeeks(days);
    }, [currentMonth, selectedDate, appointmentCounts, settings?.workingDays, settings?.closedDays]);

    const nextMonthData = useMemo(() => {
        const nextMonth = addMonths(currentMonth, 1);
        const days = generateCalendarDays(nextMonth, selectedDate, appointmentCounts, settings?.workingDays, settings?.closedDays);
        return generateCalendarWeeks(days);
    }, [currentMonth, selectedDate, appointmentCounts, settings?.workingDays, settings?.closedDays]);

    // Navigation handlers
    const handlePreviousMonth = () => {
        const prevMonth = subMonths(currentMonth, 1);
        // Don't go before current month (compare month starts)
        if (startOfMonth(prevMonth) >= startOfMonth(availableMonths.current)) {
            setCurrentMonth(prevMonth);
        }
    };

    const handleNextMonth = () => {
        const nextMonth = addMonths(currentMonth, 1);
        // Allow navigation as long as the next month has some relevance to booking
        // (even if not all days are bookable)
        const maxDate = getMaxBookingDate(settings?.bookingWindowWeeks);
        const nextMonthStart = startOfMonth(nextMonth);

        if (!isAfter(nextMonthStart, addMonths(maxDate, 1))) {
            setCurrentMonth(nextMonth);
        }
    };

    const canGoPrevious = startOfMonth(currentMonth) > startOfMonth(availableMonths.current);
    // Always show second month on desktop unless we're showing the very last possible month
    const nextMonth = addMonths(currentMonth, 1);
    const canGoNext = isMonthWithinBookingWindow(nextMonth, settings?.bookingWindowWeeks);

    // Day click handler
    const handleDayClick = (day: CalendarDay) => {
        if (isBookableDate(day.date, settings?.workingDays, settings?.bookingWindowWeeks, settings?.closedDays) && day.isCurrentMonth) {
            onDateSelect(day.date);
        }
    };

    const DayCell = ({ day }: { day: CalendarDay }) => {
        const isClickable = isBookableDate(day.date, settings?.workingDays, settings?.bookingWindowWeeks, settings?.closedDays) && day.isCurrentMonth && !day.isFullyBooked;
        const isSelected = day.isSelected;
        const isToday = day.isToday;
        const isDisabled = !isClickable;

        return (
            <Button
                variant={isSelected && !day.isClosedDay ? 'contained' : 'text'}
                onClick={() => handleDayClick(day)}
                disabled={isDisabled}
                title={
                    day.isClosedDay
                        ? 'Затворен ден'
                        : day.isFullyBooked
                            ? 'Няма свободни часове'
                            : day.hasAppointments && day.isCurrentMonth
                                ? `Резервирано (${day.appointmentCount} ${day.appointmentCount === 1 ? 'час' : 'часа'})`
                                : undefined
                }
                sx={{
                    minWidth: { xs: 30, sm: 44 },
                    height: { xs: 30, sm: 44 },
                    borderRadius: '50%',
                    p: 0,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: isToday && !day.isClosedDay ? 'bold' : 'normal',
                    color: day.isClosedDay
                        ? 'text.disabled'
                        : !day.isCurrentMonth
                            ? 'text.disabled'
                            : isSelected
                                ? 'white'
                                : isToday
                                    ? 'text.secondary'
                                    : 'text.primary',
                    background: day.isClosedDay
                        ? 'rgba(158, 158, 158, 0.2)'
                        : day.hasAppointments && day.isCurrentMonth
                            ? 'rgba(210, 20, 34, 0.12)'
                            : isSelected
                                ? 'linear-gradient(135deg, #013a6a, #0163B3)'
                                : isToday
                                    ? 'white'
                                    : 'transparent',
                    border: isToday && !isSelected && !day.isClosedDay ? 2 : 0,
                    borderColor: 'primary.main',
                    // textDecoration: day.isClosedDay ? 'line-through' : 'none',
                    opacity: day.isClosedDay || !day.isCurrentMonth ? 0.4 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                        bgcolor: day.isClosedDay
                            ? 'rgba(158, 158, 158, 0.2)'
                            : isSelected
                                ? 'primary.dark'
                                : isClickable
                                    ? 'primary.light'
                                    : day.hasAppointments
                                        ? 'rgba(210, 20, 34, 0.15)'
                                        : 'transparent',
                    },
                    '&:disabled': {
                        color: 'text.disabled',
                        bgcolor: day.isClosedDay
                            ? 'rgba(158, 158, 158, 0.2)'
                            : day.hasAppointments
                                ? 'rgba(210, 20, 34, 0.12)'
                                : 'transparent',
                        cursor: 'not-allowed',
                    },
                    '&.Mui-disabled': {
                        color: 'text.disabled',
                        opacity: day.isClosedDay || !day.isCurrentMonth ? 0.4 : 0.6,
                    },
                    position: 'relative',
                }}
            >
                {day.date.getDate()}
                {day.hasAppointments && !day.isClosedDay && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: isSelected ? 'white' : 'error.main',
                        }}
                    />
                )}
            </Button>
        );
    };

    const CalendarMonth = ({
        weeks,
        title
    }: {
        weeks: CalendarWeek[];
        monthDate: Date;
        title: string;
    }) => (
        <GradientCard
            title={title}
            titleVariant="red"
            sx={{ minHeight: { xs: 250, sm: 350 } }}
        >
            <Stack direction='row' spacing={1} mb={1} width={'100%'} justifyContent={'space-around'}>
                {BULGARIAN_DAYS_SHORT.map((day) => (
                    <Typography
                        key={day}
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                        {day}
                    </Typography>
                ))}
            </Stack>

            {/* Calendar grid */}
            <Stack direction={'column'} width={'100%'}>
                {weeks.map((week, weekIndex) => (
                    <Stack key={weekIndex} direction='row' width={'100%'} justifyContent={'space-around'}>
                        {week.days.map((day, dayIndex) => (
                            <DayCell day={day} key={dayIndex} />
                        ))}
                    </Stack>
                ))}
            </Stack>
        </GradientCard>
    );

    return (
        <Box className={className} sx={{ width: '100%' }}>
            {/* Navigation header - Only show arrows on mobile */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                px={1}
            >
                <IconButton
                    onClick={handlePreviousMonth}
                    disabled={!canGoPrevious}
                    size={isMobile ? "large" : "medium"}
                    sx={{
                        background: !canGoPrevious
                            ? 'transparent'
                            : 'linear-gradient(135deg, #750b13, #d21422)',
                        color: 'white',
                        '&:hover': {
                            background: !canGoPrevious
                                ? 'transparent'
                                : 'linear-gradient(135deg, #5a0910, #b01119)',
                        },
                        '&:disabled': {
                            background: 'transparent',
                            color: 'action.disabled',
                        },
                    }}
                >
                    <ChevronLeft />
                </IconButton>

                <Typography variant="h5" component="h2" fontWeight="600" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {isMobile
                        ? formatDateBulgarian(currentMonth, 'MMMM yyyy')
                        : formatDateBulgarian(currentMonth, 'MMMM yyyy')
                    }
                </Typography>

                <IconButton
                    onClick={handleNextMonth}
                    disabled={!canGoNext}
                    size={isMobile ? "large" : "medium"}
                    sx={{
                        background: !canGoNext
                            ? 'transparent'
                            : 'linear-gradient(135deg, #750b13, #d21422)',
                        color: 'white',
                        '&:hover': {
                            background: !canGoNext
                                ? 'transparent'
                                : 'linear-gradient(135deg, #5a0910, #b01119)',
                        },
                        '&:disabled': {
                            background: 'transparent',
                            color: 'action.disabled',
                        },
                    }}
                >
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Calendar content */}
            {isMobile ? (
                // Mobile: Single month with touch navigation
                <Box
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    sx={{
                        touchAction: 'pan-y', // Allow vertical scrolling but handle horizontal swipes
                        userSelect: 'none',
                    }}
                >
                    <CalendarMonth
                        weeks={currentMonthData}
                        monthDate={currentMonth}
                        title={formatDateBulgarian(currentMonth, 'MMMM yyyy')}
                    />

                </Box>
            ) : (
                // Desktop: Two months side by side (always show both for consistency)
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    gap={6}
                    py={2}
                    sx={{
                        '@media (max-width: 900px)': {
                            gridTemplateColumns: '1fr',
                            gap: 2,
                        }
                    }}
                >
                    <CalendarMonth
                        weeks={currentMonthData}
                        monthDate={currentMonth}
                        title={formatDateBulgarian(currentMonth, 'MMMM yyyy')}
                    />
                    <CalendarMonth
                        weeks={nextMonthData}
                        monthDate={addMonths(currentMonth, 1)}
                        title={formatDateBulgarian(addMonths(currentMonth, 1), 'MMMM yyyy')}
                    />
                </Box>
            )}

            {/* Legend */}
            <Box py={6} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'primary.main'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Избрана дата
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: 2,
                            borderColor: 'primary.main'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Днес
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'error.main'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Има записвания
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'text.disabled'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Недостъпна дата
                    </Typography>
                </Box>
            </Box>

            {/* Selected date display */}
            {selectedDate && (
                <Box mt={3} textAlign="center">
                    <Typography variant="subtitle1" fontWeight="600" color="primary">
                        Избрана дата: {formatDateBulgarian(selectedDate, 'EEEE, dd MMMM yyyy')}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default CalendarPicker;