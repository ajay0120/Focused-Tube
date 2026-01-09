import express from 'express';
import { search } from '../controllers/videoController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/search').get(protect, search);

export default router;
