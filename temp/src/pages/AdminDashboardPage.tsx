import { Container, Typography, Box } from '@mui/material';
import { TEXTS } from '../utils/constants';

const AdminDashboardPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {TEXTS.adminDashboard}
                </Typography>
            </Box>

            {/* Dashboard content will be added in next steps */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="500px"
                bgcolor="grey.100"
                borderRadius={2}
            >
                <Typography variant="h6" color="text.secondary">
                    Admin dashboard will be added here
                </Typography>
            </Box>
        </Container>
    );
};

export default AdminDashboardPage;