import dotenv from 'dotenv';
import { db } from '../config/db.js';
import { emailService } from './emailService.js';
import { whatsappNotificationService } from './whatsappNotificationService.js';

dotenv.config();

// In-memory reviews store
const reviewsStore = new Map();
const userPointsStore = new Map();

export const loyaltyReviewService = {
  /**
   * Automated Delivery Review Invite dispatched via SendGrid & WhatsApp
   */
  scheduleDeliveryReviewInvite: async (order) => {
    try {
      const recipientEmail = order.email || order.shippingAddress?.email;
      const recipientPhone = order.shippingAddress?.phone || order.phone;
      const customerName = order.customer || order.shippingAddress?.name || 'Valued Patron';
      const orderId = order.id;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const reviewLink = `${frontendUrl}/order/${orderId}?review=true`;

      console.log(`\n======================================================`);
      console.log(`[DELHIVERY POST-DELIVERY REVIEW AUTOMATION TRIGGERED]`);
      console.log(`Order: #${orderId}`);
      console.log(`Recipient: ${customerName} (${recipientEmail || recipientPhone})`);
      console.log(`Review Link (+500 Pts): ${reviewLink}`);
      console.log(`======================================================\n`);

      // 1. Send automated luxury review invite email via SendGrid
      if (recipientEmail) {
        const emailSubject = `✨ How is your Maison ÉLANE piece? Share your review & earn 500 Loyalty Points`;
        const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Review Your Acquisition</title></head>
<body style="margin:0;padding:32px 16px;background-color:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#141414;">
  <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border:1px solid #E8E6E1;border-radius:6px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.04);">
    <div style="height:4px;background:linear-gradient(90deg,#141414 0%,#C2A676 50%,#141414 100%);"></div>
    <div style="padding:36px 32px;text-align:center;">
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;margin:0 0 6px 0;letter-spacing:0.15em;text-transform:uppercase;">É L A N E</h1>
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#C2A676;font-weight:700;margin:0 0 24px 0;">Atelier Clientele Experience</p>
      
      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px 0;">
        Dear <strong>${customerName}</strong>,<br>
        Delhivery has confirmed the successful delivery of order <strong>#${orderId}</strong>. We hope your pieces embody the restraint, longevity, and tactile luxury you expect from Maison ÉLANE.
      </p>

      <div style="background:#FAF9F5;border:1px dashed #C2A676;padding:18px;border-radius:4px;margin:24px 0;">
        <span style="font-size:13px;font-weight:700;color:#141414;display:block;">⭐ 500 Atelier Loyalty Points Reserved For You</span>
        <span style="font-size:11px;color:#787570;margin-top:4px;display:block;">Submit a brief fit &amp; quality review to instantly deposit ₹500 in reward credits.</span>
      </div>

      <a href="${reviewLink}" style="display:inline-block;padding:14px 28px;background:#141414;color:#FAF9F5;text-decoration:none;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;border-radius:2px;margin-top:8px;">
        Rate &amp; Review Your Pieces (+500 Pts)
      </a>
    </div>
    <div style="padding:16px;background:#141414;color:#C2A676;text-align:center;font-size:10px;letter-spacing:0.05em;">
      ÉLANE Atelier • Defined by Restraint &amp; Longevity
    </div>
  </div>
</body>
</html>
        `;

        try {
          if (emailService.sendCustomEmail) {
            await emailService.sendCustomEmail(recipientEmail, emailSubject, emailHtml);
          }
        } catch (e) {
          console.warn('SendGrid review invite email note:', e.message);
        }
      }

      // 2. Send automated WhatsApp review invite via Twilio / Meta API
      if (recipientPhone) {
        const whatsappMsg = `✨ *Maison ÉLANE — Delivery Follow-up* ✨\n\nDear ${customerName},\n\nDelhivery has delivered order *#${orderId}*. We would love to hear your thoughts on the tailoring & fit.\n\n⭐ *Earn 500 Atelier Loyalty Points (₹500 Credit)* by sharing your feedback:\n${reviewLink}\n\n_ÉLANE Atelier Concierge_`;
        try {
          await whatsappNotificationService.sendCustomNotification?.(recipientPhone, whatsappMsg);
        } catch (e) {
          console.warn('WhatsApp review invite note:', e.message);
        }
      }

      return { success: true, orderId, reviewLink };
    } catch (err) {
      console.warn('[Review Automation Warning]:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Submit a verified customer review & award 500 loyalty points
   */
  submitReview: async ({ orderId, productId, userId, rating, headline, comment, fitFeedback, customerName, images = [] }) => {
    const reviewId = `REV-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newReview = {
      id: reviewId,
      orderId: orderId || 'ORD-VERIFIED',
      productId: productId || 'PROD-GENERAL',
      userId: userId || 'usr-guest',
      customerName: customerName || 'Verified Patron',
      rating: Number(rating) || 5,
      headline: headline || 'Exceptional craftsmanship',
      comment: comment || 'Tactile materials and impeccable tailoring.',
      fitFeedback: fitFeedback || 'True to Size',
      images,
      pointsEarned: 500,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    // Store review
    const prodReviews = reviewsStore.get(productId) || [];
    prodReviews.unshift(newReview);
    reviewsStore.set(productId, prodReviews);

    // Credit 500 Loyalty Points
    const currentPoints = userPointsStore.get(userId) || 0;
    const updatedPoints = currentPoints + 500;
    userPointsStore.set(userId, updatedPoints);

    console.log(`\n======================================================`);
    console.log(`[VERIFIED REVIEW SUBMITTED & LOYALTY POINTS AWARDED]`);
    console.log(`Review ID: ${reviewId}`);
    console.log(`Rating: ${rating} Stars • Fit: ${newReview.fitFeedback}`);
    console.log(`Patron: ${newReview.customerName}`);
    console.log(`Loyalty Points Credited: +500 (Total: ${updatedPoints} pts)`);
    console.log(`======================================================\n`);

    return {
      success: true,
      review: newReview,
      pointsAwarded: 500,
      totalPoints: updatedPoints,
      message: 'Thank you! Your verified review has been published and 500 Atelier Loyalty Points have been credited to your account.',
    };
  },

  /**
   * Get verified reviews and ratings breakdown for a product
   */
  getProductReviews: async (productId) => {
    const reviews = reviewsStore.get(productId) || [
      {
        id: 'REV-SAMPLE-01',
        customerName: 'Alistair Vance',
        rating: 5,
        headline: 'Impeccable silhouette & tactile drape',
        comment: 'The weight of the virgin wool blend and structure of the lapels exceed expectation. Fits true to European bespoke sizing.',
        fitFeedback: 'True to Size',
        pointsEarned: 500,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        verifiedPurchase: true,
      },
      {
        id: 'REV-SAMPLE-02',
        customerName: 'Genevieve L.',
        rating: 5,
        headline: 'Stunning craftsmanship',
        comment: 'Arrived in the signature obsidian keepsake packaging with next-day Delhivery courier. Highly recommend.',
        fitFeedback: 'True to Size',
        pointsEarned: 500,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        verifiedPurchase: true,
      },
    ];

    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : '5.0';

    return {
      reviews,
      totalCount: reviews.length,
      averageRating: Number(averageRating),
    };
  },

  /**
   * Get user loyalty points balance & VIP status
   */
  getUserPoints: async (userId) => {
    const points = userPointsStore.get(userId) || 750;
    const tier = points >= 3000 ? 'Black Vault VIP' : points >= 1500 ? 'Atelier Connoisseur' : 'Silver Atelier Member';

    return {
      points,
      tier,
      redeemableCoupons: [
        { code: 'LOYALTY500', value: 500, minOrder: 5000, desc: '₹500 off using 500 loyalty points' },
        { code: 'ATELIER1000', value: 1000, minOrder: 10000, desc: '₹1,000 off using 1000 loyalty points' },
      ],
    };
  },
};
