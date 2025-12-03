import { useState } from 'react';
import { Box, TextField, Alert, Grid } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { AdminButton } from '../../../components/common/buttons';
import type { ContactInfo } from '../types/settings.types';

interface ContactInfoFormProps {
  contact: ContactInfo;
  onSave: (contact: ContactInfo) => Promise<void>;
  disabled?: boolean;
}

export function ContactInfoForm({ contact, onSave, disabled }: ContactInfoFormProps) {
  const [editedContact, setEditedContact] = useState<ContactInfo>(contact);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setEditedContact((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation - at least 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleSave = async () => {
    // Validation
    if (!editedContact.phone.trim()) {
      setError('Телефонният номер е задължителен');
      return;
    }

    if (!validatePhone(editedContact.phone)) {
      setError('Невалиден телефонен номер (минимум 10 цифри)');
      return;
    }

    if (!editedContact.email.trim()) {
      setError('Имейлът е задължителен');
      return;
    }

    if (!validateEmail(editedContact.email)) {
      setError('Невалиден имейл адрес');
      return;
    }

    if (!editedContact.address.trim()) {
      setError('Адресът е задължителен');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await onSave(editedContact);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при записване');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(editedContact) !== JSON.stringify(contact);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Контактната информация е записана успешно!
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Телефон"
            value={editedContact.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={disabled || saving}
            fullWidth
            required
            placeholder="+359 XXX XXX XXX"
            helperText="Телефон за контакт с клиенти"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Имейл"
            type="email"
            value={editedContact.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={disabled || saving}
            fullWidth
            required
            placeholder="info@autobosch.bg"
            helperText="Имейл за контакт с клиенти"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label="Адрес"
            value={editedContact.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={disabled || saving}
            fullWidth
            required
            multiline
            rows={2}
            placeholder="Бургас, България"
            helperText="Физически адрес на сервиза"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <AdminButton
          adminVariant="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || disabled || saving}
        >
          {saving ? 'Записване...' : 'Запази контактите'}
        </AdminButton>
      </Box>
    </Box>
  );
}
