import api from './axios';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

export const register = async (name: string, username: string, email: string, password: string) => {
    const { data } = await api.post('/auth', { name, username, email, password });
    return data;
};

export const updateProfile = async (userData: any) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
};

export const getUserProfile = async () => {
    const { data } = await api.get('/users/profile');
    return data;
};

export const incrementBlockedCount = async () => {
    const { data } = await api.post('/users/blocked-count/increment', {});
    return data;
};

export const googleLogin = async (token: string) => {
    const { data } = await api.post('/auth/google-login', { token });
    return data;
};

export const verifyOtp = async (email: string, otp: string) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data;
};

export const resendOtp = async (email: string) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
};

export const forgotPassword = async (email: string) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
    return data;
};
