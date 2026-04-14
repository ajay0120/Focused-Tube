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
  .get(getUserProfileRateLimiter, protect, getUserProfile)
  .put(updateUserProfileRateLimiter, protect, updateUserProfile);
router.route('/blocked-count/increment').post(incrementBlockedCountRateLimiter, protect, incrementBlockedCount);

export default router;
