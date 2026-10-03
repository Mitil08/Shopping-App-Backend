import { body } from 'express-validator';

export const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Garment name is required'),
  body('base_price')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a non-negative number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
];

export const orderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one garment'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
];
