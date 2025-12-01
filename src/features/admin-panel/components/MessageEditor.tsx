import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormLabel,
  Box,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import type { AnnouncementType } from '../types/messages.types';

const messageSchema = z.object({
  title: z.string().min(1, 'Заглавието е задължително').max(100, 'Максимум 100 символа'),
  content: z.string().min(1, 'Съдържанието е задължително').max(500, 'Максимум 500 символа'),
  type: z.enum(['info', 'warning', 'success', 'error']),
  position: z.enum(['above-hero', 'below-hero']),
  isActive: z.boolean(),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface MessageEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MessageFormData) => Promise<void>;
  initialData?: Partial<MessageFormData>;
  title?: string;
}

const typeLabels: Record<AnnouncementType, string> = {
  info: 'Информация',
  warning: 'Предупреждение',
  success: 'Успех',
  error: 'Грешка',
};

export function MessageEditor({ open, onClose, onSave, initialData, title = 'Ново съобщение' }: MessageEditorProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      type: initialData?.type || 'info',
      position: initialData?.position || 'above-hero',
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (error) {
      // Error will be shown by parent component
      console.error('Error saving message:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Заглавие"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Content */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Съдържание"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!errors.content}
                  helperText={errors.content?.message || `${field.value.length}/500 символа`}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Type */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Тип съобщение</InputLabel>
                  <Select {...field} label="Тип съобщение" disabled={isSubmitting}>
                    {(Object.keys(typeLabels) as AnnouncementType[]).map((type) => (
                      <MenuItem key={type} value={type}>
                        {typeLabels[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Position */}
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Позиция на страницата</FormLabel>
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="above-hero"
                      control={<Radio />}
                      label="Над началото"
                      disabled={isSubmitting}
                    />
                    <FormControlLabel
                      value="below-hero"
                      control={<Radio />}
                      label="Под началото"
                      disabled={isSubmitting}
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />

            {/* Active Toggle */}
            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={value} onChange={onChange} disabled={isSubmitting} />}
                  label="Активно (видимо на сайта)"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} startIcon={<CloseIcon />}>
            Отказ
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<SaveIcon />}>
            {isSubmitting ? 'Записване...' : 'Запази'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
