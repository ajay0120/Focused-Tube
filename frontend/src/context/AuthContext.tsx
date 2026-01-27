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
    distractionsBlocked?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    incrementBlockedCount: () => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
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
                navigate('/recommended'); // Redirect to recommended on success
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
             // Don't set user immediately for 2FA flow if strictly required, 
             // but current backend returns token with isVerified:false. 
             // We can store it but UI needs to block.
             // Actually, for better UX, we might NOT login yet or login with restricted state.
             // Here we just store data.
            setUser(data); 
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Navigate to same page or show modal? 
            // The requirement says "if user dose'nt use google o-auth then he goes register page ... send otp ... if it matches then only the user is registered".
            // Since we already created user in backend (unverified), we should probably stay on register page or go to a verify page.
            // Let's assume RegisterPage handles the modal, so we just return here.
            // But we update state so RegisterPage knows we have a (unverified) user.
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

    const updateProfile = async (userData: any) => {
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
            const updatedUser = { ...user, distractionsBlocked: (user.distractionsBlocked || 0) + 1 };
            setUser(updatedUser);
            // localStorage update optional for this counter as it's volatile, but good for consistency
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            await apiIncrementBlockedCount();
            
        } catch (err) {
            console.error("Failed to increment blocked count", err);
            // Revert on failure? Maybe overkill for a counter.
        }
    };

    const googleLogin = async (token: string) => {
        setLoading(true);
        setError(null);
        try {
            // Need to import googleLogin from api/auth, but strictly we can use api.post if not imported.
            // Since I added it to api/auth.ts in the PARALLEL step, I should import it.
            // But I cannot easily add import in this replace block without changing top of file. 
            // I will use direct axios call OR rely on the import being present? 
            // Wait, import is NOT present. I need to update imports too.
            // I'll do this in TWO steps or use `require` or just assume I'll fix imports next.
            // Actually, I can use the `api` object which is imported in `api/auth.ts` but NOT here. 
            // Here we import named exports. 
            // Allow me to use `any` for now and I will fix imports in next step to be safe.
            // OR I can try to replace the WHOLE file content if it's small enough, which it is (150 lines).
            // BUT replace_file_content is better. 
            // I will just use `any` cast on the imported `apiLogin`... no that doesn't work.
            // I'll use `api` from standard axios if I can? No.
            // OK, I will skip implementing the body of googleLogin/verifyOtp HERE and just add the signatures, 
            // then Step 2: Add imports. Step 3: Implement bodies.
            // Actually, I can just use `apiLogin` etc. 
            // Let's assume I will add `import { googleLogin as apiGoogleLogin ... }` at the top later.
            // I will implement the logic assuming those functions exist.
             const { googleLogin: apiGoogleLogin, verifyOtp: apiVerifyOtp, resendOtp: apiResendOtp } = await import('../api/auth');
             const data = await apiGoogleLogin(token);
             setUser(data);
             localStorage.setItem('userInfo', JSON.stringify(data));
             navigate('/recommended');
        } catch (err: any) {
             setError(err.response?.data?.message || 'Google Login failed');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        setLoading(true);
        setError(null);
        try {
             // Dynamic import as above
             const { verifyOtp: apiVerifyOtp } = await import('../api/auth');
             const data = await apiVerifyOtp(email, otp);
             setUser(data);
             localStorage.setItem('userInfo', JSON.stringify(data));
             navigate('/recommended'); 
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email: string) => {
         setLoading(true);
         setError(null);
         try {
             const { resendOtp: apiResendOtp } = await import('../api/auth');
             await apiResendOtp(email);
         } catch (err: any) {
             setError(err.response?.data?.message || 'Failed to resend OTP');
             throw err;
         } finally {
             setLoading(false);
         }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            error, 
            login, 
            register, 
            logout, 
            updateProfile, 
            incrementBlockedCount,
            googleLogin,
            verifyOtp,
            resendOtp
        }}>
            {children}
        </AuthContext.Provider>
    );
};
