import { Typography } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';
import { MessageList } from '../components/MessageList';
import { useMessages } from '../hooks/useMessages';
import type { CreateAnnouncementData } from '../types/messages.types';

export function MessagesPage() {
  const {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleStatus,
  } = useMessages();

  // Wrapper to match MessageList's expected onCreate signature
  const handleCreate = async (data: CreateAnnouncementData): Promise<void> => {
    await createAnnouncement(data);
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Съобщения
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Управление на съобщения и известия, които се показват на началната страница
      </Typography>

      <MessageList
        messages={announcements}
        loading={loading}
        error={error}
        onCreate={handleCreate}
        onUpdate={updateAnnouncement}
        onDelete={deleteAnnouncement}
        onToggleStatus={toggleStatus}
      />
    </AdminLayout>
  );
}
