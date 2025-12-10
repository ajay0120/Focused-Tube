import api from './axios';

export const searchVideos = async (query: string) => {
    const response = await api.get(`/videos/search?q=${query}`);
    return response.data;
};
