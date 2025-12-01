import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Booking } from '../../../types/booking';
import { VEHICLE_TYPES } from '../../../utils/constants';
import { format } from 'date-fns';

const editSchema = z.object({
  customerName: z.string().min(1, 'Името е задължително'),
  phone: z.string().min(10, 'Телефонът трябва да е минимум 10 цифри'),
  email: z.string().email('Невалиден имейл').optional().or(z.literal('')),
  vehicleBrand: z.string().optional(),
  notes: z.string().optional(),
  appointmentDate: z.string(), // Date as string for input[type="date"]
  appointmentTime: z.string(), // Time as string for input[type="time"]
});

type EditFormData = z.infer<typeof editSchema>;

interface AppointmentEditModalProps {
  open: boolean;
  appointment: Booking | null;
  onClose: () => void;
  onSave: (appointmentId: string, updates: Partial<Booking>) => Promise<void>;
}

export function AppointmentEditModal({ open, appointment, onClose, onSave }: AppointmentEditModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: appointment
      ? {
          customerName: appointment.customerName,
          phone: appointment.phone,
          email: appointment.email || '',
          vehicleBrand: appointment.vehicleBrand || '',
          notes: appointment.notes || '',
          appointmentDate: format(appointment.appointmentDate, 'yyyy-MM-dd'),
          appointmentTime: appointment.appointmentTime,
        }
      : undefined,
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const onSubmit = async (data: EditFormData) => {
    if (!appointment) return;

    try {
      const updates: Partial<Booking> = {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || '',
        vehicleBrand: data.vehicleBrand || '',
        notes: data.notes || '',
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
      };

      await onSave(appointment.id, updates);
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Редактиране на записване</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Customer Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Име на клиента"
                    fullWidth
                    required
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Телефон"
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Имейл"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Vehicle Brand */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="vehicleBrand"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Марка на автомобила"
                    fullWidth
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Vehicle Type (read-only) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Тип превозно средство"
                value={VEHICLE_TYPES[appointment.vehicleType]}
                fullWidth
                disabled
                helperText="Типът не може да се променя"
              />
            </Grid>

            {/* Registration Plate (read-only) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Рег. номер"
                value={appointment.registrationPlate}
                fullWidth
                disabled
                helperText="Рег. номерът не може да се променя"
              />
            </Grid>

            {/* Appointment Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дата"
                    type="date"
                    fullWidth
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.appointmentDate}
                    helperText={errors.appointmentDate?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Appointment Time */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="appointmentTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Час"
                    type="time"
                    fullWidth
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.appointmentTime}
                    helperText={errors.appointmentTime?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Бележки"
                    fullWidth
                    multiline
                    rows={3}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Price (read-only) */}
            <Grid size={12}>
              <Alert severity="info">
                Цена: <strong>{appointment.price} лв</strong> (не може да се променя)
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} startIcon={<CloseIcon />}>
            Отказ
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<SaveIcon />}>
            {isSubmitting ? 'Записване...' : 'Запази промените'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
