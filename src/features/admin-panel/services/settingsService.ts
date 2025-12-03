import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import type { BusinessSettings } from '../types/settings.types';
import { DEFAULT_SETTINGS } from '../types/settings.types';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOCUMENT = 'business-config';

/**
 * Fetch business settings from Firestore
 * Returns null if document doesn't exist
 */
export async function getSettings(): Promise<BusinessSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    // Convert Firestore Timestamp to Date
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate(),
      closedDays: data.closedDays?.map((cd: any) => ({
        date: cd.date?.toDate(),
      })) || [],
    } as BusinessSettings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw new Error('Failed to fetch settings');
  }
}

/**
 * Fetch settings with fallback to default constants
 * This ensures the app always has settings to work with
 */
export async function getSettingsWithFallback(): Promise<BusinessSettings> {
  try {
    const settings = await getSettings();
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Error fetching settings, using defaults:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Update business settings in Firestore
 * @param settings - The settings to save
 * @param adminUid - The UID of the admin making the change
 */
export async function updateSettings(
  settings: Omit<BusinessSettings, 'updatedAt' | 'updatedBy'>,
  adminUid: string
): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT);

    const dataToSave = {
      ...settings,
      closedDays: settings.closedDays?.map(cd => ({
        date: Timestamp.fromDate(cd.date),
      })) || [],
      updatedAt: Timestamp.now(),
      updatedBy: adminUid,
    };

    await setDoc(docRef, dataToSave);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }
}

/**
 * Initialize settings with default values if they don't exist
 * Should be called once during admin setup
 */
export async function initializeSettings(adminUid: string): Promise<void> {
  try {
    const existing = await getSettings();

    if (!existing) {
      await updateSettings(DEFAULT_SETTINGS, adminUid);
      console.log('Settings initialized with default values');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw new Error('Failed to initialize settings');
  }
}
