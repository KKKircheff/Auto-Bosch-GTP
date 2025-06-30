import React from 'react';
import { TextField } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
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
    // Auto-uppercase and basic formatting
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  return (
    <Controller
      name="registrationPlate"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Registration Plate"
          placeholder="A1234BC"
          fullWidth
          error={!!errors.registrationPlate}
          helperText={
            errors.registrationPlate?.message || 
            'Format: 1-2 letters + 4 numbers + 0-2 letters'
          }
          onChange={(e) => {
            const formatted = handleInputChange(e.target.value);
            field.onChange(formatted);
          }}
          inputProps={{
            maxLength: 8,
            style: { textTransform: 'uppercase' },
          }}
        />
      )}
    />
  );
};
