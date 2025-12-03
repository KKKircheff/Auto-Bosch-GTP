// src/types/booking.ts
import {Timestamp} from 'firebase/firestore';

export type VehicleType = 'car' | 'bus' | 'motorcycle' | 'taxi' | 'caravan' | 'trailer' | 'lpg';

export type BookingStatus = 'confirmed' | 'cancelled';

export interface BookingFormData {
    // Customer information
    customerName: string;
    email?: string; // Made optional to match the schema
    phone: string;
    registrationPlate: string;

    // Vehicle information
    vehicleType: VehicleType;
    vehicleBrand?: string;
    is4x4?: boolean;

    // Appointment details
    appointmentDate: Date;
    appointmentTime: string;

    // Additional notes
    notes?: string;
}

export interface Booking extends Omit<BookingFormData, 'email'> {
    id: string;
    email: string; // Always required in saved booking
    price: number;
    status: BookingStatus;
    createdAt: Date;
    updatedAt?: Date;
}

// Firestore document structure (using Firestore Timestamp)
export interface BookingDocument {
    customerName: string;
    email: string;
    phone: string;
    registrationPlate: string;
    vehicleType: VehicleType;
    vehicleBrand?: string;
    is4x4?: boolean;
    appointmentDate: Timestamp;
    appointmentTime: string;
    price: number;
    status: BookingStatus;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    notes?: string;
}

// src/types/appointment.ts
export interface TimeSlot {
    time: string;
    available: boolean;
    bookingId?: string;
    booking?: {
        customerName: string;
        phone: string;
        registrationPlate: string;
        vehicleType: VehicleType;
        vehicleBrand?: string;
        price: number;
        is4x4?: boolean;
    };
}

export interface DaySchedule {
    date: Date;
    slots: TimeSlot[];
    isWorkingDay: boolean;
    isPastDate: boolean;
}

export interface CalendarMonth {
    year: number;
    month: number;
    days: DaySchedule[];
}

export interface AppointmentSummary {
    date: Date;
    time: string;
    customer: string;
    vehicle: string;
    service: string;
    status: BookingStatus;
    price: number;
}

// src/types/vehicle.ts
export interface VehicleInfo {
    type: VehicleType;
    brand?: string;
    is4x4?: boolean;
}

export interface VehicleFormConfig {
    showBrands: boolean;
    brands: readonly string[];
    show4x4: boolean;
}

export interface PriceCalculation {
    basePrice: number;
    discount: number;
    finalPrice: number;
}

// src/types/form.ts
import * as z from 'zod';

// Validation schemas using Zod
export const bookingFormSchema = z.object({
    customerName: z
        .string()
        .min(2, 'Името трябва да бъде поне 2 символа')
        .max(50, 'Името не може да бъде повече от 50 символа'),

    email: z.string().email('Невалиден имейл адрес').optional().or(z.literal('')),

    phone: z
        .string()
        .min(1, 'Телефонният номер е задължителен')
        .regex(/^(\+359|0)[0-9]{8,9}$/, 'Невалиден телефонен номер (използвайте формат +359XXXXXXXXX или 0XXXXXXXXX)'),

    registrationPlate: z
        .string()
        .min(1, 'Регистрационният номер е задължителен')
        .regex(/^[A-Za-z\u0400-\u04FF0-9\-]+$/, 'Регистрационният номер може да съдържа само букви, цифри и тирета'),

    vehicleType: z.enum(['car', 'bus', 'motorcycle', 'taxi', 'caravan', 'trailer', 'lpg']),

    vehicleBrand: z.string().optional(),

    is4x4: z.boolean().optional(),

    appointmentDate: z.date({
        required_error: 'Моля изберете дата',
    }),

    appointmentTime: z.string().min(1, 'Моля изберете час'),

    notes: z.string().max(500, 'Бележките не могат да бъдат повече от 500 символа').optional(),
});

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;

// Form validation error types
export interface FormFieldError {
    field: keyof BookingFormSchema;
    message: string;
}

export interface FormValidationResult {
    isValid: boolean;
    errors: FormFieldError[];
}

// src/types/admin.ts
export interface AdminUser {
    id: string;
    email: string;
    role: 'admin';
    createdAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface DashboardStats {
    todayAppointments: number;
    weekAppointments: number;
    periodAppointments: number;
    totalAppointments: number;
}

export interface AppointmentFilters {
    status?: BookingStatus;
    vehicleType?: VehicleType;
    dateFrom?: Date;
    dateTo?: Date;
    searchTerm?: string;
}

// src/types/api.ts
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface CreateBookingRequest {
    bookingData: BookingFormData;
}

export interface CreateBookingResponse {
    bookingId: string;
    confirmationNumber: string;
    appointmentDetails: {
        date: string;
        time: string;
        price: number;
    };
}

export interface GetAvailableSlotsRequest {
    date: Date;
}

export interface GetAvailableSlotsResponse {
    date: Date;
    slots: TimeSlot[];
}

export interface CancelBookingRequest {
    bookingId: string;
    reason?: string;
}

// src/types/notifications.ts
export interface EmailTemplate {
    to: string;
    subject: string;
    template: 'booking-confirmation' | 'booking-cancelled' | 'admin-notification';
    data: Record<string, any>;
}

export interface BookingConfirmationData {
    customerName: string;
    appointmentDate: string;
    appointmentTime: string;
    vehicleType: string;
    vehicleBrand?: string;
    registrationPlate: string;
    price: number;
    finalPrice: number;
    garageContact: {
        phone: string;
        email: string;
        address: string;
    };
}

export interface AdminNotificationData {
    customerName: string;
    phone: string;
    email: string;
    appointmentDate: string;
    appointmentTime: string;
    vehicleInfo: string;
    price: number;
    bookingId: string;
}

// src/types/calendar.ts
export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isWorkingDay: boolean;
    isPastDate: boolean;
    isClosedDay?: boolean;
    hasAppointments: boolean;
    appointmentCount: number;
    isFullyBooked?: boolean;
}

export interface CalendarWeek {
    days: CalendarDay[];
}

export interface CalendarProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    highlightedDates?: Date[];
}

// src/types/common.ts
export interface LoadingState {
    isLoading: boolean;
    error?: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Global app state
export interface AppState {
    user: AdminUser | null;
    loading: boolean;
    error?: string;
}
