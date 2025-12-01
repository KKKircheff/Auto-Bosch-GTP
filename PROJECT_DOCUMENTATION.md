# Auto Bosch GTP Bourgas- Car Garage Booking System

## Project Overview

**Auto Bosch GTP Bourgas** is a modern web application for a car garage in Bourgas, Bulgaria, that enables customers to book technical vehicle inspections online and provides administrators with a comprehensive dashboard to manage appointments.

### Purpose
- **Customer-facing**: Allow customers to easily book vehicle inspection appointments online
- **Admin management**: Provide garage owners with tools to manage appointments, view schedules, and track business metrics
- **Business efficiency**: Streamline the booking process and reduce phone-based scheduling
- **Digital transformation**: Modernize a traditional car garage with contemporary booking technology

## Technologies Used

### Frontend Stack
- **React 19** - Modern UI framework with hooks and functional components
- **TypeScript** - Type-safe development with enhanced developer experience
- **Vite** - Fast build tool and development server
- **Material-UI (MUI) v7** - Professional React component library
- **React Router DOM v7** - Client-side routing and navigation
- **React Hook Form** - Efficient form management with validation
- **Zod** - TypeScript-first schema validation
- **date-fns** - Modern date utility library

### Backend & Database
- **Firebase** - Complete backend-as-a-service platform
  - **Firestore** - NoSQL document database for storing appointments
  - **Firebase Auth** - User authentication for admin access
  - **Firebase Hosting** - Static site hosting and deployment
  - **Firebase Functions** - Serverless functions for business logic

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Git** - Version control
- **npm** - Package management

## Architecture

### Application Structure
```
Frontend (React + TypeScript)
├── Public Routes
│   ├── Home Page (/)
│   └── Booking Flow (/booking)
└── Protected Routes
    └── Admin Dashboard (/admin/*)

Backend (Firebase)
├── Firestore Database
│   ├── appointments collection
│   └── admin-users collection
├── Authentication Service
└── Cloud Functions (future enhancement)
```

### Key Components Architecture
- **Modular Design** - Separate components for booking, admin, and common functionality
- **Context-based State Management** - React Context for authentication and booking state
- **Service Layer** - Dedicated services for Firebase operations
- **Type-safe Development** - Comprehensive TypeScript interfaces throughout
- **Responsive Design** - Mobile-first approach with desktop optimization

### Database Schema
```
Firestore Collections:
/appointments/{id}
├── customerName: string
├── email?: string
├── phone: string (required)
├── registrationPlate: string (required)
├── vehicleType: enum
├── vehicleBrand?: string
├── is4x4?: boolean
├── appointmentDate: Timestamp
├── appointmentTime: string
├── price: number
├── status: 'confirmed' | 'cancelled'
├── createdAt: Timestamp
├── notes?: string

/admin-users/{uid}
├── email: string
├── role: 'admin'
└── createdAt: Timestamp
```

## Features Implemented

### Customer Features
- **Vehicle Inspection Booking** - Complete 3-step booking flow
- **Real-time Availability** - Live calendar with available time slots
- **Multiple Vehicle Types** - Support for cars, buses, motorcycles, taxis, caravans, trailers, LPG
- **Dynamic Pricing** - Automatic price calculation with online discounts (10 lv off)
- **Form Validation** - Comprehensive validation with Bulgarian error messages
- **Responsive Design** - Works seamlessly on mobile and desktop
- **Bulgarian Interface** - Complete localization in Bulgarian language

### Admin Features
- **Secure Authentication** - Email/password login with Firebase Auth
- **Dashboard Overview** - Statistics and appointment management
- **Real-time Updates** - Live data synchronization
- **Appointment Management** - View, cancel, and manage bookings

### Technical Features
- **Real-time Data** - Live updates using Firestore listeners
- **Type Safety** - Full TypeScript coverage
- **Error Handling** - Comprehensive error management
- **Loading States** - Proper UI feedback during operations
- **Security Rules** - Firestore security rules for data protection

## Business Logic

### Booking Rules
- **Working Hours**: Monday-Friday, 8:30-17:30
- **Time Slots**: 30-minute intervals
- **Advance Booking**: Current and next month only
- **No Double Booking**: Real-time slot availability checking
- **Required Fields**: Registration plate and phone number

### Pricing Structure
- **Car**: 90 lv (80 lv online)
- **Bus (up to 3.5t)**: 110 lv (100 lv online)
- **Motorcycle**: 60 lv (50 lv online)
- **Taxi**: 60 lv (50 lv online)
- **Caravan**: 60 lv (50 lv online)
- **Trailer**: 60 lv (50 lv online)
- **LPG Installation Check**: 100 lv (90 lv online)

## Development Plan

### Phase 1: Foundation ✅
1. **Project Setup** - Vite + React + TypeScript + MUI
2. **Firebase Configuration** - Database and authentication setup
3. **Constants & Types** - Bulgarian localization and type definitions
4. **Basic Routing** - Public and protected routes
5. **Theme Setup** - MUI theme configuration

### Phase 2: Core Booking System ✅
6. **Calendar Component** - Two-month view with Bulgarian localization
7. **Time Slot Management** - Real-time availability checking
8. **Vehicle Form** - Dynamic form with conditional fields
9. **Firebase Integration** - Real booking data storage
10. **Admin Authentication** - Secure login system

### Phase 3: Admin Dashboard (Next)
11. **Dashboard Statistics** - Appointment counts and revenue
12. **Appointment Management** - View, filter, and cancel bookings
13. **Real-time Updates** - Live data synchronization

### Phase 4: Enhancements (Future)
14. **Email Notifications** - Booking confirmations and reminders
15. **Google Calendar Integration** - Sync with garage owner's calendar
16. **Reporting** - Business analytics and insights
17. **Mobile App** - React Native mobile application

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore and Auth enabled
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd auto-bosch-gtp-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm run dev
```

### Firebase Setup
1. Create Firebase project
2. Enable Firestore Database
3. Enable Authentication
4. Create admin user (test@test.bg / test123456)
5. Deploy Firestore security rules

### Deployment
```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## Project Status

**Current Status**: Core booking system completed with admin authentication
**Next Milestone**: Admin dashboard implementation
**Timeline**: Estimated 2-3 weeks for full completion

## Contact Information

**Garage**: Auto Bosch GTP Bourgas  
**Location**: Bourgas, Bulgaria  
**Project Type**: Full-stack web application  
**Development**: Custom React/Firebase solution