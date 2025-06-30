import { addWeeks, startOfDay, endOfDay, addMinutes, format, isWeekend } from 'date-fns';
import { WORKING_DAYS, SLOT_DURATION_MINUTES, MAX_BOOKING_WEEKS } from './constants';

// Generate date range for booking calendar
export const getBookingDateRange = (): { startDate: Date; endDate: Date } => {
  const startDate = startOfDay(new Date());
  const endDate = endOfDay(addWeeks(startDate, MAX_BOOKING_WEEKS));
  
  return { startDate, endDate };
};

// Check if a date is a working day
export const isWorkingDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return WORKING_DAYS.includes(dayOfWeek as any);
};

// Generate time slots for a specific date
export const generateTimeSlotsForDate = (
  date: Date,
  startHour: number = 9,
  endHour: number = 17
): Date[] => {
  if (!isWorkingDay(date)) {
    return [];
  }

  const slots: Date[] = [];
  const startTime = new Date(date);
  startTime.setHours(startHour, 0, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(endHour, 0, 0, 0);

  let currentSlot = new Date(startTime);
  
  while (currentSlot < endTime) {
    slots.push(new Date(currentSlot));
    currentSlot = addMinutes(currentSlot, SLOT_DURATION_MINUTES);
  }

  return slots;
};

// Format time for display
export const formatTimeSlot = (date: Date): string => {
  return format(date, 'HH:mm');
};

// Format date for display
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

// Format full datetime for display
export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm');
};