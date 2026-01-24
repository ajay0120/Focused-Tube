import { Request, Response } from 'express';
import { searchVideos } from '../services/youtubeService';
import logger from '../utils/logger';

// @desc    Search videos from YouTube
// @route   GET /api/videos/search
// @access  Private
export const search = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        
        if (!query) {
             res.status(400).json({ message: 'Query parameter "q" is required' });
             return;
        }
        
        logger.info(`Search query received: ${query}`);

        // Pass user context to service for personalized filtering
        const videos = await searchVideos(query, (req as any).user);
        res.json(videos);

    } catch (error: any) {
        logger.error(`Error in video search: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};
