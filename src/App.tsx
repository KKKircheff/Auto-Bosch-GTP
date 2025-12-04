// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';

import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './components/common/layout/PublicLayout';

// Keep public pages in main bundle (most users land here)
import HomePage from './pages/home/HomePage';
import BookingPage from './pages/booking/BookingPage';

// Lazy load admin pages for code splitting
const AdminLoginPage = lazy(() => import('./pages/admin-login/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin-dashboard/AdminDashboardPage'));
const SettingsPage = lazy(() => import('./features/admin-panel/pages/SettingsPage'));
const MessagesPage = lazy(() => import('./features/admin-panel/pages/MessagesPage'));
const AppointmentsPage = lazy(() => import('./features/admin-panel/pages/AppointmentsPage'));

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BookingProvider>
                    <Router>
                        <Suspense
                            fallback={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100vh',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <CircularProgress />
                                    <Box sx={{ color: 'text.secondary' }}>Зареждане...</Box>
                                </Box>
                            }
                        >
                            <Routes>
                            {/* Public routes with Navbar + Footer layout */}
                            <Route element={<PublicLayout />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/booking" element={<BookingPage />} />
                            </Route>

                            {/* Admin login - standalone (no layout) */}
                            <Route
                                path="/admin/login"
                                element={
                                    <Box sx={{ minHeight: '100vh', bgcolor: grey[100] }}>
                                        <AdminLoginPage />
                                    </Box>
                                }
                            />

                            {/* Protected admin routes - AdminLayout only */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/settings"
                                element={
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/messages"
                                element={
                                    <ProtectedRoute>
                                        <MessagesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/appointments"
                                element={
                                    <ProtectedRoute>
                                        <AppointmentsPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                        </Suspense>
                    </Router>
                </BookingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;