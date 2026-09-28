import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  register: async ({ name, email, password }) => {
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      email: email.toLowerCase(),
      password_hash,
      role: 'customer',
      name,
      phone: '',
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const sanitizedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return { user: sanitizedUser, token };
  },

  login: async ({ email, password }) => {
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const err = new Error('Invalid email or password combination.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password combination.');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
    };

    return { user: sanitizedUser, token };
  },

  getMe: async (userId) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      const err = new Error('Client profile not found.');
      err.statusCode = 404;
      throw err;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
    };
  },

  updateProfile: async (userId, { name, phone }) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      const err = new Error('Client profile not found.');
      err.statusCode = 404;
      throw err;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  },
};
