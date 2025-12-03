// Announcement/Message Types

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  isActive: boolean;
  position: AnnouncementPosition;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type AnnouncementType = 'alert' | 'warning' | 'announcementPrimary' | 'announcementInfo';

export type AnnouncementPosition = 'above-hero' | 'below-hero';

// Data for creating a new announcement
export interface CreateAnnouncementData {
  title: string;
  content: string;
  type: AnnouncementType;
  isActive: boolean;
  position: AnnouncementPosition;
  displayOrder?: number;
}

// Data for updating an existing announcement
export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  type?: AnnouncementType;
  isActive?: boolean;
  position?: AnnouncementPosition;
  displayOrder?: number;
}
