import express from 'express';
import { getDailyStatistics, getWeeklyReport, logActivity } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Daily statistics route
router.get('/daily', protect, getDailyStatistics);

// Weekly report route
router.get('/weekly', protect, getWeeklyReport);

router.post('/log',protect, logActivity );

export default router;