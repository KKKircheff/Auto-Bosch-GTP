import { Typography, type TypographyProps, useTheme } from "@mui/material"
import type { ReactNode } from "react"

type Props = {
    children: ReactNode,
} & TypographyProps

const SectionTitle = ({ children, ...otherProps }: Props) => {
    const theme = useTheme()

    return (
        <Typography
            variant="h3"
            textAlign="center"
            pb={6}
            gutterBottom
            {...otherProps}
            sx={{
                fontSize: {
                    xs: theme.typography.h3.fontSize,
                    md: theme.typography.h2.fontSize
                },
                fontWeight: 400,
                color: 'info.main',
                mb: 1,
                ...otherProps.sx
            }}
        >
            {children}
        </Typography>
    )
}

export default SectionTitle