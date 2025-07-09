// src/components/common/ProtectedRoute.tsx (Updated)
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
                gap={2}
            >
                <CircularProgress size={40} />
                <Typography variant="body1" color="text.secondary">
                    Проверка на достъпа...
                </Typography>
            </Box>
        );
    }

    if (!user) {
        // Redirect to login with return path
        return (
            <Navigate
                to="/admin/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;