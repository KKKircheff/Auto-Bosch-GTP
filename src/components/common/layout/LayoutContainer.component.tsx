import { Stack, type StackProps } from "@mui/material"
import type { ReactNode } from "react"
import { shadow4 } from "../../../utils/constants"

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
                boxShadow: shadow4,
                ...otherProps.sx
            }}
        >
            {children}
        </Stack>
    )
}

export default LayoutContainer