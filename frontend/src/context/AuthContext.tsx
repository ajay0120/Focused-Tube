import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, getUserProfile as apiGetUserProfile } from '../api/auth';
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
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (userData: any) => Promise<void>;
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

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
