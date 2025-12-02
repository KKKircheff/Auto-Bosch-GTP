import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BlackButton, RedButton } from '../../../components/common/buttons';
import { shadow2 } from '../../../utils/constants';

export const HeroSection = () => {
    const navigate = useNavigate();

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <Stack
            px={{ xs: 1, sm: 2, md: 4 }}
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: '91dvh', md: '75vw', xl: '1300px' },
                backgroundImage: 'url(/images/hero.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: { xs: 'space-between', md: 'flex-start' },
                py: 2,
            }}
        >
            <Stack
                spacing={{ xs: 2, md: 8 }}
                sx={{
                    backgroundColor: { xs: 'rgba(255, 255, 255, 0.2)', md: 'transparent' },
                    backdropFilter: { xs: 'blur(8px)', md: 'none' },
                    position: 'relative',
                    zIndex: 1,
                    textAlign: { xs: 'center', md: 'left' },
                    borderRadius: 2,
                    maxWidth: { xs: '100%', md: '1200px' },
                    py: 2
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 800,
                        color: 'info.main',
                        mb: 1,
                        fontSize: 'clamp(1rem, 11vw, 10rem)',
                        lineHeight: 'clamp(1rem, 13vw, 10rem)',
                    }}
                >
                    Ауто Бош Сервиз Бургас
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        alignSelf: { xs: 'center', md: 'flex-start' },
                        color: 'info.main',
                        fontWeight: 500,
                        maxWidth: { xs: '300px', md: '400px' },
                    }}
                >
                    Годишни технически прегелди
                </Typography>
            </Stack>

            {/* Card at bottom center with buttons */}
            <Card
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: { xs: '100%', sm: '500px', md: '550px' },
                    width: '100%',
                    alignSelf: { xs: 'center', md: 'flex-end' },
                    justifySelf: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: shadow2,
                    borderRadius: 3,
                    padding: { xs: 3, sm: 4, md: 5 },
                }}
            >
                <CardContent sx={{ textAlign: 'center', p: 0, '&:last-child': { pb: 0 } }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ width: '100%' }}
                    >
                        <RedButton
                            variant="contained"
                            size="medium"
                            onClick={() => navigate('/booking')}
                            sx={{
                                width: { xs: '100%', md: 'auto' },
                                maxWidth: { xs: '100%', md: '250px' }
                            }}
                        >
                            Запази час
                        </RedButton>

                        <BlackButton
                            variant="outlined"
                            size="medium"
                            onClick={handleScrollToContact}
                            sx={{
                                width: { xs: '100%', md: 'auto' },
                                maxWidth: { xs: '100%', md: '250px' }
                            }}
                        >
                            Виж на картата
                        </BlackButton>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};
