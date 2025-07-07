import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TimeSlotProps {
    time: string;
    isBooked: boolean;
    isSelected: boolean;
    onClick: () => void;
    carBrand?: string;
}

const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isBooked' && prop !== 'isSelected',
})<{
    isBooked?: boolean;
    isSelected?: boolean;
}>(({ theme, isBooked, isSelected }) => ({
    padding: theme.spacing(1.5),
    textAlign: 'center',
    cursor: isBooked ? 'not-allowed' : 'pointer',
    backgroundColor: isSelected
        ? theme.palette.primary.main
        : isBooked
        ? theme.palette.grey[300]
        : theme.palette.background.paper,
    color: isSelected
        ? theme.palette.primary.contrastText
        : isBooked
        ? theme.palette.text.disabled
        : theme.palette.text.primary,
    border: `1px solid ${isSelected ? theme.palette.primary.dark : theme.palette.divider}`,
    transition: 'background-color 0.3s, border-color 0.3s',
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',

    '&:hover': {
        borderColor: !isBooked ? theme.palette.primary.main : undefined,
        backgroundColor: !isBooked && !isSelected ? theme.palette.action.hover : undefined,
    },
}));

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, isBooked, isSelected, onClick, carBrand }) => {
    return (
        <StyledPaper
            isBooked={isBooked}
            isSelected={isSelected}
            onClick={!isBooked ? onClick : undefined}
            elevation={isSelected ? 4 : 1}
        >
            <Typography variant="h6" component="div">
                {time}
            </Typography>
            {isBooked && carBrand && (
                <Box>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        (Заето)
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                        {carBrand}
                    </Typography>
                </Box>
            )}
        </StyledPaper>
    );
};
