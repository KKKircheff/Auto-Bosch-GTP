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
    isAfter,
    addMonths,
    addDays,
    addWeeks,
    getDay,
    setHours,
    setMinutes,
    differenceInMinutes,
    parse,
} from 'date-fns';
import {WORKING_DAYS, BUSINESS_HOURS, SLOT_DURATION_MINUTES, MAX_BOOKING_WEEKS} from './constants';
import type {CalendarDay, CalendarWeek, DaySchedule, TimeSlot} from '../types/booking';
import type {WorkingHours, WeekDay, ClosedDay} from '../features/admin-panel/types/settings.types';

// Bulgarian month names
export const BULGARIAN_MONTHS = [
    'Януари',
    'Февруари',
    'Март',
    'Април',
    'Май',
    'Юни',
    'Юли',
    'Август',
    'Септември',
    'Октомври',
    'Ноември',
    'Декември',
];

// Bulgarian day names (short) - Week starts with Monday
export const BULGARIAN_DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

// Bulgarian day names (full)
export const BULGARIAN_DAYS_FULL = ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];

/**
 * Convert WeekDay array to day numbers (0 = Sunday, 1 = Monday, etc.)
 */
const weekDayToNumber = (day: WeekDay): number => {
    const mapping: Record<WeekDay, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };
    return mapping[day];
};

/**
 * Convert WeekDay array to number array
 */
const convertWorkingDaysToNumbers = (workingDays: WeekDay[]): number[] => {
    return workingDays.map(weekDayToNumber);
};

/**
 * Get maximum allowed booking date based on MAX_BOOKING_WEEKS or custom booking window
 */
export const getMaxBookingDate = (bookingWindowWeeks?: number): Date => {
    const today = new Date();
    const weeks = bookingWindowWeeks ?? MAX_BOOKING_WEEKS;
    return addWeeks(today, weeks);
};

/**
 * Check if date is within the allowed booking window
 */
export const isWithinBookingWindow = (date: Date, bookingWindowWeeks?: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const maxDate = getMaxBookingDate(bookingWindowWeeks);
    maxDate.setHours(23, 59, 59, 999); // End of max day

    return !isBefore(checkDate, today) && !isAfter(checkDate, maxDate);
};

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
 * Check if date is a working day (Monday-Friday by default, or custom working days)
 */
export const isWorkingDay = (date: Date, workingDays?: WeekDay[]): boolean => {
    const dayOfWeek = getDay(date);
    const allowedDays = workingDays ? convertWorkingDaysToNumbers(workingDays) : WORKING_DAYS;
    return allowedDays.includes(dayOfWeek);
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
 * Check if date is marked as closed
 */
export const isClosedDay = (date: Date, closedDays?: ClosedDay[]): boolean => {
    if (!closedDays || closedDays.length === 0) return false;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return closedDays.some((closedDay) => {
        const closedDate = new Date(closedDay.date);
        closedDate.setHours(0, 0, 0, 0);
        return closedDate.getTime() === checkDate.getTime();
    });
};

/**
 * Check if date can be booked (working day, not in past, and within booking window)
 */
export const isBookableDate = (
    date: Date,
    workingDays?: WeekDay[],
    bookingWindowWeeks?: number,
    closedDays?: ClosedDay[]
): boolean => {
    return (
        isWorkingDay(date, workingDays) &&
        !isPastDate(date) &&
        isWithinBookingWindow(date, bookingWindowWeeks) &&
        !isClosedDay(date, closedDays)
    );
};

/**
 * Calculate total available time slots for a day based on business hours
 */
const getTotalSlotsPerDay = (): number => {
    const startMinutes = timeToMinutes(BUSINESS_HOURS.START);
    const endMinutes = timeToMinutes(BUSINESS_HOURS.END);
    const totalMinutes = endMinutes - startMinutes;
    return Math.floor(totalMinutes / SLOT_DURATION_MINUTES);
};

/**
 * Generate calendar days for a month
 */
export const generateCalendarDays = (
    date: Date,
    selectedDate?: Date,
    appointmentCounts?: Record<string, number>,
    workingDays?: WeekDay[],
    closedDays?: ClosedDay[]
): CalendarDay[] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, {weekStartsOn: 1}); // Start week on Monday
    const calendarEnd = endOfWeek(monthEnd, {weekStartsOn: 1});

    const days = eachDayOfInterval({start: calendarStart, end: calendarEnd});
    const totalSlotsPerDay = getTotalSlotsPerDay();

    return days.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const appointmentCount = appointmentCounts ? appointmentCounts[dateKey] || 0 : 0;

        return {
            date: day,
            isCurrentMonth: isSameMonth(day, date),
            isToday: isToday(day),
            isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
            isWorkingDay: isWorkingDay(day, workingDays),
            isPastDate: isPastDate(day),
            isClosedDay: isClosedDay(day, closedDays),
            hasAppointments: appointmentCount > 0,
            appointmentCount: appointmentCount,
            isFullyBooked: appointmentCount >= totalSlotsPerDay,
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
export const generateTimeSlots = (
    date: Date,
    existingBookings: string[] = [],
    workingHours?: WorkingHours,
    workingDays?: WeekDay[],
    bookingWindowWeeks?: number,
    closedDays?: ClosedDay[]
): TimeSlot[] => {
    if (!isBookableDate(date, workingDays, bookingWindowWeeks, closedDays)) {
        return [];
    }

    const slots: TimeSlot[] = [];
    const hours = workingHours || {start: BUSINESS_HOURS.START, end: BUSINESS_HOURS.END};
    const startTime = parse(hours.start, 'HH:mm', date);
    const endTime = parse(hours.end, 'HH:mm', date);

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
export const generateDaySchedule = (
    date: Date,
    existingBookings: string[] = [],
    workingHours?: WorkingHours,
    workingDays?: WeekDay[],
    bookingWindowWeeks?: number,
    closedDays?: ClosedDay[]
): DaySchedule => {
    return {
        date,
        slots: generateTimeSlots(date, existingBookings, workingHours, workingDays, bookingWindowWeeks, closedDays),
        isWorkingDay: isWorkingDay(date, workingDays),
        isPastDate: isPastDate(date),
    };
};

/**
 * Get next available booking date
 */
export const getNextAvailableDate = (
    workingHours?: WorkingHours,
    workingDays?: WeekDay[],
    bookingWindowWeeks?: number,
    closedDays?: ClosedDay[]
): Date => {
    let date = new Date();

    // If it's currently past business hours, start from tomorrow
    const now = new Date();
    const hours = workingHours || {start: BUSINESS_HOURS.START, end: BUSINESS_HOURS.END};
    const endTime = parse(hours.end, 'HH:mm', now);
    const currentTime = setHours(setMinutes(now, now.getMinutes()), now.getHours());

    if (currentTime >= endTime || !isWorkingDay(now, workingDays)) {
        date = addDays(date, 1);
    }

    // Find next working day within booking window
    while (!isBookableDate(date, workingDays, bookingWindowWeeks, closedDays)) {
        date = addDays(date, 1);

        // Safety check to prevent infinite loop
        if (!isWithinBookingWindow(date, bookingWindowWeeks)) {
            break;
        }
    }

    return date;
};

/**
 * Get available months for booking with respect to the booking window
 */
export const getAvailableMonths = (bookingWindowWeeks?: number): {current: Date; next: Date; maxDate: Date} => {
    const now = new Date();
    const maxDate = getMaxBookingDate(bookingWindowWeeks);

    return {
        current: now,
        next: addMonths(now, 1),
        maxDate,
    };
};

/**
 * Check if a month should be available for navigation
 */
export const isMonthWithinBookingWindow = (monthDate: Date, bookingWindowWeeks?: number): boolean => {
    const maxDate = getMaxBookingDate(bookingWindowWeeks);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return !isBefore(monthEnd, today) && !isAfter(monthStart, maxDate);
};

export const shouldShowSecondMonth = (currentMonth: Date, bookingWindowWeeks?: number): boolean => {
    const nextMonth = addMonths(currentMonth, 1);
    return isMonthWithinBookingWindow(nextMonth, bookingWindowWeeks);
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

/**
 * Get a user-friendly description of the booking window
 */
export const getBookingWindowDescription = (bookingWindowWeeks?: number): string => {
    const weeks = bookingWindowWeeks ?? MAX_BOOKING_WEEKS;
    const maxDate = getMaxBookingDate(weeks);
    return `до ${formatDateBulgarian(maxDate, 'dd MMMM yyyy')} (${weeks} седмици напред)`;
};
