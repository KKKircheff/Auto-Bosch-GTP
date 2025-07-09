import {signInWithEmailAndPassword, signOut, onAuthStateChanged, type User, type AuthError} from 'firebase/auth';
import {auth} from './firebase';
import type {LoginCredentials, AdminUser, ApiResponse} from '../types/booking';

/**
 * Convert Firebase User to AdminUser (simplified - no Firestore check)
 */
const toAdminUser = (firebaseUser: User): AdminUser => {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        role: 'admin', // Since there's only one admin, always admin
        createdAt: new Date(), // Use current date if we don't track it
    };
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
        case 'auth/invalid-login-credentials':
            return 'Невалидни данни за вход.';
        default:
            console.error('Unhandled auth error:', error.code, error.message);
            return 'Възникна грешка при влизане. Моля опитайте отново.';
    }
};

/**
 * Sign in admin user (simplified)
 */
export const signInAdmin = async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
    try {
        const {email, password} = credentials;

        // Validate input
        if (!email || !password) {
            return {
                success: false,
                error: 'Моля въведете имейл и парола.',
            };
        }

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const firebaseUser = userCredential.user;

        // Convert to AdminUser (no Firestore check needed)
        const adminUser = toAdminUser(firebaseUser);

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
 * Auth state change listener (simplified)
 */
export const onAuthStateChange = (callback: (user: AdminUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const adminUser = toAdminUser(firebaseUser);
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
 * Wait for auth to initialize
 */
export const waitForAuthInit = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};
