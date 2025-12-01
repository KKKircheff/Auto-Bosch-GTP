import { useEffect, useState } from 'react';
import { Typography, Alert } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';
import { AppointmentsList } from '../components/AppointmentsList';
import { useAppointments } from '../hooks/useAppointments';
import { updateBooking } from '../../../services/appointments';
import type { Booking } from '../../../types/booking';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';

export function AppointmentsPage() {
  const {
    appointments,
    loading,
    error,
    loadAppointments,
    cancelAppointment,
    deleteAppointment,
  } = useAppointments();
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Load appointments for current and next month on mount
  useEffect(() => {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(addMonths(today, 1));
    loadAppointments(startDate, endDate);
  }, [loadAppointments]);

  const handleEdit = async (appointmentId: string, updates: Partial<Booking>) => {
    try {
      setUpdateError(null);
      // The updateBooking function accepts Date objects and converts them internally
      // TypeScript expects BookingDocument but the function handles the conversion
      const result = await updateBooking(appointmentId, updates as any);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update appointment');
      }

      // Reload appointments
      const today = new Date();
      const startDate = startOfMonth(today);
      const endDate = endOfMonth(addMonths(today, 1));
      await loadAppointments(startDate, endDate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при актуализиране';
      setUpdateError(errorMessage);
      throw err; // Re-throw so the modal can show error too
    }
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Записвания
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Преглед и управление на записвания за прегледи
      </Typography>

      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>
          {updateError}
        </Alert>
      )}

      <AppointmentsList
        appointments={appointments}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onCancel={cancelAppointment}
        onDelete={deleteAppointment}
      />
    </AdminLayout>
  );
}
