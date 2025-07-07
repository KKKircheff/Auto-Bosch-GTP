import {useState, useEffect, useCallback} from 'react';
import {format, addMonths} from 'date-fns';
import {createBooking, getAvailableTimeSlots, getAppointmentCounts, getBookingsForDate} from '../services/appointments';
import type {BookingFormData, TimeSlot, Booking, LoadingState} from '../types/booking';

/**
 * Hook for managing booking creation
 */
export const useCreateBooking = () => {
    const [state, setState] = useState<
        LoadingState & {
            success: boolean;
            confirmationNumber?: string;
        }
    >({
        isLoading: false,
        success: false,
    });

    const createBookingMutation = useCallback(async (formData: BookingFormData) => {
        setState({isLoading: true, success: false, error: undefined});

        try {
            const result = await createBooking(formData);

            if (result.success) {
                setState({
                    isLoading: false,
                    success: true,
                    confirmationNumber: result.data?.confirmationNumber,
                });
                return result;
            } else {
                setState({
                    isLoading: false,
                    success: false,
                    error: result.error,
                });
                return result;
            }
        } catch (error) {
            const errorMessage = 'Възникна неочаквана грешка при записването.';
            setState({
                isLoading: false,
                success: false,
                error: errorMessage,
            });
            return {
                success: false,
                error: errorMessage,
            };
        }
    }, []);

    const reset = useCallback(() => {
        setState({isLoading: false, success: false});
    }, []);

    return {
        ...state,
        createBooking: createBookingMutation,
        reset,
    };
};

/**
 * Hook for managing time slots
 */
export const useTimeSlots = (selectedDate: Date | null) => {
    const [state, setState] = useState<LoadingState & {timeSlots: TimeSlot[]}>({
        isLoading: false,
        timeSlots: [],
    });

    const fetchTimeSlots = useCallback(async (date: Date) => {
        setState((prev) => ({...prev, isLoading: true, error: undefined}));

        try {
            const result = await getAvailableTimeSlots(date);

            if (result.success) {
                setState({
                    isLoading: false,
                    timeSlots: result.data || [],
                });
            } else {
                setState({
                    isLoading: false,
                    timeSlots: [],
                    error: result.error,
                });
            }
        } catch (error) {
            setState({
                isLoading: false,
                timeSlots: [],
                error: 'Възникна грешка при зареждане на свободните часове.',
            });
        }
    }, []);

    // Fetch time slots when date changes
    useEffect(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        } else {
            setState({isLoading: false, timeSlots: []});
        }
    }, [selectedDate, fetchTimeSlots]);

    const refetch = useCallback(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        }
    }, [selectedDate, fetchTimeSlots]);

    return {
        ...state,
        refetch,
    };
};

/**
 * Hook for managing appointment counts for calendar
 */
export const useAppointmentCounts = () => {
    const [state, setState] = useState<
        LoadingState & {
            counts: Record<string, number>;
        }
    >({
        isLoading: false,
        counts: {},
    });

    const fetchAppointmentCounts = useCallback(async (startDate: Date, endDate: Date) => {
        setState((prev) => ({...prev, isLoading: true, error: undefined}));

        try {
            const result = await getAppointmentCounts(startDate, endDate);

            if (result.success) {
                setState({
                    isLoading: false,
                    counts: result.data || {},
                });
            } else {
                setState({
                    isLoading: false,
                    counts: {},
                    error: result.error,
                });
            }
        } catch (error) {
            setState({
                isLoading: false,
                counts: {},
                error: 'Възникна грешка при зареждане на броя записвания.',
            });
        }
    }, []);

    // Fetch for current and next month on mount
    useEffect(() => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(addMonths(startDate, 2).getTime() - 1); // End of next month

        fetchAppointmentCounts(startDate, endDate);
    }, [fetchAppointmentCounts]);

    const refetch = useCallback(
        (startDate?: Date, endDate?: Date) => {
            if (startDate && endDate) {
                fetchAppointmentCounts(startDate, endDate);
            } else {
                // Refresh current period
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(addMonths(start, 2).getTime() - 1);
                fetchAppointmentCounts(start, end);
            }
        },
        [fetchAppointmentCounts]
    );

    return {
        ...state,
        refetch,
    };
};

/**
 * Hook for managing bookings for a specific date
 */
export const useBookingsForDate = (date: Date | null) => {
    const [state, setState] = useState<LoadingState & {bookings: Booking[]}>({
        isLoading: false,
        bookings: [],
    });

    const fetchBookings = useCallback(async (targetDate: Date) => {
        setState((prev) => ({...prev, isLoading: true, error: undefined}));

        try {
            const result = await getBookingsForDate(targetDate);

            if (result.success) {
                setState({
                    isLoading: false,
                    bookings: result.data || [],
                });
            } else {
                setState({
                    isLoading: false,
                    bookings: [],
                    error: result.error,
                });
            }
        } catch (error) {
            setState({
                isLoading: false,
                bookings: [],
                error: 'Възникна грешка при зареждане на записванията.',
            });
        }
    }, []);

    // Fetch bookings when date changes
    useEffect(() => {
        if (date) {
            fetchBookings(date);
        } else {
            setState({isLoading: false, bookings: []});
        }
    }, [date, fetchBookings]);

    const refetch = useCallback(() => {
        if (date) {
            fetchBookings(date);
        }
    }, [date, fetchBookings]);

    return {
        ...state,
        refetch,
    };
};
