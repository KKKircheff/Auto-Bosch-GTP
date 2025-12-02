import { Stack, type StackProps } from "@mui/material"
import type { ReactNode } from "react"

type Props = {
    children: ReactNode
} & StackProps

const LayoutContainer = ({ children, ...otherProps }: Props) => {
    return (
        <Stack
            width='100%'
            mx='auto'
            {...otherProps}
            sx={{
                bgcolor: 'white',
                minHeight: '80vh',
                px: '0px !important',
                maxWidth: { xs: '100%', xl: '1920px' },
                ...otherProps.sx
            }}
        >
            {children}
        </Stack>
    )
}

export default LayoutContainer