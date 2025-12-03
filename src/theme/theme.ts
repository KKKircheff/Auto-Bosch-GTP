// src/theme/theme.ts
import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#0163B3', // Primary blue pallete
            light: '#c0e2ff',
            dark: '#013a6a',
            contrastText: '#FFF',
            // primary: {
            //     main: '#01304A', // Primary blue pallete
            //     light: '#679CBC',
            //     dark: '#57a614',
            //     contrastText: '#FFF',
        },
        secondary: {
            main: '#d21422', // Secondary Red Pallete
            light: '#f05c67',
            dark: '#750b13',
            contrastText: '#FFF',
        },
        warning: {
            main: '#FFD600',
            light: '#eac400',
            dark: '#eac400',
            contrastText: '#0c0c12',
        },
        info: {
            main: '#3f3f41', //Gray colors for the app
            light: '#a5a5a7',
            dark: '#0c0c12',
            contrastText: '#FFF',
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
        fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24, // Pill shape
                    padding: '12px 24px',
                    fontWeight: 600,
                },
                sizeLarge: {
                    padding: '14px 32px',
                    fontSize: '1.1rem',
                },
                contained: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
            defaultProps: {
                disableElevation: false,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                    padding: '24px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                },
                elevation2: {
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#0c0c12',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
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
