// src/services/auth.ts
import {signInWithEmailAndPassword, signOut, onAuthStateChanged, type User, type AuthError} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import type {LoginCredentials, AdminUser, ApiResponse} from '../types/booking';

const ADMIN_USERS_COLLECTION = 'admin-users';

/**
 * Convert Firebase User to AdminUser
 */
const toAdminUser = async (firebaseUser: User): Promise<AdminUser | null> => {
    try {
        // Get admin user document from Firestore
        const adminDocRef = doc(db, ADMIN_USERS_COLLECTION, firebaseUser.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            console.warn('User is authenticated but not found in admin collection');
            return null;
        }

        const adminData = adminDoc.data();

        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: adminData.role || 'admin',
            createdAt: adminData.createdAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error('Error converting Firebase user to AdminUser:', error);
        return null;
    }
};

/**
 * Get user-friendly error message
 */
const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'Потребителят не е намерен.';
        case 'auth/wrong-password':
            return 'Грешна парола.';
        case 'auth/invalid-email':
            return 'Невалиден имейл адрес.';
        case 'auth/user-disabled':
            return 'Профилът е деактивиран.';
        case 'auth/too-many-requests':
            return 'Твърде много неуспешни опити. Моля опитайте по-късно.';
        case 'auth/network-request-failed':
            return 'Мрежова грешка. Проверете интернет връзката си.';
        case 'auth/invalid-credential':
            return 'Невалидни данни за вход.';
        default:
            return 'Възникна грешка при влизане. Моля опитайте отново.';
    }
};

/**
 * Sign in admin user
 */
export const signInAdmin = async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
    try {
        const {email, password} = credentials;

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Convert to AdminUser and verify admin status
        const adminUser = await toAdminUser(firebaseUser);

        if (!adminUser) {
            // Sign out if not an admin
            await signOut(auth);
            return {
                success: false,
                error: 'Нямате права за достъп до администраторския панел.',
            };
        }

        return {
            success: true,
            data: adminUser,
            message: 'Успешно влизане в системата.',
        };
    } catch (error) {
        console.error('Sign in error:', error);

        const errorMessage =
            error instanceof Error && 'code' in error
                ? getAuthErrorMessage(error as AuthError)
                : 'Възникна неочаквана грешка при влизане.';

        return {
            success: false,
            error: errorMessage,
        };
    }
};

/**
 * Sign out admin user
 */
export const signOutAdmin = async (): Promise<ApiResponse<void>> => {
    try {
        await signOut(auth);
        return {
            success: true,
            message: 'Успешно излизане от системата.',
        };
    } catch (error) {
        console.error('Sign out error:', error);
        return {
            success: false,
            error: 'Възникна грешка при излизане от системата.',
        };
    }
};

/**
 * Get current authenticated admin user
 */
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
        return null;
    }

    return toAdminUser(firebaseUser);
};

/**
 * Create admin user in Firestore (for initial setup)
 */
export const createAdminUser = async (uid: string, email: string): Promise<ApiResponse<void>> => {
    try {
        const adminDocRef = doc(db, ADMIN_USERS_COLLECTION, uid);

        // Check if admin user already exists
        const existingDoc = await getDoc(adminDocRef);
        if (existingDoc.exists()) {
            return {
                success: true,
                message: 'Администраторът вече съществува.',
            };
        }

        // Create admin user document
        await setDoc(adminDocRef, {
            email,
            role: 'admin',
            createdAt: new Date(),
        });

        return {
            success: true,
            message: 'Администраторският профил е създаден успешно.',
        };
    } catch (error) {
        console.error('Error creating admin user:', error);
        return {
            success: false,
            error: 'Възникна грешка при създаване на администраторския профил.',
        };
    }
};

/**
 * Auth state change listener
 */
export const onAuthStateChange = (callback: (user: AdminUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const adminUser = await toAdminUser(firebaseUser);
            callback(adminUser);
        } else {
            callback(null);
        }
    });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!auth.currentUser;
};

/**
 * Validate admin credentials (for initial setup check)
 */
export const validateAdminSetup = async (): Promise<boolean> => {
    try {
        // Check if the environment admin email exists in auth users
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (!adminEmail) {
            return false;
        }

        // This is a simple check - in production you might want more sophisticated validation
        return true;
    } catch (error) {
        console.error('Error validating admin setup:', error);
        return false;
    }
};
