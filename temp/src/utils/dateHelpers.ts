// src/utils/dateHelpers.ts
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    isToday,
    isBefore,
    addMonths,
    addDays,
    getDay,
    setHours,
    setMinutes,
    differenceInMinutes,
    parse,
} from 'date-fns';
import {WORKING_DAYS, BUSINESS_HOURS, SLOT_DURATION_MINUTES, TEXTS} from './constants';
import type {CalendarDay, CalendarWeek, DaySchedule, TimeSlot} from '../types/booking';

// Bulgarian month names
export const BULGARIAN_MONTHS = [
    TEXTS.months.january,
    TEXTS.months.february,
    TEXTS.months.march,
    TEXTS.months.april,
    TEXTS.months.may,
    TEXTS.months.june,
    TEXTS.months.july,
    TEXTS.months.august,
    TEXTS.months.september,
    TEXTS.months.october,
    TEXTS.months.november,
    TEXTS.months.december,
];

// Bulgarian day names (short)
export const BULGARIAN_DAYS_SHORT = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Bulgarian day names (full)
export const BULGARIAN_DAYS_FULL = [
    TEXTS.days.sunday,
    TEXTS.days.monday,
    TEXTS.days.tuesday,
    TEXTS.days.wednesday,
    TEXTS.days.thursday,
    TEXTS.days.friday,
    TEXTS.days.saturday,
];

/**
 * Format date in Bulgarian
 */
export const formatDateBulgarian = (date: Date, formatString: string = 'dd.MM.yyyy'): string => {
    // Custom Bulgarian formatting
    const day = format(date, 'dd');
    const month = BULGARIAN_MONTHS[date.getMonth()];
    const year = format(date, 'yyyy');
    const dayName = BULGARIAN_DAYS_FULL[getDay(date)];

    switch (formatString) {
        case 'dd.MM.yyyy':
            return `${day}.${String(date.getMonth() + 1).padStart(2, '0')}.${year}`;
        case 'dd MMMM yyyy':
            return `${day} ${month} ${year}`;
        case 'EEEE, dd MMMM yyyy':
            return `${dayName}, ${day} ${month} ${year}`;
        case 'MMMM yyyy':
            return `${month} ${year}`;
        default:
            return format(date, formatString);
    }
};

/**
 * Check if date is a working day (Monday-Friday)
 */
export const isWorkingDay = (date: Date): boolean => {
    const dayOfWeek = getDay(date);
    return WORKING_DAYS.includes(dayOfWeek);
};

/**
 * Check if date is in the past (before today)
 */
export const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return isBefore(checkDate, today);
};

/**
 * Check if date can be booked (working day and not in past)
 */
export const isBookableDate = (date: Date): boolean => {
    return isWorkingDay(date) && !isPastDate(date);
};

/**
 * Generate calendar days for a month
 */
export const generateCalendarDays = (
    date: Date,
    selectedDate?: Date,
    appointmentCounts?: Record<string, number>
): CalendarDay[] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, {weekStartsOn: 1}); // Start week on Monday
    const calendarEnd = endOfWeek(monthEnd, {weekStartsOn: 1});

    const days = eachDayOfInterval({start: calendarStart, end: calendarEnd});

    return days.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        return {
            date: day,
            isCurrentMonth: isSameMonth(day, date),
            isToday: isToday(day),
            isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
            isWorkingDay: isWorkingDay(day),
            isPastDate: isPastDate(day),
            hasAppointments: appointmentCounts ? (appointmentCounts[dateKey] || 0) > 0 : false,
            appointmentCount: appointmentCounts ? appointmentCounts[dateKey] || 0 : 0,
        };
    });
};

/**
 * Generate calendar weeks from days
 */
export const generateCalendarWeeks = (days: CalendarDay[]): CalendarWeek[] => {
    const weeks: CalendarWeek[] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push({
            days: days.slice(i, i + 7),
        });
    }
    return weeks;
};

/**
 * Generate time slots for a day
 */
export const generateTimeSlots = (date: Date, existingBookings: string[] = []): TimeSlot[] => {
    if (!isBookableDate(date)) {
        return [];
    }

    const slots: TimeSlot[] = [];
    const startTime = parse(BUSINESS_HOURS.START, 'HH:mm', date);
    const endTime = parse(BUSINESS_HOURS.END, 'HH:mm', date);

    let currentTime = startTime;

    while (currentTime < endTime) {
        const timeString = format(currentTime, 'HH:mm');
        const isAvailable = !existingBookings.includes(timeString);

        // If it's today, also check if the time has passed
        let isPastTime = false;
        if (isSameDay(date, new Date())) {
            const now = new Date();
            const slotDateTime = setHours(setMinutes(date, currentTime.getMinutes()), currentTime.getHours());
            isPastTime = isBefore(slotDateTime, now);
        }

        slots.push({
            time: timeString,
            available: isAvailable && !isPastTime,
            bookingId: isAvailable ? undefined : 'existing-booking',
        });

        currentTime = addDays(currentTime, 0);
        currentTime = new Date(currentTime.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
    }

    return slots;
};

/**
 * Generate day schedule with time slots
 */
export const generateDaySchedule = (date: Date, existingBookings: string[] = []): DaySchedule => {
    return {
        date,
        slots: generateTimeSlots(date, existingBookings),
        isWorkingDay: isWorkingDay(date),
        isPastDate: isPastDate(date),
    };
};

/**
 * Get next available booking date
 */
export const getNextAvailableDate = (): Date => {
    let date = new Date();

    // If it's currently past business hours, start from tomorrow
    const now = new Date();
    const endTime = parse(BUSINESS_HOURS.END, 'HH:mm', now);
    const currentTime = setHours(setMinutes(now, now.getMinutes()), now.getHours());

    if (currentTime >= endTime || !isWorkingDay(now)) {
        date = addDays(date, 1);
    }

    // Find next working day
    while (!isBookableDate(date)) {
        date = addDays(date, 1);
    }

    return date;
};

/**
 * Get available months for booking (current and next month)
 */
export const getAvailableMonths = (): {current: Date; next: Date} => {
    const now = new Date();
    return {
        current: now,
        next: addMonths(now, 1),
    };
};

/**
 * Format time slot for display
 */
export const formatTimeSlot = (time: string): string => {
    return time; // Already in HH:mm format
};

/**
 * Parse time string to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 */
export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Check if time slot is within business hours
 */
export const isWithinBusinessHours = (time: string): boolean => {
    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(BUSINESS_HOURS.START);
    const endMinutes = timeToMinutes(BUSINESS_HOURS.END);

    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

/**
 * Get display text for time remaining until appointment
 */
export const getTimeUntilAppointment = (appointmentDate: Date, appointmentTime: string): string => {
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    const appointmentDateTime = setHours(setMinutes(appointmentDate, minutes), hours);
    const now = new Date();

    const diffMinutes = differenceInMinutes(appointmentDateTime, now);

    if (diffMinutes < 0) {
        return 'Изминал';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} мин`;
    } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours} ч`;
    } else {
        const days = Math.floor(diffMinutes / 1440);
        return `${days} дни`;
    }
};
