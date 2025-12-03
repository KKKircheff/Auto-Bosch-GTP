import { Card, CardContent, Stack, Typography, Skeleton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RedButton } from '../../../components/common/buttons';
import { shadow2 } from '../../../utils/constants';
import TitleLight from '../../../components/common/typography/TitleLight.component';
import MainTitle from '../../../components/common/typography/MainTitle.component';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';
import type { WeekDay } from '../../../features/admin-panel/types/settings.types';
import YellowButton from '../../../components/common/buttons/YellowButton';

export const HeroSection = () => {
    const navigate = useNavigate();
    const { settings, loading } = useBusinessSettings();

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Map weekday to Bulgarian
    const weekDayToBulgarian: Record<WeekDay, string> = {
        monday: 'Понеделник',
        tuesday: 'Вторник',
        wednesday: 'Сряда',
        thursday: 'Четвъртък',
        friday: 'Петък',
        saturday: 'Събота',
        sunday: 'Неделя',
    };

    // Define correct day order
    const weekDayOrder: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // Sort working days by weekday order
    const sortedWorkingDays = settings?.workingDays
        ? [...settings.workingDays].sort((a, b) => weekDayOrder.indexOf(a) - weekDayOrder.indexOf(b))
        : [];

    return (
        <Stack
            px={{ xs: 1, sm: 2, md: 4 }}
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: '91dvh', md: '75vw', xl: '1200px' },
                backgroundImage: 'url(/images/hero-2.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                py: 2,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 0,
                },
            }}
        >
            <Stack
                spacing={{ xs: 2, md: 4 }}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    textAlign: { xs: 'center', md: 'left' },
                    borderRadius: 2,
                    maxWidth: { xs: '100%', md: '1200px' },
                    pb: 6
                }}
            >
                <Stack spacing={0}>
                    <MainTitle
                        sx={{
                            color: 'primary.contrastText'
                        }}
                    >
                        Ауто Бош Сервиз
                    </MainTitle>
                    <TitleLight
                        sx={{
                            color: 'info.light'
                        }}
                    >
                        Бургас
                    </TitleLight>
                </Stack>

                <Typography
                    variant="h4"
                    sx={{
                        pl: 1,
                        alignSelf: { xs: 'center', md: 'flex-start' },
                        color: 'info.contrastText',
                        fontWeight: 500,
                        maxWidth: { xs: '600px', md: '400px' },
                    }}
                >
                    Годишни технически прегелди
                </Typography>
            </Stack>

            <Card
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: { xs: '100%', sm: '500px', md: '550px' },
                    width: '100%',
                    alignSelf: { xs: 'center', md: 'flex-end' },
                    justifySelf: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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

                        <YellowButton
                            variant="outlined"
                            // variant="contained"
                            size="medium"
                            onClick={handleScrollToContact}
                            sx={{
                                width: { xs: '100%', md: 'auto' },
                                maxWidth: { xs: '100%', md: '250px' }
                            }}
                        >
                            Виж на картата
                        </YellowButton>
                    </Stack>

                    <Box sx={{ mt: 3 }} textAlign={'right'}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'background.default',
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            Работно време:
                        </Typography>
                        {loading ? (
                            <>
                                <Skeleton variant="text" width="80%" sx={{ mx: 'auto', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
                                <Skeleton variant="text" width="80%" sx={{ mx: 'auto', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
                                <Skeleton variant="text" width="80%" sx={{ mx: 'auto', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
                            </>
                        ) : (
                            sortedWorkingDays.map((day) => (
                                <Typography
                                    key={day}
                                    variant="subtitle1"
                                    sx={{
                                        color: 'background.default',
                                        fontWeight: 400,
                                    }}
                                >
                                    {weekDayToBulgarian[day]}: {settings?.workingHours.start} - {settings?.workingHours.end}
                                </Typography>
                            ))
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
};
