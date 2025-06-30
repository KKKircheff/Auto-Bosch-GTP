import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
} from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';

export const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                py: 3,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Info
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Phone fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">+359 888 123 456</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Email fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">info@cargarage.bg</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <LocationOn fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Sofia, Bulgaria</Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Working Hours
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Monday - Friday: 09:00 - 17:00
                        </Typography>
                        <Typography variant="body2">
                            Saturday - Sunday: Closed
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Services
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Vehicle Technical Inspections
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • LPG Installation Checks
                        </Typography>
                        <Typography variant="body2">
                            • All Vehicle Types Welcome
                        </Typography>
                    </Grid>
                </Grid>

                <Box textAlign="center" pt={3} borderTop={1} borderColor="divider" mt={3}>
                    <Typography variant="body2" color="text.secondary">
                        © 2025 Car Garage. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};