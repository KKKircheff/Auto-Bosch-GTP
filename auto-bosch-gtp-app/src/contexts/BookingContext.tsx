import { createContext, useContext, type ReactNode } from 'react';

interface BookingContextType {
    // Will be implemented in booking steps
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
    children: ReactNode;
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
    // Placeholder implementation - will be completed in later steps

    return (
        <BookingContext.Provider value={{}}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};