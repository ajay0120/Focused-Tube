import express from 'express';
import { getDailyStatistics, getWeeklyReport, logActivity } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';
import {
  getDailyStatisticsRateLimiter,
  getWeeklyReportRateLimiter,
  logActivityRateLimiter,
  generalIPRateLimiter,
} from '../middleware/rateLimitingMiddleware';

const router = express.Router();

// Daily statistics route
router.get('/daily', generalIPRateLimiter, protect, getDailyStatisticsRateLimiter, getDailyStatistics);

// Weekly report route
router.get('/weekly', generalIPRateLimiter, protect, getWeeklyReportRateLimiter, getWeeklyReport);

router.post('/log', generalIPRateLimiter, protect, logActivityRateLimiter, logActivity);

export default router;
