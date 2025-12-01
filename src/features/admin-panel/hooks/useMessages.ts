import { useState, useEffect, useCallback } from 'react';
import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '../types/messages.types';
import {
  getAnnouncements,
  createAnnouncement as createAnnouncementService,
  updateAnnouncement as updateAnnouncementService,
  deleteAnnouncement as deleteAnnouncementService,
  toggleAnnouncementStatus as toggleAnnouncementStatusService,
} from '../services/messagesService';

interface UseMessagesReturn {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  createAnnouncement: (data: CreateAnnouncementData) => Promise<string>;
  updateAnnouncement: (id: string, data: UpdateAnnouncementData) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  toggleStatus: (id: string, isActive: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing announcements/messages
 * Automatically loads all announcements on mount
 */
export function useMessages(): UseMessagesReturn {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load announcements on mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = useCallback(
    async (data: CreateAnnouncementData): Promise<string> => {
      try {
        setError(null);
        const id = await createAnnouncementService(data);
        await loadAnnouncements(); // Refresh list
        return id;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create announcement';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const updateAnnouncement = useCallback(
    async (id: string, data: UpdateAnnouncementData): Promise<void> => {
      try {
        setError(null);
        await updateAnnouncementService(id, data);
        await loadAnnouncements(); // Refresh list
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update announcement';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteAnnouncement = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteAnnouncementService(id);
      await loadAnnouncements(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete announcement';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const toggleStatus = useCallback(
    async (id: string, isActive: boolean): Promise<void> => {
      try {
        setError(null);
        await toggleAnnouncementStatusService(id, isActive);
        await loadAnnouncements(); // Refresh list
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to toggle announcement status';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    await loadAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleStatus,
    refresh,
  };
}
