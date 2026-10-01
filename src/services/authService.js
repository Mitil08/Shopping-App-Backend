import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import supabase from '../config/supabase.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  register: async ({ name, email, password }) => {
    // 1. Check existing user
    let existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existing && supabase) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      if (data) existing = data;
    }

    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = {
      email: email.toLowerCase(),
      password_hash,
      role: 'customer',
      name,
      phone: '',
      created_at: new Date().toISOString(),
    };

    // 2. Insert into Supabase if connected
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (error) {
          console.warn('Supabase insert notice (falling back to memory):', error.message);
          newUser.id = `usr-${Date.now().toString(36)}`;
        } else if (data) {
          newUser.id = data.id;
        }
      } catch (sbErr) {
        console.warn('Supabase exception:', sbErr.message);
        newUser.id = `usr-${Date.now().toString(36)}`;
      }
    } else {
      newUser.id = `usr-${Date.now().toString(36)}`;
    }

    // Always mirror to in-memory store for instant responsiveness
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
    let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user && supabase) {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .maybeSingle();
        if (data) {
          user = data;
          db.users.push(user); // Cache in memory
        }
      } catch (sbErr) {
        console.warn('Supabase fetch error:', sbErr.message);
      }
    }

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
    let user = db.users.find((u) => u.id === userId);

    if (!user && supabase) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (data) user = data;
    }

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
    let user = db.users.find((u) => u.id === userId);
    if (!user) {
      const err = new Error('Client profile not found.');
      err.statusCode = 404;
      throw err;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (supabase) {
      try {
        await supabase
          .from('users')
          .update({ name: user.name, phone: user.phone, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (sbErr) {
        console.warn('Supabase update profile warning:', sbErr.message);
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  },
};
