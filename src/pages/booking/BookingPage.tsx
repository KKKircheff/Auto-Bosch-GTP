// src/pages/booking/BookingPage.tsx
import { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import BookingForm from '../../components/booking/BookingForm';
import { useBookingContext } from '../../contexts/BookingContext';
import type { BookingFormSchema } from '../../types/booking';

const BookingPage = () => {
    const {
        createBooking,
        bookingLoading,
        bookingError,
        bookingSuccess,
        confirmationNumber,
        clearBooking
    } = useBookingContext();

    // Clear booking state when component mounts
    useEffect(() => {
        clearBooking();
    }, [clearBooking]);

    const handleBookingSubmit = async (data: BookingFormSchema) => {
        try {
            // Convert BookingFormSchema to BookingFormData format expected by the service
            const bookingData = {
                customerName: data.customerName,
                email: data.email || '', // Convert undefined to empty string
                phone: data.phone,
                registrationPlate: data.registrationPlate,
                vehicleType: data.vehicleType,
                vehicleBrand: data.vehicleBrand || '',
                is4x4: data.is4x4 || false,
                appointmentDate: data.appointmentDate,
                appointmentTime: data.appointmentTime,
                notes: data.notes || '',
            };

            await createBooking(bookingData);
        } catch (error) {
            console.error('Error submitting booking:', error);
        }
    };

    const handleCloseSuccess = () => {
        clearBooking();
    };

    const handleCloseError = () => {
        // Don't clear the whole booking on error, just acknowledge the error
        // The context should handle error clearing
    };

    return (
        <>
            <BookingForm
                onSubmit={handleBookingSubmit}
                loading={bookingLoading}
                error={bookingError}
            />

            {/* Success notification */}
            <Snackbar
                open={bookingSuccess}
                autoHideDuration={8000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {confirmationNumber
                        ? `Записването е успешно! Номер за потвърждение: ${confirmationNumber}`
                        : 'Записването е успешно! Ще получите потвърждение на имейл.'
                    }
                </Alert>
            </Snackbar>

            {/* Error notification */}
            <Snackbar
                open={!!bookingError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {bookingError || 'Възникна грешка при записването. Моля опитайте отново.'}
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookingPage;
