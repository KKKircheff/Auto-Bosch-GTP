import { createContext, useContext, type ReactNode, useState, useCallback, useMemo } from 'react';
import { useCreateBooking, useAppointmentCounts, useTimeSlots } from '../hooks/useBooking';
import { isTimeSlotAvailable } from '../services/appointments'; // Import the correct function
import type { BookingFormSchema, BookingFormData, TimeSlot } from '../types/booking';
import { getNextAvailableDate } from '../utils/dateHelpers';
import { useBusinessSettings } from '../hooks/useBusinessSettings';

interface BookingContextType {
    // Current booking state
    currentBooking: Partial<BookingFormSchema> | null;
    setCurrentBooking: (booking: Partial<BookingFormSchema> | null) => void;

    // Selected date and time
    selectedDate: Date | null;
    selectedTime: string | null;
    setSelectedDate: (date: Date | null) => void;
    setSelectedTime: (time: string | null) => void;

    // Time slots for selected date
    timeSlots: TimeSlot[];
    timeSlotsLoading: boolean;
    timeSlotsError?: string;

    // Appointment counts for calendar
    appointmentCounts: Record<string, number>;
    appointmentCountsLoading: boolean;

    // Booking creation
    createBooking: (data: BookingFormData) => Promise<any>;
    bookingLoading: boolean;
    bookingError?: string;
    bookingSuccess: boolean;
    confirmationNumber?: string;

    // Real-time validation
    validateTimeSlot: (date: Date, time: string) => Promise<boolean>;
    isValidatingSlot: boolean;

    // Utilities
    clearBooking: () => void;
    clearError: () => void;
    refreshTimeSlots: () => void;
    refreshAppointmentCounts: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
    children: ReactNode;
}


// ...

export const BookingProvider = ({ children }: BookingProviderProps) => {
    // Get business settings from Firebase
    const { settings } = useBusinessSettings();

    // Local state
    const [currentBooking, setCurrentBooking] = useState<Partial<BookingFormSchema> | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
        getNextAvailableDate(settings?.workingHours, settings?.workingDays, settings?.bookingWindowWeeks)
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isValidatingSlot, setIsValidatingSlot] = useState(false);

    // Firebase hooks
    const {
        createBooking: createBookingMutation,
        isLoading: bookingLoading,
        error: bookingError,
        success: bookingSuccess,
        confirmationNumber,
        reset: resetBooking,
        clearError: clearBookingError,
    } = useCreateBooking();

    const {
        timeSlots,
        isLoading: timeSlotsLoading,
        error: timeSlotsError,
        refetch: refetchTimeSlots,
    } = useTimeSlots(selectedDate);

    const {
        counts: appointmentCounts,
        isLoading: appointmentCountsLoading,
        refetch: refetchAppointmentCounts,
    } = useAppointmentCounts();

    // Real-time slot validation
    const validateTimeSlot = useCallback(async (date: Date, time: string): Promise<boolean> => {
        setIsValidatingSlot(true);
        try {
            const isAvailable = await isTimeSlotAvailable(date, time);
            return isAvailable;
        } catch (error) {
            console.error('Error validating time slot:', error);
            return false;
        } finally {
            setIsValidatingSlot(false);
        }
    }, []);

    // Memoized callbacks to prevent recreation on every render
    const handleSetSelectedDate = useCallback((date: Date | null) => {
        setSelectedDate(date);
        setSelectedTime(null); // Clear time when date changes
    }, []);

    const handleSetSelectedTime = useCallback(async (time: string | null) => {
        if (!time || !selectedDate) {
            setSelectedTime(time);
            return;
        }

        // Validate the slot before selecting it
        console.log('Validating time slot before selection:', { date: selectedDate, time });
        const isValid = await validateTimeSlot(selectedDate, time);

        if (isValid) {
            setSelectedTime(time);
            console.log('Time slot is valid and selected');
        } else {
            console.log('Time slot is no longer available');
            // Refresh time slots to get updated availability
            if (refetchTimeSlots) {
                refetchTimeSlots();
            }
            // Don't set the time - show user that it's unavailable
            alert('Този час вече не е свободен. Моля изберете друг час.');
        }
    }, [selectedDate, validateTimeSlot, refetchTimeSlots]);

    const handleSetCurrentBooking = useCallback((booking: Partial<BookingFormSchema> | null) => {
        setCurrentBooking(booking);
    }, []);

    // Enhanced create booking with final validation
    const handleCreateBooking = useCallback(async (data: BookingFormData) => {
        console.log('Starting booking creation process...');

        // Clear any previous errors
        if (clearBookingError) {
            clearBookingError();
        }

        // Final validation before submission
        console.log('Performing final slot validation...');
        const isSlotStillAvailable = await validateTimeSlot(data.appointmentDate, data.appointmentTime);

        if (!isSlotStillAvailable) {
            console.log('Slot no longer available during final validation');

            // Refresh time slots
            if (refetchTimeSlots) refetchTimeSlots();
            if (refetchAppointmentCounts) refetchAppointmentCounts();

            // Return error without calling the mutation
            return {
                success: false,
                error: 'Избраният час вече не е свободен. Моля изберете друг час.',
            };
        }

        console.log('Final validation passed, proceeding with booking...');

        // Update current booking state
        setCurrentBooking(data);

        // Create the booking
        const result = await createBookingMutation(data);

        if (result?.success) {
            console.log('Booking created successfully, refreshing data...');
            // Refresh data after successful booking
            if (refetchTimeSlots) refetchTimeSlots();
            if (refetchAppointmentCounts) refetchAppointmentCounts();
        } else {
            console.log('Booking failed:', result?.error);
        }

        return result;
    }, [createBookingMutation, validateTimeSlot, refetchTimeSlots, refetchAppointmentCounts, clearBookingError]);

    // Clear all booking state
    const clearBooking = useCallback(() => {
        setCurrentBooking(null);
        setSelectedDate(null);
        setSelectedTime(null);
        if (resetBooking) resetBooking();
    }, [resetBooking]);

    // Clear only error state
    const clearError = useCallback(() => {
        if (clearBookingError) clearBookingError();
    }, [clearBookingError]);

    // Memoized refresh functions
    const refreshTimeSlots = useCallback(() => {
        console.log('Refreshing time slots...');
        if (refetchTimeSlots) refetchTimeSlots();
    }, [refetchTimeSlots]);

    const refreshAppointmentCounts = useCallback(() => {
        console.log('Refreshing appointment counts...');
        if (refetchAppointmentCounts) refetchAppointmentCounts();
    }, [refetchAppointmentCounts]);

    // Memoize the context value to prevent recreation
    const value = useMemo<BookingContextType>(() => ({
        // Current booking state
        currentBooking,
        setCurrentBooking: handleSetCurrentBooking,

        // Selected date and time
        selectedDate,
        selectedTime,
        setSelectedDate: handleSetSelectedDate,
        setSelectedTime: handleSetSelectedTime,

        // Time slots for selected date
        timeSlots: timeSlots || [],
        timeSlotsLoading,
        timeSlotsError,

        // Appointment counts for calendar
        appointmentCounts: appointmentCounts || {},
        appointmentCountsLoading,

        // Booking creation
        createBooking: handleCreateBooking,
        bookingLoading,
        bookingError,
        bookingSuccess,
        confirmationNumber,

        // Real-time validation
        validateTimeSlot,
        isValidatingSlot,

        // Utilities
        clearBooking,
        clearError,
        refreshTimeSlots,
        refreshAppointmentCounts,
    }), [
        // Dependencies for the memoization
        currentBooking,
        selectedDate,
        selectedTime,
        timeSlots,
        timeSlotsLoading,
        timeSlotsError,
        appointmentCounts,
        appointmentCountsLoading,
        bookingLoading,
        bookingError,
        bookingSuccess,
        confirmationNumber,
        isValidatingSlot,
        handleSetCurrentBooking,
        handleSetSelectedDate,
        handleSetSelectedTime,
        handleCreateBooking,
        validateTimeSlot,
        clearBooking,
        clearError,
        refreshTimeSlots,
        refreshAppointmentCounts,
    ]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
};

// Export for backward compatibility
export { useBookingContext as useBooking };