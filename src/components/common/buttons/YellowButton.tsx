'use client'

import { Button, type ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode,
} & ButtonProps

const YellowButton = ({ children, variant = 'contained', ...otherProps }: Props) => {
    const getColorStyles = () => {
        const baseColor = 'warning.dark'
        const hoverColor = 'warning.main'

        switch (variant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: 'warning.contrastText',
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
                        color: 'warning.contrastText',
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
                        bgcolor: 'rgba(255, 215, 0, 0.04)',
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
            color='warning'
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

export default YellowButton