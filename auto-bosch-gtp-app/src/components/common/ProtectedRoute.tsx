import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;