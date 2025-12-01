import { useState, useEffect, useCallback } from 'react';
import type { BusinessSettings } from '../types/settings.types';
import {
  getSettingsWithFallback,
  updateSettings as updateSettingsService,
  initializeSettings,
} from '../services/settingsService';
import { useAuth } from '../../../contexts/AuthContext';

interface UseSettingsReturn {
  settings: BusinessSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Omit<BusinessSettings, 'updatedAt' | 'updatedBy'>) => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Custom hook for managing business settings
 * Automatically loads settings on mount with fallback to defaults
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettingsWithFallback();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = useCallback(
    async (newSettings: Omit<BusinessSettings, 'updatedAt' | 'updatedBy'>) => {
      if (!user) {
        throw new Error('Must be logged in to update settings');
      }

      try {
        setLoading(true);
        setError(null);
        await updateSettingsService(newSettings, user.id);
        await loadSettings(); // Reload to get updated timestamp
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const initialize = useCallback(async () => {
    if (!user) {
      throw new Error('Must be logged in to initialize settings');
    }

    try {
      setLoading(true);
      setError(null);
      await initializeSettings(user.id);
      await loadSettings();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    initialize,
  };
}
