import api from './axios';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    return data;
};

export const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/users', { name, email, password });
    return data;
};
