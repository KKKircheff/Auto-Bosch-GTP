import React from 'react';
import {
    Box,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Paper,
    Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import { VehicleTypeSelect } from './VehicleTypeSelect';
import { CarBrandSelect } from './CarBrandSelect';
import { RegistrationPlateInput } from './RegistrationPlateInput';
import { createAppointment } from '../../services/appointmentService';
import { getBookingDateRange } from '../../utils/helpers';
import { bookingFormSchema } from '../../types/appointment';
import type { BookingFormData } from '../../types/appointment';

interface BookingFormProps {
    onBookingSuccess: (appointmentId: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    onBookingSuccess
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const { startDate, endDate } = getBookingDateRange();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            registrationPlate: '',
            phoneNumber: '',
            email: '',
            serviceType: 'car',
            brand: '',
            model: '',
            is4x4: false,
        },
    });

    const watchedServiceType = watch('serviceType');
    const showBrandSelect = ['car', 'taxi', 'bus', 'motorcycle'].includes(watchedServiceType);
    const show4x4Checkbox = ['car', 'taxi', 'bus'].includes(watchedServiceType);
    const showModelInput = ['car', 'taxi'].includes(watchedServiceType);

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const appointmentId = await createAppointment(data);
            onBookingSuccess(appointmentId);
            reset();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to create appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Book Your Vehicle Check
                </Typography>

                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Registration Plate */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <RegistrationPlateInput control={control} errors={errors} />
                        </Grid>

                        {/* Phone Number */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone Number"
                                        placeholder="+359888123456"
                                        fullWidth
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Service Type */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <VehicleTypeSelect control={control} errors={errors} />
                        </Grid>

                        {/* Brand Select - Conditional */}
                        {showBrandSelect && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CarBrandSelect
                                    control={control}
                                    errors={errors}
                                    serviceType={watchedServiceType}
                                />
                            </Grid>
                        )}

                        {/* Model Input - Conditional */}
                        {showModelInput && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="model"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Model"
                                            placeholder="e.g., Golf, Corolla"
                                            fullWidth
                                            error={!!errors.model}
                                            helperText={errors.model?.message}
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        {/* 4x4 Checkbox - Conditional */}
                        {show4x4Checkbox && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="is4x4"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value || false}
                                                />
                                            }
                                            label="4x4 / All-wheel drive"
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        {/* Date Time Picker */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="appointmentDateTime"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        {...field}
                                        label="Appointment Date & Time"
                                        minDateTime={dayjs(startDate)}
                                        maxDateTime={dayjs(endDate)}
                                        minutesStep={15}
                                        shouldDisableTime={(timeValue, clockType) => {
                                            if (clockType === 'hours') {
                                                const hour = timeValue.hour();
                                                return hour < 9 || hour >= 17;
                                            }
                                            if (clockType === 'minutes') {
                                                const minute = timeValue.minute();
                                                return minute % 15 !== 0;
                                            }
                                            return false;
                                        }}
                                        shouldDisableDate={(date) => {
                                            const day = date.day();
                                            return day === 0 || day === 6; // Disable weekends
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.appointmentDateTime,
                                                helperText: errors.appointmentDateTime?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                {isSubmitting ? 'Booking...' : 'Book Appointment'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </LocalizationProvider>
    );
};