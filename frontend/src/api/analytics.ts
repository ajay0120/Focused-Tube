import api from './axios';

const API_URL = '/analytics';

export const getDailyStatistics = async () => {
    const response = await api.get(`${API_URL}/daily`);
    return response.data;
};

export const getWeeklyReport = async () => {
    const response = await api.get(`${API_URL}/weekly`);
    return response.data;
};

export const logActivity = async (activityData: {
    videoId: string;
    category: string;
    watchTime: number;
    isBlockedTopic: boolean;
    wasOverride: boolean;
    mode?: "study" | "relax";
}) => {
    const response = await api.post(`${API_URL}/log`, activityData);
    return response.data;
}
