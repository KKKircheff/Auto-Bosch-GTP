import { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import { getAnnouncementsByPosition } from '../../features/admin-panel/services/messagesService';
import type { Announcement, AnnouncementPosition } from '../../features/admin-panel/types/messages.types';
import { AboveHeroBanner } from './announcements/AboveHeroBanner';
import { BelowHeroCard } from './announcements/BelowHeroCard';

interface AnnouncementBannerProps {
    position: AnnouncementPosition;
}

export function AnnouncementBanner({ position }: AnnouncementBannerProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        loadAnnouncements();
    }, [position]);

    const loadAnnouncements = async () => {
        try {
            const data = await getAnnouncementsByPosition(position);
            setAnnouncements(data);
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    };

    if (announcements.length === 0) {
        return null;
    }

    // Render above-hero as simple banner
    if (position === 'above-hero') {
        return (
            <Stack spacing={0}>
                {announcements.map((announcement) => (
                    <AboveHeroBanner
                        key={announcement.id}
                        title={announcement.title}
                        content={announcement.content}
                        type={announcement.type}
                    />
                ))}
            </Stack>
        );
    }

    // Render below-hero as cards
    return (
        <Container maxWidth='xl' sx={{ pt: { xs: 6, md: 12 }, pb: { xs: 0, md: 6 } }}>
            <Stack spacing={2}>
                {announcements.map((announcement) => (
                    <BelowHeroCard
                        key={announcement.id}
                        title={announcement.title}
                        content={announcement.content}
                        type={announcement.type}
                    />
                ))}
            </Stack>
        </Container>
    );
}
