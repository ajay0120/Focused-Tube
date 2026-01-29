import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
  getUserProfile as apiGetUserProfile,
  incrementBlockedCount as apiIncrementBlockedCount,
} from "../api/auth";
import { useNavigate } from "react-router-dom";

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
  register: (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  incrementBlockedCount: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const refetchUser = async () => {
    try {
      const data = await apiGetUserProfile();
      const currentInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const updatedUserData = { ...data, token: currentInfo.token };
      setUser(updatedUserData);
      localStorage.setItem("userInfo", JSON.stringify(updatedUserData));
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
      refetchUser();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const data = await apiLogin(email, password);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.onboardingCompleted) {
        navigate("/profile"); // Redirect to recommended on success
      } else {
        navigate("/onboarding");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      setError(null);
      const data = await apiRegister(name, username, email, password);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const updateProfile = async (userData: any) => {
    try {
      const updatedUser = await apiUpdateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  const incrementBlockedCount = async () => {
    try {
      if (!user) return;
      const updatedUser = {
        ...user,
        distractionsBlocked: (user.distractionsBlocked || 0) + 1,
      };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      await apiIncrementBlockedCount();
    } catch (err) {
      console.error("Failed to increment blocked count", err);
    }
  };

  const googleLogin = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const {
        googleLogin: apiGoogleLogin,
        verifyOtp: apiVerifyOtp,
        resendOtp: apiResendOtp,
      } = await import("../api/auth");
      const data = await apiGoogleLogin(token);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const { verifyOtp: apiVerifyOtp } = await import("../api/auth");
      const data = await apiVerifyOtp(email, otp);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/onboarding");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { resendOtp: apiResendOtp } = await import("../api/auth");
      await apiResendOtp(email);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { forgotPassword: apiForgotPassword } = await import("../api/auth");
      await apiForgotPassword(email);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { resetPassword: apiResetPassword } = await import("../api/auth");
      await apiResetPassword(email, otp, newPassword);
      // Don't auto-login here, let user login with new password
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
        resendOtp,
        forgotPassword,
        resetPassword,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
