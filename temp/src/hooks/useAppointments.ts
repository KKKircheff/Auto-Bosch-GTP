import { useState, useEffect } from 'react';
import { getAppointments } from '../services/appointmentService';
import type { Appointment } from '../types/appointment';

export const useAppointments = (autoRefresh = false) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAppointments(new Date());
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Auto refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAppointments();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return {
    appointments,
    loading,
    error,
    refetch: loadAppointments,
  };
};
