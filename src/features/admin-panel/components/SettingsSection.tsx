import type { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Generic settings section wrapper component
 * Provides consistent styling for all settings sections
 */
export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
}
