import {collection, doc, getDocs, deleteDoc, query, where, orderBy, Timestamp, limit} from 'firebase/firestore';
import {httpsCallable} from 'firebase/functions';
import {db, functions} from './firebase';
import type {Appointment, AppointmentData, TimeSlot, BookingFormData} from '../types/appointment';

// Collection references
const appointmentsRef = collection(db, 'appointments');

// Cloud functions
const createAppointmentFn = httpsCallable(functions, 'createAppointment');
const getAvailableSlotsFn = httpsCallable(functions, 'getAvailableSlots');

// Create new appointment
export const createAppointment = async (formData: BookingFormData): Promise<string> => {
    try {
        const appointmentData: AppointmentData = {
            customerInfo: {
                registrationPlate: formData.registrationPlate.toUpperCase(),
                phoneNumber: formData.phoneNumber,
                email: formData.email,
            },
            vehicleInfo: {
                serviceType: formData.serviceType,
                brand: formData.brand,
                model: formData.model,
                is4x4: formData.is4x4,
            },
            appointmentDateTime: formData.appointmentDateTime,
        };

        const result = await createAppointmentFn(appointmentData);
        return result.data as string; // Returns appointment ID
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw new Error('Failed to create appointment');
    }
};

// Get available time slots for a date range
export const getAvailableSlots = async (startDate: Date, endDate: Date): Promise<TimeSlot[]> => {
    try {
        const result = await getAvailableSlotsFn({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });

        const slots = result.data as Array<{datetime: string; available: boolean}>;
        return slots.map((slot) => ({
            datetime: new Date(slot.datetime),
            available: slot.available,
        }));
    } catch (error) {
        console.error('Error fetching available slots:', error);
        throw new Error('Failed to fetch available slots');
    }
};

// Get all appointments (for admin dashboard)
export const getAppointments = async (startDate?: Date, limitCount?: number): Promise<Appointment[]> => {
    try {
        let q = query(appointmentsRef, orderBy('appointmentDateTime', 'asc'));

        if (startDate) {
            q = query(q, where('appointmentDateTime', '>=', Timestamp.fromDate(startDate)));
        }

        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            appointmentDateTime: doc.data().appointmentDateTime.toDate(),
            createdAt: doc.data().createdAt.toDate(),
        })) as Appointment[];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Failed to fetch appointments');
    }
};

// Delete appointment (admin only)
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
    try {
        await deleteDoc(doc(appointmentsRef, appointmentId));
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw new Error('Failed to delete appointment');
    }
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId: string): Promise<Appointment | null> => {
    try {
        const docRef = doc(appointmentsRef, appointmentId);
        const docSnap = await getDocs(query(appointmentsRef, where('__name__', '==', appointmentId)));

        if (docSnap.empty) {
            return null;
        }

        const appointmentDoc = docSnap.docs[0];
        return {
            id: appointmentDoc.id,
            ...appointmentDoc.data(),
            appointmentDateTime: appointmentDoc.data().appointmentDateTime.toDate(),
            createdAt: appointmentDoc.data().createdAt.toDate(),
        } as Appointment;
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return null;
    }
};
