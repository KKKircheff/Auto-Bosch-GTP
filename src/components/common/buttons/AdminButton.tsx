'use client'

import { Button, type ButtonProps, useTheme } from '@mui/material'
import type { ReactNode } from 'react'

type AdminButtonVariant = 'black' | 'primary' | 'secondary' | 'warning'

type Props = {
    children: ReactNode
    adminVariant?: AdminButtonVariant
} & ButtonProps

const AdminButton = ({
    children,
    adminVariant = 'primary',
    variant = 'contained',
    ...otherProps
}: Props) => {
    const theme = useTheme()

    const getColorStyles = () => {
        switch (adminVariant) {
            case 'black':
                return getBlackStyles(variant)
            case 'primary':
                return getPrimaryStyles(variant)
            case 'secondary':
                return getSecondaryStyles(variant)
            case 'warning':
                return getWarningStyles(variant)
            default:
                return getPrimaryStyles(variant)
        }
    }

    const getBlackStyles = (buttonVariant: string) => {
        const baseColor = theme.palette.info.dark // #0c0c12
        const hoverColor = theme.palette.info.main // #3f3f41

        switch (buttonVariant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: theme.palette.info.contrastText,
                    '&:hover': {
                        bgcolor: hoverColor,
                        color: theme.palette.info.contrastText,
                    },
                    '&:disabled': {
                        bgcolor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'outlined':
                return {
                    borderColor: baseColor,
                    color: baseColor,
                    '&:hover': {
                        bgcolor: baseColor,
                        color: theme.palette.info.contrastText,
                    },
                    '&:disabled': {
                        borderColor: theme.palette.action.disabled,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'text':
            default:
                return {
                    color: baseColor,
                    '&:hover': {
                        bgcolor: 'rgba(12, 12, 18, 0.04)',
                    },
                    '&:disabled': {
                        color: theme.palette.action.disabled,
                    },
                }
        }
    }

    const getPrimaryStyles = (buttonVariant: string) => {
        const gradient = 'linear-gradient(135deg, #013a6a, #0163B3)'
        const hoverGradient = 'linear-gradient(135deg, #012a50, #014a8a)'
        const baseColor = theme.palette.primary.main

        switch (buttonVariant) {
            case 'contained':
                return {
                    background: gradient,
                    color: '#FFF',
                    '&:hover': {
                        background: hoverGradient,
                        color: '#FFF',
                    },
                    '&:disabled': {
                        background: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'outlined':
                return {
                    borderColor: baseColor,
                    color: baseColor,
                    '&:hover': {
                        bgcolor: baseColor,
                        color: theme.palette.primary.contrastText,
                    },
                    '&:disabled': {
                        borderColor: theme.palette.action.disabled,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'text':
            default:
                return {
                    color: baseColor,
                    '&:hover': {
                        bgcolor: 'rgba(1, 99, 179, 0.04)',
                    },
                    '&:disabled': {
                        color: theme.palette.action.disabled,
                    },
                }
        }
    }

    const getSecondaryStyles = (buttonVariant: string) => {
        const baseColor = theme.palette.secondary.main // #d21422
        const darkColor = theme.palette.secondary.dark // #750b13

        switch (buttonVariant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: theme.palette.secondary.contrastText,
                    '&:hover': {
                        bgcolor: darkColor,
                        color: theme.palette.secondary.contrastText,
                    },
                    '&:disabled': {
                        bgcolor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'outlined':
                return {
                    borderColor: baseColor,
                    color: baseColor,
                    '&:hover': {
                        borderColor: baseColor,
                        bgcolor: baseColor,
                        color: theme.palette.secondary.contrastText,
                    },
                    '&:disabled': {
                        borderColor: theme.palette.action.disabled,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'text':
            default:
                return {
                    color: baseColor,
                    '&:hover': {
                        bgcolor: 'rgba(210, 20, 34, 0.04)',
                    },
                    '&:disabled': {
                        color: theme.palette.action.disabled,
                    },
                }
        }
    }

    const getWarningStyles = (buttonVariant: string) => {
        const baseColor = theme.palette.warning.dark // #eac400
        const hoverColor = theme.palette.warning.main // #FFD600

        switch (buttonVariant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: theme.palette.warning.contrastText,
                    '&:hover': {
                        bgcolor: hoverColor,
                        color: theme.palette.warning.contrastText,
                    },
                    '&:disabled': {
                        bgcolor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'outlined':
                return {
                    borderColor: baseColor,
                    color: baseColor,
                    '&:hover': {
                        bgcolor: baseColor,
                        color: theme.palette.warning.contrastText,
                    },
                    '&:disabled': {
                        borderColor: theme.palette.action.disabled,
                        color: theme.palette.action.disabled,
                    },
                }

            case 'text':
            default:
                return {
                    color: baseColor,
                    '&:hover': {
                        bgcolor: 'rgba(255, 215, 0, 0.04)',
                    },
                    '&:disabled': {
                        color: theme.palette.action.disabled,
                    },
                }
        }
    }

    return (
        <Button
            variant={variant}
            size='small'
            {...otherProps}
            sx={{
                borderRadius: '500px',
                minWidth: '230px',
                ...getColorStyles(),
                ...otherProps.sx,
            }}
        >
            {children}
        </Button>
    )
}

export default AdminButton
