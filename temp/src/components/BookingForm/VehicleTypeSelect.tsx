import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { SERVICE_TYPE_OPTIONS } from '../../types/appointment';
import type { BookingFormData } from '../../types/appointment';

interface VehicleTypeSelectProps {
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
}

export const VehicleTypeSelect: React.FC<VehicleTypeSelectProps> = ({
  control,
  errors,
}) => {
  return (
    <Controller
      name="serviceType"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.serviceType}>
          <InputLabel id="service-type-label">Service Type</InputLabel>
          <Select
            {...field}
            labelId="service-type-label"
            label="Service Type"
          >
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors.serviceType && (
            <FormHelperText>{errors.serviceType.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
