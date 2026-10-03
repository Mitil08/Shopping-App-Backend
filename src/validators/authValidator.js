import { body } from 'express-validator';

// Email regex enforcing standard user@domain.tld structure
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid, verified email address')
    .matches(EMAIL_REGEX)
    .withMessage('Email address must contain a valid domain (e.g. name@domain.com)')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters in length'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid, registered email address')
    .matches(EMAIL_REGEX)
    .withMessage('Email address format is invalid')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
