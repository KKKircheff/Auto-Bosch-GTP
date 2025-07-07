import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { onAuthStateChange, signInAdmin, signOutAdmin } from '../services/auth';
import type { AdminUser, LoginCredentials, ApiResponse } from '../types';

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    error?: string;
    login: (credentials: LoginCredentials) => Promise<ApiResponse<AdminUser>>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChange((adminUser) => {
            setUser(adminUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
        setLoading(true);
        setError('');

        try {
            const result = await signInAdmin(credentials);

            if (result.success && result.data) {
                setUser(result.data);
            } else {
                setError(result.error || 'Възникна грешка при влизане.');
            }

            return result;
        } catch (err) {
            const errorMessage = 'Възникна неочаквана грешка при влизане.';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        setError('');

        try {
            const result = await signOutAdmin();

            if (result.success) {
                setUser(null);
            } else {
                setError(result.error || 'Възникна грешка при излизане.');
            }
        } catch (err) {
            setError('Възникна неочаквана грешка при излизане.');
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
