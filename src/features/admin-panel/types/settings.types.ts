// Business Settings Types

export interface ClosedDay {
  date: Date;  // Will be stored as Firestore Timestamp
}

export interface BusinessSettings {
  prices: VehiclePrices;
  onlineDiscount: number;
  workingHours: WorkingHours;
  workingDays: WeekDay[];
  bookingWindowWeeks: number;
  contact: ContactInfo;
  closedDays: ClosedDay[];
  updatedAt?: Date;
  updatedBy?: string;
}

/** Prices in EUR (Euro) */
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

// Default settings to use as fallback (prices in EUR)
export const DEFAULT_SETTINGS: BusinessSettings = {
  prices: {
    car: 46,
    bus: 56,
    motorcycle: 31,
    taxi: 31,
    caravan: 31,
    trailer: 31,
    lpg: 51,
  },
  onlineDiscount: 5,
  workingHours: {
    start: '08:30',
    end: '17:30',
  },
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  bookingWindowWeeks: 8,
  closedDays: [],
  contact: {
    phone: '+359 XXX XXX XXX',
    email: 'info@autobosch.bg',
    address: 'Бургас, България',
  },
};
