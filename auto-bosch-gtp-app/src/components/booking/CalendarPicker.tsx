// src/components/booking/CalendarPicker.tsx
import { useState, useMemo, useRef } from 'react';
import {
    Box,
    Paper,
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
    getBookingWindowDescription,
    BULGARIAN_DAYS_SHORT,
    isMonthWithinBookingWindow,
} from '../../utils/dateHelpers';
import { type CalendarDay, type CalendarWeek } from '../../types/booking'
import { shadow1 } from '../../utils/constants';

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

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const availableMonths = getAvailableMonths();

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
        const days = generateCalendarDays(currentMonth, selectedDate, appointmentCounts);
        return generateCalendarWeeks(days);
    }, [currentMonth, selectedDate, appointmentCounts]);

    const nextMonthData = useMemo(() => {
        const nextMonth = addMonths(currentMonth, 1);
        const days = generateCalendarDays(nextMonth, selectedDate, appointmentCounts);
        return generateCalendarWeeks(days);
    }, [currentMonth, selectedDate, appointmentCounts]);

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
        const maxDate = getMaxBookingDate();
        const nextMonthStart = startOfMonth(nextMonth);

        if (!isAfter(nextMonthStart, addMonths(maxDate, 1))) {
            setCurrentMonth(nextMonth);
        }
    };

    const canGoPrevious = startOfMonth(currentMonth) > startOfMonth(availableMonths.current);
    // Always show second month on desktop unless we're showing the very last possible month
    const nextMonth = addMonths(currentMonth, 1);
    const canGoNext = isMonthWithinBookingWindow(nextMonth);

    // Day click handler
    const handleDayClick = (day: CalendarDay) => {
        if (isBookableDate(day.date) && day.isCurrentMonth) {
            onDateSelect(day.date);
        }
    };

    const DayCell = ({ day }: { day: CalendarDay }) => {
        const isClickable = isBookableDate(day.date) && day.isCurrentMonth;
        const isSelected = day.isSelected;
        const isToday = day.isToday;

        return (
            <Button
                variant={isSelected ? 'contained' : 'text'}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                sx={{
                    minWidth: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    borderRadius: '50%',
                    p: 0,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: day.isCurrentMonth
                        ? isSelected
                            ? 'white'
                            : isToday
                                ? 'text.secondary'
                                : 'text.primary'
                        : 'text.disabled',
                    bgcolor: isSelected
                        ? 'primary.main'
                        : isToday
                            ? 'white'
                            : 'transparent',
                    border: isToday && !isSelected ? 2 : 0,
                    borderColor: 'primary.main',
                    '&:hover': {
                        bgcolor: isSelected
                            ? 'primary.dark'
                            : isClickable
                                ? 'primary.light'
                                : 'transparent',
                    },
                    '&:disabled': {
                        color: 'text.disabled',
                        bgcolor: 'transparent',
                    },
                    position: 'relative',
                }}
            >
                {day.date.getDate()}
                {day.hasAppointments && (
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
        monthDate,
        title
    }: {
        weeks: CalendarWeek[];
        monthDate: Date;
        title: string;
    }) => (
        <Stack
            sx={{
                boxShadow: shadow1,
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                minHeight: { xs: 300, sm: 350 }
            }}
        >
            {/* Month header */}
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Typography variant="h6" component="h3" fontWeight="600">
                    {title}
                </Typography>
            </Box>

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
        </Stack>
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
                {isMobile && (
                    <IconButton
                        onClick={handlePreviousMonth}
                        disabled={!canGoPrevious}
                        size="large"
                    >
                        <ChevronLeft />
                    </IconButton>
                )}

                <Typography variant="h5" component="h2" fontWeight="600" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {isMobile
                        ? formatDateBulgarian(currentMonth, 'MMMM yyyy')
                        : 'Изберете дата'
                    }
                </Typography>

                {isMobile && (
                    <IconButton
                        onClick={handleNextMonth}
                        disabled={!canGoNext}
                        size="large"
                    >
                        <ChevronRight />
                    </IconButton>
                )}
            </Box>

            {/* Booking window info */}
            <Box textAlign="center" mb={2}>
                <Typography variant="caption" color="text.secondary">
                    Можете да записвате {getBookingWindowDescription()}
                </Typography>
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

                    {/* Mobile navigation hint */}
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
                        <Typography variant="caption" color="text.secondary">
                            Използвайте стрелките или плъзнете за навигация
                        </Typography>
                    </Box>
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