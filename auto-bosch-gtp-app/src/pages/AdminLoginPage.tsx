import { Container, Typography, Box } from '@mui/material';
import { TEXTS } from '../utils/constants';

const AdminLoginPage = () => {
    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {TEXTS.adminLogin}
                </Typography>
            </Box>

            {/* Login form will be added in next steps */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
                bgcolor="grey.100"
                borderRadius={2}
            >
                <Typography variant="h6" color="text.secondary">
                    Admin login form will be added here
                </Typography>
            </Box>
        </Container>
    );
};

export default AdminLoginPage;
