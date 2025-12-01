# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

This is a **React 19 + TypeScript** vehicle inspection booking system for Auto Bosch GTP garage in Bourgas, Bulgaria. The application uses **Firebase** as the backend service.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **UI Library**: Material-UI v7 (MUI 7.x with new Grid API)
- **Backend**: Firebase (Firestore + Auth + Hosting)
- **Form Management**: React Hook Form + Zod validation
- **Routing**: React Router DOM v7
- **Date Handling**: date-fns + dayjs

### Key Architecture Patterns

**Context-based State Management**:
- `AuthContext` - Firebase authentication state
- `BookingContext` - Complex booking flow state with real-time validation

**Service Layer Structure**:
- `services/firebase.ts` - Firebase configuration with environment validation
- `services/auth.ts` - Authentication operations
- `services/appointments.ts` - Firestore booking operations

**Component Organization**:
```
components/
├── admin/       # Admin dashboard components
├── booking/     # Multi-step booking flow components
└── common/      # Shared components (Header, Footer, ProtectedRoute)
```

**Type-first Development**:
- Comprehensive TypeScript definitions in `src/types/`
- Zod schemas for form validation with Bulgarian error messages
- Firebase document interfaces with Timestamp handling

### Critical Implementation Details

**MUI 7.x Grid Syntax** - Always use the new Grid API:
```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>
    <Item>Content</Item>
  </Grid>
</Grid>
```

**Real-time Booking Validation**:
- Time slots are validated in real-time before selection
- Double-booking prevention with Firestore transactions
- BookingContext handles complex validation logic

**Bulgarian Localization**:
- All user-facing text in Bulgarian
- Form validation messages in Bulgarian
- Date formatting follows Bulgarian conventions

**Firebase Environment Setup**:
Environment variables required:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` 
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Business Logic

**Working Hours**: Monday-Friday, 8:30-17:30, 30-minute slots
**Booking Constraints**: Current and next month only
**Pricing**: Dynamic with 10 lv online discount
**Vehicle Types**: car, bus, motorcycle, taxi, caravan, trailer, lpg

### Testing Admin Access
Test admin credentials: `test@test.bg` / `test123456`

### Route Structure
- `/` - Home page with garage info
- `/booking` - Multi-step booking flow
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Protected admin area
## Repository Structure

This repository was restructured (December 2025) with Git root at application level.
Design assets and parent folder structure removed from version control.
