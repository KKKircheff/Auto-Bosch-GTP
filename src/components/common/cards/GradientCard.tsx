// src/components/common/cards/GradientCard.tsx
import { Box, Typography, useTheme, type BoxProps } from '@mui/material';
import { shadow1 } from '../../../utils/constants';

type GradientCardProps = {
    children: React.ReactNode;
    title?: string;
    titleVariant?: 'red' | 'blue';
    bgcolor?: string;
    className?: string;
} & BoxProps

const GradientCard = ({
    children,
    title,
    titleVariant = 'blue',
    bgcolor = 'background.paper',
    className,
    ...otherProps
}: GradientCardProps) => {
    const theme = useTheme();

    // Generate gradient based on variant
    const gradient = titleVariant === 'red'
        ? `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`
        : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;

    return (
        <Box
            className={className}
            {...otherProps}
            sx={{
                boxShadow: shadow1,
                borderRadius: 1,
                bgcolor,
                overflow: 'hidden',
                ...otherProps.sx
            }}
        >
            {title && (
                <Box
                    sx={{
                        background: gradient,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 2, // Horizontal padding for long titles
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 600,
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
            )}
            <Box
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default GradientCard;
