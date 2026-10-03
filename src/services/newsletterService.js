import { db } from '../config/db.js';
import supabase from '../config/supabase.js';

// In-memory subscribers store initialization
if (!db.subscribers) {
  db.subscribers = [
    {
      id: 'sub-1',
      email: 'clientele.vip@elane-studio.com',
      promoCode: 'VIP-WELCOME15-8941',
      subscribedAt: new Date('2026-01-15').toISOString(),
      status: 'active',
      tier: 'VIP Connoisseur',
    },
    {
      id: 'sub-2',
      email: 'genevieve.laurent@paris-atelier.fr',
      promoCode: 'VIP-WELCOME15-3209',
      subscribedAt: new Date('2026-02-20').toISOString(),
      status: 'active',
      tier: 'VIP Connoisseur',
    }
  ];
}

export const newsletterService = {
  subscribe: async (email, preferences = {}) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = db.subscribers.find((s) => s.email === cleanEmail);
    if (existing) {
      return {
        alreadySubscribed: true,
        email: cleanEmail,
        promoCode: existing.promoCode,
        message: 'Welcome back! You are already registered on the VIP Clientele bulletin.',
      };
    }

    // Generate unique 15% VIP welcome code
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const promoCode = `VIP-WELCOME15-${uniqueSuffix}`;

    const newSubscriber = {
      id: `sub-${Date.now().toString(36)}`,
      email: cleanEmail,
      promoCode,
      interests: preferences.interests || ['All Luxury Departments', 'Outerwear', 'Horology'],
      subscribedAt: new Date().toISOString(),
      status: 'active',
      tier: 'VIP Connoisseur',
    };

    db.subscribers.unshift(newSubscriber);

    // Persist to Supabase if connected
    if (supabase) {
      try {
        await supabase.from('subscribers').upsert({
          id: newSubscriber.id,
          email: cleanEmail,
          promo_code: promoCode,
          status: 'active',
          created_at: newSubscriber.subscribedAt,
        });
      } catch (err) {
        console.warn('Supabase subscriber upsert note:', err.message);
      }
    }

    return {
      alreadySubscribed: false,
      subscriber: newSubscriber,
      promoCode,
      discountPercent: 15,
      message: 'Exclusive invitation confirmed. Your VIP 15% Welcome Pass is now active.',
    };
  },

  getAllSubscribers: async () => {
    return [...db.subscribers];
  },
};
