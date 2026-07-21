import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../api/endpoints';
import type { User } from '../types';

// -----------------------------------------------------------------------------
// 1. Define the shape of the context
// -----------------------------------------------------------------------------
interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// -----------------------------------------------------------------------------
// 2. Create the context
// -----------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// 3. Provider component
// -----------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // On mount, check localStorage for saved token
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // In a real app, you'd fetch /me here to get user profile.
            // For now, user stays null until signup/login provides it.
        }
        setIsLoading(false);
    }, []);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            auth.login({ email, password }).then((res) => res.data),
        onSuccess: (data) => {
            const newToken = data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            // Ideally fetch user profile here, but for now navigate.
            navigate('/');
        },
        onError: (error) => {
            console.error('Login error:', error);
        },
    });

    // Signup mutation
    const signupMutation = useMutation({
        mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
            auth.signup({ name, email, password }).then((res) => res.data),
        onSuccess: (data) => {
            const newToken = data.token;
            const userData = data.user;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            navigate('/');
        },
        onError: (error) => {
            console.error('Signup error:', error);
        },
    });

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
        // After login, you could fetch /me here to set user.
    };

    const signup = async (name: string, email: string, password: string) => {
        await signupMutation.mutateAsync({ name, email, password });
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// -----------------------------------------------------------------------------
// 4. Custom hook to use the auth context
// -----------------------------------------------------------------------------
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}