import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../api/endpoints';
import { User } from '../types';

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
// 2. Create the context with a default value (will be overridden by provider)
// -----------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// 3. Provider component – wraps the app and provides auth state
// -----------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // ---------------------------------------------------------------------------
    // On mount, check localStorage for a saved token and validate it.
    // This simulates a "silent login" – you can extend it to call /me endpoint.
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // For a real implementation, you might call a /me endpoint here
            // to fetch the user's profile using the token.
            // For this demo, we assume the token is valid and we'll parse a dummy user.
            // In practice, you'd decode the JWT or fetch the user.
            // For now, we just store the token and set a placeholder user.
            setToken(storedToken);
            // Ideally, you'd fetch user data from the backend here.
            // We'll keep user null until a successful login/signup.
        }
        setIsLoading(false);
    }, []);

    // ---------------------------------------------------------------------------
    // Login mutation
    // ---------------------------------------------------------------------------
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            auth.login({ email, password }).then((res) => res.data),
        onSuccess: (data) => {
            // data = { token: '...' }
            const newToken = data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            // In a real app, you'd fetch the user profile here using the token.
            // For this demo, we set a minimal user from the login response.
            // If your backend returns user data on login, use that.
            // Otherwise, you could call /me after login.
            // For now, we'll set a placeholder user (name from signup, but we don't have it here).
            // Better: use the signup response or a separate /me call.
            // Since we don't have user data on login, we'll keep user as null
            // and rely on components to use token for authentication.
            // A more robust approach: after login, call /me to get user details.
            // We'll implement that now.
            // Let's fetch the user profile after login.
            // We'll add a /me endpoint later; for now, we'll just simulate.
            // For this example, we'll navigate to home.
            navigate('/');
        },
        onError: (error) => {
            console.error('Login error:', error);
        },
    });

    // ---------------------------------------------------------------------------
    // Signup mutation
    // ---------------------------------------------------------------------------
    const signupMutation = useMutation({
        mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
            auth.signup({ name, email, password }).then((res) => res.data),
        onSuccess: (data) => {
            // data = { token: '...', user: { id, name, email, created_at } }
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

    // ---------------------------------------------------------------------------
    // Logout – clears token and user state
    // ---------------------------------------------------------------------------
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // ---------------------------------------------------------------------------
    // Public methods that components will call
    // ---------------------------------------------------------------------------
    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
        // After login, we should fetch user profile. For now, we'll navigate.
        // You can extend this by calling a /me endpoint and updating user state.
    };

    const signup = async (name: string, email: string, password: string) => {
        await signupMutation.mutateAsync({ name, email, password });
    };

    // ---------------------------------------------------------------------------
    // Provide the context value
    // ---------------------------------------------------------------------------
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