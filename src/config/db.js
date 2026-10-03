import bcrypt from 'bcryptjs';
import supabase from './supabase.js';
import { mockProducts, mockCategories } from '../data/mockProducts.js';

// Pre-hashed passwords for demo accounts
// AdminPass123! -> hashed
// ClientPass123! -> hashed
const adminPasswordHash = bcrypt.hashSync('AdminPass123!', 10);
const clientPasswordHash = bcrypt.hashSync('ClientPass123!', 10);

export const db = {
  users: [
    {
      id: 'usr-admin-1',
      email: 'admin@elane-studio.com',
      password_hash: adminPasswordHash,
      role: 'admin',
      name: 'Atelier Administrator',
      phone: '+1 (555) 902-1200',
      created_at: new Date('2025-01-01').toISOString(),
    },
    {
      id: 'usr-client-1',
      email: 'client@elane-studio.com',
      password_hash: clientPasswordHash,
      role: 'customer',
      name: 'Genevieve Laurent',
      phone: '+1 (555) 304-8821',
      created_at: new Date('2026-02-14').toISOString(),
    },
  ],

  categories: [...mockCategories],
  products: [...mockProducts],
  carts: {},
  emailOtps: new Map(), // email -> { otp, expiresAt, name, password_hash }

  wishlists: {},
  orders: [
    {
      id: 'ORD-L89K2-4912',
      user_id: 'usr-client-1',
      customer: 'Genevieve Laurent',
      email: 'client@elane-studio.com',
      subtotal: 850.0,
      shippingCost: 0.0,
      discount: 0.0,
      total: 850.0,
      status: 'Confirmed',
      items: [
        { productId: 'prod-1', name: 'Atelier Double-Breasted Wool Coat', size: 'M', color: 'Charcoal Noir', quantity: 1, price: 590.0 },
        { productId: 'prod-3', name: 'Pleated Wide-Leg Wool Trousers', size: 'M', color: 'Oatmeal Taupe', quantity: 1, price: 260.0 },
      ],
      shippingAddress: {
        name: 'Genevieve Laurent',
        email: 'client@elane-studio.com',
        phone: '+1 (555) 304-8821',
        street: '740 Park Avenue',
        city: 'New York',
        state: 'NY',
        postalCode: '10021',
        country: 'United States',
      },
      createdAt: new Date('2026-09-28').toISOString(),
    },
  ],
};
