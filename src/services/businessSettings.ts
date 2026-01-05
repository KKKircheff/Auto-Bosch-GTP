import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { BusinessSettings } from '../features/admin-panel/types/settings.types';
import { DEFAULT_SETTINGS } from '../features/admin-panel/types/settings.types';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOCUMENT = 'business-config';

/**
 * Fetch business settings from Firestore
 * Returns null if document doesn't exist
 * This is a public read-only service for fetching settings (no auth required)
 */
export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    // Convert Firestore Timestamp to Date for updatedAt and closedDays
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate(),
      closedDays: data.closedDays?.map((closedDay: any) => ({
        ...closedDay,
        date: closedDay.date?.toDate?.() || closedDay.date,
      })) || [],
    } as BusinessSettings;
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return null;
  }
}

/**
 * Fetch settings with fallback to default constants
 * Now throws error when Firebase is unavailable - no automatic fallback to stale prices
 * This ensures users see 'N/A' instead of outdated hardcoded prices
 */
export async function getBusinessSettingsWithFallback(): Promise<BusinessSettings> {
  const settings = await getBusinessSettings();

  if (!settings) {
    throw new Error('Firebase settings not available');
  }

  return settings;
}
