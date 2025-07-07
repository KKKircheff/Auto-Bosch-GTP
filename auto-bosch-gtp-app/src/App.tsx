import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
// import { Header } from './components/Layout/Header';
// import { Footer } from './components/Layout/Footer';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/Home.Page';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                <Header />
                                <Box component="main" sx={{ flexGrow: 1 }}>
                                    <HomePage />
                                </Box>
                                <Footer />
                            </Box>
                        }
                    />

                    <Route
                        path="/confirmation/:appointmentId"
                        element={
                            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                <Header />
                                <Box component="main" sx={{ flexGrow: 1 }}>
                                    <ConfirmationPage />
                                </Box>
                                <Footer />
                            </Box>
                        }
                    />

                    {/* Admin dashboard without public layout */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;