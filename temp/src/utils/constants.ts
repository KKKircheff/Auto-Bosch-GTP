export const BUSINESS_HOURS = {
  START: '09:00',
  END: '17:00',
} as const;

export const WORKING_DAYS = [1, 2, 3, 4, 5] as const; // Monday to Friday

export const SLOT_DURATION_MINUTES = 15;

export const MAX_BOOKING_WEEKS = 8;

export const DEFAULT_PRICING = {
  car: 50,
  bus: 80,
  motorcycle: 30,
  taxi: 55, // Slightly higher than regular car
  caravan: 60,
  hanger: 40,
  lpg: 45,
} as const;