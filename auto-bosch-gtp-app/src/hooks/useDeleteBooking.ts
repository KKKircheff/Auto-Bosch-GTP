// src/hooks/useDeleteBooking.ts
import {useState, useCallback} from 'react';
import {deleteBooking} from '../services/appointments';

export const useDeleteBooking = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDeleteBooking = useCallback(async (bookingId: string) => {
        setIsDeleting(true);
        setError('');

        try {
            const result = await deleteBooking(bookingId);

            if (result.success) {
                return {
                    success: true,
                    message: result.message || 'Записването е успешно изтрито',
                };
            } else {
                const errorMessage = result.error || 'Възникна грешка при изтриване на записването';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                };
            }
        } catch (err) {
            const errorMessage = 'Възникна неочаквана грешка при изтриване на записването';
            setError(errorMessage);
            console.error('Delete booking error:', err);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsDeleting(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    return {
        deleteBooking: handleDeleteBooking,
        isDeleting,
        error,
        clearError,
    };
};
