import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { getUserProfile, updateUserProfile, incrementBlockedCount } from '../controllers/userController';
import {
  getUserProfileRateLimiter,
  incrementBlockedCountRateLimiter,
  updateUserProfileRateLimiter,
  generalIPRateLimiter,
} from '../middleware/rateLimitingMiddleware';


const router = express.Router();

router.route('/profile')
      .get(generalIPRateLimiter, protect, getUserProfileRateLimiter, getUserProfile)
      .put(generalIPRateLimiter, protect, updateUserProfileRateLimiter, updateUserProfile);
    
router.route('/blocked-count/increment').post(generalIPRateLimiter,   protect, incrementBlockedCountRateLimiter, incrementBlockedCount);

export default router;
