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

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration for frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://shopping-app-frontend-rho.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow dev origins seamlessly
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiting
app.use('/api', generalLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
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

// 404 & Centralized Error Middleware
app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;
