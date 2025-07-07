import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Appointment } from '../types/appointment';

export const useAppointments = (date: Date) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointmentsCol = collection(db, 'appointments');
        const q = query(
            appointmentsCol,
            where('appointmentDateTime', '>=', startOfDay),
            where('appointmentDateTime', '<', endOfDay)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedAppointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                fetchedAppointments.push({ id: doc.id, ...doc.data() } as Appointment);
            });
            setAppointments(fetchedAppointments);
            setIsLoading(false);
        }, (err) => {
            setError('Failed to fetch appointments');
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [date]);

    return { appointments, isLoading, error };
};