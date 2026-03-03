import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { getUserProfile, updateUserProfile, incrementBlockedCount } from '../controllers/userController';


const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/blocked-count/increment').post(protect, incrementBlockedCount);

export default router;