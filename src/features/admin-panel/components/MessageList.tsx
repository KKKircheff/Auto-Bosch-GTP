import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { AdminButton } from '../../../components/common/buttons';
import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '../types/messages.types';
import { MessageCard } from './MessageCard';
import { MessageEditor } from './MessageEditor';

interface MessageListProps {
    messages: Announcement[];
    loading: boolean;
    error: string | null;
    onCreate: (data: CreateAnnouncementData) => Promise<void>;
    onUpdate: (id: string, data: UpdateAnnouncementData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
}

export function MessageList({
    messages,
    loading,
    error,
    onCreate,
    onUpdate,
    onDelete,
    onToggleStatus,
}: MessageListProps) {
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState<Announcement | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

    const handleCreate = () => {
        setEditingMessage(null);
        setEditorOpen(true);
    };

    const handleEdit = (message: Announcement) => {
        setEditingMessage(message);
        setEditorOpen(true);
    };

    const handleSave = async (data: CreateAnnouncementData) => {
        if (editingMessage) {
            await onUpdate(editingMessage.id, data);
        } else {
            await onCreate(data);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingMessageId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingMessageId) {
            await onDelete(deletingMessageId);
            setDeleteDialogOpen(false);
            setDeletingMessageId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDeletingMessageId(null);
    };

    if (loading && messages.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mb: 3 }} spacing={2}>
                <Typography variant="h6">Съобщения ({messages.length})</Typography>
                <AdminButton adminVariant="primary" startIcon={<AddIcon />} onClick={handleCreate}>
                    Ново съобщение
                </AdminButton>
            </Stack>

            {messages.length === 0 ? (
                <Alert severity="info">
                    Няма създадени съобщения. Създайте първото си съобщение с бутона "Ново съобщение".
                </Alert>
            ) : (
                <Box>
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            message={message}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </Box>
            )}

            {/* Message Editor Dialog */}
            <MessageEditor
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSave={handleSave}
                initialData={
                    editingMessage
                        ? {
                            title: editingMessage.title,
                            content: editingMessage.content,
                            type: editingMessage.type,
                            position: editingMessage.position,
                            isActive: editingMessage.isActive,
                        }
                        : undefined
                }
                title={editingMessage ? 'Редактирай съобщение' : 'Ново съобщение'}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Изтриване на съобщение</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Сигурни ли сте, че искате да изтриете това съобщение? Действието не може да бъде отменено.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Отказ</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Изтрий
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
