import { Stack, Typography, useTheme } from '@mui/material';
import type { AnnouncementType } from '../../../features/admin-panel/types/messages.types';

interface AboveHeroBannerProps {
    title: string;
    content: string;
    type: AnnouncementType;
}

// Helper to get background color for banner
const getBannerBgColor = (type: AnnouncementType): string => {
    switch (type) {
        case 'alert':
            return 'secondary.main';
        case 'warning':
            return 'warning.main';
        case 'announcementPrimary':
            return 'primary.dark';
        case 'announcementInfo':
            return 'info.main';
    }
};

// Helper to get border color for banner
const getBannerBorderColor = (type: AnnouncementType): string => {
    switch (type) {
        case 'alert':
            return 'secondary.dark';
        case 'warning':
            return 'warning.dark';
        case 'announcementPrimary':
            return 'primary.dark';
        case 'announcementInfo':
            return 'info.dark';
    }
};

// Helper to get text color for banner
const getBannerColor = (type: AnnouncementType): string => {
    switch (type) {
        case 'warning':
            return 'warning.contrastText';
        default:
            return 'primary.contrastText';
    }
};

export function AboveHeroBanner({ title, content, type }: AboveHeroBannerProps) {
    const theme = useTheme();

    return (
        <Stack
            spacing={2}
            textAlign={'center'}
            sx={{
                width: '100%',
                bgcolor: getBannerBgColor(type),
                py: 3,
                px: 3,
                // borderBottom: `3px solid`,
                borderBottomColor: getBannerBorderColor(type),
                borderRadius: 0,
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontSize: {
                        xs: theme.typography.h4.fontSize,
                        md: theme.typography.h3.fontSize,
                    },
                    fontWeight: 600,
                    color: getBannerColor(type),
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    fontSize: {
                        xs: theme.typography.body1.fontSize,
                        md: theme.typography.h6.fontSize,
                    },
                    color: getBannerColor(type),
                }}
            >
                {content}
            </Typography>
        </Stack>
    );
}
