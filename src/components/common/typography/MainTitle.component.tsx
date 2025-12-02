import { Typography, type TypographyProps } from "@mui/material"
import type { ReactNode } from "react"

type Props = {
    children: ReactNode,
} & TypographyProps

const MainTitle = ({ children, ...otherProps }: Props) => {
    return (
        <Typography
            variant="h1"
            {...otherProps}
            sx={{
                fontWeight: 800,
                color: 'info.main',
                mb: 1,
                fontSize: 'clamp(1rem, 11vw, 10rem)',
                lineHeight: 'clamp(1rem, 13vw, 10rem)',
                ...otherProps.sx
            }}
        >
            {children}
        </Typography>
    )
}

export default MainTitle