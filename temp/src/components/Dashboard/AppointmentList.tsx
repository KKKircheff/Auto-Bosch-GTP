import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { deleteAppointment } from '../../services/appointmentService';
import { formatDateTime } from '../../utils/helpers';
import { SERVICE_TYPE_OPTIONS } from '../../types/appointment';
import type { Appointment } from '../../types/appointment';

interface AppointmentListProps {
  appointments: Appointment[];
  loading: boolean;
  onRefresh: () => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  loading,
  onRefresh,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getServiceTypeLabel = (serviceType: string) => {
    return SERVICE_TYPE_OPTIONS.find(option => option.value === serviceType)?.label || serviceType;
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAppointment) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAppointment(selectedAppointment.id);
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
      onRefresh();
    } catch (error) {
      setDeleteError('Failed to delete appointment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedAppointment(null);
    setDeleteError(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppointments = appointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Upcoming Appointments ({appointments.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Registration</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No appointments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {appointment.customerInfo.registrationPlate}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getServiceTypeLabel(appointment.vehicleInfo.serviceType)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {appointment.vehicleInfo.is4x4 && (
                      <Chip
                        label="4x4"
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.vehicleInfo.brand && (
                        <>
                          {appointment.vehicleInfo.brand}
                          {appointment.vehicleInfo.model && ` ${appointment.vehicleInfo.model}`}
                        </>
                      )}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.customerInfo.phoneNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appointment.customerInfo.email}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {appointment.price} BGN
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="Delete appointment">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(appointment)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          
          {selectedAppointment && (
            <Box>
              <Typography gutterBottom>
                Are you sure you want to delete this appointment?
              </Typography>
              
              <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {formatDateTime(selectedAppointment.appointmentDateTime)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Registration:</strong> {selectedAppointment.customerInfo.registrationPlate}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Service:</strong> {getServiceTypeLabel(selectedAppointment.vehicleInfo.serviceType)}
                </Typography>
                <Typography variant="body2">
                  <strong>Customer:</strong> {selectedAppointment.customerInfo.phoneNumber}
                </Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone. The customer will need to rebook if needed.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
