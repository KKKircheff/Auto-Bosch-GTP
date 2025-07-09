// src/services/appointments.ts - Fixed version with proper conflict detection
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
    runTransaction,
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
 * FIXED: Create exact date match for better conflict detection
 */
const createExactDateTimestamp = (date: Date, time: string): Timestamp => {
    // Parse the time string (e.g., "09:30")
    const [hours, minutes] = time.split(':').map(Number);

    // Create a new date with the exact time
    const exactDateTime = new Date(date);
    exactDateTime.setHours(hours, minutes, 0, 0);

    return Timestamp.fromDate(exactDateTime);
};

/**
 * FIXED: Check if a specific time slot is available with proper date handling
 */
export const isTimeSlotAvailable = async (date: Date, time: string): Promise<boolean> => {
    try {
        console.log('FIXED: Checking availability for:', {
            date: date.toISOString(),
            time,
            dateString: format(date, 'yyyy-MM-dd'),
        });

        // Create the exact timestamp for this appointment
        const appointmentTimestamp = createExactDateTimestamp(date, time);

        // Also check using date string for additional safety
        const dateString = format(date, 'yyyy-MM-dd');

        // Query for any confirmed appointments with this exact timestamp OR date+time combination
        const exactQuery = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '==', appointmentTimestamp),
            where('status', '==', 'confirmed')
        );

        // Also query by date range and time (fallback safety check)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const rangeQuery = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay)),
            where('appointmentTime', '==', time),
            where('status', '==', 'confirmed')
        );

        // Execute both queries
        const [exactSnapshot, rangeSnapshot] = await Promise.all([getDocs(exactQuery), getDocs(rangeQuery)]);

        const hasExactMatch = !exactSnapshot.empty;
        const hasRangeMatch = !rangeSnapshot.empty;
        const isAvailable = !hasExactMatch && !hasRangeMatch;

        console.log('FIXED: Availability check results:', {
            hasExactMatch,
            hasRangeMatch,
            isAvailable,
            exactDocs: exactSnapshot.size,
            rangeDocs: rangeSnapshot.size,
        });

        // Log existing bookings for debugging
        if (hasRangeMatch) {
            rangeSnapshot.forEach((doc) => {
                const booking = doc.data() as BookingDocument;
                console.log('FIXED: Existing booking found:', {
                    id: doc.id,
                    time: booking.appointmentTime,
                    date: booking.appointmentDate.toDate().toISOString(),
                    customer: booking.customerName,
                });
            });
        }

        return isAvailable;
    } catch (error) {
        console.error('FIXED: Error checking time slot availability:', error);
        // Return false on error to be safe - don't allow booking if we can't verify
        return false;
    }
};

/**
 * FIXED: Check availability within transaction context
 */
const isTimeSlotAvailableInTransaction = async (transaction: any, date: Date, time: string): Promise<boolean> => {
    try {
        console.log('FIXED: Checking availability within transaction for:', {date: date.toISOString(), time});

        // Create queries (same as above but using transaction.get)
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

        // Use transaction.get for atomic read
        const querySnapshot = await transaction.get(q);
        const isAvailable = querySnapshot.empty;

        console.log('FIXED: Transaction availability check:', {
            isAvailable,
            existingBookings: querySnapshot.size,
        });

        return isAvailable;
    } catch (error) {
        console.error('FIXED: Error checking availability in transaction:', error);
        return false;
    }
};

/**
 * FIXED: Create a new booking with proper atomic transaction and conflict checking
 */
export const createBooking = async (formData: BookingFormData): Promise<ApiResponse<CreateBookingResponse>> => {
    console.log('=== FIXED BOOKING START ===');
    console.log('1. Received form data:', {
        customerName: formData.customerName,
        appointmentDate: formData.appointmentDate.toISOString(),
        appointmentTime: formData.appointmentTime,
        vehicleType: formData.vehicleType,
    });

    try {
        // Pre-check availability (fast fail)
        console.log('2. Pre-checking availability...');
        const preCheckAvailable = await isTimeSlotAvailable(formData.appointmentDate, formData.appointmentTime);

        if (!preCheckAvailable) {
            console.log('2.1. Pre-check failed - slot already taken');
            return {
                success: false,
                error: 'Избраният час вече е зает. Моля изберете друг час.',
            };
        }

        console.log('2.2. Pre-check passed, proceeding with transaction...');

        // Use Firestore transaction to ensure atomicity
        const result = await runTransaction(db, async (transaction) => {
            console.log('3. Starting atomic transaction...');

            // FIXED: Check availability again within the transaction for atomic operation
            const isStillAvailable = await isTimeSlotAvailableInTransaction(
                transaction,
                formData.appointmentDate,
                formData.appointmentTime
            );

            if (!isStillAvailable) {
                console.log('3.1. Transaction check failed - slot was taken during pre-check');
                throw new Error('SLOT_UNAVAILABLE');
            }

            console.log('3.2. Transaction check passed, creating booking...');

            // Prepare document data
            const docData = toFirestoreDocument(formData);
            const now = Timestamp.now();

            const finalDocData = {
                ...docData,
                createdAt: now,
                // Add additional fields for better conflict detection
                dateString: format(formData.appointmentDate, 'yyyy-MM-dd'),
                timeSlot: formData.appointmentTime,
                fullDateTime: createExactDateTimestamp(formData.appointmentDate, formData.appointmentTime),
            };

            console.log('3.3. Final document data prepared:', {
                date: finalDocData.appointmentDate.toDate().toISOString(),
                time: finalDocData.appointmentTime,
                dateString: finalDocData.dateString,
                fullDateTime: finalDocData.fullDateTime.toDate().toISOString(),
            });

            // Create the booking document using transaction
            const collectionRef = collection(db, APPOINTMENTS_COLLECTION);
            const docRef = doc(collectionRef); // Generate ID first

            // Use transaction.set for atomic write
            transaction.set(docRef, finalDocData);

            console.log('3.4. Booking created successfully with ID:', docRef.id);

            return {
                bookingId: docRef.id,
                appointmentDetails: {
                    date: format(formData.appointmentDate, 'dd.MM.yyyy'),
                    time: formData.appointmentTime,
                    price: docData.price,
                },
            };
        });

        // Generate confirmation number
        const confirmationNumber = `AC${format(formData.appointmentDate, 'yyyyMMdd')}${result.bookingId
            .slice(-6)
            .toUpperCase()}`;

        console.log('4. Generated confirmation number:', confirmationNumber);
        console.log('=== FIXED BOOKING SUCCESS ===');

        return {
            success: true,
            data: {
                ...result,
                confirmationNumber,
            },
            message: 'Записването е успешно създадено!',
        };
    } catch (error) {
        console.log('=== FIXED BOOKING ERROR ===');
        console.error('Error details:', error);

        if (error instanceof Error) {
            if (error.message === 'SLOT_UNAVAILABLE') {
                return {
                    success: false,
                    error: 'Избраният час вече е зает. Моля изберете друг час.',
                };
            }
        }

        return {
            success: false,
            error: `Възникна грешка при записването: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`,
        };
    }
};

/**
 * FIXED: Get available time slots with better conflict detection
 */
export const getAvailableTimeSlots = async (date: Date): Promise<ApiResponse<TimeSlot[]>> => {
    try {
        console.log('FIXED: Getting time slots for date:', date.toISOString());

        // Import generateTimeSlots from dateHelpers
        const {generateTimeSlots} = await import('../utils/dateHelpers');

        // Get all possible time slots for the date
        const allSlots = generateTimeSlots(date);

        // Get existing bookings for this date using both exact and range queries
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Main query by date range
        const rangeQuery = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay)),
            where('status', '==', 'confirmed'),
            orderBy('appointmentTime')
        );

        // Additional query by date string (if field exists)
        const dateString = format(date, 'yyyy-MM-dd');
        const dateStringQuery = query(
            collection(db, APPOINTMENTS_COLLECTION),
            where('dateString', '==', dateString),
            where('status', '==', 'confirmed')
        );

        // Execute both queries
        const [rangeSnapshot, dateStringSnapshot] = await Promise.all([
            getDocs(rangeQuery),
            getDocs(dateStringQuery).catch(() => ({docs: []})), // Fallback if field doesn't exist
        ]);

        // Combine results and get unique booked times
        const bookedTimes = new Set<string>();

        rangeSnapshot.forEach((doc) => {
            const booking = doc.data() as BookingDocument;
            bookedTimes.add(booking.appointmentTime);
            console.log('FIXED: Found range booking:', {
                id: doc.id,
                time: booking.appointmentTime,
                date: booking.appointmentDate.toDate().toISOString(),
            });
        });

        if (dateStringSnapshot.docs) {
            dateStringSnapshot.docs.forEach((doc) => {
                const booking = doc.data() as BookingDocument;
                bookedTimes.add(booking.appointmentTime);
                console.log('FIXED: Found dateString booking:', {
                    id: doc.id,
                    time: booking.appointmentTime,
                    dateString: booking.dateString || 'N/A',
                });
            });
        }

        console.log('FIXED: All booked times found:', Array.from(bookedTimes));

        // Mark slots as unavailable if they're booked
        const availableSlots = allSlots.map((slot) => ({
            ...slot,
            available: slot.available && !bookedTimes.has(slot.time),
            bookingId: bookedTimes.has(slot.time) ? 'booked' : undefined,
        }));

        const availableCount = availableSlots.filter((slot) => slot.available).length;
        console.log(`FIXED: Returning ${availableCount}/${allSlots.length} available slots`);

        return {
            success: true,
            data: availableSlots,
        };
    } catch (error) {
        console.error('FIXED: Error getting available time slots:', error);
        return {
            success: false,
            error: 'Възникна грешка при зареждане на свободните часове.',
            data: [],
        };
    }
};

/**
 * IMPROVED: Pre-booking validation with enhanced checks
 */
export const validateBookingSlot = async (date: Date, time: string): Promise<ApiResponse<boolean>> => {
    try {
        console.log('FIXED: Validating booking slot:', {date: date.toISOString(), time});

        const isAvailable = await isTimeSlotAvailable(date, time);

        console.log('FIXED: Validation result:', {isAvailable});

        return {
            success: true,
            data: isAvailable,
            message: isAvailable ? 'Часът е свободен' : 'Часът вече е зает',
        };
    } catch (error) {
        console.error('FIXED: Error validating booking slot:', error);
        return {
            success: false,
            error: 'Възникна грешка при проверка на часа.',
            data: false,
        };
    }
};

// Rest of the functions remain the same...
// (getBookings, getBookingsForDate, getAppointmentCounts, etc.)

/**
 * Get bookings for a specific date range
 */
export const getBookings = async (
    startDate: Date,
    endDate: Date,
    status?: BookingStatus
): Promise<ApiResponse<Booking[]>> => {
    try {
        console.log('Getting bookings for date range:', {startDate, endDate, status});

        let q;

        if (status) {
            q = query(
                collection(db, APPOINTMENTS_COLLECTION),
                where('appointmentDate', '>=', Timestamp.fromDate(startDate)),
                where('appointmentDate', '<=', Timestamp.fromDate(endDate)),
                where('status', '==', status),
                orderBy('appointmentDate'),
                orderBy('appointmentTime')
            );
        } else {
            q = query(
                collection(db, APPOINTMENTS_COLLECTION),
                where('appointmentDate', '>=', Timestamp.fromDate(startDate)),
                where('appointmentDate', '<=', Timestamp.fromDate(endDate)),
                orderBy('appointmentDate'),
                orderBy('appointmentTime')
            );
        }

        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map((doc) => fromFirestoreDocument(doc.id, doc.data() as BookingDocument));

        console.log('Found bookings:', bookings.length);

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
        console.log('Getting appointment counts for:', {startDate, endDate});

        const result = await getBookings(startDate, endDate, 'confirmed');

        if (!result.success || !result.data) {
            return {
                success: true,
                data: {},
            };
        }

        // Group by date
        const counts: Record<string, number> = {};
        result.data.forEach((booking) => {
            const dateKey = format(booking.appointmentDate, 'yyyy-MM-dd');
            counts[dateKey] = (counts[dateKey] || 0) + 1;
        });

        console.log('Appointment counts:', counts);

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
