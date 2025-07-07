import React from 'react';
import { TextField } from '@mui/material';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type { BookingFormData } from '../../types/appointment';

interface RegistrationPlateInputProps {
    control: Control<BookingFormData>;
    errors: FieldErrors<BookingFormData>;
}

export const RegistrationPlateInput: React.FC<RegistrationPlateInputProps> = ({
    control,
    errors,
}) => {
    const handleInputChange = (value: string) => {
        return value
            .toUpperCase()
            .replace(/[^A-ZА-Я0-9]/g, '')
            .slice(0, 10);
    };

    return (
        <Controller
            name="registrationPlate"
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Регистрационен номер"
                    placeholder="A1234BC"
                    fullWidth
                    error={!!errors.registrationPlate}
                    onChange={(e) => {
                        const formatted = handleInputChange(e.target.value);
                        field.onChange(formatted);
                    }}
                />
            )}
        />
    );
};