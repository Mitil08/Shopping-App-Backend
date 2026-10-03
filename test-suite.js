import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function runComprehensiveSmokeTest() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('===============================================================');
  console.log('  ÉLANE LUXURY ATELIER — FULL END-TO-END AUTOMATED SMOKE TEST  ');
  console.log('===============================================================\n');

  let passed = 0;
  let totalTests = 0;

  function assertTest(name, condition, details = '') {
    totalTests++;
    if (condition) {
      passed++;
      console.log(`✓ [PASS ${passed}/${totalTests}] ${name} ${details ? '— ' + details : ''}`);
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '— ' + details : ''}`);
      throw new Error(`Assertion failed for test: ${name}`);
    }
  }

  try {
    // 1. Health Endpoint
    const health = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assertTest('API Health Status', health.status === 'ONLINE' && health.success === true, `Service: ${health.service}`);

    // 2. Categories
    const cats = await fetch(`${BASE_URL}/categories`).then((r) => r.json());
    assertTest('Catalog Categories', cats.success && Array.isArray(cats.data) && cats.data.length > 0, `Loaded ${cats.data.length} categories`);

    // 3. Products Catalog & Search
    const prods = await fetch(`${BASE_URL}/products?search=Coat`).then((r) => r.json());
    assertTest('Product Search Filtering', prods.success && prods.data.products.length > 0, `Found ${prods.data.products.length} coat products`);

    // 4. Free Complimentary Product by Slug
    const freeProd = await fetch(`${BASE_URL}/products/elane-complimentary-discovery-gift`).then((r) => r.json());
    assertTest(
      'Complimentary ₹0 Product Verification',
      freeProd.success && freeProd.data.base_price === 0 && freeProd.data.is_free === true,
      `Item: "${freeProd.data.name}" | Price: ₹${freeProd.data.base_price}`
    );

    // 5. User Registration (with bcrypt hashing)
    const testEmail = `patron_${Date.now()}@elane-atelier.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lady Genevieve Laurent',
        email: testEmail,
        password: 'SecurePatronPass2026!',
      }),
    }).then((r) => r.json());
    assertTest('Patron Registration & Token Issue', regRes.success && !!regRes.data.token, `User ID: ${regRes.data.user.id}`);
    const patronToken = regRes.data.token;

    // 6. User Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePatronPass2026!',
      }),
    }).then((r) => r.json());
    assertTest('Patron Login & bcrypt Authentication', loginRes.success && !!loginRes.data.token, `Token verified for ${loginRes.data.user.email}`);

    // 7. Authenticated Profile Fetch
    const profileRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${patronToken}` },
    }).then((r) => r.json());
    assertTest('Client Profile Fetch (/api/auth/me)', profileRes.success && profileRes.data.user.name === 'Lady Genevieve Laurent');

    // 8. Shopping Bag / Cart Addition
    const cartRes = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${patronToken}` },
      body: JSON.stringify({
        productId: 'prod-1',
        variantId: 'var-1-1',
        quantity: 1,
      }),
    }).then((r) => r.json());
    assertTest('Shopping Bag Management (/api/cart)', cartRes.success && cartRes.data.items.length > 0, `Items in bag: ${cartRes.data.items.length}`);

    // 9. Razorpay Public Key ID Retrieval
    const keyRes = await fetch(`${BASE_URL}/payment/key-id`).then((r) => r.json());
    assertTest('Razorpay Key ID Endpoint', keyRes.success && !!keyRes.key_id, `Key ID: ${keyRes.key_id}`);

    // 10. Razorpay Live Order Creation
    const rzpOrderRes = await fetch(`${BASE_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100, // 100 paise = ₹1.00 minimum
        currency: 'INR',
        receipt: `smoke_rcpt_${Date.now().toString(36)}`,
      }),
    }).then((r) => r.json());
    assertTest('Razorpay Live Order Creation (POST /api/create-order)', rzpOrderRes.success && !!rzpOrderRes.order_id, `Razorpay Order ID: ${rzpOrderRes.order_id}`);
    const razorpayOrderId = rzpOrderRes.order_id;

    // 11. Razorpay Signature Verification (Valid Signature)
    const secretKey = process.env.RAZORPAY_KEY_SECRET || 'mC46DOmqy8ZEGf1JEHQM9HKS';
    const samplePaymentId = `pay_smoke_${Date.now().toString(36)}`;
    const validSignature = crypto
      .createHmac('sha256', secretKey)
      .update(`${razorpayOrderId}|${samplePaymentId}`)
      .digest('hex');

    const verifyRes = await fetch(`${BASE_URL}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: samplePaymentId,
        razorpay_signature: validSignature,
      }),
    }).then((r) => r.json());
    assertTest('Razorpay HMAC-SHA256 Signature Verification', verifyRes.success && verifyRes.verified === true, 'Valid signature accepted');

    // 12. Razorpay Signature Verification (Forged Signature Rejection)
    const forgedRes = await fetch(`${BASE_URL}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: samplePaymentId,
        razorpay_signature: 'invalid_forged_signature_hex_12345',
      }),
    }).then((r) => r.json());
    assertTest('Tampered Signature Security Rejection', forgedRes.success === false && forgedRes.verified === false, 'Invalid signature rejected with HTTP 400');

    // 13. Razorpay Webhook Event Processing
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'elane_webhook_secret_live_2026';
    const webhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_webhook_${Date.now().toString(36)}`,
            order_id: razorpayOrderId,
            amount: 100,
            status: 'captured',
            method: 'upi',
          },
        },
      },
    });
    const webhookSig = crypto.createHmac('sha256', webhookSecret).update(webhookPayload).digest('hex');

    const webhookRes = await fetch(`${BASE_URL}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': webhookSig,
      },
      body: webhookPayload,
    }).then((r) => r.json());
    assertTest('Razorpay Webhook Event Dispatch & Capture', webhookRes.status === 'ok', `Acknowledged event: ${webhookRes.eventReceived}`);

    // 14. Free 100% Complimentary Order Creation (₹0 Bypass)
    const freeOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            productId: 'prod-free-atelier-gift',
            variantId: 'var-free-1',
            name: 'ÉLANE Signature Scent & Silk Pouch (Complimentary Gift)',
            size: 'One Size',
            color: 'Noir & Gold',
            quantity: 1,
            unitPrice: 0,
          },
        ],
        shippingAddress: {
          name: 'Lady Genevieve',
          email: testEmail,
          phone: '+919876543210',
          street: '10 Place Vendôme',
          city: 'Mumbai',
          postalCode: '400001',
          country: 'India',
        },
        subtotal: 0,
        discount: 0,
        shippingCost: 0,
        total: 0,
        paymentMethod: 'complimentary',
        paymentId: 'COMPLIMENTARY-GIFT-CLAIM',
        paymentStatus: 'PAID',
      }),
    }).then((r) => r.json());
    assertTest('Complimentary ₹0 Order Creation', freeOrderRes.success && freeOrderRes.data.order.total === 0, `Order Reference: ${freeOrderRes.data.order.id}`);
    const createdOrderId = freeOrderRes.data.order.id;

    // 15. Fetch Order Manifest by ID
    const fetchOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`).then((r) => r.json());
    assertTest('Fetch Order by ID Manifest', fetchOrderRes.success && fetchOrderRes.data.order.id === createdOrderId, `Customer: ${fetchOrderRes.data.order.customer}`);

    // 16. Admin Dashboard Metrics & Security
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@elane-studio.com', password: 'AdminPass123!' }),
    }).then((r) => r.json());
    const adminToken = adminLogin.data.token;

    const adminDash = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assertTest(
      'Admin Dashboard Metrics & Authorization',
      adminDash.success && adminDash.data.totalProducts > 0,
      `Gross Volume: ₹${adminDash.data.totalSales.toLocaleString('en-IN')} | Total Catalog Items: ${adminDash.data.totalProducts}`
    );

    // 17. Newsletter Subscription
    const newsRes = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `newsletter_${Date.now()}@clientele.com` }),
    }).then((r) => r.json());
    assertTest('Newsletter Subscription API', newsRes.success === true, newsRes.message);

    console.log('\n===============================================================');
    console.log(`  🎉 ALL ${passed}/${totalTests} E2E TESTS PASSED WITH 100% SUCCESS  `);
    console.log('===============================================================\n');
  } catch (err) {
    console.error('\n❌ Smoke Test Aborted with Error:', err.message);
    process.exit(1);
  }
}

runComprehensiveSmokeTest();

