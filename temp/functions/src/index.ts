import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Configuration
const BUSINESS_HOURS = { START: 9, END: 17 };
const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
const SLOT_DURATION_MINUTES = 15;
const PRICING = {
  car: 50,
  bus: 80,
  motorcycle: 30,
  taxi: 55,
  caravan: 60,
  hanger: 40,
  lpg: 45,
};

// Validation schemas
const appointmentDataSchema = z.object({
  customerInfo: z.object({
    registrationPlate: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
  }),
  vehicleInfo: z.object({
    serviceType: z.enum(['car', 'bus', 'motorcycle', 'taxi', 'caravan', 'hanger', 'lpg']),
    brand: z.string().optional(),
    model: z.string().optional(),
    is4x4: z.boolean().optional(),
  }),
  appointmentDateTime: z.string().datetime(),
});

const availableSlotsRequestSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Utility functions
const generateTimeSlots = (date: Date): Date[] => {
  const slots: Date[] = [];
  const startTime = new Date(date);
  startTime.setHours(BUSINESS_HOURS.START, 0, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(BUSINESS_HOURS.END, 0, 0, 0);

  // Check if it's a working day
  if (!WORKING_DAYS.includes(date.getDay())) {
    return [];
  }

  let currentSlot = new Date(startTime);
  while (currentSlot < endTime) {
    slots.push(new Date(currentSlot));
    currentSlot.setMinutes(currentSlot.getMinutes() + SLOT_DURATION_MINUTES);
  }

  return slots;
};

const isSlotAvailable = async (datetime: Date): Promise<boolean> => {
  const appointmentsRef = db.collection('appointments');
  const snapshot = await appointmentsRef
    .where('appointmentDateTime', '==', datetime)
    .where('status', '==', 'booked')
    .get();
  
  return snapshot.empty;
};

// Cloud Functions

// Create appointment
export const createAppointment = onCall(async (request) => {
  try {
    const validatedData = appointmentDataSchema.parse(request.data);
    const appointmentDateTime = new Date(validatedData.appointmentDateTime);
    
    // Check if slot is still available
    const available = await isSlotAvailable(appointmentDateTime);
    if (!available) {
      throw new HttpsError('already-exists', 'This time slot is no longer available');
    }

    // Check if appointment is in the future
    if (appointmentDateTime <= new Date()) {
      throw new HttpsError('invalid-argument', 'Appointment must be in the future');
    }

    // Check if appointment is within business hours
    const hour = appointmentDateTime.getHours();
    const day = appointmentDateTime.getDay();
    
    if (hour < BUSINESS_HOURS.START || hour >= BUSINESS_HOURS.END) {
      throw new HttpsError('invalid-argument', 'Appointment must be within business hours');
    }
    
    if (!WORKING_DAYS.includes(day)) {
      throw new HttpsError('invalid-argument', 'Appointment must be on a working day');
    }

    // Calculate price
    const serviceType = validatedData.vehicleInfo.serviceType;
    const price = PRICING[serviceType];

    // Create appointment document
    const appointmentData = {
      ...validatedData,
      appointmentDateTime,
      price,
      status: 'booked',
      createdAt: new Date(),
    };

    const docRef = await db.collection('appointments').add(appointmentData);
    return docRef.id;
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error instanceof z.ZodError) {
      throw new HttpsError('invalid-argument', 'Invalid appointment data');
    }
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to create appointment');
  }
});

// Get available slots
export const getAvailableSlots = onCall(async (request) => {
  try {
    const { startDate, endDate } = availableSlotsRequestSchema.parse(request.data);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const slots: Array<{ datetime: string; available: boolean }> = [];
    
    // Generate all possible slots in the date range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const daySlots = generateTimeSlots(currentDate);
      
      for (const slot of daySlots) {
        // Skip past slots
        if (slot <= new Date()) {
          continue;
        }
        
        const available = await isSlotAvailable(slot);
        slots.push({
          datetime: slot.toISOString(),
          available,
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
    
  } catch (error) {
    console.error('Error getting available slots:', error);
    
    if (error instanceof z.ZodError) {
      throw new HttpsError('invalid-argument', 'Invalid date range');
    }
    
    throw new HttpsError('internal', 'Failed to get available slots');
  }
});

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('bg-BG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getServiceTypeLabel = (serviceType: string): string => {
  const labels: Record<string, string> = {
    car: 'Car',
    bus: 'Bus',
    motorcycle: 'Motorcycle',
    taxi: 'Taxi',
    caravan: 'Caravan',
    hanger: 'Hanger',
    lpg: 'LPG Installation Check',
  };
  return labels[serviceType] || serviceType;
};

// Send confirmation email on appointment creation
export const sendConfirmationEmail = onDocumentCreated(
  'appointments/{appointmentId}',
  async (event) => {
    try {
      const appointmentData = event.data?.data();
      if (!appointmentData) return;

      const transporter = createTransporter();
      
      const customerEmailHtml = `
        <h2>Appointment Confirmation - Car Garage</h2>
        <p>Dear Customer,</p>
        <p>Your vehicle check appointment has been confirmed!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>Appointment Details:</h3>
          <p><strong>Date & Time:</strong> ${formatDateTime(appointmentData.appointmentDateTime.toDate())}</p>
          <p><strong>Service:</strong> ${getServiceTypeLabel(appointmentData.vehicleInfo.serviceType)}</p>
          <p><strong>Registration Plate:</strong> ${appointmentData.customerInfo.registrationPlate}</p>
          ${appointmentData.vehicleInfo.brand ? `<p><strong>Vehicle:</strong> ${appointmentData.vehicleInfo.brand} ${appointmentData.vehicleInfo.model || ''}</p>` : ''}
          ${appointmentData.vehicleInfo.is4x4 ? '<p><strong>Type:</strong> 4x4 / All-wheel drive</p>' : ''}
          <p><strong>Price:</strong> ${appointmentData.price} BGN</p>
        </div>
        
        <h3>Important Information:</h3>
        <ul>
          <li>Please arrive 10 minutes before your scheduled time</li>
          <li>Bring your vehicle registration documents</li>
          <li>Contact us if you need to reschedule: +359 888 123 456</li>
        </ul>
        
        <p>Best regards,<br>Car Garage Team</p>
        <p>Sofia, Bulgaria | +359 888 123 456 | info@cargarage.bg</p>
      `;

      // Send email to customer
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: appointmentData.customerInfo.email,
        subject: 'Vehicle Check Appointment Confirmed',
        html: customerEmailHtml,
      });

      // Send notification to garage owner
      const ownerEmailHtml = `
        <h2>New Appointment Booking</h2>
        <p>A new appointment has been booked:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Date & Time:</strong> ${formatDateTime(appointmentData.appointmentDateTime.toDate())}</p>
          <p><strong>Service:</strong> ${getServiceTypeLabel(appointmentData.vehicleInfo.serviceType)}</p>
          <p><strong>Registration Plate:</strong> ${appointmentData.customerInfo.registrationPlate}</p>
          <p><strong>Customer Phone:</strong> ${appointmentData.customerInfo.phoneNumber}</p>
          <p><strong>Customer Email:</strong> ${appointmentData.customerInfo.email}</p>
          ${appointmentData.vehicleInfo.brand ? `<p><strong>Vehicle:</strong> ${appointmentData.vehicleInfo.brand} ${appointmentData.vehicleInfo.model || ''}</p>` : ''}
          ${appointmentData.vehicleInfo.is4x4 ? '<p><strong>Type:</strong> 4x4 / All-wheel drive</p>' : ''}
          <p><strong>Price:</strong> ${appointmentData.price} BGN</p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GARAGE_OWNER_EMAIL,
        subject: `New Appointment: ${appointmentData.customerInfo.registrationPlate}`,
        html: ownerEmailHtml,
      });

      console.log('Confirmation emails sent successfully');
      
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }
);

// Google Calendar integration
const createCalendarEvent = async (appointmentData: any) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    const event = {
      summary: `Vehicle Check - ${appointmentData.customerInfo.registrationPlate}`,
      description: `
Service: ${getServiceTypeLabel(appointmentData.vehicleInfo.serviceType)}
Registration: ${appointmentData.customerInfo.registrationPlate}
${appointmentData.vehicleInfo.brand ? `Vehicle: ${appointmentData.vehicleInfo.brand} ${appointmentData.vehicleInfo.model || ''}` : ''}
Customer: ${appointmentData.customerInfo.phoneNumber}
Email: ${appointmentData.customerInfo.email}
Price: ${appointmentData.price} BGN
      `.trim(),
      start: {
        dateTime: appointmentData.appointmentDateTime.toDate().toISOString(),
        timeZone: 'Europe/Sofia',
      },
      end: {
        dateTime: new Date(appointmentData.appointmentDateTime.toDate().getTime() + 15 * 60000).toISOString(),
        timeZone: 'Europe/Sofia',
      },
      attendees: [
        { email: appointmentData.customerInfo.email },
      ],
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    console.log('Google Calendar event created successfully');
    
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
  }
};

// Sync with Google Calendar on appointment creation
export const syncGoogleCalendar = onDocumentCreated(
  'appointments/{appointmentId}',
  async (event) => {
    try {
      const appointmentData = event.data?.data();
      if (!appointmentData) return;
      
      await createCalendarEvent(appointmentData);
      
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
    }
  }
);