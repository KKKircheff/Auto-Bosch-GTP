import { Button, type ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode,
} & ButtonProps

const PrimaryButton = ({ children, variant = 'contained', ...otherProps }: Props) => {
    const getColorStyles = () => {
        const baseColor = 'primary.main' // #0163B3
        const darkColor = 'primary.dark' // #013a6a

        switch (variant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: 'primary.contrastText',
                    '&:hover': {
                        bgcolor: darkColor,
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
                        borderColor: baseColor,
                        bgcolor: baseColor,
                        color: 'primary.contrastText'
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
                        bgcolor: 'rgba(1, 99, 179, 0.04)',
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
            color='primary'
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

export default PrimaryButton
