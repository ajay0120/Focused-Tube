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
router.get('/daily', getDailyStatisticsRateLimiter, protect, getDailyStatistics);

// Weekly report route
router.get('/weekly', getWeeklyReportRateLimiter, protect, getWeeklyReport);

router.post('/log', logActivityRateLimiter, protect, logActivity);

export default router;
