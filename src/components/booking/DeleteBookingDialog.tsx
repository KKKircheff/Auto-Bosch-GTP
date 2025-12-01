// src/components/booking/DeleteBookingDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Chip,
    Divider,
    alpha,
} from '@mui/material';
import {
    Warning,
    Person,
    Phone,
    DirectionsCar,
    AccessTime,
    Receipt,
} from '@mui/icons-material';
import { VEHICLE_TYPES } from '../../utils/constants';
import type { TimeSlot } from '../../types/booking';
import { theme } from '../../theme/theme';

interface DeleteBookingDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    timeSlot: TimeSlot | null;
    selectedDate: Date | null;
    loading?: boolean;
}

const DeleteBookingDialog: React.FC<DeleteBookingDialogProps> = ({
    open,
    onClose,
    onConfirm,
    timeSlot,
    selectedDate,
    loading = false,
}) => {
    if (!timeSlot?.booking || !selectedDate) {
        return null;
    }

    const { booking } = timeSlot;
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('bg-BG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatVehicleInfo = () => {
        const parts: string[] = [VEHICLE_TYPES[booking.vehicleType]];
        if (booking.vehicleBrand) {
            parts.push(booking.vehicleBrand);
        }
        return parts.join(' - ');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Warning sx={{ color: 'warning.main', fontSize: 28 }} />
                    <Typography variant="h6" component="span">
                        Изтриване на резервация
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3}>
                    {/* Warning message */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.warning.light, 1),
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'warning.light',
                        }}
                    >
                        <Typography variant="body2" color="info.dark">
                            <strong>Внимание:</strong> Това действие ще изтрие резервацията окончателно и няма да може да бъде възстановена.
                        </Typography>
                    </Box>

                    {/* Booking details */}
                    <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                            Детайли
                        </Typography>

                        <Stack spacing={2}>
                            {/* Date and time */}
                            <Box display="flex" alignItems="center" gap={2}>
                                <AccessTime sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Дата и час
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(selectedDate)} в {timeSlot.time}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Customer info */}
                            <Box display="flex" alignItems="center" gap={2}>
                                <Person sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Клиент
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {booking.customerName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" gap={2}>
                                <Phone sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Телефон
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {booking.phone}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Vehicle info */}
                            <Box display="flex" alignItems="center" gap={2}>
                                <DirectionsCar sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Превозно средство
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatVehicleInfo()}
                                    </Typography>
                                    <Chip
                                        label={booking.registrationPlate}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mt: 0.5, borderRadius: 0.7 }}
                                    />
                                </Box>
                            </Box>

                            <Divider />

                            {/* Price */}
                            <Box display="flex" alignItems="center" gap={2}>
                                <Receipt sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Цена
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {booking.price} лв
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={loading}
                    size="large"
                >
                    Отказ
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    size="large"
                    startIcon={loading ? undefined : <Warning />}
                >
                    {loading ? 'Изтриване...' : 'Изтрий'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteBookingDialog;