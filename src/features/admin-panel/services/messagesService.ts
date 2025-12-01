import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../services/firebase';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from '../types/messages.types';

const ANNOUNCEMENTS_COLLECTION = 'announcements';

/**
 * Fetch all announcements
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      orderBy('displayOrder', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Announcement;
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw new Error('Failed to fetch announcements');
  }
}

/**
 * Fetch only active announcements
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Announcement;
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    return []; // Return empty array on error so homepage doesn't break
  }
}

/**
 * Fetch announcements by position
 */
export async function getAnnouncementsByPosition(
  position: 'above-hero' | 'below-hero'
): Promise<Announcement[]> {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where('isActive', '==', true),
      where('position', '==', position),
      orderBy('displayOrder', 'asc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Announcement;
    });
  } catch (error) {
    console.error(`Error fetching ${position} announcements:`, error);
    return [];
  }
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(
  data: CreateAnnouncementData
): Promise<string> {
  try {
    const now = Timestamp.now();

    // If no display order provided, get the highest order + 1
    let displayOrder = data.displayOrder ?? 0;
    if (displayOrder === 0) {
      const all = await getAnnouncements();
      displayOrder = all.length > 0
        ? Math.max(...all.map((a) => a.displayOrder)) + 1
        : 1;
    }

    const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
      title: data.title,
      content: data.content,
      type: data.type,
      isActive: data.isActive,
      position: data.position,
      displayOrder,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw new Error('Failed to create announcement');
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  id: string,
  data: UpdateAnnouncementData
): Promise<void> {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);

    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw new Error('Failed to update announcement');
  }
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw new Error('Failed to delete announcement');
  }
}

/**
 * Toggle announcement active status
 */
export async function toggleAnnouncementStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  try {
    await updateAnnouncement(id, { isActive });
  } catch (error) {
    console.error('Error toggling announcement status:', error);
    throw new Error('Failed to toggle announcement status');
  }
}

/**
 * Get a single announcement by ID
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Announcement;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw new Error('Failed to fetch announcement');
  }
}
