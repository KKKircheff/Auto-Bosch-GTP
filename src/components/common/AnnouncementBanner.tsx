import { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Collapse, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getAnnouncementsByPosition } from '../../features/admin-panel/services/messagesService';
import type { Announcement, AnnouncementPosition } from '../../features/admin-panel/types/messages.types';

interface AnnouncementBannerProps {
  position: AnnouncementPosition;
}

const DISMISSED_KEY_PREFIX = 'announcement-dismissed-';

export function AnnouncementBanner({ position }: AnnouncementBannerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAnnouncements();
    loadDismissedIds();
  }, [position]);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncementsByPosition(position);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const loadDismissedIds = () => {
    const dismissed = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DISMISSED_KEY_PREFIX)) {
        const id = key.replace(DISMISSED_KEY_PREFIX, '');
        dismissed.add(id);
      }
    }
    setDismissedIds(dismissed);
  };

  const handleDismiss = (id: string) => {
    // Save to localStorage
    localStorage.setItem(`${DISMISSED_KEY_PREFIX}${id}`, 'true');
    // Update state
    setDismissedIds(new Set([...dismissedIds, id]));
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter((ann) => !dismissedIds.has(ann.id));

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      {visibleAnnouncements.map((announcement) => (
        <Collapse key={announcement.id} in={true}>
          <Alert
            severity={announcement.type}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleDismiss(announcement.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 1 }}
          >
            <AlertTitle>{announcement.title}</AlertTitle>
            {announcement.content}
          </Alert>
        </Collapse>
      ))}
    </Box>
  );
}
