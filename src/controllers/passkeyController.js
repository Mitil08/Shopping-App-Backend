import { passkeyService } from '../services/passkeyService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const passkeyController = {
  getRegistrationChallenge: async (req, res, next) => {
    try {
      const challengeOptions = await passkeyService.generateRegistrationChallenge({
        userId: req.user.id,
        email: req.user.email,
        name: req.user.name
      });
      return successResponse(res, challengeOptions, 'Registration challenge generated');
    } catch (err) {
      next(err);
    }
  },

  verifyRegistration: async (req, res, next) => {
    try {
      const result = await passkeyService.verifyRegistration(req.body);
      return successResponse(res, result, 'Passkey registered successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  getLoginChallenge: async (req, res, next) => {
    try {
      const { email } = req.body || {};
      const challengeOptions = await passkeyService.generateLoginChallenge({ email });
      return successResponse(res, challengeOptions, 'Login challenge generated');
    } catch (err) {
      next(err);
    }
  },

  verifyLogin: async (req, res, next) => {
    try {
      const result = await passkeyService.verifyLogin(req.body);
      // Set secure HTTP-only cookie
      res.cookie('elane_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return successResponse(res, result, 'Biometric passkey verified. Welcome to Maison ÉLANE.');
    } catch (err) {
      next(err);
    }
  },

  getPasskeys: async (req, res, next) => {
    try {
      const list = await passkeyService.getUserPasskeys(req.user.id);
      return successResponse(res, list, 'User passkeys retrieved');
    } catch (err) {
      next(err);
    }
  },

  deletePasskey: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await passkeyService.deletePasskey(req.user.id, id);
      return successResponse(res, result, 'Passkey removed');
    } catch (err) {
      next(err);
    }
  }
};
