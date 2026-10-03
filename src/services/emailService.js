import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter if SMTP credentials are provided
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✓ Nodemailer SMTP transporter initialized successfully');
  } catch (err) {
    console.warn('⚠️ SMTP Transporter configuration warning:', err.message);
  }
}

export const emailService = {
  /**
   * Generates a luxury-themed HTML invoice matching ÉLANE Atelier brand aesthetics
   */
  generateInvoiceHTML: (order) => {
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : new Date().toLocaleDateString('en-US');

    const items = order.items || [];
    const subtotal = Number(order.subtotal || 0);
    const discount = Number(order.discount || 0);
    const shipping = Number(order.shippingCost || 0);
    const total = Number(order.total || 0);
    const customerName = order.customer || order.shippingAddress?.name || 'Valued Patron';
    const customerEmail = order.email || order.shippingAddress?.email || '';
    const paymentMethod = (order.paymentMethod || 'Razorpay').toUpperCase();
    const paymentStatus = (order.paymentStatus || 'PAID').toUpperCase();
    const paymentId = order.paymentId || 'N/A';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const itemsHtml = items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #E8E6E1;">
          <td style="padding: 16px 8px; vertical-align: middle;">
            <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 600; color: #141414; font-size: 14px;">
              ${item.name}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #787570; text-transform: uppercase; letter-spacing: 0.05em;">
              Size: ${item.size || 'Standard'} &nbsp;•&nbsp; Color: ${item.color || 'Default'}
            </p>
          </td>
          <td style="padding: 16px 8px; text-align: center; color: #141414; font-size: 13px; font-weight: 500;">
            ${item.quantity || 1}
          </td>
          <td style="padding: 16px 8px; text-align: right; color: #141414; font-size: 13px; font-weight: 600;">
            ₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}
          </td>
          <td style="padding: 16px 8px; text-align: right; color: #141414; font-size: 13px; font-weight: 700;">
            ₹${(Number(item.unitPrice || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
          </td>
        </tr>
      `
      )
      .join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ÉLANE Atelier — Order Invoice #${order.id}</title>
  <style>
    @media print {
      body { background: #FFFFFF !important; margin: 0; padding: 0; }
      .no-print { display: none !important; }
      .invoice-container { box-shadow: none !important; border: none !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141414; -webkit-font-smoothing: antialiased;">
  
  <div class="invoice-container" style="max-width: 680px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border-radius: 4px; overflow: hidden;">
    
    <!-- Top Gold Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>

    <!-- Header & Brand -->
    <div style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #E8E6E1;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: #141414;">
            É L A N E
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C2A676; font-weight: 600;">
            Haute Maroquinerie & Atelier
          </p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 4px 10px; background-color: #FAF9F5; border: 1px solid #E8E6E1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #141414;">
            Tax Invoice / Acquisition Receipt
          </span>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #787570; font-family: monospace;">
            Invoice #: <strong>${order.id}</strong>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #787570;">
            Date: ${orderDate}
          </p>
        </div>
      </div>
    </div>

    <!-- Patron & Shipping Details -->
    <div style="padding: 24px 40px; background-color: #FAF9F5; border-bottom: 1px solid #E8E6E1;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
        <div>
          <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">
            Clientele & Delivery Address
          </p>
          <p style="margin: 0; font-size: 13px; font-weight: 600; color: #141414;">
            ${customerName}
          </p>
          ${order.shippingAddress?.street ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #52504C;">${order.shippingAddress.street}</p>` : ''}
          ${order.shippingAddress?.city ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #52504C;">${order.shippingAddress.city}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}</p>` : ''}
          ${order.shippingAddress?.country ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #52504C;">${order.shippingAddress.country}</p>` : ''}
          ${order.shippingAddress?.phone ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #787570;">Tel: ${order.shippingAddress.phone}</p>` : ''}
        </div>
        <div>
          <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">
            Payment & Settlement Manifest
          </p>
          <p style="margin: 0; font-size: 12px; color: #141414;">
            Method: <strong>${paymentMethod}</strong>
          </p>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #141414;">
            Status: <strong style="color: ${paymentStatus === 'PAID' ? '#047857' : '#B45309'};">${paymentStatus}</strong>
          </p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #787570; font-family: monospace;">
            Transaction Ref: ${paymentId}
          </p>
          ${order.razorpayOrderId ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #787570; font-family: monospace;">Razorpay Order: ${order.razorpayOrderId}</p>` : ''}
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding: 24px 40px;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #141414;">
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; font-weight: 700;">
              Acquisition Piece
            </th>
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; font-weight: 700; text-align: center;">
              Qty
            </th>
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; font-weight: 700; text-align: right;">
              Unit Price
            </th>
            <th style="padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #141414; font-weight: 700; text-align: right;">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals Breakdown -->
      <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
        <div style="width: 260px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #787570; padding-bottom: 6px;">
            <span>Subtotal</span>
            <span style="font-weight: 600; color: #141414;">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          ${discount > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #047857; padding-bottom: 6px;">
            <span>VIP / Promo Savings</span>
            <span style="font-weight: 600;">-₹${discount.toLocaleString('en-IN')}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #787570; padding-bottom: 8px; border-bottom: 1px solid #E8E6E1;">
            <span>White-Glove Courier</span>
            <span style="font-weight: 600; color: #141414;">${shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-family: 'Playfair Display', Georgia, serif; color: #141414; padding-top: 8px;">
            <span>Total Investment</span>
            <span style="font-weight: 700;">₹${total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer & Atelier Guarantee -->
    <div style="padding: 24px 40px; background-color: #141414; color: #FAF9F5; text-align: center;">
      <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 14px; letter-spacing: 0.1em;">
        Thank you for commissioning with Maison ÉLANE
      </p>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: #C2A676; letter-spacing: 0.05em;">
        Defined by Restraint & Longevity • Complimentarily insured nationwide
      </p>
      <div style="margin-top: 16px;" class="no-print">
        <a href="${frontendUrl}/order-success/${order.id}" style="display: inline-block; padding: 10px 20px; background-color: #C2A676; color: #141414; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; border-radius: 2px;">
          Track Live Acquisition
        </a>
      </div>
    </div>

  </div>

  <div class="no-print" style="max-width: 680px; margin: 16px auto 0 auto; text-align: center;">
    <button onclick="window.print()" style="cursor: pointer; padding: 10px 24px; background-color: #141414; color: #FFFFFF; border: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
      🖨️ Print / Save as PDF Invoice
    </button>
  </div>

</body>
</html>
    `;
  },

  /**
   * Dispatches order confirmation email with embedded HTML invoice
   */
  sendOrderConfirmation: async (order, recipientEmail = null) => {
    const email = recipientEmail || order.email || order.shippingAddress?.email;
    if (!email) {
      console.warn('[Email Service]: No recipient email provided for order confirmation.');
      return { success: false, message: 'Missing recipient email' };
    }

    const htmlContent = emailService.generateInvoiceHTML(order);
    const subject = `✨ Maison ÉLANE — Acquisition Invoice #${order.id} Confirmed`;

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"ÉLANE Atelier Concierge" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: htmlContent,
        });
        console.log(`✓ Order confirmation email dispatched to ${email} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        console.warn(`⚠️ Failed to send email via SMTP (${err.message}). Logged invoice locally.`);
        return { success: false, error: err.message };
      }
    } else {
      // Graceful fallback for local or development environments
      console.log(`======================================================`);
      console.log(`[ATELIER ORDER EMAIL DISPATCH READY]`);
      console.log(`Recipient: ${email}`);
      console.log(`Order: #${order.id}`);
      console.log(`Subject: ${subject}`);
      console.log(`Invoice Preview URL: http://localhost:5000/api/orders/${order.id}/invoice`);
      console.log(`======================================================`);
      return {
        success: true,
        mock: true,
        previewUrl: `http://localhost:5000/api/orders/${order.id}/invoice`,
      };
    }
  },

  /**
   * Dispatches luxury styled 6-digit email verification OTP
   */
  sendRegistrationOtp: async (recipientEmail, otpCode, clientName = 'Valued Patron') => {
    if (!recipientEmail) {
      return { success: false, message: 'Recipient email required' };
    }

    const subject = `✨ ${otpCode} is your ÉLANE Atelier Verification Code`;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ÉLANE Atelier Verification Code</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>
    <div style="padding: 36px 32px; text-align: center;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; margin: 0 0 8px 0; letter-spacing: 0.15em; text-transform: uppercase;">ÉLANE</h2>
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #8C6D2D; margin: 0 0 24px 0; font-weight: 700;">Atelier Client Authentication</p>
      
      <p style="font-size: 14px; color: #555; margin: 0 0 24px 0; line-height: 1.6;">
        Dear ${clientName},<br>
        Please use the following 6-digit verification code to confirm your email address and activate your ÉLANE Atelier account.
      </p>

      <div style="margin: 32px 0; padding: 20px; background-color: #FAF8F5; border: 1px dashed #C2A676; border-radius: 6px; display: inline-block;">
        <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 0.35em; color: #141414; padding-left: 0.35em;">${otpCode}</span>
      </div>

      <p style="font-size: 12px; color: #888; margin: 0 0 8px 0;">This security code will expire in <strong>10 minutes</strong>.</p>
      <p style="font-size: 11px; color: #aaa; margin: 0;">If you did not initiate this request, you can safely ignore this email.</p>
    </div>
    <div style="padding: 16px; background-color: #141414; color: #C2A676; text-align: center; font-size: 11px; letter-spacing: 0.05em;">
      ÉLANE Atelier • Defined by Restraint &amp; Longevity
    </div>
  </div>
</body>
</html>
    `;

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"ÉLANE Atelier Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: recipientEmail,
          subject,
          html: htmlContent,
        });
        console.log(`✓ Verification OTP email dispatched to ${recipientEmail} (ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        console.warn(`⚠️ SMTP dispatch notice (${err.message}). Logging OTP to console.`);
      }
    }

    // Always log OTP to server terminal for instant frictionless verification
    console.log(`\n======================================================`);
    console.log(`[ÉLANE ATELIER EMAIL VERIFICATION OTP CODE]`);
    console.log(`Recipient: ${recipientEmail}`);
    console.log(`6-Digit OTP Code: >>  ${otpCode}  <<`);
    console.log(`Expires in: 10 Minutes`);
    console.log(`======================================================\n`);

    return {
      success: true,
      mock: true,
      otp: otpCode,
    };
  },
};
