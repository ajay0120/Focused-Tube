import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, incrementBlockedCount } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/blocked-count/increment').post(protect, incrementBlockedCount);

export default router;
