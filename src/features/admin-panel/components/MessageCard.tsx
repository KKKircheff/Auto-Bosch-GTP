import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
  Alert,
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

interface MessageCardProps {
  message: Announcement;
  onEdit: (message: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

const typeColors: Record<Announcement['type'], 'info' | 'warning' | 'success' | 'error'> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'error',
};

const positionLabels: Record<Announcement['position'], string> = {
  'above-hero': 'Над началото',
  'below-hero': 'Под началото',
};

export function MessageCard({ message, onEdit, onDelete, onToggleStatus }: MessageCardProps) {
  const handleToggle = () => {
    onToggleStatus(message.id, !message.isActive);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {message.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {message.content}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 2 }}>
            <Chip
              label={message.isActive ? 'Активно' : 'Неактивно'}
              color={message.isActive ? 'success' : 'default'}
              size="small"
            />
            <Chip label={positionLabels[message.position]} size="small" variant="outlined" />
          </Box>
        </Box>

        {/* Preview */}
        <Alert severity={typeColors[message.type]} sx={{ mb: 1 }}>
          <Typography variant="subtitle2">{message.title}</Typography>
          <Typography variant="body2">{message.content}</Typography>
        </Alert>

        <Typography variant="caption" color="text.secondary">
          Създадено: {format(message.createdAt, 'dd MMM yyyy, HH:mm', { locale: bg })}
        </Typography>
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
