import { useState, useCallback } from 'react';
import type { Booking } from '../../../types/booking';
import {
  getBookings,
  cancelBooking,
  deleteBooking,
  getDashboardStats,
} from '../../../services/appointments';

interface DashboardStats {
  todayAppointments: number;
  weekAppointments: number;
  periodAppointments: number;
  totalAppointments: number;
}

interface UseAppointmentsReturn {
  appointments: Booking[];
  loading: boolean;
  error: string | null;
  stats: DashboardStats | null;
  loadAppointments: (startDate: Date, endDate: Date) => Promise<void>;
  loadStats: () => Promise<void>;
  cancelAppointment: (bookingId: string, reason?: string) => Promise<void>;
  deleteAppointment: (bookingId: string) => Promise<void>;
}

/**
 * Custom hook for managing appointments in admin panel
 */
export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getBookings(startDate, endDate);

      if (result.success && result.data) {
        setAppointments(result.data);
      } else {
        setError(result.error || 'Failed to load appointments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardStats();

      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(
    async (bookingId: string, reason?: string): Promise<void> => {
      try {
        setError(null);
        const result = await cancelBooking(bookingId, reason);

        if (!result.success) {
          throw new Error(result.error || 'Failed to cancel appointment');
        }

        // Update local state
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === bookingId ? { ...apt, status: 'cancelled' } : apt
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel appointment';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteAppointment = useCallback(async (bookingId: string): Promise<void> => {
    try {
      setError(null);
      const result = await deleteBooking(bookingId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete appointment');
      }

      // Update local state
      setAppointments((prev) => prev.filter((apt) => apt.id !== bookingId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete appointment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    stats,
    loadAppointments,
    loadStats,
    cancelAppointment,
    deleteAppointment,
  };
}
