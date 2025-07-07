import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import {format} from 'date-fns';
import {db} from './firebase';
import type {
    BookingFormData,
    Booking,
    BookingDocument,
    BookingStatus,
    TimeSlot,
    ApiResponse,
    CreateBookingResponse,
} from '../types/booking';
import {calculatePrice} from '../utils/constants';

const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Convert BookingFormData to Firestore document
 */
const toFirestoreDocument = (formData: BookingFormData): Omit<BookingDocument, 'createdAt' | 'updatedAt'> => {
    const priceInfo = calculatePrice(formData.vehicleType, true);

    return {
        customerName: formData.customerName,
        email: formData.email || '',
        phone: formData.phone,
        registrationPlate: formData.registrationPlate.toUpperCase(),
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand || '',
        is4x4: formData.is4x4 || false,
        appointmentDate: Timestamp.fromDate(formData.appointmentDate),
        appointmentTime: formData.appointmentTime,
        price: priceInfo.finalPrice,
        status: 'confirmed' as BookingStatus,
        notes: formData.notes || '',
    };
};

/**
 * Convert Firestore document to Booking
 */
const fromFirestoreDocument = (id: string, doc: BookingDocument): Booking => {
    return {
        id,
        customerName: doc.customerName,
        email: doc.email,
        phone: doc.phone,
        registrationPlate: doc.registrationPlate,
        vehicleType: doc.vehicleType,
        vehicleBrand: doc.vehicleBrand,
        is4x4: doc.is4x4,
        appointmentDate: doc.appointmentDate.toDate(),
        appointmentTime: doc.appointmentTime,
        price: doc.price,
        status: doc.status,
        createdAt: doc.createdAt.toDate(),
        updatedAt: doc.updatedAt?.toDate(),
        notes: doc.notes,
    };
};

/**
 * Create a new booking
 */
export const createBooking = async (formData: BookingFormData): Promise<ApiResponse<CreateBookingResponse>> => {
    try {
        // Check if time slot is still available
        const isAvailable = await isTimeSlotAvailable(formData.appointmentDate, formData.appointmentTime);
        if (!isAvailable) {
            return {
                success: false,
                error: 'Избраният час вече е зает. Моля изберете друг час.',
            };
        }

        // Prepare document data
        const docData = toFirestoreDocument(formData);
        const now = Timestamp.now();

        // Add to Firestore
        const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
            ...docData,
            createdAt: now,
        });

        // Generate confirmation number
        const confirmationNumber = `AC${format(formData.appointmentDate, 'yyyyMMdd')}${docRef.id
            .slice(-6)
            .toUpperCase()}`;

        return {
            success: true,
            data: {
                bookingId: docRef.id,
                confirmationNumber,
                appointmentDetails: {
                    date: format(formData.appointmentDate, 'dd.MM.yyyy'),
                    time: formData.appointmentTime,
                    price: docData.price,
                },
            },
            message: 'Записването е успешно създадено!',
        };
    } catch (error) {
        console.error('Error creating booking:', error);
        return {
            success: false,
            error: 'Възникна грешка при записването. Моля опитайте отново.',
        };
    }
};

/**
 * Check if a time slot is available
 */
export const isTimeSlotAvailable = async (date: Date, time: string): Promise<boolean> => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay)),
            where('appointmentTime', '==', time),
            where('status', '==', 'confirmed')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    } catch (error) {
        console.error('Error checking time slot availability:', error);
        return false;
    }
};

/**
 * Get available time slots for a specific date
 */
export const getAvailableTimeSlots = async (date: Date): Promise<ApiResponse<TimeSlot[]>> => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all bookings for the date
        const q = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay)),
            where('status', '==', 'confirmed')
        );

        const querySnapshot = await getDocs(q);
        const bookedTimes = querySnapshot.docs.map((doc) => doc.data().appointmentTime);

        // Import generateTimeSlots from dateHelpers
        const {generateTimeSlots} = await import('../utils/dateHelpers');
        const allSlots = generateTimeSlots(date);

        // Mark slots as unavailable if they're booked
        const availableSlots = allSlots.map((slot) => ({
            ...slot,
            available: slot.available && !bookedTimes.includes(slot.time),
            bookingId: bookedTimes.includes(slot.time) ? 'booked' : undefined,
        }));

        return {
            success: true,
            data: availableSlots,
        };
    } catch (error) {
        console.error('Error getting available time slots:', error);
        return {
            success: false,
            error: 'Възникна грешка при зареждане на свободните часове.',
            data: [],
        };
    }
};

/**
 * Get bookings for a specific date range
 */
export const getBookings = async (
    startDate: Date,
    endDate: Date,
    status?: BookingStatus
): Promise<ApiResponse<Booking[]>> => {
    try {
        let q = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startDate)),
            where('appointmentDate', '<=', Timestamp.fromDate(endDate)),
            orderBy('appointmentDate', 'asc'),
            orderBy('appointmentTime', 'asc')
        );

        if (status) {
            q = query(
                collection(db, APPOINTMENTS_COLLECTION),
                where('appointmentDate', '>=', Timestamp.fromDate(startDate)),
                where('appointmentDate', '<=', Timestamp.fromDate(endDate)),
                where('status', '==', status),
                orderBy('appointmentDate', 'asc'),
                orderBy('appointmentTime', 'asc')
            );
        }

        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map((doc) => fromFirestoreDocument(doc.id, doc.data() as BookingDocument));

        return {
            success: true,
            data: bookings,
        };
    } catch (error) {
        console.error('Error getting bookings:', error);
        return {
            success: false,
            error: 'Възникна грешка при зареждане на записванията.',
            data: [],
        };
    }
};

/**
 * Get bookings for a specific date
 */
export const getBookingsForDate = async (date: Date): Promise<ApiResponse<Booking[]>> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return getBookings(startOfDay, endOfDay);
};

/**
 * Get appointment counts by date for calendar display
 */
export const getAppointmentCounts = async (
    startDate: Date,
    endDate: Date
): Promise<ApiResponse<Record<string, number>>> => {
    try {
        const result = await getBookings(startDate, endDate, 'confirmed');

        if (!result.success || !result.data) {
            return {
                success: false,
                error: result.error,
                data: {},
            };
        }

        // Group by date
        const counts: Record<string, number> = {};
        result.data.forEach((booking) => {
            const dateKey = format(booking.appointmentDate, 'yyyy-MM-dd');
            counts[dateKey] = (counts[dateKey] || 0) + 1;
        });

        return {
            success: true,
            data: counts,
        };
    } catch (error) {
        console.error('Error getting appointment counts:', error);
        return {
            success: false,
            error: 'Възникна грешка при зареждане на броя записвания.',
            data: {},
        };
    }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string, reason?: string): Promise<ApiResponse<void>> => {
    try {
        const bookingRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);
        await updateDoc(bookingRef, {
            status: 'cancelled',
            updatedAt: Timestamp.now(),
            cancelReason: reason || '',
        });

        return {
            success: true,
            message: 'Записването е успешно отказано.',
        };
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return {
            success: false,
            error: 'Възникна грешка при отказване на записването.',
        };
    }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<ApiResponse<void>> => {
    try {
        const bookingRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);
        await updateDoc(bookingRef, {
            status,
            updatedAt: Timestamp.now(),
        });

        return {
            success: true,
            message: `Статусът е променен на "${status}".`,
        };
    } catch (error) {
        console.error('Error updating booking status:', error);
        return {
            success: false,
            error: 'Възникна грешка при промяна на статуса.',
        };
    }
};

/**
 * Delete a booking permanently
 */
export const deleteBooking = async (bookingId: string): Promise<ApiResponse<void>> => {
    try {
        const bookingRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);
        await deleteDoc(bookingRef);

        return {
            success: true,
            message: 'Записването е изтрито.',
        };
    } catch (error) {
        console.error('Error deleting booking:', error);
        return {
            success: false,
            error: 'Възникна грешка при изтриване на записването.',
        };
    }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<
    ApiResponse<{
        todayAppointments: number;
        weekAppointments: number;
        monthAppointments: number;
        totalRevenue: number;
    }>
> => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get all appointments for calculations
        const [todayResult, weekResult, monthResult] = await Promise.all([
            getBookingsForDate(today),
            getBookings(startOfWeek, today),
            getBookings(startOfMonth, today),
        ]);

        const todayAppointments = todayResult.data?.length || 0;
        const weekAppointments = weekResult.data?.length || 0;
        const monthAppointments = monthResult.data?.length || 0;

        // Calculate total revenue for the month
        const totalRevenue = monthResult.data?.reduce((sum, booking) => sum + booking.price, 0) || 0;

        return {
            success: true,
            data: {
                todayAppointments,
                weekAppointments,
                monthAppointments,
                totalRevenue,
            },
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return {
            success: false,
            error: 'Възникна грешка при зареждане на статистиките.',
            data: {
                todayAppointments: 0,
                weekAppointments: 0,
                monthAppointments: 0,
                totalRevenue: 0,
            },
        };
    }
};
