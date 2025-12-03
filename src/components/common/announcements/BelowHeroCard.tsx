import { Box, Typography, useTheme } from '@mui/material';
import type { AnnouncementType } from '../../../features/admin-panel/types/messages.types';

interface BelowHeroCardProps {
    title: string;
    content: string;
    type: AnnouncementType;
}

// Helper to get gradient for card header (mimics GradientCard)
const getGradient = (type: AnnouncementType, theme: any): string => {
    switch (type) {
        case 'alert':
            return `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`;
        case 'announcementPrimary':
            return `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;
        case 'announcementInfo':
            return `linear-gradient(135deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`;
        case 'warning':
            return `linear-gradient(135deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`;
    }
};

// Helper to get text color for card header
const getBannerColor = (type: AnnouncementType): string => {
    switch (type) {
        case 'warning':
            return 'warning.contrastText';
        default:
            return 'white';
    }
};

export function BelowHeroCard({ title, content, type }: BelowHeroCardProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                borderRadius: 1,
                bgcolor: 'background.paper',
                overflow: 'hidden',
                border: '1px solid #DDD',
            }}
        >
            <Box
                sx={{
                    background: getGradient(type, theme),
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: {
                            xs: theme.typography.body1.fontSize,
                            md: theme.typography.h6.fontSize,
                        },
                        color: getBannerColor(type),
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Typography variant="body1">{content}</Typography>
            </Box>
        </Box>
    );
}
