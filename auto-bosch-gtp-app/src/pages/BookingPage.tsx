import { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import BookingForm from '../components/booking/BookingForm';
import type { BookingFormSchema } from '../types/booking';

const BookingPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const handleBookingSubmit = async (data: BookingFormSchema) => {
        setLoading(true);
        setError('');

        try {
            // Simulate API call
            console.log('Submitting booking:', data);

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success/error
            const isSuccess = Math.random() > 0.2; // 80% success rate for demo

            if (isSuccess) {
                setSuccess(true);
                console.log('Booking successful!');
                // Here you would typically redirect to a success page
                // or show a success message
            } else {
                throw new Error('Възникна грешка при записването. Моля опитайте отново.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неочаквана грешка');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
    };

    return (
        <>
            <BookingForm
                onSubmit={handleBookingSubmit}
                loading={loading}
                error={error}
            />

            {/* Success notification */}
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Записването е успешно! Ще получите потвърждение на имейл.
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookingPage;