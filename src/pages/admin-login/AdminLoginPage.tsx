import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoginForm from '../../components/admin/LoginForm';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleLoginSuccess = () => {
        navigate('/admin/dashboard', { replace: true });
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    {/* Could add a loading spinner here */}
                </Box>
            </Container>
        );
    }

    if (user) {
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <LoginForm onSuccess={handleLoginSuccess} />
        </Container>
    );
};

export default AdminLoginPage;
