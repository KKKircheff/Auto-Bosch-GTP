import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DirectionsCar, LocalShipping, TwoWheeler, LocalTaxi } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TEXTS,
    VEHICLE_TYPES,
    getVehicleBrands,
    shouldShow4x4,
    shouldShowBrands,
    calculatePrice,
} from '../../utils/constants';
import { bookingFormSchema, type BookingFormSchema, type VehicleType } from '../../types/booking';

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
    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | ''>('');
    const [priceInfo, setPriceInfo] = useState<{ basePrice: number; discount: number; finalPrice: number } | null>(null);

    // Form setup with validation
    const {
        control,
        watch,
        formState: { errors, isValid },
        setValue,
        trigger,
    } = useForm<BookingFormSchema>({
        resolver: zodResolver(bookingFormSchema.partial()),
        mode: 'onChange',
        defaultValues: {
            customerName: initialData?.customerName || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            registrationPlate: initialData?.registrationPlate || '',
            vehicleType: initialData?.vehicleType || undefined,
            vehicleBrand: initialData?.vehicleBrand || '',
            is4x4: initialData?.is4x4 || false,
            notes: initialData?.notes || '',
        },
    });

    // Watch form changes
    const watchedValues = watch();
    const vehicleType = watch('vehicleType');

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

            // Calculate price
            const pricing = calculatePrice(vehicleType, true);
            setPriceInfo(pricing);

            // Trigger validation
            trigger();
        } else {
            setSelectedVehicleType('');
            setPriceInfo(null);
        }
    }, [vehicleType, setValue, trigger]);

    // Notify parent of form changes
    useEffect(() => {
        if (onFormChange) {
            onFormChange(watchedValues);
        }
    }, [watchedValues, onFormChange]);

    // Notify parent of validation changes
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [isValid, onValidationChange]);

    // Get vehicle icon
    const getVehicleIcon = (type: VehicleType) => {
        switch (type) {
            case 'car':
            case 'taxi':
                return <DirectionsCar />;
            case 'bus':
                return <LocalShipping />;
            case 'motorcycle':
                return <TwoWheeler />;
            default:
                return <DirectionsCar />;
        }
    };

    // Get available brands for current vehicle type
    const availableBrands = selectedVehicleType ? getVehicleBrands(selectedVehicleType) : [];

    return (
        <Paper elevation={2} sx={{ p: 3 }} className={className}>
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
                                name="registrationPlate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label={TEXTS.registrationPlate}
                                        required
                                        error={!!errors.registrationPlate}
                                        helperText={errors.registrationPlate?.message}
                                        placeholder="A1234AB"
                                        // sx={{ textTransform: 'uppercase' }}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="customerName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label={TEXTS.customerName}
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
                                        label={TEXTS.phoneNumber}
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
                                        fullWidth
                                        label={TEXTS.emailOptional}
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        placeholder="example@email.bg"
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
                                    <InputLabel>{TEXTS.vehicleType}</InputLabel>
                                    <Select
                                        {...field}
                                        label={TEXTS.vehicleType}
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
                                                {...params}
                                                label={TEXTS.vehicleBrandOptional}
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
                                        label={TEXTS.is4x4}
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
                {priceInfo && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                Информация за цената:
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">
                                    Базова цена за {VEHICLE_TYPES[selectedVehicleType]}:
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {priceInfo.basePrice} лв
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="success.main">
                                    Отстъпка при онлайн записване:
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    -{priceInfo.discount} лв
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                <Typography variant="subtitle2">
                                    Крайна цена:
                                </Typography>
                                <Chip
                                    label={`${priceInfo.finalPrice} лв`}
                                    color="primary"
                                    size="small"
                                />
                            </Stack>
                        </Stack>
                    </Alert>
                )}

                {/* Form Status */}
                {Object.keys(errors).length > 0 && (
                    <Alert severity="warning">
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