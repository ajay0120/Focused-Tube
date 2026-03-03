import express from 'express';
import { authUser, registerUser, verifyOtp, resendOtp, googleLogin, forgotPassword, resetPassword } from '../controllers/authController';


const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);


export default router;
