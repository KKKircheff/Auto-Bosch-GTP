import { useState } from 'react';
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
import { TEXTS } from '../../utils/constants';
import type { BookingFormSchema } from '../..//types/booking';
import BookingConfirmation from './BookingConfirmation';

interface BookingFormProps {
    onSubmit?: (data: BookingFormSchema) => void;
    loading?: boolean;
    error?: string;
}

const BookingForm = ({ onSubmit, loading = false, error }: BookingFormProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Partial<BookingFormSchema>>({});
    const [isFormValid, setIsFormValid] = useState(false);

    const steps = [
        'Изберете дата и час',
        'Данни за превозното средство',
        'Потвърждение',
    ];

    // Handle step navigation
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setFormData({});
        setIsFormValid(false);
    };

    // Handle date/time selection
    const handleDateTimeSelect = (date: Date, time: string) => {
        setFormData(prev => ({
            ...prev,
            appointmentDate: date,
            appointmentTime: time,
        }));
    };

    // Handle vehicle form changes
    const handleVehicleFormChange = (data: Partial<BookingFormSchema>) => {
        setFormData(prev => ({
            ...prev,
            ...data,
        }));
    };

    // Handle form validation
    const handleValidationChange = (isValid: boolean) => {
        setIsFormValid(isValid);
    };

    // Handle final submission
    const handleSubmit = () => {
        if (onSubmit && formData as BookingFormSchema) {
            onSubmit(formData as BookingFormSchema);
        }
    };

    // Check if current step is completed
    const isStepCompleted = (step: number) => {
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
    };

    const canProceed = isStepCompleted(activeStep);

    // Mock data for calendar
    const mockExistingBookings = {
        '2025-07-08': ['09:00', '10:30', '14:00'],
        '2025-07-09': ['11:00', '15:30'],
        '2025-07-10': ['08:30', '13:00', '16:30'],
    };

    const mockAppointmentCounts = {
        '2025-07-08': 3,
        '2025-07-09': 2,
        '2025-07-10': 3,
        '2025-07-11': 1,
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <BookingCalendar
                        onDateTimeSelect={handleDateTimeSelect}
                        existingBookings={mockExistingBookings}
                        appointmentCounts={mockAppointmentCounts}
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
                        <BookingConfirmation
                            formData={formData as BookingFormSchema}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </Container>
                );
            default:
                return <div>Неизвестна стъпка</div>;
        }
    };

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
                                disabled={!canProceed || loading}
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
                            {JSON.stringify(formData, null, 2)}
                        </Typography>
                        <Typography variant="caption" display="block" mt={1}>
                            Step {activeStep + 1} completed: {isStepCompleted(activeStep) ? 'Yes' : 'No'}
                        </Typography>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default BookingForm;