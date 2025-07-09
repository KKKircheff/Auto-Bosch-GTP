import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Stack,
    Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import BookingCalendar from './BookingCalendar';
import VehicleForm from './VehicleForm';
import BookingConfirmation from './BookingConfirmation';
import { useBookingContext } from '../../contexts/BookingContext';
import { TEXTS } from '../../utils/constants';
import type { BookingFormSchema } from '../../types/booking';

interface BookingFormProps {
    onSubmit?: (data: BookingFormSchema) => void;
    loading?: boolean;
    error?: string;
}

const BookingForm = ({ onSubmit, loading = false, error }: BookingFormProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Partial<BookingFormSchema>>({});
    const [isFormValid, setIsFormValid] = useState(false);

    const {
        selectedDate,
        selectedTime,
        bookingSuccess,
        clearBooking
    } = useBookingContext();

    // Use refs to prevent unnecessary effect triggers
    const hasResetRef = useRef(false);
    const prevBookingSuccessRef = useRef(bookingSuccess);

    const steps = [
        'Изберете дата и час',
        'Данни за превозното средство',
        'Потвърждение',
    ];

    // Reset form when booking is successful - but only once
    useEffect(() => {
        if (bookingSuccess && !prevBookingSuccessRef.current && !hasResetRef.current) {
            hasResetRef.current = true;
            handleReset();
        }

        // Reset the flag when booking success changes to false
        if (!bookingSuccess && prevBookingSuccessRef.current) {
            hasResetRef.current = false;
        }

        prevBookingSuccessRef.current = bookingSuccess;
    }, [bookingSuccess]);

    // Update form data when date/time changes from context - but prevent loops
    useEffect(() => {
        if (selectedDate && selectedTime) {
            setFormData(prev => {
                // Only update if values actually changed
                if (prev.appointmentDate?.getTime() !== selectedDate.getTime() ||
                    prev.appointmentTime !== selectedTime) {
                    return {
                        ...prev,
                        appointmentDate: selectedDate,
                        appointmentTime: selectedTime,
                    };
                }
                return prev;
            });
        }
    }, [selectedDate, selectedTime]);

    // Memoized handlers to prevent recreation
    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);

    const handleReset = useCallback(() => {
        setActiveStep(0);
        setFormData({});
        setIsFormValid(false);
    }, []);

    // Handle step navigation with edit functionality
    const handleEditStep = useCallback((step: number) => {
        setActiveStep(step);
    }, []);

    // Handle date/time selection
    const handleDateTimeSelect = useCallback((date: Date, time: string) => {
        setFormData(prev => ({
            ...prev,
            appointmentDate: date,
            appointmentTime: time,
        }));
    }, []);

    // Handle vehicle form changes - prevent unnecessary updates
    const handleVehicleFormChange = useCallback((data: Partial<BookingFormSchema>) => {
        setFormData(prev => {
            // Deep compare to prevent unnecessary updates
            const hasChanges = Object.keys(data).some(key => {
                const typedKey = key as keyof BookingFormSchema;
                return prev[typedKey] !== data[typedKey];
            });

            if (hasChanges) {
                return { ...prev, ...data };
            }
            return prev;
        });
    }, []);

    // Handle form validation
    const handleValidationChange = useCallback((isValid: boolean) => {
        setIsFormValid(prevValid => {
            if (prevValid !== isValid) {
                return isValid;
            }
            return prevValid;
        });
    }, []);

    // Handle final submission
    const handleSubmit = useCallback(() => {
        if (onSubmit && isCompleteFormData(formData)) {
            onSubmit(formData as BookingFormSchema);
        }
    }, [onSubmit, formData]);

    // Type guard to check if form data is complete
    const isCompleteFormData = useCallback((data: Partial<BookingFormSchema>): data is BookingFormSchema => {
        return !!(
            data.customerName &&
            data.phone &&
            data.registrationPlate &&
            data.vehicleType &&
            data.appointmentDate &&
            data.appointmentTime
        );
    }, []);

    // Check if current step is completed
    const isStepCompleted = useCallback((step: number) => {
        switch (step) {
            case 0:
                return !!(formData.appointmentDate && formData.appointmentTime);
            case 1:
                return isFormValid && !!(
                    formData.customerName &&
                    formData.phone &&
                    formData.registrationPlate &&
                    formData.vehicleType
                );
            case 2:
                return true;
            default:
                return false;
        }
    }, [formData, isFormValid]);

    const canProceed = isStepCompleted(activeStep);

    const renderStepContent = useCallback((step: number) => {
        switch (step) {
            case 0:
                return (
                    <BookingCalendar
                        onDateTimeSelect={handleDateTimeSelect}
                    />
                );
            case 1:
                return (
                    <Container maxWidth="md">
                        <VehicleForm
                            onFormChange={handleVehicleFormChange}
                            onValidationChange={handleValidationChange}
                            initialData={formData}
                        />
                    </Container>
                );
            case 2:
                return (
                    <Container maxWidth="md">
                        {isCompleteFormData(formData) ? (
                            <BookingConfirmation
                                formData={formData as BookingFormSchema}
                                onSubmit={handleSubmit}
                                onEdit={handleEditStep}
                                loading={loading}
                            />
                        ) : (
                            <Alert severity="error">
                                Липсват данни за потвърждение. Моля върнете се назад и попълнете всички полета.
                            </Alert>
                        )}
                    </Container>
                );
            default:
                return <div>Неизвестна стъпка</div>;
        }
    }, [handleDateTimeSelect, handleVehicleFormChange, handleValidationChange, formData, handleSubmit, handleEditStep, loading, isCompleteFormData]);

    return (
        <Box sx={{ width: '100%', py: 4 }}>
            {/* Header */}
            <Container maxWidth="lg" sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
                    {TEXTS.bookingTitle}
                </Typography>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    {TEXTS.bookingSubtitle}
                </Typography>
            </Container>

            {/* Progress Stepper */}
            <Container maxWidth="md" sx={{ mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={label} completed={isStepCompleted(index)}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>

            {/* Error Display */}
            {error && (
                <Container maxWidth="md" sx={{ mb: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
                {renderStepContent(activeStep)}
            </Box>

            {/* Navigation */}
            <Container maxWidth="md">
                <Paper elevation={1} sx={{ p: 3 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button
                            disabled={activeStep === 0 || loading}
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                            size="large"
                        >
                            Назад
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                Стъпка {activeStep + 1} от {steps.length}
                            </Typography>
                        </Box>

                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!canProceed || loading || !isCompleteFormData(formData)}
                                startIcon={<Check />}
                                size="large"
                            >
                                {loading ? 'Запазване...' : 'Потвърди записването'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={!canProceed || loading}
                                endIcon={<ArrowForward />}
                                size="large"
                            >
                                Напред
                            </Button>
                        )}
                    </Stack>

                    {/* Step completion indicator */}
                    {!canProceed && activeStep < steps.length - 1 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            {activeStep === 0 && 'Моля изберете дата и час за да продължите.'}
                            {activeStep === 1 && 'Моля попълнете всички задължителни полета за да продължите.'}
                        </Alert>
                    )}
                </Paper>
            </Container>

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            Debug Info:
                        </Typography>
                        <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                            Step: {activeStep + 1}, Valid: {isFormValid ? 'Yes' : 'No'}, CanProceed: {canProceed ? 'Yes' : 'No'}
                        </Typography>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default BookingForm;