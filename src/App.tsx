// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { SettingsPage } from './features/admin-panel/pages/SettingsPage';
import { MessagesPage } from './features/admin-panel/pages/MessagesPage';
import { AppointmentsPage } from './features/admin-panel/pages/AppointmentsPage';
import { Box, Container } from '@mui/material';
import { grey } from '@mui/material/colors';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BookingProvider>
                    <Router>
                        <Box className="App" sx={{ minHeight: '100vh', bgcolor: grey[100], px: 0 }}>
                            <Container maxWidth="xl" sx={{ px: '0px !important' }}>
                                <Header />
                            </Container>
                            <Container maxWidth="xl" sx={{ bgcolor: 'white', minHeight: '80vh', px: 2 }}>
                                <main style={{ flex: 1 }}>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/booking" element={<BookingPage />} />
                                        <Route path="/admin/login" element={<AdminLoginPage />} />
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
                                </main>
                            </Container>
                            <Container maxWidth="xl" sx={{ px: '0px !important' }}>
                                <Footer />
                            </Container>
                        </Box>
                    </Router>
                </BookingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;