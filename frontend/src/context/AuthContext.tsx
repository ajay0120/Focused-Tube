import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, getUserProfile as apiGetUserProfile, incrementBlockedCount as apiIncrementBlockedCount } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    token: string;
    onboardingCompleted: boolean;
    interests?: string[];
    disinterests?: string[];
    age?: number;
    blockedCount?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (userData: any) => Promise<void>;
    incrementBlockedCount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            // Fetch fresh profile data to ensure we have latest interests
            apiGetUserProfile()
                .then((data) => {
                    // Preserve the token from existing localStorage since getUserProfile doesn't return it
                    const currentInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    const updatedUserData = { ...data, token: currentInfo.token };
                    setUser(updatedUserData);
                    // Update storage but keep token intact
                    localStorage.setItem('userInfo', JSON.stringify(updatedUserData));
                })
                .catch((err) => {
                    console.error("Failed to refresh user profile", err);
                });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const data = await apiLogin(email, password);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.onboardingCompleted) {
                navigate('/profile');
            } else {
                navigate('/onboarding');
            }
        } catch (err: any) {
             setError(err.response?.data?.message || 'Login failed');
             throw err;
        }
    };

    const register = async (name: string, username: string, email: string, password: string) => {
        try {
            setError(null);
            const data = await apiRegister(name, username, email, password);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    const updateUserProfile = async (userData: any) => {
        try {
           const updatedUser = await apiUpdateProfile(userData);
           setUser(updatedUser);
           localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Update failed');
            throw err;
        }
    };

    const incrementBlockedCount = async () => {
        try {
            if (!user) return;
            // Optimistically update UI
            const updatedUser = { ...user, blockedCount: (user.blockedCount || 0) + 1 };
            setUser(updatedUser);
            // localStorage update optional for this counter as it's volatile, but good for consistency
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            // Call API
            // const token = user.token;
            // We need to make an authenticated call. Ideally we should use the configured axios instance,
            // but for simplicity/directness here (and since api imports are named exports), we can use fetch or import a helper.
            // Let's assume we can add this to api/auth.ts or call axios directly here with token.
            // Given the pattern, let's create the API function in api/auth first or use fetch.
            // To be clean, let's just use axios here or call an imported function.
            // Wait, I should probably add the API call to api/auth.ts first. 
            // BUT, for now I will implement it inline or better yet, I will update api/auth.ts in next step if needed, 
            // or just assume it exists? No, I must ensure it works. 
            // Actually, I can use the existing `apiUpdateProfile` pattern.
            // Let's create `apiIncrementBlockedCount` in api/auth.ts. 
            // HOLD ON. I missed creating the frontend API function in my plan. 
            // I will use `axios` directly for now to save steps or just add `apiIncrementBlockedCount` to `api/auth.ts` in a separate step?
            // I'll add the function to `api/auth.ts` first in a separate call then come back? 
            // No, strictly following standard procedure: I will add `apiIncrementBlockedCount` to `api/auth.ts` immediately after this.
            // So I will assume it exists or use a placeholder that calls the endpoint.
            
            // Re-evaluating: I will make the API call here using fetch or similar to avoid context switching too much,
            // OR I can import a new function `incrementBlockedCountApi` which I will creating in `api/auth.ts`.
            // Let's do the clean way: Call `apiIncrementBlockedCount`. passing token is tricky if not in axios interceptor.
            // The existing `api/auth.ts` likely has axios setup.
            
            await apiIncrementBlockedCount();
            
        } catch (err) {
            console.error("Failed to increment blocked count", err);
            // Revert on failure? Maybe overkill for a counter.
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUserProfile, incrementBlockedCount }}>
            {children}
        </AuthContext.Provider>
    );
};
