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
      logger.warn('Video search rejected because query is missing', { path: req.originalUrl });
      res.status(400).json({ message: 'Query parameter "q" is required' });
      return;
    }

    logger.info('Video search requested', {
      query,
      userId: (req as any).user?._id?.toString(),
    });

    const result = await searchVideos(query, (req as any).user);
    logger.info('Video search completed', {
      query,
      userId: (req as any).user?._id?.toString(),
      resultCount: result.videos.length,
      blockedCount: result.blockedCount,
      blockedAll: result.blockedAll,
    });
    res.json(result);
  } catch (error: any) {
    logger.error('Error in video search', {
      query: req.query.q,
      userId: (req as any).user?._id?.toString(),
      error: error.message,
    });
    res.status(500).json({ message: 'Server Error' });
  }
};
