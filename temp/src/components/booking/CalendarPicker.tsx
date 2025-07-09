// src/components/booking/CalendarPicker.tsx
import { useState, useMemo } from 'react';
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
import { addMonths, subMonths } from 'date-fns';
import {
    formatDateBulgarian,
    generateCalendarDays,
    generateCalendarWeeks,
    getAvailableMonths,
    isBookableDate,
    BULGARIAN_DAYS_SHORT,
} from '../../utils/dateHelpers';
import { type CalendarDay, type CalendarWeek } from '../../types/booking'

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
        // Don't go before current month
        if (prevMonth >= availableMonths.current) {
            setCurrentMonth(prevMonth);
        }
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const canGoPrevious = currentMonth > availableMonths.current;
    const canGoNext = true; // Allow going forward indefinitely

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
                                ? 'primary.main'
                                : 'text.primary'
                        : 'text.disabled',
                    bgcolor: isSelected
                        ? 'primary.main'
                        : isToday
                            ? 'primary.light'
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
        <Paper
            elevation={2}
            sx={{
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

            {/* Days of week header */}
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
            <Box>
                {weeks.map((week, weekIndex) => (
                    <Stack direction={'row'} spacing={1} key={weekIndex} mb={0.5}>
                        {week.days.map((day, dayIndex) => (
                            <DayCell day={day} key={dayIndex} />
                        ))}
                    </Stack>
                ))}
            </Box>
        </Paper>
    );

    return (
        <Box className={className} sx={{ width: '100%' }}>
            {/* Navigation header */}
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
                    size="large"
                >
                    <ChevronLeft />
                </IconButton>

                <Typography variant="h5" component="h2" fontWeight="600">
                    {isMobile
                        ? formatDateBulgarian(currentMonth, 'MMMM yyyy')
                        : 'Изберете дата'
                    }
                </Typography>

                <IconButton
                    onClick={handleNextMonth}
                    disabled={!canGoNext}
                    size="large"
                >
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Calendar content */}
            {isMobile ? (
                // Mobile: Single month with navigation
                <CalendarMonth
                    weeks={currentMonthData}
                    monthDate={currentMonth}
                    title={formatDateBulgarian(currentMonth, 'MMMM yyyy')}
                />
            ) : (
                // Desktop: Two months side by side
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    gap={3}
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
            <Box mt={3} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
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