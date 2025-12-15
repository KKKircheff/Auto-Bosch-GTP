import { useState, useMemo, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Alert,
    Typography,
    Paper,
    Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { bg } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import { Delete as DeleteIcon, Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { AdminButton } from '../../../components/common/buttons';
import type { ClosedDay } from '../types/settings.types';
import { isPastDate, isWithinBookingWindow, getMaxBookingDate } from '../../../utils/dateHelpers';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';

interface ClosedDaysEditorProps {
    closedDays: ClosedDay[];
    onSave: (closedDays: ClosedDay[]) => Promise<void>;
    disabled?: boolean;
}

const STRINGS = {
    title: 'Добавяне на неработен ден',
    addButton: 'Добави ден',
    deleteButton: 'Изтрий',
    saveButton: 'Запази',
    closedDaysLabel: 'Неработни дни:',
    noClosedDays: 'Няма маркирани неработни дни',
    appointmentsWarning: '({count} часа)',
    errorPastDate: 'Не може да маркирате минал ден като неработен',
    errorDuplicate: 'Този ден вече е маркиран като неработен',
    errorOutOfRange: 'Датата е извън разрешения период за записване',
    successSaved: 'Неработните дни са записани успешно!',
    selectDateLabel: 'Изберете дата',
};

export function ClosedDaysEditor({ closedDays, onSave, disabled }: ClosedDaysEditorProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [editedClosedDays, setEditedClosedDays] = useState<ClosedDay[]>(closedDays);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { settings } = useBusinessSettings();

    const bookingWindowWeeks = settings?.bookingWindowWeeks || 8;
    const maxDate = getMaxBookingDate(bookingWindowWeeks);

    // Sync local state with props when they change (e.g., after saving)
    useEffect(() => {
        setEditedClosedDays(closedDays);
    }, [closedDays]);

    const validateClosedDay = (date: Date): string | null => {
        if (isPastDate(date)) {
            return STRINGS.errorPastDate;
        }
        if (!isWithinBookingWindow(date, bookingWindowWeeks)) {
            return STRINGS.errorOutOfRange;
        }
        if (editedClosedDays.some(cd => isSameDay(new Date(cd.date), date))) {
            return STRINGS.errorDuplicate;
        }
        return null;
    };

    const handleAddClosedDay = () => {
        if (!selectedDate) return;

        const validationError = validateClosedDay(selectedDate);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        const newClosedDay: ClosedDay = {
            date: selectedDate,
        };
        setEditedClosedDays([...editedClosedDays, newClosedDay]);
        setSelectedDate(null);
    };

    const handleDeleteClosedDay = (index: number) => {
        const updated = editedClosedDays.filter((_, i) => i !== index);
        setEditedClosedDays(updated);
        setError(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(false);
            await onSave(editedClosedDays);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при записване');
        } finally {
            setSaving(false);
        }
    };

    // Sort closed days: future dates first, then by date ascending
    const sortedClosedDays = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return [...editedClosedDays].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            dateA.setHours(0, 0, 0, 0);
            dateB.setHours(0, 0, 0, 0);

            const aIsFuture = dateA >= today;
            const bIsFuture = dateB >= today;

            if (aIsFuture && !bIsFuture) return -1;
            if (!aIsFuture && bIsFuture) return 1;

            return dateA.getTime() - dateB.getTime();
        });
    }, [editedClosedDays]);

    const hasChanges = useMemo(() => {
        if (closedDays.length !== editedClosedDays.length) return true;

        const originalDates = closedDays.map(cd =>
            format(new Date(cd.date), 'yyyy-MM-dd')
        ).sort();
        const editedDates = editedClosedDays.map(cd =>
            format(new Date(cd.date), 'yyyy-MM-dd')
        ).sort();

        return JSON.stringify(originalDates) !== JSON.stringify(editedDates);
    }, [closedDays, editedClosedDays]);

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
                    {STRINGS.successSaved}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ px: { xs: .6, md: 2 }, py: 2, mb: 3 }}>
                <Typography variant="subtitle2" pb={3}>
                    {STRINGS.title}
                </Typography>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems='center'
                    flexWrap='wrap'
                    spacing={4}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                        <MobileDatePicker
                            label={STRINGS.selectDateLabel}
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                                setError(null);
                            }}
                            minDate={new Date()}
                            maxDate={maxDate}
                            disabled={disabled || saving}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: { minWidth: 200 },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <AdminButton
                        adminVariant="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddClosedDay}
                        disabled={!selectedDate || disabled || saving}
                        sx={{
                            py: 1.2
                        }}
                    >
                        {STRINGS.addButton}
                    </AdminButton>
                </Stack>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom pb={1.5}>
                    {STRINGS.closedDaysLabel}
                </Typography>
                {sortedClosedDays.length === 0 ? (
                    <Alert severity="info">{STRINGS.noClosedDays}</Alert>
                ) : (
                    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                        <List disablePadding >
                            {sortedClosedDays.map((closedDay, index) => {
                                const originalIndex = editedClosedDays.findIndex(cd => cd === closedDay);
                                const date = new Date(closedDay.date);
                                const dateStr = format(date, 'd MMMM yyyy', { locale: bg });
                                const isPast = isPastDate(date);

                                return (
                                    <ListItem
                                        key={originalIndex}
                                        divider={index < sortedClosedDays.length - 1}

                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label={STRINGS.deleteButton}
                                                onClick={() => handleDeleteClosedDay(originalIndex)}
                                                disabled={disabled || saving}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        sx={{
                                            opacity: isPast ? 0.6 : 1,
                                            // bgcolor: isPast ? 'action.hover' : 'transparent',
                                            bgcolor: isPast ? 'background.default' : 'rgba(255, 0, 0, 0.03)',
                                        }}
                                    >
                                        <ListItemText
                                            primary={dateStr}
                                            secondary={isPast ? 'Минал ден' : undefined}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AdminButton
                    adminVariant="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!hasChanges || disabled || saving}
                >
                    {saving ? 'Записване...' : STRINGS.saveButton}
                </AdminButton>
            </Box>
        </Box>
    );
}
