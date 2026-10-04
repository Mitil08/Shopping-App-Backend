import { db } from '../config/db.js';
import { emailService } from './emailService.js';
import { whatsappNotificationService } from './whatsappNotificationService.js';

// In-memory tracker for active & abandoned carts
// Structure: userId/sessionId -> { userId, guestEmail, guestPhone, items, updatedAt, recoverySentAt, recovered }
const cartTracker = new Map();

export const abandonedCartService = {
  /**
   * Tracks customer cart modifications
   */
  trackCartActivity: (userId, items, customerInfo = {}) => {
    if (!userId && !customerInfo.email) return;
    const key = userId || customerInfo.email;
    const existing = cartTracker.get(key) || {};

    cartTracker.set(key, {
      ...existing,
      userId,
      email: customerInfo.email || existing.email || (userId ? db.users.find((u) => u.id === userId)?.email : null),
      phone: customerInfo.phone || existing.phone || (userId ? db.users.find((u) => u.id === userId)?.phone : null),
      name: customerInfo.name || existing.name || (userId ? db.users.find((u) => u.id === userId)?.name : 'Valued Patron'),
      items: items || [],
      updatedAt: new Date().toISOString(),
      recovered: false,
    });
  },

  /**
   * Marks a cart as recovered (e.g. when order is placed)
   */
  markCartRecovered: (userId, email) => {
    const key = userId || email;
    if (cartTracker.has(key)) {
      const entry = cartTracker.get(key);
      entry.recovered = true;
      entry.recoveredAt = new Date().toISOString();
    }
  },

  /**
   * Generates luxury HTML Abandoned Cart Recovery email with 5% promo voucher
   */
  generateRecoveryEmailHTML: (cartData, discountCode = 'RECOVER5') => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const clientName = cartData.name || 'Valued Patron';
    const items = cartData.items || [];
    const cartTotal = items.reduce((sum, it) => sum + (Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)), 0);
    const discountedTotal = Math.round(cartTotal * 0.95);
    const recoveryUrl = `${frontendUrl}/cart?discount=${discountCode}&utm_source=abandoned_cart_email`;

    const itemsHtml = items.map((it) => `
      <tr style="border-bottom: 1px solid #E8E6E1;">
        <td style="padding: 16px 8px; vertical-align: middle;">
          <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 600; color: #141414; font-size: 14px;">
            ${it.name || 'Atelier Selection'}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #787570; text-transform: uppercase; letter-spacing: 0.05em;">
            Size: ${it.size || 'Standard'} • Color: ${it.color || 'Signature'} • Qty: ${it.quantity || 1}
          </p>
        </td>
        <td style="padding: 16px 8px; text-align: right; color: #141414; font-size: 13px; font-weight: 700;">
          ₹${(Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your ÉLANE Atelier Selection Awaits</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border-radius: 4px; overflow: hidden;">
    
    <!-- Top Gold Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>

    <!-- Header -->
    <div style="padding: 36px 40px 24px 40px; text-align: center; border-bottom: 1px solid #E8E6E1;">
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase;">
        É L A N E
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C2A676; font-weight: 700;">
        Haute Maroquinerie & Atelier
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 40px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 400; margin: 0 0 12px 0; color: #141414;">
        You left something exceptional behind, ${clientName}.
      </h2>
      <p style="font-size: 14px; color: #52504C; line-height: 1.6; margin: 0 0 24px 0;">
        We have reserved the items in your shopping bag. Due to high demand in our atelier, inventory is strictly limited. To assist with your commission, we have unlocked a private <strong>5% Atelier Courtesy Privilège</strong>.
      </p>

      <!-- Reserved Bag Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #141414;">
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; text-align: left;">Reserved Item</th>
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- 5% Discount Box -->
      <div style="background-color: #FAF9F5; border: 1px dashed #C2A676; padding: 18px 24px; border-radius: 4px; text-align: center; margin-bottom: 28px;">
        <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">
          Exclusive 5% Recovery Voucher Code
        </p>
        <span style="font-family: monospace; font-size: 22px; font-weight: 700; letter-spacing: 0.2em; color: #141414;">
          ${discountCode}
        </span>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #047857; font-weight: 600;">
          Your bag total: <span style="text-decoration: line-through; color: #787570;">₹${cartTotal.toLocaleString('en-IN')}</span> → ₹${discountedTotal.toLocaleString('en-IN')}
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 16px;">
        <a href="${recoveryUrl}" style="display: inline-block; padding: 14px 36px; background-color: #141414; color: #FAF9F5; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 2px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
          Complete My Acquisition (5% Off)
        </a>
      </div>
      <p style="text-align: center; margin: 0; font-size: 11px; color: #787570;">
        Voucher is automatically applied at checkout • Complimentary insured white-glove shipping
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 40px; background-color: #141414; color: #FAF9F5; text-align: center; font-size: 11px; letter-spacing: 0.05em;">
      ÉLANE Atelier • Defined by Restraint &amp; Longevity • 24/7 Concierge Support
    </div>
  </div>
</body>
</html>
    `;
  },

  /**
   * Scans for abandoned carts and dispatches recovery sequence via Email & WhatsApp
   */
  processAbandonedCarts: async (minInactivityMinutes = 15) => {
    const now = Date.now();
    const results = [];

    // Also populate from db.carts for logged in users if not tracked yet
    for (const [userId, items] of Object.entries(db.carts || {})) {
      if (items && items.length > 0) {
        const user = db.users.find((u) => u.id === userId);
        if (user && !cartTracker.has(userId)) {
          cartTracker.set(userId, {
            userId,
            email: user.email,
            phone: user.phone,
            name: user.name,
            items,
            updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // simulate 30 mins ago
            recovered: false,
          });
        }
      }
    }

    for (const [key, cart] of cartTracker.entries()) {
      if (cart.recovered) continue;
      if (!cart.items || cart.items.length === 0) continue;

      const timeSinceUpdate = (now - new Date(cart.updatedAt).getTime()) / (1000 * 60);

      // If inactive past threshold and haven't sent recovery email in last 24h
      if (timeSinceUpdate >= minInactivityMinutes && (!cart.recoverySentAt || (now - new Date(cart.recoverySentAt).getTime()) > 24 * 3600 * 1000)) {
        const recipientEmail = cart.email;
        const recipientPhone = cart.phone;
        const discountCode = 'RECOVER5';
        const itemCount = cart.items.length;
        const cartTotal = cart.items.reduce((sum, it) => sum + (Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)), 0);

        let emailDispatched = false;
        let whatsappDispatched = false;

        // 1. Dispatch SendGrid Email
        if (recipientEmail) {
          const emailHtml = abandonedCartService.generateRecoveryEmailHTML(cart, discountCode);
          const emailRes = await emailService.sendCustomEmail(
            recipientEmail,
            `✨ Your ÉLANE Atelier Selection Awaits (5% Courtesy Unlocked)`,
            emailHtml
          );
          emailDispatched = emailRes.success;
        }

        // 2. Dispatch WhatsApp Notification
        if (recipientPhone) {
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const recoveryUrl = `${frontendUrl}/cart?discount=${discountCode}`;
          const waMessage = 
`✨ *ÉLANE ATELIER — RESERVED SELECTION AWAITS* ✨

Dear ${cart.name || 'Valued Patron'},

You left ${itemCount} ${itemCount === 1 ? 'exceptional piece' : 'exceptional pieces'} in your Atelier Shopping Bag (Total: ₹${cartTotal.toLocaleString('en-IN')}).

Due to limited availability, we have reserved your items and unlocked a private *5% Courtesy Code*: *${discountCode}*.

Complete your acquisition with 1-click:
${recoveryUrl}

_ÉLANE Atelier — Defined by Restraint & Longevity_`;

          const waRes = await whatsappNotificationService.sendCustomWhatsAppMessage(recipientPhone, waMessage);
          whatsappDispatched = waRes.success;
        }

        cart.recoverySentAt = new Date().toISOString();
        results.push({
          recipient: cart.email || cart.name,
          itemsCount: itemCount,
          cartTotal,
          emailDispatched,
          whatsappDispatched,
          discountCode,
          timestamp: cart.recoverySentAt,
        });
      }
    }

    return results;
  },

  /**
   * Manual test trigger for demo / testing
   */
  triggerTestRecovery: async (targetEmail, targetPhone = null, customItems = null) => {
    const testItems = customItems || [
      { name: 'Atelier Double-Breasted Wool Coat', size: 'M', color: 'Charcoal Noir', price: 48500, quantity: 1 },
      { name: 'Sartorial Silk Crepe Evening Gown', size: 'S', color: 'Champagne Gold', price: 62000, quantity: 1 }
    ];

    const testCart = {
      name: 'Genevieve Laurent',
      email: targetEmail || 'client@elane-studio.com',
      phone: targetPhone || '+91 98765 43210',
      items: testItems,
      updatedAt: new Date().toISOString(),
      recovered: false,
    };

    cartTracker.set('test-user', testCart);
    return await abandonedCartService.processAbandonedCarts(0); // 0 min threshold for instant test
  },
};
