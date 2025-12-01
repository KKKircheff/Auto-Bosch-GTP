# Auto Bosch GTP - Vehicle Inspection Booking System

Modern web application for booking vehicle inspections at Auto Bosch GTP garage in Bourgas, Bulgaria.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI v7
- **Backend**: Firebase (Firestore + Auth + Hosting)
- **Form Management**: React Hook Form + Zod
- **Routing**: React Router DOM v7

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/KKKircheff/Auto-Bosch-GTP.git
cd Auto-Bosch-GTP
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create \`.env\` file in the root directory:
\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=auto-bosch-gtp
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:5173\` to view the application.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Deployment

The application is deployed on Firebase Hosting:

\`\`\`bash
npm run build
firebase deploy
\`\`\`

## Project Structure

\`\`\`
├── src/
│   ├── components/       # React components
│   │   ├── admin/       # Admin dashboard components
│   │   ├── booking/     # Booking flow components
│   │   └── common/      # Shared components
│   ├── contexts/        # React contexts (Auth, Booking)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Firebase services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions and constants
│   ├── theme/           # MUI theme configuration
│   └── App.tsx          # Main application component
├── public/              # Static assets
├── firebase.json        # Firebase configuration
├── .firebaserc          # Firebase project settings
└── [config files]       # TypeScript, Vite, ESLint configs
\`\`\`

## Features

### Customer Features
- **Vehicle Information Form**: Select vehicle type and enter registration details
- **Calendar Booking**: Choose appointment date and time
- **Real-time Availability**: See available time slots in real-time
- **Online Discount**: 10 lv discount for online bookings
- **Booking Confirmation**: View and manage booking details

### Admin Features
- **Dashboard**: View all bookings in calendar format
- **Booking Management**: Edit or delete existing bookings
- **Authentication**: Secure admin access with Firebase Auth

## Business Logic

- **Working Hours**: Monday-Friday, 8:30-17:30
- **Time Slots**: 30-minute intervals
- **Booking Window**: Current month and next month only
- **Vehicle Types**: Car, Bus, Motorcycle, Taxi, Caravan, Trailer, LPG
- **Pricing**: Dynamic pricing with 10 lv online discount

## Admin Access

Test credentials:
- Email: \`test@test.bg\`
- Password: \`test123456\`

## Technologies & Libraries

### Core
- React 19.1.0
- TypeScript 5.8.3
- Vite 7.0.0

### UI & Styling
- Material-UI 7.2.0
- Emotion (for styled components)
- MUI Icons 7.2.0
- MUI Date Pickers 8.6.0

### State & Forms
- React Hook Form 7.59.0
- Zod 3.25.67 (schema validation)
- React Router DOM 7.6.3

### Backend & Utils
- Firebase 11.9.1
- date-fns 4.1.0
- dayjs 1.11.13

## Development Notes

- The application uses **Material-UI v7** with the new Grid API syntax
- All user-facing text is in **Bulgarian**
- Form validation messages are in Bulgarian using Zod schemas
- Real-time booking validation prevents double-booking
- Firebase Firestore handles all data persistence
- The app uses context-based state management (AuthContext, BookingContext)

## License

Private project - All rights reserved

## Contact

Auto Bosch GTP
Bourgas, Bulgaria
