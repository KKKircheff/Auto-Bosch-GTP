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
    .min(5, 'Регистрационният номер е твърде къс')
    .max(8, 'Регистрационният номер е твърде дълъг')
    .regex(bulgarianPlateRegex, 'Невалиден формат на български регистрационен номер')
    .transform((val) => val.toUpperCase());

export const phoneNumberSchema = z.string().regex(bulgarianPhoneRegex, 'Невалиден български телефонен номер');

export const emailSchema = z.string().email('Невалиден имейл адрес');

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
    registrationPlate: z.string().min(1, 'Регистрационният номер е задължителен'),
    phoneNumber: z.string().min(1, 'Телефонният номер е задължителен'),
    email: z.string().min(1, 'Имейлът е задължителен'),
    serviceType: serviceTypeSchema,
    brand: z.string().optional(),
    model: z.string().optional(),
    is4x4: z.boolean().default(false),
    appointmentDateTime: z.date({
        required_error: 'Моля, изберете дата и час на резервацията',
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
    workingDays: z.array(z.number().min(0).max(6)),
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
    {value: ServiceType.CAR, label: 'Лек автомобил'},
    {value: ServiceType.BUS, label: 'Автобус'},
    {value: ServiceType.MOTORCYCLE, label: 'Мотоциклет'},
    {value: ServiceType.TAXI, label: 'Такси'},
    {value: ServiceType.CARAVAN, label: 'Каравана'},
    {value: ServiceType.HANGER, label: 'Ремарке'},
    {value: ServiceType.LPG, label: 'Проверка на газова уредба'},
] as const;

// Temporary arrays for bus and motorcycle brands
export const BUS_BRANDS = ['Друга'] as const;
export const MOTORCYCLE_BRANDS = ['Друга'] as const;
