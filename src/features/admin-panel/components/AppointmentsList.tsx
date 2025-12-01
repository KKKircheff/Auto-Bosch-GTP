import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import type { Booking, BookingStatus } from '../../../types/booking';
import { VEHICLE_TYPES } from '../../../utils/constants';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { AppointmentEditModal } from './AppointmentEditModal';

interface AppointmentsListProps {
  appointments: Booking[];
  loading: boolean;
  error: string | null;
  onEdit: (appointmentId: string, updates: Partial<Booking>) => Promise<void>;
  onCancel: (appointmentId: string, reason?: string) => Promise<void>;
  onDelete: (appointmentId: string) => Promise<void>;
}

export function AppointmentsList({
  appointments,
  loading,
  error,
  onEdit,
  onCancel,
  onDelete,
}: AppointmentsListProps) {
  const [editingAppointment, setEditingAppointment] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      !searchTerm ||
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm);

    const matchesDate =
      !filterDate || format(apt.appointmentDate, 'yyyy-MM-dd') === filterDate;

    return matchesSearch && matchesDate;
  });

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedAppointmentId) {
      await onCancel(selectedAppointmentId, cancelReason);
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
      setCancelReason('');
    }
  };

  const handleDeleteClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAppointmentId) {
      await onDelete(selectedAppointmentId);
      setDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const getStatusChip = (status: BookingStatus) => {
    const statusConfig = {
      confirmed: { label: 'Потвърдено', color: 'success' as const },
      cancelled: { label: 'Отказано', color: 'error' as const },
    };

    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading && appointments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Търсене"
              placeholder="Име, телефон, рег. номер..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Филтър по дата"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Показани {filteredAppointments.length} от {appointments.length} записвания
      </Typography>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <Alert severity="info">Няма записвания, които отговарят на филтрите.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата и час</TableCell>
                <TableCell>Клиент</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Рег. номер</TableCell>
                <TableCell>Тип МПС</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {format(appointment.appointmentDate, 'dd MMM yyyy', { locale: bg })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appointment.appointmentTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{appointment.customerName}</Typography>
                    {appointment.vehicleBrand && (
                      <Typography variant="caption" color="text.secondary">
                        {appointment.vehicleBrand}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>
                    <strong>{appointment.registrationPlate}</strong>
                  </TableCell>
                  <TableCell>{VEHICLE_TYPES[appointment.vehicleType]}</TableCell>
                  <TableCell align="right">
                    <strong>{appointment.price} лв</strong>
                  </TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Редактирай">
                        <IconButton
                          size="small"
                          onClick={() => setEditingAppointment(appointment)}
                          disabled={appointment.status === 'cancelled'}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Откажи">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleCancelClick(appointment.id)}
                          disabled={appointment.status === 'cancelled'}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Изтрий">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(appointment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Modal */}
      <AppointmentEditModal
        open={!!editingAppointment}
        appointment={editingAppointment}
        onClose={() => setEditingAppointment(null)}
        onSave={onEdit}
      />

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Отказване на записване</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Сигурни ли сте, че искате да откажете това записване?
          </DialogContentText>
          <TextField
            label="Причина (опционално)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleCancelConfirm} color="warning" variant="contained">
            Откажи записването
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Изтриване на записване</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Сигурни ли сте, че искате да изтриете това записване? Действието не може да бъде отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
