/* Sharma Homeware local commerce platform server — Node.js standard library only. */
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const DB_FILE = path.join(ROOT, 'data', 'platform-store.json');
const sessions = new Map();
const loginAttempts = new Map();
let db;

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}_${crypto.randomUUID().replaceAll('-', '').slice(0, 14)}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const money = (value) => Math.round(Number(value || 0));
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(`${salt}:${key.toString('hex')}`));
});
const verifyPassword = async (password, encoded) => {
  const [salt, expected] = String(encoded || '').split(':');
  if (!salt || !expected) return false;
  const actual = await hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(encoded));
};

const defaults = () => ({
  schemaVersion: 1,
  updatedAt: now(),
  storefront: {
    activeLocale: 'en', enabledLocales: ['en', 'hi', 'pa'], theme: { mode: 'light', primary: '#B3122E', gold: '#BD9131' },
    home: {
      en: { heroEyebrow: 'Designed for the daily ritual', heroTitle: 'Crafted for every', heroAccent: 'Indian kitchen.', heroCopy: 'Beautiful, enduring steelware that turns everyday cooking into something you want to linger over.', ctaLabel: 'Shop the collection', ctaHref: '#/category/cookware', festival: 'Monsoon Edit — 10% off orders above ₹2,999', festivalLink: '#/category/cookware' },
      hi: { heroEyebrow: 'रोज़मर्रा की रस्मों के लिए', heroTitle: 'हर', heroAccent: 'भारतीय रसोई के लिए।', heroCopy: 'सुंदर और टिकाऊ स्टीलवेयर, जो हर रोज़ के खाना बनाने को खास बनाता है।', ctaLabel: 'कलेक्शन देखें', ctaHref: '#/category/cookware', festival: 'मानसून एडिट — ₹2,999 से ऊपर 10% की बचत', festivalLink: '#/category/cookware' },
      pa: { heroEyebrow: 'ਰੋਜ਼ਾਨਾ ਦੀ ਰਸੋਈ ਲਈ', heroTitle: 'ਹਰ', heroAccent: 'ਭਾਰਤੀ ਰਸੋਈ ਲਈ।', heroCopy: 'ਸੁੰਦਰ ਅਤੇ ਟਿਕਾਊ ਸਟੀਲਵੇਅਰ ਜੋ ਰੋਜ਼ਮਰ੍ਹਾ ਦੀ ਰਸੋਈ ਨੂੰ ਖਾਸ ਬਣਾਉਂਦਾ ਹੈ।', ctaLabel: 'ਕਲੈਕਸ਼ਨ ਦੇਖੋ', ctaHref: '#/category/cookware', festival: 'ਮਾਨਸੂਨ ਐਡਿਟ — ₹2,999 ਤੋਂ ਉੱਤੇ 10% ਬਚਤ', festivalLink: '#/category/cookware' }
    },
    contact: { phone: '+91 99999 99999', whatsapp: '+91 99999 99999', email: 'hello@sharmahomeware.in', address: 'Mumbai, Maharashtra, India', hours: 'Mon–Sat, 10 AM–7 PM', mapUrl: '' },
    social: { instagram: '', facebook: '', youtube: '', pinterest: '' },
    seo: { title: 'Sharma Homeware — Crafted for every Indian kitchen', description: 'Premium cookware, steel utensils and dinnerware for Indian homes.', keywords: 'steel utensils, cookware, dinner sets, homeware India', ogImage: '' },
    featureFlags: { cod: true, reviews: true, whatsapp: true, newsletter: true }
  },
  categories: [
    { id: 'cookware', name: 'Cookware', slug: 'cookware', description: 'Kadais, tawas and pressure cookers.', image: '', position: 1, visible: true, seoTitle: '', seoDescription: '' },
    { id: 'steel-utensils', name: 'Steel Utensils', slug: 'steel-utensils', description: 'Steel plates, bowls and glasses.', image: '', position: 2, visible: true, seoTitle: '', seoDescription: '' },
    { id: 'dinner-sets', name: 'Dinner Sets', slug: 'dinner-sets', description: 'Dining sets and serveware.', image: '', position: 3, visible: true, seoTitle: '', seoDescription: '' },
    { id: 'storage', name: 'Storage Containers', slug: 'storage', description: 'Airtight jars and masala boxes.', image: '', position: 4, visible: true, seoTitle: '', seoDescription: '' },
    { id: 'bottles-flasks', name: 'Bottles & Flasks', slug: 'bottles-flasks', description: 'Steel bottles and insulated flasks.', image: '', position: 5, visible: true, seoTitle: '', seoDescription: '' },
    { id: 'kitchen-tools', name: 'Kitchen Tools', slug: 'kitchen-tools', description: 'Ladles, graters and kitchen gadgets.', image: '', position: 6, visible: true, seoTitle: '', seoDescription: '' }
  ],
  products: [
    { id: 'aurum-tri-ply-kadai', name: 'Aurum Tri-Ply Kadai', slug: 'aurum-tri-ply-kadai', category: 'cookware', subcategory: '', brand: 'Sharma Homeware', price: 2499, salePrice: 2299, oldPrice: 2999, gst: 12, stock: 18, lowStockAt: 8, status: 'active', featured: true, bestseller: true, newArrival: false, rating: 4.9, reviews: 128, badge: 'Bestseller', material: 'Tri-ply steel', capacity: '2.2 L', image: 'kadai', images: [], videos: [], sku: 'SH-CK-AUR-24', barcode: '890000000001', weight: '1.35 kg', dimensions: '24 × 24 × 10 cm', shippingInfo: 'Ships in 1–2 business days', description: 'A responsive, beautifully balanced kadai for the dishes that bring everyone to the table.', specifications: { construction: 'Tri-ply stainless steel', compatible: 'Gas and induction', warranty: '7 years' }, careInstructions: 'Hand wash recommended. Dry immediately after washing.', tags: ['cookware', 'kadai', 'tri-ply'], variants: [{ id: 'aur-20', name: '20 cm', sku: 'SH-CK-AUR-20', price: 2199, stock: 12 }, { id: 'aur-24', name: '24 cm', sku: 'SH-CK-AUR-24', price: 2499, stock: 18 }], seoTitle: 'Aurum Tri-Ply Kadai | Sharma Homeware', seoDescription: 'Premium tri-ply steel kadai for Indian cooking.', metaKeywords: ['kadai', 'tri-ply', 'steel kadai'], createdAt: now(), updatedAt: now() },
    { id: 'heritage-thali-set', name: 'Heritage Thali Set', slug: 'heritage-thali-set', category: 'dinner-sets', subcategory: '', brand: 'Sharma Homeware', price: 3299, salePrice: 2999, oldPrice: 3999, gst: 12, stock: 8, lowStockAt: 10, status: 'active', featured: true, bestseller: true, newArrival: false, rating: 4.8, reviews: 94, badge: 'Festive edit', material: '304 food-grade steel', capacity: '24 pc', image: 'thali', images: [], videos: [], sku: 'SH-DS-HER-24', barcode: '890000000002', weight: '3.2 kg', dimensions: '34 × 34 × 11 cm', shippingInfo: 'Ships in 2–3 business days', description: 'A complete dining ritual in mirror-finished food-grade steel.', specifications: { pieces: 24, material: '304 stainless steel', finish: 'Mirror polish' }, careInstructions: 'Dishwasher safe. Avoid abrasive scrubbers.', tags: ['thali', 'dinner set', 'serveware'], variants: [{ id: 'heritage-4', name: '4 settings', sku: 'SH-DS-HER-4', price: 3299, stock: 8 }], seoTitle: '', seoDescription: '', metaKeywords: [], createdAt: now(), updatedAt: now() },
    { id: 'saffron-vacuum-flask', name: 'Saffron Vacuum Flask', slug: 'saffron-vacuum-flask', category: 'bottles-flasks', subcategory: '', brand: 'Sharma Homeware', price: 1199, salePrice: 1099, oldPrice: 1499, gst: 18, stock: 26, lowStockAt: 8, status: 'active', featured: true, bestseller: false, newArrival: true, rating: 4.9, reviews: 211, badge: 'New', material: '18/8 steel', capacity: '750 ml', image: 'flask', images: [], videos: [], sku: 'SH-BF-SAF-750', barcode: '890000000003', weight: '420 g', dimensions: '8 × 8 × 29 cm', shippingInfo: 'Ships in 1–2 business days', description: 'Keeps chai warm and water cool, with a silhouette made to leave on the desk.', specifications: { insulation: 'Double-wall vacuum', retention: '12 hours hot / 18 hours cold' }, careInstructions: 'Hand wash only. Do not microwave.', tags: ['flask', 'bottle', 'travel'], variants: [{ id: 'saf-500', name: '500 ml', sku: 'SH-BF-SAF-500', price: 999, stock: 19 }, { id: 'saf-750', name: '750 ml', sku: 'SH-BF-SAF-750', price: 1199, stock: 26 }], seoTitle: '', seoDescription: '', metaKeywords: [], createdAt: now(), updatedAt: now() },
    { id: 'modular-masala-dabba', name: 'Modular Masala Dabba', slug: 'modular-masala-dabba', category: 'storage', subcategory: '', brand: 'Sharma Homeware', price: 1599, salePrice: null, oldPrice: 1899, gst: 12, stock: 5, lowStockAt: 8, status: 'active', featured: false, bestseller: false, newArrival: false, rating: 4.7, reviews: 81, badge: null, material: '304 food-grade steel', capacity: '7 compartment', image: 'dabba', images: [], videos: [], sku: 'SH-ST-MAS-7', barcode: '890000000004', weight: '860 g', dimensions: '22 × 22 × 8 cm', shippingInfo: 'Ships in 1–2 business days', description: 'The quiet order of seven essential spices, sealed in a weighty steel case.', specifications: { compartments: 7, lid: 'Tight fitting' }, careInstructions: 'Dry thoroughly before storing spices.', tags: ['storage', 'masala', 'organizer'], variants: [], seoTitle: '', seoDescription: '', metaKeywords: [], createdAt: now(), updatedAt: now() }
  ],
  orders: [
    { id: 'SH-81472', number: 'SH-81472', customerId: 'cus_aarav', customer: { name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phone: '+91 98765 43210' }, items: [{ productId: 'aurum-tri-ply-kadai', name: 'Aurum Tri-Ply Kadai', qty: 1, price: 2499 }], subtotal: 2499, discount: 0, shipping: 0, total: 2499, paymentMethod: 'cod', paymentStatus: 'pending', status: 'out_for_delivery', trackingNumber: 'SHRMA-924728', notes: '', createdAt: now(), updatedAt: now() },
    { id: 'SH-81460', number: 'SH-81460', customerId: 'cus_meera', customer: { name: 'Meera Shah', email: 'meera@example.com', phone: '+91 98111 11111' }, items: [{ productId: 'heritage-thali-set', name: 'Heritage Thali Set', qty: 1, price: 3299 }], subtotal: 3299, discount: 300, shipping: 0, total: 2999, paymentMethod: 'razorpay', paymentStatus: 'paid', status: 'packed', trackingNumber: '', notes: '', createdAt: now(), updatedAt: now() }
  ],
  customers: [
    { id: 'cus_aarav', name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phone: '+91 98765 43210', status: 'active', addresses: [{ label: 'Home', address: 'A-12, Palm Grove Apartments, Bandra West, Mumbai — 400050' }], wishlist: [], createdAt: now() },
    { id: 'cus_meera', name: 'Meera Shah', email: 'meera@example.com', phone: '+91 98111 11111', status: 'active', addresses: [], wishlist: [], createdAt: now() }
  ],
  users: [],
  coupons: [{ id: 'coupon_MONSOON10', code: 'MONSOON10', type: 'percentage', value: 10, minOrder: 2999, maxDiscount: 700, freeShipping: false, startsAt: now(), expiresAt: '2026-08-31T23:59:59.000Z', usageLimit: 500, usageCount: 0, active: true }],
  reviews: [{ id: 'review_001', productId: 'aurum-tri-ply-kadai', customer: 'Aparna Mehta', rating: 5, title: 'A beautiful everyday kadai', body: 'Thoughtful weight and very even heating.', images: [], status: 'approved', createdAt: now() }],
  media: [],
  inventoryHistory: [],
  legal: { about: '<h1>About Sharma Homeware</h1><p>Objects made for the heart of Indian homes.</p>', privacy: '<h1>Privacy Policy</h1><p>Last updated: July 2026.</p>', terms: '<h1>Terms & Conditions</h1><p>Last updated: July 2026.</p>', shipping: '<h1>Shipping Policy</h1><p>Orders ship pan-India.</p>', returns: '<h1>Return & Refund Policy</h1><p>7-day easy returns on eligible products.</p>', faq: '<h1>Frequently asked questions</h1><p>Contact us for any help.</p>' }
});

async function persist() { db.updatedAt = now(); await fs.mkdir(path.dirname(DB_FILE), { recursive: true }); await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2)); }
async function init() {
  try { db = JSON.parse(await fs.readFile(DB_FILE, 'utf8')); } catch { db = defaults(); }
  if (!Array.isArray(db.users)) db.users = [];
  let owner = db.users.find((user) => user.role === 'owner');
  if (!owner) {
    owner = { id: 'usr_owner', name: 'Sharma Homeware Owner', email: process.env.ADMIN_EMAIL || 'owner@sharmahomeware.in', role: 'owner', permissions: ['*'], active: true, passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || 'ChangeMe!2026'), createdAt: now() };
    db.users.push(owner); await persist();
  }
}

function send(res, status, payload, headers = {}) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(JSON.stringify(payload)); }
function staticSend(res, status, body, type) { res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); }
function cookieMap(req) { return Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter((pair) => pair[0])); }
function publicUser(user) { if (!user) return null; const { passwordHash, ...safe } = user; return safe; }
function sessionUser(req) { const token = cookieMap(req).sh_session; const session = sessions.get(token); if (!session || session.expiresAt < Date.now()) return null; return db.users.find((user) => user.id === session.userId && user.active) || null; }
function isAllowed(user, permission) { return user && (user.role === 'owner' || user.permissions?.includes('*') || user.permissions?.includes(permission)); }
function requirePermission(req, res, permission) { const user = sessionUser(req); if (!user) { send(res, 401, { error: 'Authentication required' }); return null; } if (!isAllowed(user, permission)) { send(res, 403, { error: 'You do not have permission for this action' }); return null; } return user; }
async function body(req) { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 2_000_000) throw new Error('Request too large'); } return raw ? JSON.parse(raw) : {}; }
function asArray(value) { return Array.isArray(value) ? value : []; }
function orderStatus(status) { return ['pending', 'accepted', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'].includes(status) ? status : 'pending'; }
function resource(name) { return ({ products: 'products', categories: 'categories', coupons: 'coupons', reviews: 'reviews', media: 'media', customers: 'customers', users: 'users' })[name]; }
function safeProduct(input = {}) { const product = clone(input); product.price = money(product.price); product.salePrice = product.salePrice === null || product.salePrice === '' ? null : money(product.salePrice); product.oldPrice = product.oldPrice === null || product.oldPrice === '' ? null : money(product.oldPrice); product.stock = money(product.stock); product.lowStockAt = money(product.lowStockAt || 5); product.variants = asArray(product.variants); product.images = asArray(product.images); product.videos = asArray(product.videos); product.tags = asArray(product.tags); product.metaKeywords = asArray(product.metaKeywords); product.specifications = product.specifications || {}; product.status = product.status || 'draft'; return product; }

function dashboard() {
  const orders = db.orders; const revenue = orders.filter((order) => !['cancelled', 'refunded'].includes(order.status)).reduce((sum, order) => sum + money(order.total), 0);
  const month = Array.from({ length: 6 }, (_, index) => ({ label: `M${index + 1}`, revenue: Math.round(revenue * (.62 + index * .1)) }));
  const topProducts = db.products.map((product) => ({ id: product.id, name: product.name, sales: orders.reduce((sum, order) => sum + order.items.filter((line) => line.productId === product.id).reduce((n, line) => n + line.qty, 0), 0), revenue: orders.reduce((sum, order) => sum + order.items.filter((line) => line.productId === product.id).reduce((n, line) => n + line.qty * line.price, 0), 0) })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return { revenue, orders: orders.length, pending: orders.filter((order) => ['pending', 'accepted', 'packed'].includes(order.status)).length, delivered: orders.filter((order) => order.status === 'delivered').length, cancelled: orders.filter((order) => order.status === 'cancelled').length, activeCustomers: db.customers.filter((customer) => customer.status === 'active').length, products: db.products.length, lowStock: db.products.filter((product) => product.stock <= product.lowStockAt).length, monthlySales: month, topProducts, recentOrders: orders.slice(0, 8) };
}

async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); const method = req.method;
  if (url.pathname === '/api/health') return send(res, 200, { ok: true, updatedAt: db.updatedAt });
  if (url.pathname === '/api/public/store' && method === 'GET') return send(res, 200, { storefront: db.storefront, categories: db.categories.filter((item) => item.visible), products: db.products.filter((item) => item.status === 'active'), reviews: db.reviews.filter((item) => item.status === 'approved') });
  if (url.pathname === '/api/auth/me' && method === 'GET') return send(res, 200, { user: publicUser(sessionUser(req)) });
  if (url.pathname === '/api/auth/logout' && method === 'POST') { const token = cookieMap(req).sh_session; sessions.delete(token); return send(res, 200, { ok: true }, { 'Set-Cookie': 'sh_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' }); }
  if (url.pathname === '/api/auth/login' && method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown'; const rate = loginAttempts.get(ip) || { count: 0, reset: Date.now() + 60_000 }; if (rate.reset < Date.now()) { rate.count = 0; rate.reset = Date.now() + 60_000; } if (rate.count >= 8) return send(res, 429, { error: 'Too many login attempts. Please wait a minute.' });
    const input = await body(req); const user = db.users.find((item) => item.email.toLowerCase() === String(input.email || '').toLowerCase()); if (!user || !user.active || !(await verifyPassword(String(input.password || ''), user.passwordHash))) { rate.count += 1; loginAttempts.set(ip, rate); return send(res, 401, { error: 'Invalid email or password' }); }
    loginAttempts.delete(ip); const token = crypto.randomBytes(32).toString('base64url'); sessions.set(token, { userId: user.id, expiresAt: Date.now() + 1000 * 60 * 60 * 12 }); return send(res, 200, { user: publicUser(user) }, { 'Set-Cookie': `sh_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200` });
  }
  if (url.pathname === '/api/checkout' && method === 'POST') {
    const input = await body(req); const lines = asArray(input.items).map((line) => ({ product: db.products.find((product) => product.id === line.productId), qty: Math.max(1, money(line.qty || 1)) })).filter((line) => line.product && line.product.stock >= line.qty); if (!lines.length) return send(res, 400, { error: 'Your cart is empty or contains unavailable products.' });
    const subtotal = lines.reduce((sum, line) => sum + (line.product.salePrice || line.product.price) * line.qty, 0); const order = { id: id('ord'), number: `SH-${Math.floor(80000 + Math.random() * 9999)}`, customerId: input.customerId || null, customer: input.customer || {}, items: lines.map((line) => ({ productId: line.product.id, name: line.product.name, qty: line.qty, price: line.product.salePrice || line.product.price })), subtotal, discount: 0, shipping: subtotal >= 999 ? 0 : 99, total: subtotal + (subtotal >= 999 ? 0 : 99), paymentMethod: input.paymentMethod || 'cod', paymentStatus: input.paymentMethod === 'cod' ? 'pending' : 'requires_payment', status: 'pending', trackingNumber: '', notes: '', createdAt: now(), updatedAt: now() };
    if (order.paymentMethod === 'cod') lines.forEach((line) => line.product.stock -= line.qty); db.orders.unshift(order); await persist(); return send(res, 201, { order, gateway: order.paymentMethod === 'cod' ? null : { provider: order.paymentMethod === 'razorpay' ? 'razorpay' : 'payment-provider', integrationRequired: true } });
  }
  if (url.pathname === '/sitemap.xml' && method === 'GET') { const urls = ['/', ...db.products.filter((product) => product.status === 'active').map((product) => `/#/product/${product.slug || product.id}`), ...db.categories.filter((category) => category.visible).map((category) => `/#/category/${category.slug || category.id}`)]; return staticSend(res, 200, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((entry) => `<url><loc>${entry}</loc></url>`).join('')}</urlset>`, 'application/xml; charset=utf-8'); }
  if (url.pathname === '/robots.txt' && method === 'GET') return staticSend(res, 200, 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n', 'text/plain; charset=utf-8');
  if (!url.pathname.startsWith('/api/admin')) return send(res, 404, { error: 'Not found' });
  const user = requirePermission(req, res, 'manage_store'); if (!user) return;
  if (url.pathname === '/api/admin/dashboard' && method === 'GET') return send(res, 200, dashboard());
  if (url.pathname === '/api/admin/content') { if (method === 'GET') return send(res, 200, db.storefront); if (method === 'PUT') { db.storefront = { ...db.storefront, ...(await body(req)) }; await persist(); return send(res, 200, db.storefront); } }
  if (url.pathname === '/api/admin/legal') { if (method === 'GET') return send(res, 200, db.legal); if (method === 'PUT') { db.legal = { ...db.legal, ...(await body(req)) }; await persist(); return send(res, 200, db.legal); } }
  if (parts[2] === 'inventory' && parts[3] && method === 'POST') { const input = await body(req); const product = db.products.find((item) => item.id === parts[3]); if (!product) return send(res, 404, { error: 'Product not found' }); const delta = money(input.delta); product.stock = Math.max(0, product.stock + delta); product.updatedAt = now(); db.inventoryHistory.unshift({ id: id('inv'), productId: product.id, delta, reason: input.reason || 'Manual adjustment', by: user.id, createdAt: now() }); await persist(); return send(res, 200, { product, history: db.inventoryHistory.slice(0, 50) }); }
  if (parts[2] === 'orders') {
    if (method === 'GET' && !parts[3]) return send(res, 200, db.orders);
    const order = db.orders.find((item) => item.id === parts[3] || item.number === parts[3]); if (!order) return send(res, 404, { error: 'Order not found' });
    if (method === 'PATCH') { const input = await body(req); Object.assign(order, { status: orderStatus(input.status || order.status), trackingNumber: input.trackingNumber ?? order.trackingNumber, notes: input.notes ?? order.notes, paymentStatus: input.paymentStatus ?? order.paymentStatus, updatedAt: now() }); await persist(); return send(res, 200, order); }
    if (parts[4] === 'invoice' && method === 'GET') return send(res, 200, { invoiceNumber: `INV-${order.number}`, order, issuedAt: now() });
  }
  const collection = resource(parts[2]); if (!collection) return send(res, 404, { error: 'Unknown admin resource' });
  const list = db[collection];
  if (method === 'GET' && !parts[3]) return send(res, 200, collection === 'users' ? list.map(publicUser) : list);
  if (method === 'POST' && !parts[3]) { const input = await body(req); let item = collection === 'products' ? safeProduct(input) : clone(input); item.id = item.id || id(collection.slice(0, 3)); item.createdAt = item.createdAt || now(); item.updatedAt = now(); if (collection === 'users') { if (user.role !== 'owner') return send(res, 403, { error: 'Only the owner can manage staff accounts' }); item.passwordHash = await hashPassword(input.password || crypto.randomBytes(12).toString('base64url')); item.role = input.role || 'staff'; item.permissions = asArray(input.permissions); item.active = true; } list.unshift(item); await persist(); return send(res, 201, collection === 'users' ? publicUser(item) : item); }
  const index = list.findIndex((item) => item.id === parts[3] || item.slug === parts[3]); if (index < 0) return send(res, 404, { error: 'Record not found' });
  if (parts[4] === 'duplicate' && method === 'POST' && collection === 'products') { const copy = clone(list[index]); copy.id = id('prd'); copy.slug = `${copy.slug || copy.id}-copy`; copy.name = `${copy.name} (Copy)`; copy.sku = `${copy.sku || 'SKU'}-COPY`; copy.status = 'draft'; copy.createdAt = now(); copy.updatedAt = now(); list.unshift(copy); await persist(); return send(res, 201, copy); }
  if (method === 'PUT' || method === 'PATCH') { const input = await body(req); const updated = collection === 'products' ? safeProduct({ ...list[index], ...input }) : { ...list[index], ...input }; updated.updatedAt = now(); if (collection === 'users') { if (user.role !== 'owner') return send(res, 403, { error: 'Only the owner can manage staff accounts' }); if (input.password) updated.passwordHash = await hashPassword(input.password); } list[index] = updated; await persist(); return send(res, 200, collection === 'users' ? publicUser(updated) : updated); }
  if (method === 'DELETE') { if (collection === 'users' && user.role !== 'owner') return send(res, 403, { error: 'Only the owner can manage staff accounts' }); list.splice(index, 1); await persist(); return send(res, 200, { ok: true }); }
  return send(res, 405, { error: 'Method not allowed' });
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'SAMEORIGIN'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  try {
    if (url.pathname.startsWith('/api/') || url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml') return await api(req, res, url);
    const requested = url.pathname === '/' ? '/index.html' : url.pathname; const file = path.resolve(ROOT, `.${decodeURIComponent(requested)}`); if (!file.startsWith(ROOT)) return staticSend(res, 403, 'Forbidden', 'text/plain');
    const content = await fs.readFile(file); const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' }; return staticSend(res, 200, content, types[path.extname(file)] || 'application/octet-stream');
  } catch (error) { if (error.code === 'ENOENT') return staticSend(res, 404, 'Not found', 'text/plain'); console.error(error); return send(res, 500, { error: 'Internal server error' }); }
}

init().then(() => {
  http.createServer(serve).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
