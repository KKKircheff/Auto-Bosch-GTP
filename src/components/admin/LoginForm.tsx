import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Stack,
    CircularProgress,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    AdminPanelSettings,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { shadow1, TEXTS } from '../../utils/constants';
import type { LoginCredentials } from '../../types/booking';

// Validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Имейлът е задължителен')
        .email('Невалиден имейл адрес'),
    password: z
        .string()
        .min(1, 'Паролата е задължителна')
        .min(6, 'Паролата трябва да бъде поне 6 символа'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess?: () => void;
    className?: string;
}

const LoginForm = ({ onSuccess, className }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error, clearError } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        // Clear any previous errors
        clearError();

        try {
            const result = await login(data as LoginCredentials);

            if (result.success) {
                reset(); // Clear form on success
                onSuccess?.();
            }
            // Error handling is done by the AuthContext
        } catch (err) {
            console.error('Login form error:', err);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <Box
            className={className}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: { xs: 2, lg: 14 }
            }}
        >
            <Card sx={{ boxShadow: shadow1 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box textAlign="center" mb={3}>
                        <AdminPanelSettings
                            sx={{
                                fontSize: 48,
                                color: 'primary.main',
                                mb: 2
                            }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            {TEXTS.adminLogin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Въведете данните си за достъп до администраторския панел
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                            onClose={clearError}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                        <Stack spacing={3}>
                            {/* Email Field */}
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        color='info'
                                        {...field}
                                        fullWidth
                                        label="Имейл адрес"
                                        type="email"
                                        required
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        disabled={loading}
                                        placeholder="admin@example.com"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                )}
                            />

                            {/* Password Field */}
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        color='info'
                                        fullWidth
                                        label="Парола"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleTogglePasswordVisibility}
                                                        disabled={loading}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={!isValid || loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        <LoginIcon />
                                    )
                                }
                                sx={{ py: 1.5 }}
                            >
                                {loading ? 'Влизане...' : TEXTS.login}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Development Info */}
                    {/* {process.env.NODE_ENV === 'development' && (
                        <Alert
                            severity="info"
                            sx={{ mt: 3 }}
                        >
                            <Typography variant="caption" display="block">
                                <strong>Развойна информация:</strong>
                            </Typography>
                            <Typography variant="caption" display="block">
                                Имейл: {import.meta.env.VITE_ADMIN_EMAIL || 'Не е зададен'}
                            </Typography>
                            <Typography variant="caption" display="block">
                                Парола: {import.meta.env.VITE_ADMIN_PASSWORD || 'Не е зададена'}
                            </Typography>
                        </Alert>
                    )} */}
                </CardContent>
            </Card>

            {/* Additional Info */}
            <Box textAlign="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                    Само администратори имат достъп до този панел
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;