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
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
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
import { SLOT_DURATION_MINUTES } from '../../utils/constants';

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
            setSubmitError(error instanceof Error ? error.message : 'Неуспешно създаване на резервация');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Резервирайте Вашия технически преглед
                </Typography>

                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Регистрационен номер */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <RegistrationPlateInput control={control} errors={errors} />
                        </Grid>

                        {/* Телефонен номер */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Телефонен номер"
                                        placeholder="+359888123456"
                                        fullWidth
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Имейл */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Имейл"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Тип на услугата */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <VehicleTypeSelect control={control} errors={errors} />
                        </Grid>

                        {/* Избор на марка - Условно */}
                        {showBrandSelect && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CarBrandSelect
                                    control={control}
                                    errors={errors}
                                    serviceType={watchedServiceType}
                                />
                            </Grid>
                        )}

                        {/* Поле за модел - Условно */}
                        {showModelInput && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="model"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Модел"
                                            placeholder="напр. Golf, Corolla"
                                            fullWidth
                                            error={!!errors.model}
                                            helperText={errors.model?.message}
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        {/* Квадратче за 4x4 - Условно */}
                        <Grid size={{ xs: 12 }} sx={{ display: show4x4Checkbox ? 'block' : 'none' }}>
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
                                        label="4x4 / Задвижване на всички колела"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Избор на дата и час */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="appointmentDateTime"
                                control={control}
                                render={({ field }) => (
                                    <StaticDateTimePicker
                                        {...field}
                                        ampm={false}
                                        label="Дата и час на резервацията"
                                        minDateTime={dayjs(startDate)}
                                        maxDateTime={dayjs(endDate)}
                                        minutesStep={SLOT_DURATION_MINUTES}
                                        shouldDisableTime={(timeValue, clockType) => {
                                            if (clockType === 'hours') {
                                                const hour = timeValue.hour();
                                                return hour < 9 || hour >= 17;
                                            }
                                            if (clockType === 'minutes') {
                                                const minute = timeValue.minute();
                                                return minute % SLOT_DURATION_MINUTES !== 0;
                                            }
                                            return false;
                                        }}
                                        shouldDisableDate={(date) => {
                                            const day = date.day();
                                            return day === 0 || day === 6; // Disable weekends
                                        }}
                                    // slotProps={{
                                    //     textField: {
                                    //         fullWidth: true,
                                    //         error: !!errors.appointmentDateTime,
                                    //         helperText: errors.appointmentDateTime?.message,
                                    //     },
                                    // }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Бутон за изпращане */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                {isSubmitting ? 'Резервиране...' : 'Резервирай час'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </LocalizationProvider>
    );
};