import express from 'express';
import { search } from '../controllers/videoController';
import { protect } from '../middleware/authMiddleware';
import { videoSearchRateLimiter, generalIPRateLimiter } from '../middleware/rateLimitingMiddleware';

const router = express.Router();

router.route('/search').get(generalIPRateLimiter,protect, videoSearchRateLimiter, search);

export default router;
