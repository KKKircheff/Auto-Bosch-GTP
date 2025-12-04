import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Stack,
    Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import BookingCalendar from './BookingCalendar';
import VehicleForm from './VehicleForm';
import BookingConfirmation from './BookingConfirmation';
import { useBookingContext } from '../../contexts/BookingContext';
import type { BookingFormSchema } from '../../types/booking';
import { PrimaryButton } from '../common/buttons';
import SectionTitle from '../common/typography/SectionTitle.component';
import { GradientCard } from '../common/cards';
import { useTheme, useMediaQuery } from '@mui/material';

interface BookingFormProps {
    onSubmit?: (data: BookingFormSchema) => void;
    loading?: boolean;
    error?: string;
}

const BookingForm = ({ onSubmit, loading = false, error }: BookingFormProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Partial<BookingFormSchema>>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigationRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        selectedDate,
        selectedTime,
        bookingSuccess,
    } = useBookingContext();

    // Use refs to prevent unnecessary effect triggers
    const hasResetRef = useRef(false);
    const prevBookingSuccessRef = useRef(bookingSuccess);

    const steps = [
        'Дата и час',
        'Данни и МПС',
        'Потвърди',
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

    const scrollToTop = useCallback(() => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, []);

    // Scroll to navigation callback
    const scrollToNavigation = useCallback(() => {
        setTimeout(() => {
            navigationRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
    }, []);

    // Memoized handlers to prevent recreation
    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        scrollToTop();
    }, [scrollToTop]);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        scrollToTop();
    }, [scrollToTop]);

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
                return step !== 2;
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
                        onTimeSlotSelect={scrollToNavigation}
                    />
                );
            case 1:
                return (
                    <Container maxWidth="xl">
                        <VehicleForm
                            onFormChange={handleVehicleFormChange}
                            onValidationChange={handleValidationChange}
                            initialData={formData}
                        />
                    </Container>
                );
            case 2:
                return (
                    <Container maxWidth="xl">
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
    }, [handleDateTimeSelect, scrollToNavigation, handleVehicleFormChange, handleValidationChange, formData, handleSubmit, handleEditStep, loading, isCompleteFormData]);

    return (
        <Box sx={{ width: '100%', py: 8 }} ref={formRef}>
            <SectionTitle>
                Запазване час за технически преглед
            </SectionTitle>

            {/* Progress Stepper */}
            <Container maxWidth='xl' >
                <GradientCard title="Стъпки" titleVariant="red" mb={8}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label} completed={isStepCompleted(index)}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </GradientCard>
            </Container>

            {/* Error Display */}
            {error && (
                <Container maxWidth="xl" sx={{ mb: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 8 }}>
                {renderStepContent(activeStep)}
            </Box>

            {/* Navigation */}
            <Container maxWidth="xl" ref={navigationRef}>
                <GradientCard title="Навигация" titleVariant="blue">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <PrimaryButton
                            disabled={activeStep === 0 || loading}
                            onClick={handleBack}
                            startIcon={!isMobile ? <ArrowBack /> : undefined}
                            size="large"
                            sx={{
                                minWidth: { sx: '48px', md: '250px' },
                                px: { sx: 1, md: 4 },
                            }}
                        >
                            {isMobile ? <ArrowBack /> : 'Назад'}
                        </PrimaryButton>

                        <Box textAlign="center" display={{ xs: 'block', sm: 'block' }}>
                            <Typography variant="body2" color="text.secondary">
                                Стъпка {activeStep + 1} от {steps.length}
                            </Typography>
                        </Box>

                        {activeStep === steps.length - 1 ? (
                            <PrimaryButton
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!canProceed || loading || !isCompleteFormData(formData)}
                                startIcon={!isMobile ? <Check /> : undefined}
                                size="large"
                                sx={{
                                    minWidth: { sx: '48px', md: '250px' },
                                    px: { sx: 1, md: 4 },
                                }}
                            >
                                {isMobile ? <Check /> : (loading ? 'Запазване...' : 'Потвърди')}
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton
                                variant="contained"
                                onClick={handleNext}
                                disabled={!canProceed || loading}
                                endIcon={!isMobile ? <ArrowForward /> : undefined}
                                size="large"
                                sx={{
                                    minWidth: { sx: '48px', md: '250px' },
                                    px: { sx: 1, md: 4 },
                                }}
                            >
                                {isMobile ? <ArrowForward /> : 'Напред'}
                            </PrimaryButton>
                        )}
                    </Stack>

                    {/* Step completion indicator */}
                    {!canProceed && activeStep < steps.length - 1 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {activeStep === 0 && 'Моля изберете дата и час, за да продължите.'}
                            {activeStep === 1 && 'Моля попълнете всички задължителни полета, за да продължите.'}
                        </Alert>
                    )}
                </GradientCard>
            </Container>
        </Box>
    );
};

export default BookingForm;