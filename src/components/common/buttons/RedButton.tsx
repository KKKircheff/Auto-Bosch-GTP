import { Button, type ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode,
} & ButtonProps

const RedButton = ({ children, variant = 'contained', ...otherProps }: Props) => {
    const getColorStyles = () => {
        const baseColor = 'secondary.main' // #d21422
        const darkColor = 'secondary.dark' // #750b13

        switch (variant) {
            case 'contained':
                return {
                    bgcolor: baseColor,
                    color: 'backgo',
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
                        color: 'secondary.contrastText'
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
                        bgcolor: 'rgba(210, 20, 34, 0.04)',
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
            sx={{
                borderRadius: '500px',
                minWidth: '250px',
                ...getColorStyles(),
                ...otherProps.sx
            }}
            {...otherProps}
        >
            {children}
        </Button>
    )
}

export default RedButton