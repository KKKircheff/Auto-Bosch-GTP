'use client'
import { Button, type ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode,
} & ButtonProps

const BlackButton = ({ children, variant = 'contained', ...otherProps }: Props) => {
    const getColorStyles = () => {
        const baseColor = 'info.dark'
        const hoverColor = 'info.main'

        switch (variant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: 'info.contrastText',
                    '&:hover': {
                        bgcolor: hoverColor,
                    },
                    '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                    },
                }

            case 'outlined':
                return {
                    borderColor: baseColor,
                    color: baseColor,
                    '&:hover': {
                        bgcolor: baseColor,
                        color: 'background.paper',
                    },
                    '&:disabled': {
                        borderColor: 'action.disabled',
                        color: 'action.disabled',
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
                        color: 'action.disabled',
                    },
                }
        }
    }

    return (
        <Button
            variant={variant}
            color='info'
            {...otherProps}
            sx={{
                borderRadius: '500px',
                minWidth: '250px',
                ...getColorStyles(),
                ...otherProps.sx,
            }}
        >
            {children}
        </Button>
    )
}

export default BlackButton
