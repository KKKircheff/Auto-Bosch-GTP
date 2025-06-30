import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentList } from './AppointmentList';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { appointments, loading, error, refetch } = useAppointments(true);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.email}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && !appointments.length ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <AppointmentList
            appointments={appointments}
            loading={loading}
            onRefresh={refetch}
          />
        )}
      </Container>
    </Box>
  );
};
