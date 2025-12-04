import { Paper, Typography } from '@mui/material';
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
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 5 }, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Съобщения на началната страница
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Добавяне на едно или няколко съобщения директно под менюто или в самата страница
                </Typography>
            </Paper>

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

export default MessagesPage;
