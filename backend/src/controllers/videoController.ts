import { Request, Response } from 'express';
import { searchVideos } from '../services/youtubeService';

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

        const videos = await searchVideos(query);
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
