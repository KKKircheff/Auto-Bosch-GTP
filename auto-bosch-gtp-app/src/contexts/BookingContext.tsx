import { createContext, useContext, type ReactNode, useState, useCallback } from 'react';
import { useCreateBooking, useAppointmentCounts, useTimeSlots } from '../hooks/useBooking';
import type { BookingFormSchema, TimeSlot } from '../types/booking';

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
    createBooking: (data: BookingFormSchema) => Promise<any>;
    bookingLoading: boolean;
    bookingError?: string;
    bookingSuccess: boolean;
    confirmationNumber?: string;

    // Utilities
    clearBooking: () => void;
    refreshTimeSlots: () => void;
    refreshAppointmentCounts: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
    children: ReactNode;
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
    // Local state
    const [currentBooking, setCurrentBooking] = useState<Partial<BookingFormSchema> | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Firebase hooks
    const {
        createBooking: createBookingMutation,
        isLoading: bookingLoading,
        error: bookingError,
        success: bookingSuccess,
        confirmationNumber,
        reset: resetBooking,
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

    // Enhanced date setter that clears time when date changes
    const handleSetSelectedDate = useCallback((date: Date | null) => {
        setSelectedDate(date);
        setSelectedTime(null); // Clear time when date changes
    }, []);

    // Create booking with context state management
    const handleCreateBooking = useCallback(async (data: BookingFormSchema) => {
        // Update current booking state
        setCurrentBooking(data);

        // Create the booking
        const result = await createBookingMutation(data);

        if (result.success) {
            // Refresh data after successful booking
            refetchTimeSlots();
            refetchAppointmentCounts();
        }

        return result;
    }, [createBookingMutation, refetchTimeSlots, refetchAppointmentCounts]);

    // Clear all booking state
    const clearBooking = useCallback(() => {
        setCurrentBooking(null);
        setSelectedDate(null);
        setSelectedTime(null);
        resetBooking();
    }, [resetBooking]);

    const value: BookingContextType = {
        // Current booking state
        currentBooking,
        setCurrentBooking,

        // Selected date and time
        selectedDate,
        selectedTime,
        setSelectedDate: handleSetSelectedDate,
        setSelectedTime,

        // Time slots for selected date
        timeSlots,
        timeSlotsLoading,
        timeSlotsError,

        // Appointment counts for calendar
        appointmentCounts,
        appointmentCountsLoading,

        // Booking creation
        createBooking: handleCreateBooking,
        bookingLoading,
        bookingError,
        bookingSuccess,
        confirmationNumber,

        // Utilities
        clearBooking,
        refreshTimeSlots: refetchTimeSlots,
        refreshAppointmentCounts: refetchAppointmentCounts,
    };

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

// src/hooks/useAuth.ts
export { useAuth } from '../contexts/AuthContext';