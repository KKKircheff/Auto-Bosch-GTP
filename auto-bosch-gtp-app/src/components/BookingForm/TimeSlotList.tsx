import React from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { TimeSlot } from './TimeSlot';
import { useAppointments } from '../../hooks/useAppointments'; // Assuming you have this hook
import { Appointment } from '../../types/appointment';

interface TimeSlotListProps {
    selectedDate: Date;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

// Function to generate time slots for a given day
const generateTimeSlots = (date: Date): string[] => {
    const slots = [];
    const day = date.getDay();

    // Assuming working days are Monday (1) to Friday (5)
    if (day >= 1 && day <= 5) {
        // Assuming business hours are 9:00 to 17:00
        for (let hour = 9; hour < 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
};

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ selectedDate, selectedTime, onTimeSelect }) => {
    const { appointments, isLoading, error } = useAppointments(selectedDate);
    const timeSlots = generateTimeSlots(selectedDate);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const isSlotBooked = (time: string) => {
        return appointments.some(appointment => {
            const appointmentDate = new Date(appointment.appointmentDateTime);
            const appointmentTime = `${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
            return appointmentTime === time;
        });
    };

    const getCarBrandForSlot = (time: string): string | undefined => {
        const appointment = appointments.find(app => {
            const appointmentDate = new Date(app.appointmentDateTime);
            const appointmentTime = `${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
            return appointmentTime === time;
        });
        return appointment?.vehicleInfo.brand;
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Изберете свободен час
            </Typography>
            <Grid container spacing={2}>
                {timeSlots.map(time => (
                    <Grid item xs={6} sm={4} md={3} key={time}>
                        <TimeSlot
                            time={time}
                            isBooked={isSlotBooked(time)}
                            isSelected={selectedTime === time}
                            onClick={() => onTimeSelect(time)}
                            carBrand={getCarBrandForSlot(time)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
