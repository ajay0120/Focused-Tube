import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { getUserProfile, updateUserProfile, incrementBlockedCount } from '../controllers/userController';
import {
  getUserProfileRateLimiter,
  incrementBlockedCountRateLimiter,
  updateUserProfileRateLimiter,
} from '../middleware/rateLimitingMiddleware';


const router = express.Router();

router
  .route('/profile')
  .get(protect, getUserProfileRateLimiter, getUserProfile)
  .put(protect, updateUserProfileRateLimiter, updateUserProfile);
router.route('/blocked-count/increment').post(protect, incrementBlockedCountRateLimiter, incrementBlockedCount);

export default router;
