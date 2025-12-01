// src/theme/theme.ts
import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#01304A', // Primary blue pallete
            light: '#679CBC',
            dark: '#57a614',
        },
        secondary: {
            main: '#d21422', // Secondary Red Pallete
            light: '#f05c67',
            dark: '#750b13',
        },
        warning: {
            main: '#FFD600',
            light: '#fff1bb',
            dark: '#FFD600',
        },
        info: {
            main: '#3f3f41', //Gray colors for the app
            light: '#a5a5a7',
            dark: '#0c0c12',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#0c0c12',
            secondary: '#77777a',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        button: {
            textTransform: 'none', // Prevent uppercase transformation
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1976d2',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});
