import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';
import { SettingsSection } from '../components/SettingsSection';
import { PricingTable } from '../components/PricingTable';
import { WorkingHoursEditor } from '../components/WorkingHoursEditor';
import { ContactInfoForm } from '../components/ContactInfoForm';
import { ClosedDaysEditor } from '../components/ClosedDaysEditor';
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

    const handleClosedDaysUpdate = async (closedDays: typeof settings.closedDays) => {
        await updateSettings({
            ...settings,
            closedDays,
        });
    };

    return (
        <AdminLayout>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 5 }, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Настройки
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Управление на цени, работно време и информация за контакт
                </Typography>
            </Paper>

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
                title="Резервирай почивен ден"
                description="Маркирайте дни, в които не работите (празници, ремонти)"
            >
                <ClosedDaysEditor
                    closedDays={settings.closedDays || []}
                    onSave={handleClosedDaysUpdate}
                />
            </SettingsSection>

            <SettingsSection
                title="Адрес и контакт"
                description="Телефон, имейл и адрес за свързване с клиенти"
            >
                <ContactInfoForm contact={settings.contact} onSave={handleContactUpdate} />
            </SettingsSection>
        </AdminLayout>
    );
}
