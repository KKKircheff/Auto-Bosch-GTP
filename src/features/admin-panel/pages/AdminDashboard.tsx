import { useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Paper, Stack } from '@mui/material';
import {
    TodayOutlined as TodayIcon,
    DateRangeOutlined as WeekIcon,
    EventAvailableOutlined as PeriodIcon,
    AssessmentOutlined as TotalIcon,
    Settings as SettingsIcon,
    Campaign as CampaignIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { useAppointments } from '../hooks/useAppointments';
import { AdminButton } from '../../../components/common/buttons';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <Card
            sx={{
                p: {
                    xs: 1, md: 2
                }
            }
            } >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: `${color}.light`,
                            borderRadius: 2,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card >
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

function QuickAction({ title, description, icon, onClick }: QuickActionProps) {
    return (
        <Card sx={{ height: '100%', px: 0 }}>
            <CardContent>
                <Stack sx={{ alignItems: 'flex-start', mb: 4 }} spacing={1}>
                    <Stack direction={'row'} alignItems={'center'}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
                        <Typography variant="h6" gutterBottom>
                            {title}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" >
                        {description}
                    </Typography>
                </Stack>
                <AdminButton adminVariant="primary" variant="outlined" fullWidth onClick={onClick}>
                    Отвори
                </AdminButton>
            </CardContent>
        </Card >
    );
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const { stats, loadStats } = useAppointments();

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return (
        <AdminLayout>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 5 }, mb: 6 }}>
                <Typography variant="h4" gutterBottom>
                    Админ панел
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Добре дошли в административния панел на Auto Bosch GTP
                </Typography>
            </Paper>

            {/* Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <StatCard
                        title="Резервирани днес"
                        value={stats?.todayAppointments || 0}
                        icon={<TodayIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <StatCard
                        title="За седмицата напред"
                        value={stats?.weekAppointments || 0}
                        icon={<WeekIcon />}
                        color="info"
                    />
                </Grid>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <StatCard
                        title="За периода напред"
                        value={stats?.periodAppointments || 0}
                        icon={<PeriodIcon />}
                        color="success"
                    />
                </Grid>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <StatCard
                        title="Общо потвърдени до сега"
                        value={stats?.totalAppointments || 0}
                        icon={<TotalIcon />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
                Админ секции
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <QuickAction
                        title="Настройки"
                        description="Управление на цени, работно време и контакти"
                        icon={<SettingsIcon />}
                        onClick={() => navigate('/admin/settings')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <QuickAction
                        title="Съобщения"
                        description="Създаване и редакция на съобщения за клиенти"
                        icon={<CampaignIcon />}
                        onClick={() => navigate('/admin/messages')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <QuickAction
                        title="Записвания"
                        description="Преглед и управление на записвания за прегледи"
                        icon={<EventIcon />}
                        onClick={() => navigate('/admin/appointments')}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
}
