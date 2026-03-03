import api from './axios';

export interface SearchResult<T> {
    videos: T[];
    blockedCount: number;
    blockedAll: boolean;
}

export const searchVideos = async <T = any>(query: string): Promise<SearchResult<T>> => {
    const response = await api.get(`/videos/search?q=${query}`);
    return response.data;
};
