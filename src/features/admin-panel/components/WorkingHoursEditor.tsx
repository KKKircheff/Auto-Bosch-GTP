import { useState } from 'react';
import {
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Grid,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { AdminButton } from '../../../components/common/buttons';
import type { WorkingHours, WeekDay } from '../types/settings.types';

interface WorkingHoursEditorProps {
  workingHours: WorkingHours;
  workingDays: WeekDay[];
  bookingWindowWeeks: number;
  onSave: (hours: WorkingHours, days: WeekDay[], windowWeeks: number) => Promise<void>;
  disabled?: boolean;
}

const weekDayLabels: Record<WeekDay, string> = {
  monday: 'Понеделник',
  tuesday: 'Вторник',
  wednesday: 'Сряда',
  thursday: 'Четвъртък',
  friday: 'Петък',
  saturday: 'Събота',
  sunday: 'Неделя',
};

const allWeekDays: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function WorkingHoursEditor({
  workingHours,
  workingDays,
  bookingWindowWeeks,
  onSave,
  disabled,
}: WorkingHoursEditorProps) {
  const [editedHours, setEditedHours] = useState<WorkingHours>(workingHours);
  const [editedDays, setEditedDays] = useState<WeekDay[]>(workingDays);
  const [editedWindowWeeks, setEditedWindowWeeks] = useState(bookingWindowWeeks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDayToggle = (day: WeekDay) => {
    setEditedDays((prev) => {
      if (prev.includes(day)) {
        // Must have at least one working day
        if (prev.length === 1) {
          setError('Трябва да има поне един работен ден');
          return prev;
        }
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleSave = async () => {
    // Validation
    if (editedDays.length === 0) {
      setError('Трябва да има поне един работен ден');
      return;
    }

    if (editedWindowWeeks < 1 || editedWindowWeeks > 52) {
      setError('Периодът за записване трябва да е между 1 и 52 седмици');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await onSave(editedHours, editedDays, editedWindowWeeks);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при записване');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(editedHours) !== JSON.stringify(workingHours) ||
    JSON.stringify(editedDays.sort()) !== JSON.stringify(workingDays.sort()) ||
    editedWindowWeeks !== bookingWindowWeeks;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Работното време е записано успешно!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Working Hours */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Начален час"
            type="time"
            value={editedHours.start}
            onChange={(e) => setEditedHours({ ...editedHours, start: e.target.value })}
            disabled={disabled || saving}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Краен час"
            type="time"
            value={editedHours.end}
            onChange={(e) => setEditedHours({ ...editedHours, end: e.target.value })}
            disabled={disabled || saving}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        {/* Working Days */}
        <Grid size={12}>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ fontWeight: 'medium', mb: 1 }}>Работни дни:</Box>
            <FormGroup row>
              {allWeekDays.map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={editedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      disabled={disabled || saving}
                    />
                  }
                  label={weekDayLabels[day]}
                />
              ))}
            </FormGroup>
          </Box>
        </Grid>

        {/* Booking Window */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Период за записване (седмици напред)"
            type="number"
            value={editedWindowWeeks}
            onChange={(e) => setEditedWindowWeeks(parseInt(e.target.value, 10))}
            disabled={disabled || saving}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 52, step: 1 } }}
            helperText="Колко седмици напред клиентите могат да запазват час"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <AdminButton
          adminVariant="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || disabled || saving}
        >
          {saving ? 'Записване...' : 'Запази промените'}
        </AdminButton>
      </Box>
    </Box>
  );
}
