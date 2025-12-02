import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BlackButton, RedButton } from '../../../components/common/buttons';

export const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <Stack
            direction={'column'}
            spacing={4}
            alignItems="center"
            justifyContent='center'
            py={8}
        >
            <Typography
                variant="h2"
                component="h1"
                gutterBottom
                color="text.primary"
                textAlign={{ xs: 'center' }}
                sx={{ fontWeight: 700 }}
            >
                Ауто Бош Сервиз Бургас
            </Typography>
            <Typography
                variant="h5"
                color="text.secondary"
                pb={4}
                textAlign={{ xs: 'center' }}
            >
                ГОДИШНИ ТЕХНИЧЕСКИ ПРЕГЛЕДИ
            </Typography>
            <RedButton
                variant="contained"
                size="large"
                onClick={() => navigate('/booking')}
            >
                Запази час
            </RedButton>
        </Stack>
    );
};
