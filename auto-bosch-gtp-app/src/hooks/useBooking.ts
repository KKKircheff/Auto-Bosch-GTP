// src/hooks/useBooking.ts - Updated version with enhanced validation
import {useState, useCallback, useEffect, useRef} from 'react';
import {
    createBooking,
    getAvailableTimeSlots,
    getAppointmentCounts,
    validateBookingSlot,
} from '../services/appointments';
import type {BookingFormData, TimeSlot} from '../types/booking';

// Hook for creating bookings with enhanced validation
export const useCreateBooking = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [confirmationNumber, setConfirmationNumber] = useState<string>('');

    const createBookingMutation = useCallback(async (data: BookingFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);
        setConfirmationNumber('');

        try {
            console.log('Creating booking with enhanced validation...');
            const result = await createBooking(data);

            if (result.success && result.data) {
                setSuccess(true);
                setConfirmationNumber(result.data.confirmationNumber);
                console.log('Booking created successfully');
                return result;
            } else {
                setError(result.error || 'Възникна грешка при записването.');
                console.error('Booking failed:', result.error);
                return result;
            }
        } catch (err) {
            const errorMessage = 'Възникна неочаквана грешка при записването.';
            setError(errorMessage);
            console.error('Booking exception:', err);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError('');
        setSuccess(false);
        setConfirmationNumber('');
    }, []);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    return {
        createBooking: createBookingMutation,
        isLoading,
        error,
        success,
        confirmationNumber,
        reset,
        clearError,
    };
};

// Hook for fetching time slots with real-time updates
export const useTimeSlots = (selectedDate: Date | null) => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Use ref to track the current date to avoid stale closures
    const currentDateRef = useRef<Date | null>(selectedDate);
    currentDateRef.current = selectedDate;

    const fetchTimeSlots = useCallback(async (date: Date) => {
        // Check if this is still the current date (avoid race conditions)
        if (currentDateRef.current?.getTime() !== date.getTime()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Fetching time slots for:', date.toISOString());
            const result = await getAvailableTimeSlots(date);

            // Double-check we're still on the same date
            if (currentDateRef.current?.getTime() === date.getTime()) {
                if (result.success && result.data) {
                    setTimeSlots(result.data);
                    console.log('Time slots updated:', result.data.length);
                } else {
                    setError(result.error || 'Възникна грешка при зареждане на свободните часове.');
                    setTimeSlots([]);
                }
            }
        } catch (err) {
            if (currentDateRef.current?.getTime() === date.getTime()) {
                setError('Възникна неочаквана грешка при зареждане на свободните часове.');
                setTimeSlots([]);
                console.error('Error fetching time slots:', err);
            }
        } finally {
            if (currentDateRef.current?.getTime() === date.getTime()) {
                setIsLoading(false);
            }
        }
    }, []); // Empty dependency array since we use refs

    // Fetch time slots when date changes
    useEffect(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        } else {
            setTimeSlots([]);
            setError('');
            setIsLoading(false);
        }
    }, [selectedDate, fetchTimeSlots]);

    const refetch = useCallback(() => {
        if (currentDateRef.current) {
            console.log('Manually refetching time slots...');
            fetchTimeSlots(currentDateRef.current);
        }
    }, [fetchTimeSlots]);

    return {
        timeSlots,
        isLoading,
        error,
        refetch,
    };
};

// Hook for fetching appointment counts with caching
export const useAppointmentCounts = () => {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Use ref to prevent infinite loops
    const fetchInProgressRef = useRef(false);
    const lastFetchRef = useRef<number>(0);

    const fetchAppointmentCounts = useCallback(async (forceRefresh = false) => {
        // Prevent concurrent fetches
        if (fetchInProgressRef.current) {
            return;
        }

        // Cache for 5 minutes unless force refresh
        const now = Date.now();
        if (!forceRefresh && now - lastFetchRef.current < 5 * 60 * 1000) {
            console.log('Using cached appointment counts');
            return;
        }

        fetchInProgressRef.current = true;
        setIsLoading(true);
        setError('');

        try {
            console.log('Fetching appointment counts...');
            // Get counts for the next 3 months
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);

            const result = await getAppointmentCounts(startDate, endDate);

            if (result.success && result.data) {
                setCounts(result.data);
                lastFetchRef.current = now;
                console.log('Appointment counts updated:', Object.keys(result.data).length, 'dates');
            } else {
                setError(result.error || 'Възникна грешка при зареждане на броя записвания.');
                setCounts({});
            }
        } catch (err) {
            setError('Възникна неочаквана грешка при зареждане на броя записвания.');
            setCounts({});
            console.error('Error fetching appointment counts:', err);
        } finally {
            setIsLoading(false);
            fetchInProgressRef.current = false;
        }
    }, []);

    // Fetch counts on mount only
    useEffect(() => {
        fetchAppointmentCounts();
    }, []); // Empty dependency array - only run on mount

    const refetch = useCallback(() => {
        console.log('Manually refetching appointment counts...');
        fetchAppointmentCounts(true);
    }, [fetchAppointmentCounts]);

    return {
        counts,
        isLoading,
        error,
        refetch,
    };
};

// Hook for real-time time slot validation
export const useTimeSlotValidation = () => {
    const [isValidating, setIsValidating] = useState(false);
    const [lastValidation, setLastValidation] = useState<{
        date: string;
        time: string;
        result: boolean;
        timestamp: number;
    } | null>(null);

    const validateTimeSlot = useCallback(
        async (date: Date, time: string): Promise<boolean> => {
            const dateStr = date.toISOString();
            const now = Date.now();

            // Use cached result if validation was recent (within 10 seconds)
            if (
                lastValidation &&
                lastValidation.date === dateStr &&
                lastValidation.time === time &&
                now - lastValidation.timestamp < 10000
            ) {
                console.log('Using cached validation result');
                return lastValidation.result;
            }

            setIsValidating(true);

            try {
                console.log('Validating time slot:', {date: dateStr, time});
                const result = await validateBookingSlot(date, time);
                const isValid = result.success && result.data === true;

                // Cache the result
                setLastValidation({
                    date: dateStr,
                    time,
                    result: isValid,
                    timestamp: now,
                });

                console.log('Validation result:', isValid);
                return isValid;
            } catch (err) {
                console.error('Error validating time slot:', err);
                return false;
            } finally {
                setIsValidating(false);
            }
        },
        [lastValidation]
    );

    const clearValidationCache = useCallback(() => {
        setLastValidation(null);
    }, []);

    return {
        validateTimeSlot,
        isValidating,
        lastValidation,
        clearValidationCache,
    };
};

// Hook for checking if a time slot is available (backward compatibility)
export const useTimeSlotAvailability = () => {
    const {validateTimeSlot, isValidating} = useTimeSlotValidation();

    const checkAvailability = useCallback(
        async (date: Date, time: string): Promise<boolean> => {
            return validateTimeSlot(date, time);
        },
        [validateTimeSlot]
    );

    return {
        checkAvailability,
        isChecking: isValidating,
    };
};

// Hook for booking validation with enhanced checks
export const useBookingValidation = () => {
    const {validateTimeSlot} = useTimeSlotValidation();

    const validateBooking = useCallback(
        async (
            data: BookingFormData
        ): Promise<{
            isValid: boolean;
            errors: string[];
        }> => {
            const errors: string[] = [];

            // Check if date is in the future
            const now = new Date();
            if (data.appointmentDate <= now) {
                errors.push('Датата на прегледа трябва да бъде в бъдещето.');
            }

            // Check if date is a working day (Monday-Friday)
            const dayOfWeek = data.appointmentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                errors.push('Прегледите се извършват само в работни дни (понеделник - петък).');
            }

            // Validate phone number format
            const phoneRegex = /^(\+359|0)[0-9]{8,9}$/;
            if (!phoneRegex.test(data.phone)) {
                errors.push('Невалиден телефонен номер.');
            }

            // Validate email if provided
            if (data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    errors.push('Невалиден имейл адрес.');
                }
            }

            // Validate registration plate
            const plateRegex = /^[A-Za-z0-9\-]+$/;
            if (!plateRegex.test(data.registrationPlate)) {
                errors.push('Невалиден регистрационен номер.');
            }

            // Real-time availability check
            if (errors.length === 0) {
                const isTimeAvailable = await validateTimeSlot(data.appointmentDate, data.appointmentTime);
                if (!isTimeAvailable) {
                    errors.push('Избраният час вече не е свободен.');
                }
            }

            return {
                isValid: errors.length === 0,
                errors,
            };
        },
        [validateTimeSlot]
    );

    return {
        validateBooking,
    };
};
