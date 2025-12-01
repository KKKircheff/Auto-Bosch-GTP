import { Typography, Box, CircularProgress } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';
import { SettingsSection } from '../components/SettingsSection';
import { PricingTable } from '../components/PricingTable';
import { WorkingHoursEditor } from '../components/WorkingHoursEditor';
import { ContactInfoForm } from '../components/ContactInfoForm';
import { useSettings } from '../hooks/useSettings';

export function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();

  if (loading || !settings) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  const handlePricingUpdate = async (prices: typeof settings.prices, discount: number) => {
    await updateSettings({
      ...settings,
      prices,
      onlineDiscount: discount,
    });
  };

  const handleWorkingHoursUpdate = async (
    hours: typeof settings.workingHours,
    days: typeof settings.workingDays,
    windowWeeks: number
  ) => {
    await updateSettings({
      ...settings,
      workingHours: hours,
      workingDays: days,
      bookingWindowWeeks: windowWeeks,
    });
  };

  const handleContactUpdate = async (contact: typeof settings.contact) => {
    await updateSettings({
      ...settings,
      contact,
    });
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Управление на цени, работно време и контактна информация
      </Typography>

      <SettingsSection
        title="Цени на прегледите"
        description="Задайте цените за различните типове превозни средства и онлайн отстъпката"
      >
        <PricingTable
          prices={settings.prices}
          onlineDiscount={settings.onlineDiscount}
          onSave={handlePricingUpdate}
        />
      </SettingsSection>

      <SettingsSection
        title="Работно време"
        description="Конфигурирайте работните часове, дни и период за записване"
      >
        <WorkingHoursEditor
          workingHours={settings.workingHours}
          workingDays={settings.workingDays}
          bookingWindowWeeks={settings.bookingWindowWeeks}
          onSave={handleWorkingHoursUpdate}
        />
      </SettingsSection>

      <SettingsSection
        title="Контактна информация"
        description="Телефон, имейл и адрес за свързване с клиенти"
      >
        <ContactInfoForm contact={settings.contact} onSave={handleContactUpdate} />
      </SettingsSection>
    </AdminLayout>
  );
}
