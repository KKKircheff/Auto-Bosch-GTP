import { useState, useEffect } from 'react';
import type { BusinessSettings } from '../features/admin-panel/types/settings.types';
import { getBusinessSettingsWithFallback } from '../services/businessSettings';

interface UseBusinessSettingsReturn {
  settings: BusinessSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching business settings for public-facing components
 * Automatically loads settings on mount with fallback to defaults
 *
 * Usage:
 * const { settings, loading, error, refetch } = useBusinessSettings();
 */
export function useBusinessSettings(): UseBusinessSettingsReturn {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessSettingsWithFallback();
      setSettings(data);
    } catch (err) {
      // Silent error handling - set error but settings will have defaults
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      console.warn('Error loading business settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refetch = () => {
    loadSettings();
  };

  return {
    settings,
    loading,
    error,
    refetch,
  };
}
