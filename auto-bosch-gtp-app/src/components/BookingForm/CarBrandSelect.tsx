import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { useCarBrands } from '../../hooks/useCarBrands';
import { BUS_BRANDS, MOTORCYCLE_BRANDS } from '../../types/appointment';
import type { BookingFormData, ServiceTypeValue } from '../../types/appointment';

interface CarBrandSelectProps {
    control: Control<BookingFormData>;
    errors: FieldErrors<BookingFormData>;
    serviceType: ServiceTypeValue;
}

export const CarBrandSelect: React.FC<CarBrandSelectProps> = ({
    control,
    errors,
    serviceType,
}) => {
    const { brands: carBrands, loading } = useCarBrands();

    const getBrandOptions = () => {
        switch (serviceType) {
            case 'car':
            case 'taxi':
                return carBrands.map(brand => ({ value: brand.make, label: brand.make }));
            case 'bus':
                return BUS_BRANDS.map(brand => ({ value: brand, label: brand }));
            case 'motorcycle':
                return MOTORCYCLE_BRANDS.map(brand => ({ value: brand, label: brand }));
            default:
                return [];
        }
    };

    const brandOptions = getBrandOptions();
    const shouldShow = ['car', 'taxi', 'bus', 'motorcycle'].includes(serviceType);

    if (!shouldShow) {
        return null;
    }

    return (
        <Controller
            name="brand"
            control={control}
            render={({ field }) => (
                <FormControl fullWidth error={!!errors.brand}>
                    <InputLabel id="brand-label">Марка</InputLabel>
                    <Select
                        {...field}
                        labelId="brand-label"
                        label="Марка"
                        disabled={loading}
                        value={field.value || ''}
                    >
                        {loading ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} />
                                <span style={{ marginLeft: 8 }}>Зареждане на марки...</span>
                            </MenuItem>
                        ) : (
                            brandOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                    {errors.brand && (
                        <FormHelperText>{errors.brand.message}</FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
};