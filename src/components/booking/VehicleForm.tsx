// src/components/booking/VehicleForm.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Stack,
    Grid,
    Chip,
    Alert,
    Autocomplete,
    alpha,
} from '@mui/material';
import { DirectionsCar, LocalShipping, TwoWheeler, LocalTaxi, AirportShuttle, RvHookup, Propane } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    VEHICLE_TYPES,
    getVehicleBrands,
    shouldShow4x4,
    shouldShowBrands,
    calculatePriceWithCurrencies,
    calculatePriceWithCurrenciesFromSettings,
    shadow1,
} from '../../utils/constants';
import { type BookingFormSchema, type VehicleType } from '../../types/booking';
import { theme } from '../../theme/theme';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';

// Create a partial schema for the vehicle form
const vehicleFormSchema = z.object({
    customerName: z
        .string()
        .min(2, 'Името трябва да бъде поне 2 символа')
        .max(50, 'Името не може да бъде повече от 50 символа')
        .optional(),

    email: z
        .string()
        .email('Невалиден имейл адрес')
        .optional()
        .or(z.literal('')),

    phone: z
        .string()
        .min(1, 'Телефонният номер е задължителен')
        .regex(
            /^(\+359|0)[0-9]{8,9}$/,
            'Невалиден телефонен номер (използвайте формат +359XXXXXXXXX или 0XXXXXXXXX)'
        )
        .optional(),

    registrationPlate: z
        .string()
        .min(1, 'Регистрационният номер е задължителен')
        .regex(
            /^[A-Za-z\u0400-\u04FF0-9\-]+$/,
            'Регистрационният номер може да съдържа само букви, цифри и тирета'
        )
        .optional(),

    vehicleType: z.enum(['car', 'bus', 'motorcycle', 'taxi', 'caravan', 'trailer', 'lpg']).optional(),

    vehicleBrand: z.string().optional(),

    is4x4: z.boolean().optional(),

    notes: z.string().max(500, 'Бележките не могат да бъдат повече от 500 символа').optional(),
});

type VehicleFormData = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
    onFormChange?: (data: Partial<BookingFormSchema>) => void;
    onValidationChange?: (isValid: boolean) => void;
    initialData?: Partial<BookingFormSchema>;
    className?: string;
}

const VehicleForm = ({
    onFormChange,
    onValidationChange,
    initialData,
    className,
}: VehicleFormProps) => {
    const [searchParams] = useSearchParams();
    const vehicleTypeFromUrl = searchParams.get('vehicleType') as VehicleType | null;
    const { settings, loading: settingsLoading } = useBusinessSettings();

    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | 'car'>(vehicleTypeFromUrl || 'car');
    const [priceInfo, setPriceInfo] = useState<{
        basePrice: number;
        basePriceEur: number;
        discount: number;
        discountEur: number;
        finalPrice: number;
        finalPriceEur: number;
        basePriceFormatted: string;
        discountFormatted: string;
        finalPriceFormatted: string;
    } | null>(null);

    // Form setup with validation
    const {
        control,
        watch,
        formState: { errors },
        setValue,
        trigger,
    } = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleFormSchema),
        mode: 'onChange',
        defaultValues: {
            customerName: initialData?.customerName || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            registrationPlate: initialData?.registrationPlate || '',
            vehicleType: vehicleTypeFromUrl || initialData?.vehicleType || undefined,
            vehicleBrand: initialData?.vehicleBrand || '',
            is4x4: initialData?.is4x4 || false,
            notes: initialData?.notes || '',
        },
    });

    // Watch form changes
    const watchedValues = watch();
    const vehicleType = watch('vehicleType');

    // Custom validation for required fields
    const isFormValid = () => {
        const requiredFieldsValid = !!(
            watchedValues.customerName &&
            watchedValues.phone &&
            watchedValues.registrationPlate &&
            watchedValues.vehicleType
        );

        const noErrors = Object.keys(errors).length === 0;

        return requiredFieldsValid && noErrors;
    };

    // Update vehicle type state and reset dependent fields
    useEffect(() => {
        if (vehicleType) {
            setSelectedVehicleType(vehicleType);

            // Reset brand and 4x4 when vehicle type changes
            if (!shouldShowBrands(vehicleType)) {
                setValue('vehicleBrand', '');
            }
            if (!shouldShow4x4(vehicleType)) {
                setValue('is4x4', false);
            }

            // Calculate price with currencies - use Firebase settings if available
            const pricing = settings?.prices && settings?.onlineDiscount !== undefined
                ? calculatePriceWithCurrenciesFromSettings(vehicleType, settings.prices, settings.onlineDiscount, true)
                : calculatePriceWithCurrencies(vehicleType, true);
            setPriceInfo(pricing);

            // Trigger validation for the vehicle type only
            trigger('vehicleType');
        } else {
            setSelectedVehicleType('car');
            setPriceInfo(null);
        }
    }, [vehicleType, setValue, trigger, settings]);

    // Notify parent of form changes
    useEffect(() => {
        if (onFormChange) {
            // Convert to BookingFormSchema format
            const formattedData: Partial<BookingFormSchema> = {
                customerName: watchedValues.customerName || '',
                email: watchedValues.email || '',
                phone: watchedValues.phone || '',
                registrationPlate: watchedValues.registrationPlate || '',
                vehicleType: watchedValues.vehicleType,
                vehicleBrand: watchedValues.vehicleBrand || '',
                is4x4: watchedValues.is4x4 || false,
                notes: watchedValues.notes || '',
            };
            onFormChange(formattedData);
        }
    }, [watchedValues, onFormChange]);

    // Notify parent of validation changes
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isFormValid());
        }
    }, [watchedValues, errors, onValidationChange]);

    // Get vehicle icon
    const getVehicleIcon = (type: VehicleType) => {
        switch (type) {
            case 'car':
                return <DirectionsCar />;
            case 'taxi':
                return <LocalTaxi />;
            case 'bus':
                return <LocalShipping />;
            case 'motorcycle':
                return <TwoWheeler />;
            case 'caravan':
                return <AirportShuttle />;
            case 'lpg':
                return <Propane />;
            case 'trailer':
                return <RvHookup />;
            default:
                return <DirectionsCar />;
        }
    };

    // Get available brands for current vehicle type
    const availableBrands = selectedVehicleType ? getVehicleBrands(selectedVehicleType) : [];

    return (
        <Paper sx={{ p: 4, boxShadow: shadow1, borderRadius: 4 }} className={className}>
            <Typography variant="h6" gutterBottom>
                Информация за превозното средство
            </Typography>

            <Stack spacing={3}>
                {/* Customer Information */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                        Данни на клиента
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="customerName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        color='info'
                                        label="Име и фамилия"
                                        required
                                        error={!!errors.customerName}
                                        helperText={errors.customerName?.message}
                                        placeholder="Въведете име и фамилия"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        color='info'
                                        label="Телефонен номер"
                                        required
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        placeholder="+359888123456 или 0888123456"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        color='info'
                                        fullWidth
                                        label="Имейл адрес (по желание)"
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        placeholder="example@email.bg"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="registrationPlate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        color='info'
                                        fullWidth
                                        label="Регистрационен номер"
                                        required
                                        error={!!errors.registrationPlate}
                                        helperText={errors.registrationPlate?.message}
                                        placeholder="A1234AB"
                                        sx={{ textTransform: 'uppercase' }}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Vehicle Information */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                        Информация за превозното средство
                    </Typography>

                    <Stack spacing={2}>
                        {/* Vehicle Type Selection */}
                        <Controller
                            name="vehicleType"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.vehicleType}>
                                    <InputLabel color='info'>Тип превозно средство</InputLabel>
                                    <Select
                                        {...field}
                                        color='info'
                                        label="Тип превозно средство"
                                        value={field.value || ''}
                                    >
                                        {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    {getVehicleIcon(key as VehicleType)}
                                                    <span>{label}</span>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.vehicleType && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.vehicleType.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />

                        {/* Conditional Brand Selection */}
                        {selectedVehicleType && shouldShowBrands(selectedVehicleType) && (
                            <Controller
                                name="vehicleBrand"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={availableBrands}
                                        value={field.value || ''}
                                        onChange={(_, value) => field.onChange(value || '')}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                color='info'
                                                {...params}
                                                label="Марка (по желание)"
                                                placeholder="Изберете или въведете марка"
                                                error={!!errors.vehicleBrand}
                                                helperText={errors.vehicleBrand?.message}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option}>
                                                {option}
                                            </li>
                                        )}
                                    />
                                )}
                            />
                        )}

                        {/* Conditional 4x4 Checkbox */}
                        {selectedVehicleType && shouldShow4x4(selectedVehicleType) && (
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
                                        label="4x4"
                                    />
                                )}
                            />
                        )}

                        {/* Notes */}
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    color='info'
                                    {...field}
                                    fullWidth
                                    label="Бележки (по желание)"
                                    multiline
                                    rows={3}
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                    placeholder="Допълнителна информация за прегледа..."
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* Price Information */}
                {priceInfo && !settingsLoading && (
                    <Alert
                        severity='success'
                        sx={{
                            mt: 2,
                            bgcolor: alpha(theme.palette.success.light, 0.1),
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2),
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                Информация за цената:
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">
                                    Базова цена за {VEHICLE_TYPES[selectedVehicleType]}:
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {priceInfo.basePriceFormatted}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="success.main">
                                    Отстъпка при онлайн записване:
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    -{priceInfo.discountFormatted}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                <Typography variant="subtitle2">
                                    Крайна цена:
                                </Typography>
                                <Chip
                                    label={priceInfo.finalPriceFormatted}
                                    color="primary"
                                    size="small"
                                />
                            </Stack>
                        </Stack>
                    </Alert>
                )}

                {/* Form Status */}
                {Object.keys(errors).length > 0 && (
                    <Alert severity="error">
                        <Typography variant="subtitle2" gutterBottom>
                            Моля поправете следните грешки:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>
                                    <Typography variant="body2" color="error">
                                        {error?.message}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}
            </Stack>
        </Paper>
    );
};

export default VehicleForm;