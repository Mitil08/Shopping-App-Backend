import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { passkeyController } from '../controllers/passkeyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validateRequest, authController.register);
router.post('/send-otp', authLimiter, authController.sendOtp);
router.post('/verify-otp', authLimiter, authController.verifyOtpAndRegister);
router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);
router.post('/google', authLimiter, authController.googleLogin);

// WebAuthn FIDO2 Biometric Passkey Endpoints
router.post('/passkey/login-challenge', passkeyController.getLoginChallenge);
router.post('/passkey/login-verify', passkeyController.verifyLogin);
router.post('/passkey/register-challenge', authMiddleware, passkeyController.getRegistrationChallenge);
router.post('/passkey/register-verify', authMiddleware, passkeyController.verifyRegistration);
router.get('/passkey/credentials', authMiddleware, passkeyController.getPasskeys);
router.delete('/passkey/credentials/:id', authMiddleware, passkeyController.deletePasskey);

router.post('/verify-email', authLimiter, authController.verifyEmail);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
