// Business Settings Types

export interface BusinessSettings {
  prices: VehiclePrices;
  onlineDiscount: number;
  workingHours: WorkingHours;
  workingDays: WeekDay[];
  bookingWindowWeeks: number;
  contact: ContactInfo;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface VehiclePrices {
  car: number;
  bus: number;
  motorcycle: number;
  taxi: number;
  caravan: number;
  trailer: number;
  lpg: number;
}

export interface WorkingHours {
  start: string; // "HH:mm" format
  end: string;   // "HH:mm" format
}

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

// Default settings to use as fallback
export const DEFAULT_SETTINGS: BusinessSettings = {
  prices: {
    car: 90,
    bus: 110,
    motorcycle: 60,
    taxi: 60,
    caravan: 60,
    trailer: 60,
    lpg: 100,
  },
  onlineDiscount: 10,
  workingHours: {
    start: '08:30',
    end: '17:30',
  },
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  bookingWindowWeeks: 8,
  contact: {
    phone: '+359 XXX XXX XXX',
    email: 'info@autobosch.bg',
    address: 'Бургас, България',
  },
};
