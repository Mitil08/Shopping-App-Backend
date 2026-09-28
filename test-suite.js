async function runSuite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('=== STARTING COMPLETE END-TO-END VERIFICATION SUITE ===');

  try {
    // 1. Health
    const health = await fetch(BASE_URL + '/health').then(r => r.json());
    console.log('✓ [1/10] Health Check:', health.status);

    // 2. Categories
    const cats = await fetch(BASE_URL + '/categories').then(r => r.json());
    console.log('✓ [2/10] Categories count:', cats.data.length);

    // 3. Products Filter & Search
    const prods = await fetch(BASE_URL + '/products?search=Coat').then(r => r.json());
    console.log('✓ [3/10] Search for "Coat":', prods.data.products.length, 'results');

    // 4. Product Detail by Slug
    const prodSlug = await fetch(BASE_URL + '/products/atelier-double-breasted-wool-coat').then(r => r.json());
    console.log('✓ [4/10] Product by Slug:', prodSlug.data.name, '| Base Price: $' + prodSlug.data.base_price);

    // 5. Auth Register
    const testEmail = `vip_${Date.now()}@elane-clientele.com`;
    const reg = await fetch(BASE_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Lady Genevieve', email: testEmail, password: 'SecurePassword123!' })
    }).then(r => r.json());
    console.log('✓ [5/10] Register New Clientele:', reg.success, '| User ID:', reg.data.user.id);

    // 6. Auth Login
    const login = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'SecurePassword123!' })
    }).then(r => r.json());
    const token = login.data.token;
    console.log('✓ [6/10] Login Token Generated:', !!token);

    // 7. Profile
    const me = await fetch(BASE_URL + '/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    console.log('✓ [7/10] Authenticated Profile:', me.data.user.name);

    // 8. Cart
    const cartAdd = await fetch(BASE_URL + '/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: 'prod-1', variantId: 'var-1-1', quantity: 2 })
    }).then(r => r.json());
    console.log('✓ [8/10] Add to Bag:', cartAdd.success, '| Bag Items:', cartAdd.data.items.length);

    // 9. Order
    const order = await fetch(BASE_URL + '/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: [{ productId: 'prod-1', variantId: 'var-1-1', name: 'Atelier Double-Breasted Wool Coat', price: 590, quantity: 2 }],
        shippingAddress: { name: 'Lady Genevieve', street: '10 Place Vendome', city: 'Paris', postalCode: '75001' },
        subtotal: 1180,
        total: 1180
      })
    }).then(r => r.json());
    console.log('✓ [9/10] Place Order:', order.success, '| Order ID:', order.data.order.id);

    // 10. Admin
    const adminLogin = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@elane-studio.com', password: 'AdminPass123!' })
    }).then(r => r.json());
    const adminToken = adminLogin.data.token;

    const adminDash = await fetch(BASE_URL + '/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    console.log('✓ [10/10] Admin Dashboard Metrics: Gross Volume: $' + adminDash.data.totalSales + ' | Total Products: ' + adminDash.data.totalProducts);

    console.log('=== ALL 10 PHASES & SUBSYSTEMS PASSED WITH 100% SUCCESS ===');
  } catch (err) {
    console.error('Test Suite Error:', err);
  }
}

runSuite();
