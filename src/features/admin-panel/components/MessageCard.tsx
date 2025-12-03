import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Box,
    Tooltip,
    Stack,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import type { Announcement } from '../types/messages.types';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { AboveHeroBanner } from '../../../components/common/announcements/AboveHeroBanner';
import { BelowHeroCard } from '../../../components/common/announcements/BelowHeroCard';

interface MessageCardProps {
    message: Announcement;
    onEdit: (message: Announcement) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, isActive: boolean) => void;
}

const positionLabels: Record<Announcement['position'], string> = {
    'above-hero': 'Над началото',
    'below-hero': 'Под началото',
};

export function MessageCard({ message, onEdit, onDelete, onToggleStatus }: MessageCardProps) {
    const handleToggle = () => {
        onToggleStatus(message.id, !message.isActive);
    };

    return (
        <Card variant="outlined" sx={{ p: { xs: 0, md: 2 }, mb: 2 }}>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' alignItems='flex-start' mb={2} spacing={1} >
                    <Typography variant="caption" color="text.secondary">
                        Създадено: {format(message.createdAt, 'dd MMM yyyy, HH:mm', { locale: bg })}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={message.isActive ? 'Активно' : 'Неактивно'}
                            color={message.isActive ? 'success' : 'default'}
                            size="small"
                        />
                        <Chip label={positionLabels[message.position]} size="small" variant="outlined" />
                    </Box>
                </Stack>

                {/* Preview - mimics how it will appear on the site */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Преглед:
                </Typography>

                <Box sx={{ mb: 1 }}>
                    {message.position === 'above-hero' ? (
                        <AboveHeroBanner
                            title={message.title}
                            content={message.content}
                            type={message.type}
                        />
                    ) : (
                        <BelowHeroCard
                            title={message.title}
                            content={message.content}
                            type={message.type}
                        />
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Tooltip title={message.isActive ? 'Скрий' : 'Покажи'}>
                    <IconButton size="small" onClick={handleToggle} color={message.isActive ? 'primary' : 'default'}>
                        {message.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Редактирай">
                    <IconButton size="small" onClick={() => onEdit(message)} color="primary">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Изтрий">
                    <IconButton size="small" onClick={() => onDelete(message.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
