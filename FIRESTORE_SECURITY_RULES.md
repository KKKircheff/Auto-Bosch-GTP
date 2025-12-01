# Firestore Security Rules for Auto Bosch GTP

## Instructions

Deploy these security rules to Firebase Firestore via the Firebase Console:
1. Go to Firebase Console > Firestore Database > Rules
2. Replace the existing rules with the content below
3. Click "Publish"

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function - check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // SETTINGS COLLECTION
    // Public read (needed for booking flow to get prices/hours)
    // Admin write only
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // ANNOUNCEMENTS COLLECTION
    // Public read (displayed on homepage)
    // Admin write only
    match /announcements/{announcementId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }

    // APPOINTMENTS COLLECTION
    // Public create (customers can book)
    // Admin read/write (manage appointments)
    match /appointments/{appointmentId} {
      allow create: if true; // Anyone can create bookings
      allow read, update, delete: if isAuthenticated(); // Only admins can view/manage
    }

    // ADMIN USERS COLLECTION (optional - if you store admin user profiles)
    match /admin-users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

## Rule Explanation

### Settings Collection
- **Read**: Public access so booking form can fetch prices and working hours
- **Write**: Admin only for updating business settings

### Announcements Collection
- **Read**: Public access to display messages on homepage
- **Write**: Admin only for creating/editing/deleting announcements

### Appointments Collection
- **Create**: Public access so customers can book appointments online
- **Read/Update/Delete**: Admin only for managing bookings

## Testing Rules

After deployment, test with:

1. **Public user (not logged in)**:
   - ✅ Should be able to view settings
   - ✅ Should be able to view announcements
   - ✅ Should be able to create appointments
   - ❌ Should NOT be able to view/edit appointments
   - ❌ Should NOT be able to edit settings/announcements

2. **Admin user (logged in)**:
   - ✅ Should have full access to all collections
   - ✅ Should be able to update settings
   - ✅ Should be able to manage announcements
   - ✅ Should be able to view/edit/cancel/delete appointments

## Production Notes

- These rules are designed for a small business with trusted admin users
- All authenticated users are treated as admins
- For more granular permissions, add role-based access control using custom claims
- Consider adding rate limiting for public create operations to prevent abuse
