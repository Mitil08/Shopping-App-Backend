import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import { notFoundMiddleware, globalErrorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration: Allow all domains dynamically while supporting credentials
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiting
app.use('/api', generalLimiter);

// Parsers (Capture rawBody buffer for Razorpay Webhook HMAC-SHA256 signature verification)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Root & API Welcome endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ÉLANE Luxury Fashion REST API is online',
    healthCheck: '/api/health',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth',
      cart: '/api/cart',
      orders: '/api/orders'
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ÉLANE API Root',
    healthCheck: '/api/health',
    status: 'ONLINE'
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    service: 'ÉLANE Luxury Fashion REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// REST API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', paymentRoutes);

// 404 & Centralized Error Middleware
app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;
