// src/services/appointments.ts - Corrected version using predictable document IDs for atomic operations
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    runTransaction,
    Transaction,
    getDoc,
    setDoc,
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
 * Generates a predictable document ID based on date and time.
 * Format: YYYY-MM-DD_HH:mm
 */
const generateAppointmentId = (date: Date, time: string): string => {
    return `${format(date, 'yyyy-MM-dd')}_${time}`;
};

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
 * CORRECTED: Check if a specific time slot is available by checking for a specific document's existence.
 */
export const isTimeSlotAvailable = async (date: Date, time: string): Promise<boolean> => {
    try {
        const docId = generateAppointmentId(date, time);
        const docRef = doc(db, APPOINTMENTS_COLLECTION, docId);
        const docSnap = await getDoc(docRef);
        return !docSnap.exists();
    } catch (error) {
        console.error('Error checking time slot availability:', error);
        return false; // Safer to assume not available on error
    }
};

/**
 * CORRECTED: Check availability within a transaction context by reading a specific document.
 */
const isTimeSlotAvailableInTransaction = async (
    transaction: Transaction,
    date: Date,
    time: string
): Promise<boolean> => {
    const docId = generateAppointmentId(date, time);
    const docRef = doc(db, APPOINTMENTS_COLLECTION, docId);
    const docSnap = await transaction.get(docRef);
    return !docSnap.exists();
};

/**
 * CORRECTED: Create a new booking with a proper atomic transaction using a predictable document ID.
 */
export const createBooking = async (formData: BookingFormData): Promise<ApiResponse<CreateBookingResponse>> => {
    console.log('=== ATOMIC BOOKING START ===');
    try {
        const result = await runTransaction(db, async (transaction) => {
            // 1. Check availability again within the transaction for a guaranteed atomic operation
            const isStillAvailable = await isTimeSlotAvailableInTransaction(
                transaction,
                formData.appointmentDate,
                formData.appointmentTime
            );

            if (!isStillAvailable) {
                console.error('Booking failed: Slot was taken during the transaction.');
                throw new Error('SLOT_UNAVAILABLE');
            }

            // 2. Prepare document data
            const docData = toFirestoreDocument(formData);
            const now = Timestamp.now();
            const finalDocData: BookingDocument = {
                ...docData,
                createdAt: now,
                updatedAt: now,
            };

            // 3. Create the booking document with the predictable ID
            const docId = generateAppointmentId(formData.appointmentDate, formData.appointmentTime);
            const docRef = doc(db, APPOINTMENTS_COLLECTION, docId);
            transaction.set(docRef, finalDocData);

            console.log('Booking created successfully with predictable ID:', docRef.id);

            return {
                bookingId: docRef.id,
                appointmentDetails: {
                    date: format(formData.appointmentDate, 'dd.MM.yyyy'),
                    time: formData.appointmentTime,
                    price: docData.price,
                },
            };
        });

        const confirmationNumber = `AC${format(formData.appointmentDate, 'yyyyMMdd')}${result.bookingId
            .slice(-6)
            .toUpperCase()}`;

        console.log('=== ATOMIC BOOKING SUCCESS ===');

        return {
            success: true,
            data: {
                ...result,
                confirmationNumber,
            },
            message: 'Записването е успешно създадено!',
        };
    } catch (error) {
        console.log('=== ATOMIC BOOKING ERROR ===');
        console.error('Error details:', error);

        if (error instanceof Error && error.message === 'SLOT_UNAVAILABLE') {
            return {
                success: false,
                error: 'Избраният час вече е зает. Моля изберете друг час.',
            };
        }

        return {
            success: false,
            error: `Възникна грешка при записването: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`,
        };
    }
};

/**
 * Get available time slots. This logic remains largely the same, as it doesn't need to be transactional.
 */
export const getAvailableTimeSlots = async (date: Date): Promise<ApiResponse<TimeSlot[]>> => {
    try {
        const {generateTimeSlots} = await import('../utils/dateHelpers');
        const allSlots = generateTimeSlots(date);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay))
        );

        const querySnapshot = await getDocs(q);

        const bookedTimes = new Set<string>();
        querySnapshot.forEach((doc) => {
            const booking = doc.data() as BookingDocument;
            // Only consider confirmed bookings for availability
            if (booking.status === 'confirmed') {
                bookedTimes.add(booking.appointmentTime);
            }
        });

        const availableSlots = allSlots.map((slot) => ({
            ...slot,
            available: slot.available && !bookedTimes.has(slot.time),
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
 * Pre-booking validation.
 */
export const validateBookingSlot = async (date: Date, time: string): Promise<ApiResponse<boolean>> => {
    try {
        const isAvailable = await isTimeSlotAvailable(date, time);
        return {
            success: true,
            data: isAvailable,
            message: isAvailable ? 'Часът е свободен' : 'Часът вече е зает',
        };
    } catch (error) {
        console.error('Error validating booking slot:', error);
        return {
            success: false,
            error: 'Възникна грешка при проверка на часа.',
            data: false,
        };
    }
};

/**
 * Get bookings for a specific date range. Sorting is done client-side.
 */
export const getBookings = async (
    startDate: Date,
    endDate: Date,
    status?: BookingStatus
): Promise<ApiResponse<Booking[]>> => {
    try {
        const constraints = [
            where('appointmentDate', '>=', Timestamp.fromDate(startDate)),
            where('appointmentDate', '<=', Timestamp.fromDate(endDate)),
            orderBy('appointmentDate'),
        ];

        const q = query(collection(db, APPOINTMENTS_COLLECTION), ...constraints);

        const querySnapshot = await getDocs(q);
        let bookings = querySnapshot.docs.map((doc) => fromFirestoreDocument(doc.id, doc.data() as BookingDocument));

        // Filter client-side by status if provided
        if (status) {
            bookings = bookings.filter(booking => booking.status === status);
        }

        bookings.sort((a, b) => {
            if (a.appointmentDate.getTime() !== b.appointmentDate.getTime()) {
                return a.appointmentDate.getTime() - b.appointmentDate.getTime();
            }
            return a.appointmentTime.localeCompare(b.appointmentTime);
        });

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

    return getBookings(startOfDay, endOfDay, 'confirmed');
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
            return {success: true, data: {}};
        }

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
            success: true,
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

        const [todayResult, weekResult, monthResult] = await Promise.all([
            getBookingsForDate(today),
            getBookings(startOfWeek, today),
            getBookings(startOfMonth, today),
        ]);

        const todayAppointments = todayResult.data?.length || 0;
        const weekAppointments = weekResult.data?.length || 0;
        const monthAppointments = monthResult.data?.length || 0;
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
