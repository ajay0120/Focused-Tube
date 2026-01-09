import api from './axios';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    return data;
};

export const register = async (name: string, username: string, email: string, password: string) => {
    const { data } = await api.post('/users', { name, username, email, password });
    return data;
};

export const updateProfile = async (userData: any) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
};
