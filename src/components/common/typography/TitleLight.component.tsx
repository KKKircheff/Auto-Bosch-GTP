import { Typography, type TypographyProps } from "@mui/material"
import type { ReactNode } from "react"

type Props = {
    children: ReactNode,
} & TypographyProps

const TitleLight = ({ children, ...otherProps }: Props) => {
    return (
        <Typography
            variant="h2"
            {...otherProps}
            sx={{
                fontWeight: 200,
                color: 'info.main',
                mb: 1,
                fontSize: 'clamp(2rem, 6vw, 7rem)',
                lineHeight: 'clamp(rem, 7vw, 8rem)',
                ...otherProps.sx
            }}
        >
            {children}
        </Typography>
    )
}

export default TitleLight