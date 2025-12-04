import { useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    alpha,
    IconButton,
    Tooltip,
    Snackbar,
    Stack,
} from '@mui/material';
import { AccessTime, CheckCircle, Refresh, Delete } from '@mui/icons-material';
import { formatDateBulgarian, isBookableDate, isClosedDay } from '../../utils/dateHelpers';
import { VEHICLE_TYPES } from '../../utils/constants';
import { deleteBooking } from '../../services/appointments';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import DeleteBookingDialog from './DeleteBookingDialog';
import type { TimeSlot } from '../../types/booking';
import { theme } from '../../theme/theme';
import { GradientCard } from '../common/cards';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

interface TimeSlotPickerProps {
    selectedDate: Date | null;
    selectedTime?: string;
    onTimeSelect: (time: string) => void;
    timeSlots: TimeSlot[];
    loading?: boolean;
    error?: string;
    onRefresh?: () => void;
    onRefreshAppointmentCounts?: () => void;
    className?: string;
}

const TimeSlotPicker = ({
    selectedDate,
    selectedTime,
    onTimeSelect,
    timeSlots = [],
    loading = false,
    error,
    onRefresh,
    onRefreshAppointmentCounts,
    className,
}: TimeSlotPickerProps) => {
    const { user } = useAuth();
    const { settings } = useBusinessSettings();
    const { snackbar, hideSnackbar, showSuccess, showError } = useSnackbar();
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        timeSlot: TimeSlot | null;
    }>({ open: false, timeSlot: null });
    const [deletingSlot, setDeletingSlot] = useState<string | null>(null);

    // Group time slots by morning/afternoon
    const groupedSlots = useMemo(() => {
        const morning: TimeSlot[] = [];
        const afternoon: TimeSlot[] = [];

        timeSlots.forEach(slot => {
            const hour = parseInt(slot.time.split(':')[0]);
            if (hour < 12) {
                morning.push(slot);
            } else {
                afternoon.push(slot);
            }
        });

        return { morning, afternoon };
    }, [timeSlots]);

    // Count available slots
    const availableCount = timeSlots.filter(slot => slot.available).length;
    const totalCount = timeSlots.length;

    // Handle delete booking
    const handleDeleteClick = (timeSlot: TimeSlot) => {
        setDeleteDialog({ open: true, timeSlot });
    };

    const handleDeleteConfirm = async () => {
        const { timeSlot } = deleteDialog;
        if (!timeSlot?.bookingId) return;

        setDeletingSlot(timeSlot.time);

        try {
            const result = await deleteBooking(timeSlot.bookingId);

            if (result.success) {
                showSuccess('Записването е успешно изтрито');
                // Refresh both time slots and appointment counts to update calendar dots
                if (onRefresh) {
                    onRefresh();
                }
                if (onRefreshAppointmentCounts) {
                    onRefreshAppointmentCounts();
                }
            } else {
                showError(result.error || 'Възникна грешка при изтриване на записването');
            }
        } catch (err) {
            console.error('Delete booking error:', err);
            showError('Възникна неочаквана грешка при изтриване на записването');
        } finally {
            setDeletingSlot(null);
            setDeleteDialog({ open: false, timeSlot: null });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, timeSlot: null });
    };

    // Show loading state while date is being auto-selected
    if (!selectedDate) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }} className={className}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                    Търсене на първата свободна дата...
                </Typography>
            </Paper>
        );
    }

    if (selectedDate && settings?.closedDays && isClosedDay(selectedDate, settings.closedDays)) {
        return (
            <Paper elevation={2} sx={{ p: 3 }} className={className}>
                <Alert severity="info">
                    Избраният ден е затворен. Моля изберете друг ден.
                </Alert>
            </Paper>
        );
    }

    if (!isBookableDate(selectedDate)) {
        return (
            <Paper elevation={2} sx={{ p: 3 }} className={className}>
                <Alert severity="info">
                    Избраната дата не е работен ден или е в миналото.
                    Моля изберете друга дата (понеделник - петък).
                </Alert>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={2} sx={{ p: 3 }} className={className}>
                <Alert
                    severity="error"
                    action={
                        onRefresh && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={onRefresh}
                                startIcon={<Refresh />}
                            >
                                Опитай отново
                            </Button>
                        )
                    }
                >
                    {error}
                </Alert>
            </Paper>
        );
    }

    if (loading) {
        return (
            <GradientCard title="Налични часове" titleVariant="red" sx={{ minWidth: '100%', minHeight: '60vh' }} className={className}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={8}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        Зареждане на свободни часове...
                    </Typography>
                </Box>
            </GradientCard>
        );
    }

    // Time slot button component
    const TimeSlotButton = ({ slot }: { slot: TimeSlot }) => {
        const isSelected = selectedTime === slot.time;
        const isAvailable = slot.available;
        const isDeleting = deletingSlot === slot.time;
        const isAdmin = !!user;

        if (!isAvailable && slot.booking && user) {
            // Unavailable slot with booking info - show with delete button for admin
            return (
                <Box
                    sx={{
                        position: 'relative',
                        border: 1,
                        borderColor: 'error.light',
                        borderRadius: 1,
                        p: 1.5,
                        bgcolor: alpha(theme.palette.error.light, 0.1),
                    }}
                >
                    <Typography variant="body2" color="error.dark" fontWeight={600} gutterBottom>
                        {slot.time} - Запазен час
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                        {slot.booking.customerName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                        {slot.booking.registrationPlate}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                        {VEHICLE_TYPES[slot.booking.vehicleType]}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                        {slot.booking.vehicleBrand}{'  '}{slot.booking.is4x4 ? 'Задвижване 4x4' : ''}
                    </Typography>

                    {isAdmin && (
                        <Tooltip title="Изтрий записването">
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(slot)}
                                disabled={isDeleting}
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': {
                                        bgcolor: 'error.light',
                                        color: 'white',
                                    },
                                }}
                            >
                                {isDeleting ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <Delete fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            );
        }

        // Available slot - regular button
        return (
            <Button
                variant={isSelected ? 'contained' : 'outlined'}
                onClick={() => isAvailable && onTimeSelect(slot.time)}
                disabled={!isAvailable}
                fullWidth
                sx={{
                    minHeight: 56,
                    minWidth: '60px',
                    fontSize: '1rem',
                    fontWeight: isSelected ? 600 : 500,
                    borderRadius: 3,
                    borderWidth: 1.7,
                    borderColor: isAvailable ? 'primary.main' : 'text.disabled',
                    color: isSelected
                        ? 'warning.main'
                        : isAvailable
                            ? 'primary.main'
                            : 'text.disabled',
                    bgcolor: isSelected
                        ? 'primary.main'
                        : 'transparent',
                    '&:hover': {
                        bgcolor: isSelected
                            ? 'primary.dark'
                            : isAvailable
                                ? alpha(theme.palette.primary.main, 0.04)
                                : 'transparent',
                        borderColor: isAvailable ? 'primary.dark' : 'text.disabled',
                        borderWidth: 2,
                    },
                    '&:disabled': {
                        borderColor: 'text.disabled',
                        color: 'text.disabled',
                    },
                }}
                startIcon={isSelected ? <CheckCircle /> : <AccessTime />}
            >
                {slot.time}
            </Button>
        );
    };

    const TimeSlotGroup = ({
        title,
        slots,
        icon
    }: {
        title: string;
        slots: TimeSlot[];
        icon?: React.ReactNode;
    }) => {
        if (slots.length === 0) return null;

        const availableInGroup = slots.filter(slot => slot.available).length;

        return (
            <Box mb={4}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" justifyContent="space-between" mb={2.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        {icon}
                        <Typography variant="h6" fontWeight="600" color="text.primary">
                            {title}
                        </Typography>
                    </Box>
                    <Chip
                        label={`${availableInGroup}/${slots.length} свободни`}
                        size="medium"
                        color={availableInGroup > 0 ? 'primary' : 'default'}
                        variant='outlined'
                        sx={{ fontWeight: 600 }}
                    />
                </Stack>

                <Grid container spacing={2}>
                    {slots.map((slot) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot.time}>
                            <TimeSlotButton slot={slot} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <>
            <GradientCard
                title={`Налични часове за ${formatDateBulgarian(selectedDate, 'dd MMMM yyyy')}`}
                titleVariant="red"
                className={className}
            >
                {/* Header */}
                <Box mb={3}>
                    {/* Availability summary */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            {availableCount} от {totalCount} часа са свободни
                        </Typography>

                        <Stack direction={{ xs: "column", sm: 'row' }} spacing={1} alignItems="center">
                            {selectedTime && (
                                <Chip
                                    label={`Избран час: ${selectedTime}`}
                                    color="primary"
                                    size="medium"
                                    icon={<CheckCircle />}
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            {onRefresh && (
                                <Button
                                    size="small"
                                    onClick={onRefresh}
                                    startIcon={<Refresh />}
                                    disabled={loading}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ py: .5, px: 2 }}
                                >
                                    Обнови
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    {/* Admin indicator */}
                    {user && (
                        <Stack
                            direction={'row'}
                            bgcolor={'primary.main'}
                            alignItems={'center'}
                            spacing={1}
                            sx={{
                                my: 6,
                                p: 1.2,
                                borderRadius: .5
                            }}
                        >
                            <Typography variant="body2" color='primary.contrastText'>
                                <AdminPanelSettingsOutlinedIcon />
                            </Typography>
                            <Typography variant="body2" color='primary.contrastText'>
                                Администраторски режим: Можете да изтривате записвания с иконата за изтриване
                            </Typography>
                        </Stack>
                    )}
                </Box>

                {/* Time slots */}
                {timeSlots.length === 0 ? (
                    <Alert severity="warning">
                        Няма налични часове за избраната дата.
                        Моля изберете друга дата от календара.
                    </Alert>
                ) : (
                    <Box>
                        <TimeSlotGroup
                            title="Сутрешни часове"
                            slots={groupedSlots.morning}
                            icon={<AccessTime sx={{ color: 'primary.main' }} />}
                        />

                        <TimeSlotGroup
                            title="Следобедни часове"
                            slots={groupedSlots.afternoon}
                            icon={<AccessTime sx={{ color: 'primary.main' }} />}
                        />
                    </Box>
                )}

                {/* Legend */}
                <Box mt={4} pt={3} borderTop={1} borderColor="divider">
                    <Typography variant="body2" color="text.primary" display="block" mb={2} fontWeight={600}>
                        Легенда:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                                Избран час
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                                Свободен час
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime sx={{ fontSize: 18, color: 'text.disabled' }} />
                            <Typography variant="body2" color="text.secondary">
                                Зает час
                            </Typography>
                        </Box>

                        {user && (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Delete sx={{ fontSize: 18, color: 'error.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Изтрий записването (админ)
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Selected time confirmation */}
                {selectedTime && (
                    <Box
                        mt={3}
                        p={2.5}
                        bgcolor={alpha(theme.palette.primary.light, .3)}
                        borderRadius={2}
                        textAlign="center"
                        border={1}
                        borderColor="primary.light"
                    >
                        <Typography variant="subtitle1" color="primary.dark" fontWeight={600}>
                            ✓ Избрахте час: {selectedTime} на {formatDateBulgarian(selectedDate, 'dd.MM.yyyy')}
                        </Typography>
                    </Box>
                )}
            </GradientCard>

            {/* Delete Confirmation Dialog */}
            <DeleteBookingDialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                timeSlot={deleteDialog.timeSlot}
                selectedDate={selectedDate}
                loading={!!deletingSlot}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TimeSlotPicker;