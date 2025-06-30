import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/Dashboard/LoginForm';
import { AdminDashboard } from '../components/Dashboard/AdminDashboard';
import { CircularProgress, Box } from '@mui/material';

export const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <AdminDashboard /> : <LoginForm />;
};
