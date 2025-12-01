import { useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import {
  TodayOutlined as TodayIcon,
  DateRangeOutlined as WeekIcon,
  CalendarMonthOutlined as MonthIcon,
  AttachMoneyOutlined as RevenueIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { useAppointments } from '../hooks/useAppointments';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
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
    </Card>
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
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" fullWidth onClick={onClick}>
          Отвори
        </Button>
      </CardContent>
    </Card>
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
      <Typography variant="h4" gutterBottom>
        Табло
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Добре дошли в административния панел на Auto Bosch GTP
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Днес"
            value={stats?.todayAppointments || 0}
            icon={<TodayIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Тази седмица"
            value={stats?.weekAppointments || 0}
            icon={<WeekIcon />}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Този месец"
            value={stats?.monthAppointments || 0}
            icon={<MonthIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Приход (месец)"
            value={`${stats?.totalRevenue || 0} лв`}
            icon={<RevenueIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Бързи действия
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
