import express from 'express';
import { getDailyStatistics, getWeeklyReport, logActivity } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';
import {
  getDailyStatisticsRateLimiter,
  getWeeklyReportRateLimiter,
  logActivityRateLimiter,
} from '../middleware/rateLimitingMiddleware';

const router = express.Router();

// Daily statistics route
router.get('/daily', protect, getDailyStatisticsRateLimiter, getDailyStatistics);

// Weekly report route
router.get('/weekly', protect, getWeeklyReportRateLimiter, getWeeklyReport);

router.post('/log', protect, logActivityRateLimiter, logActivity);

export default router;
