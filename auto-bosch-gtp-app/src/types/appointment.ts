// src/types/appointment.ts
import {z} from 'zod';

// Service type enum
export const ServiceType = {
    CAR: 'car',
    BUS: 'bus',
    MOTORCYCLE: 'motorcycle',
    TAXI: 'taxi',
    CARAVAN: 'caravan',
    HANGER: 'hanger',
    LPG: 'lpg',
} as const;

export type ServiceTypeValue = (typeof ServiceType)[keyof typeof ServiceType];

// Bulgarian registration plate regex: 1-2 letters + 4 numbers + 0-2 letters
const bulgarianPlateRegex = /^[A-Z]{1,2}\d{4}[A-Z]{0,2}$/;

// Bulgarian phone number regex (mobile format)
const bulgarianPhoneRegex = /^(\+359|0)[87-9]\d{8}$/;

// Zod validation schemas
export const registrationPlateSchema = z
    .string()
    .min(5, 'Registration plate is too short')
    .max(8, 'Registration plate is too long')
    .regex(bulgarianPlateRegex, 'Invalid Bulgarian registration plate format')
    .transform((val) => val.toUpperCase());

export const phoneNumberSchema = z.string().regex(bulgarianPhoneRegex, 'Invalid Bulgarian phone number');

export const emailSchema = z.string().email('Invalid email address');

export const serviceTypeSchema = z.enum([
    ServiceType.CAR,
    ServiceType.BUS,
    ServiceType.MOTORCYCLE,
    ServiceType.TAXI,
    ServiceType.CARAVAN,
    ServiceType.HANGER,
    ServiceType.LPG,
]);

export const vehicleInfoSchema = z.object({
    serviceType: serviceTypeSchema,
    brand: z.string().optional(),
    model: z.string().optional(),
    is4x4: z.boolean().default(false),
});

export const customerInfoSchema = z.object({
    registrationPlate: registrationPlateSchema,
    phoneNumber: phoneNumberSchema,
    email: emailSchema,
});

export const appointmentSchema = z.object({
    customerInfo: customerInfoSchema,
    vehicleInfo: vehicleInfoSchema,
    appointmentDateTime: z.date(),
});

// TypeScript types derived from Zod schemas
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type VehicleInfo = z.infer<typeof vehicleInfoSchema>;
export type AppointmentData = z.infer<typeof appointmentSchema>;

// Extended appointment type for database
export const appointmentDbSchema = appointmentSchema.extend({
    id: z.string(),
    status: z.enum(['booked', 'completed', 'cancelled']),
    price: z.number(),
    createdAt: z.date(),
});

export type Appointment = z.infer<typeof appointmentDbSchema>;

// Form data type for the booking form
export const bookingFormSchema = z.object({
    registrationPlate: z.string().min(1, 'Registration plate is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().min(1, 'Email is required'),
    serviceType: serviceTypeSchema,
    brand: z.string().optional(),
    model: z.string().optional(),
    is4x4: z.boolean().default(false),
    appointmentDateTime: z.date({
        required_error: 'Please select appointment date and time',
    }),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Car brand from API
export const carBrandSchema = z.object({
    make: z.string(),
});

export type CarBrand = z.infer<typeof carBrandSchema>;

// API response schema
export const carBrandsApiResponseSchema = z.object({
    results: z.array(carBrandSchema),
});

// Garage settings
export const garageSettingsSchema = z.object({
    businessHours: z.object({
        start: z.string(), // "09:00"
        end: z.string(), // "17:00"
    }),
    workingDays: z.array(z.number().min(0).max(6)), // 0-6 for Sunday-Saturday
    pricing: z.object({
        car: z.number(),
        bus: z.number(),
        motorcycle: z.number(),
        taxi: z.number(),
        caravan: z.number(),
        hanger: z.number(),
        lpg: z.number(),
    }),
});

export type GarageSettings = z.infer<typeof garageSettingsSchema>;

// Available time slot
export const timeSlotSchema = z.object({
    datetime: z.date(),
    available: z.boolean(),
});

export type TimeSlot = z.infer<typeof timeSlotSchema>;

// Constants for form options
export const SERVICE_TYPE_OPTIONS = [
    {value: ServiceType.CAR, label: 'Car'},
    {value: ServiceType.BUS, label: 'Bus'},
    {value: ServiceType.MOTORCYCLE, label: 'Motorcycle'},
    {value: ServiceType.TAXI, label: 'Taxi'},
    {value: ServiceType.CARAVAN, label: 'Caravan'},
    {value: ServiceType.HANGER, label: 'Hanger'},
    {value: ServiceType.LPG, label: 'LPG Installation Check'},
] as const;

// Temporary arrays for bus and motorcycle brands
export const BUS_BRANDS = ['Other'] as const;
export const MOTORCYCLE_BRANDS = ['Other'] as const;
