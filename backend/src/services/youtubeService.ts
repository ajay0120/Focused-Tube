import axios from 'axios';
import logger from '../utils/logger';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

const MOCK_VIDEOS: Video[] = [
    {
        id: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
        description: 'The official video for "Never Gonna Give You Up" by Rick Astley',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        channelTitle: 'Rick Astley',
        publishedAt: '2009-10-25T06:57:33Z'
    },
    {
        id: 'K3g7eQ7h41k',
        title: 'React Tutorial for Beginners',
        description: 'Learn React in this full course for beginners.',
        thumbnail: 'https://i.ytimg.com/vi/SqcY0GlETPk/mqdefault.jpg',
        channelTitle: 'Programming with Mosh',
        publishedAt: '2023-01-01T10:00:00Z'
    },
     {
        id: 'PkZNo7MFNFg',
        title: 'Learn JavaScript - Full Course for Beginners',
        description: 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started with the JavaScript programming language.',
        thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg',
        channelTitle: 'freeCodeCamp.org',
        publishedAt: '2018-12-10T14:13:40Z'
    }
];

export const searchVideos = async (query: string): Promise<Video[]> => {
    try {
        let videos = [];
        
        // 1. Fetch from YouTube
        if (!process.env.YOUTUBE_API_KEY) {
            logger.info('Using Mock Data for YouTube Search (No API Key)');
            videos = MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
            if (videos.length === 0) {
                // specific mock search failed, return all mock videos to show something
                videos = MOCK_VIDEOS;
            }
        } else {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 10,
                    q: query,
                    type: 'video',
                    key: process.env.YOUTUBE_API_KEY
                }
            });

            logger.info(`YouTube API called successfully for query: ${query}`);

            videos = response.data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt
            }));
        }

        // 2. Rank using ML Service (Falback to original order if fails)
        try {
            const mlResponse = await axios.post('http://localhost:8000/api/videos/rank', {
                videos: videos
            });
            if (mlResponse.data && Array.isArray(mlResponse.data)) {
                 logger.info('Videos ranked successfully by ML service');
                 return mlResponse.data;
            }
        } catch (mlError: any) {
            logger.warn(`ML Service Error (Skipping Ranking): ${mlError.message}`);
        }
        
        return videos;

    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const reason = error.response.data?.error?.message || error.message;
            logger.error(`YouTube API Error (${error.response.status}): ${reason}`);
            if (error.response.status === 403) {
                 logger.warn("This usually means your YouTube Data API quota is exceeded or the API key is invalid.");
            }
        } else {
            logger.error(`Error fetching from YouTube API: ${error.message || error}`);
        }
        return MOCK_VIDEOS; // Fallback to mock on error
    }
};
