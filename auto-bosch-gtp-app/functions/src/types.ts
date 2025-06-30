export interface AppointmentData {
  customerInfo: {
    registrationPlate: string;
    phoneNumber: string;
    email: string;
  };
  vehicleInfo: {
    serviceType: 'car' | 'bus' | 'motorcycle' | 'taxi' | 'caravan' | 'hanger' | 'lpg';
    brand?: string;
    model?: string;
    is4x4?: boolean;
  };
  appointmentDateTime: Date;
  price: number;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface TimeSlot {
  datetime: string;
  available: boolean;
}