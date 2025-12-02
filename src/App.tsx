// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './components/common/layout/PublicLayout';
import HomePage from './pages/home/HomePage';
import BookingPage from './pages/booking/BookingPage';
import AdminLoginPage from './pages/admin-login/AdminLoginPage';
import AdminDashboardPage from './pages/admin-dashboard/AdminDashboardPage';
import { SettingsPage } from './features/admin-panel/pages/SettingsPage';
import { MessagesPage } from './features/admin-panel/pages/MessagesPage';
import { AppointmentsPage } from './features/admin-panel/pages/AppointmentsPage';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BookingProvider>
                    <Router>
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
                    </Router>
                </BookingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;