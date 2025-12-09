import express from 'express';
import { authUser, registerUser } from '../controllers/authController';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);

export default router;
