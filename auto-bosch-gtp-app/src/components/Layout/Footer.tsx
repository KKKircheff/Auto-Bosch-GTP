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
                            Информация за контакт
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
                            <Typography variant="body2">София, България</Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Работно време
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Понеделник - Петък: 09:00 - 17:00
                        </Typography>
                        <Typography variant="body2">
                            Събота - Неделя: Почивни дни
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Услуги
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Технически прегледи на автомобили
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Проверки на газови уредби
                        </Typography>
                        <Typography variant="body2">
                            • Всички видове превозни средства са добре дошли
                        </Typography>
                    </Grid>
                </Grid>

                <Box textAlign="center" pt={3} borderTop={1} borderColor="divider" mt={3}>
                    <Typography variant="body2" color="text.secondary">
                        © 2025 Автосервиз. Всички права запазени.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};