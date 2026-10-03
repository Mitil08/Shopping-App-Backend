import { authService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      // Set secure HTTP-only cookie
      res.cookie('elane_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return successResponse(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      // Set secure HTTP-only cookie
      res.cookie('elane_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return successResponse(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res) => {
    res.clearCookie('elane_token');
    return successResponse(res, {}, 'Logged out successfully');
  },

  getMe: async (req, res, next) => {
    try {
      const user = await authService.getMe(req.user.id);
      return successResponse(res, { user });
    } catch (err) {
      next(err);
    }
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { emailValidatorService } = await import('../services/emailValidatorService.js');
      const verification = await emailValidatorService.verifyEmailLive(email);
      if (!verification.isValid) {
        return errorResponse(res, verification.reason || 'Email address domain could not be verified.', 400);
      }
      return successResponse(res, verification, 'Email address domain and mail servers verified successfully.');
    } catch (err) {
      next(err);
    }
  },

  sendOtp: async (req, res, next) => {
    try {
      const result = await authService.sendRegistrationOtp(req.body);
      return successResponse(res, result, result.message);
    } catch (err) {
      next(err);
    }
  },

  verifyOtpAndRegister: async (req, res, next) => {
    try {
      const result = await authService.verifyOtpAndRegister(req.body);
      // Set secure HTTP-only cookie
      res.cookie('elane_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return successResponse(res, result, 'Email verified & account activated successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      return successResponse(res, { user: updated }, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  },
};
