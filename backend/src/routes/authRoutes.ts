import express from 'express';
import { authUser, registerUser, verifyOtp, resendOtp, googleLogin, forgotPassword, resetPassword } from '../controllers/authController';
import {
  forgotPasswordRateLimiter,
  googleLoginRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
  resendOtpRateLimiter,
  resetPasswordRateLimiter,
  verifyOtpRateLimiter,
} from '../middleware/rateLimitingMiddleware';


const router = express.Router();

router.post('/', registerRateLimiter, registerUser);
router.post('/login', loginRateLimiter, authUser);
router.post('/google-login', googleLoginRateLimiter, googleLogin);
router.post('/verify-otp', verifyOtpRateLimiter, verifyOtp);
router.post('/resend-otp', resendOtpRateLimiter, resendOtp);
router.route('/forgot-password').post(forgotPasswordRateLimiter, forgotPassword);
router.route('/reset-password').post(resetPasswordRateLimiter, resetPassword);


export default router;
