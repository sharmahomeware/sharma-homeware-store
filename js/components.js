import { categories, money, products } from './data.js';
import { getState } from './store.js';

export const icon = (name, size = 20) => {
  const paths = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>', heart: '<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.8l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.4 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>', user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    arrow: '<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>', shield: '<path d="M12 3 20 6v5c0 5-3.3 8.6-8 10-4.7-1.4-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    return: '<path d="M20 11a8 8 0 1 0 1 5"/><path d="M20 4v7h-7"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', tune: '<path d="M4 6h16M7 12h10M10 18h4"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>',
    home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z"/><path d="M9 21v-6h6v6"/>'
  };
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.plus}</svg>`;
};

export const productArt = (kind, large = false) => {
  const size = large ? ' product-art--large' : '';
  const shapes = {
    kadai: '<div class="kadai-bowl"></div><i class="kadai-handle kadai-handle--left"></i><i class="kadai-handle kadai-handle--right"></i><i class="kadai-knob"></i>',
    thali: '<div class="thali-plate"></div><i class="thali-bowl t1"></i><i class="thali-bowl t2"></i><i class="thali-bowl t3"></i><i class="thali-cup"></i>',
    flask: '<div class="flask-body"></div><i class="flask-neck"></i><i class="flask-cap"></i><i class="flask-glint"></i>',
    dabba: '<div class="dabba-base"></div><div class="dabba-lid"></div><i class="dabba-dot d1"></i><i class="dabba-dot d2"></i><i class="dabba-dot d3"></i><i class="dabba-dot d4"></i><i class="dabba-dot d5"></i><i class="dabba-dot d6"></i><i class="dabba-dot d7"></i>',
    bowls: '<div class="bowl b1"></div><div class="bowl b2"></div><div class="bowl b3"></div>',
    tools: '<i class="tool tool1"></i><i class="tool tool2"></i><i class="tool tool3"></i><i class="tool tool4"></i>',
    casserole: '<div class="casserole-body"></div><i class="casserole-lid"></i><i class="casserole-knob"></i><i class="casserole-handle h1"></i><i class="casserole-handle h2"></i>',
    plates: '<div class="plate p1"></div><div class="plate p2"></div><div class="plate p3"></div>',
    lunchbox: '<div class="lunchbox-body"></div><div class="lunchbox-top"></div><i class="lunchbox-band"></i>'
  };
  return `<div class="product-art art-${kind}${size}" aria-hidden="true"><div class="art-shadow"></div><div class="art-object">${shapes[kind] || shapes.kadai}</div></div>`;
};

export const stars = (rating) => `<span class="stars" aria-label="${rating} out of 5"><span>★★★★★</span><b>${rating}</b></span>`;

export const brand = () => `<a class="brand" href="#/home" aria-label="Sharma Homeware home"><span class="brand-mark">S<i>H</i></span><span class="brand-copy">Sharma <em>Homeware</em></span></a>`;

export const productCard = (p, compact = false) => {
  const state = getState(); const wished = state.wishlist.includes(p.id);
  return `<article class="product-card ${compact ? 'product-card--compact' : ''}" data-tilt>
    <a class="product-visual" href="#/product/${p.id}">${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}${productArt(p.image)}<button class="heart-button ${wished ? 'is-active' : ''}" data-wishlist="${p.id}" aria-label="Save ${p.name}">${icon('heart', 19)}</button></a>
    <div class="product-info"><a href="#/product/${p.id}" class="product-name">${p.name}</a><p>${p.material} <span>·</span> ${p.capacity}</p>${stars(p.rating)}<div class="price-row"><strong>${money(p.price)}</strong>${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ''}<button class="mini-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">${icon('plus', 18)}</button></div></div>
  </article>`;
};

export const header = () => {
  const state = getState(); const count = state.cart.reduce((n, x) => n + x.qty, 0);
  return `<header class="site-header"><div class="nav-shell"><button class="mobile-menu" data-action="menu">${icon('menu')}</button>${brand()}<nav class="main-nav">${categories.map(c => `<a href="#/category/${c.id}">${c.name}</a>`).join('')}</nav><div class="nav-actions"><button data-action="search" aria-label="Search">${icon('search')}</button><a href="#/wishlist" aria-label="Wishlist" class="nav-icon">${icon('heart')}</a><button data-action="cart" aria-label="Cart" class="nav-icon bag-icon">${icon('bag')}<span class="cart-count">${count}</span></button><a href="#/account" aria-label="Account" class="nav-icon account-link">${icon('user')}</a></div></div></header>`;
};

export const offer = () => getState().offerVisible ? `<div class="offer-strip"><span class="offer-spark">✦</span><span><b>Monsoon Edit</b> — 10% off orders above ₹2,999 <a href="#/category/cookware">Explore the collection ${icon('arrow', 15)}</a></span><button data-action="dismiss-offer" aria-label="Dismiss offer">${icon('close', 16)}</button></div>` : '';

export const trustMark = (symbol, title, copy) => `<div class="trust-mark"><span class="trust-icon">${icon(symbol, 24)}</span><div><b>${title}</b><p>${copy}</p></div></div>`;

export const footer = () => `<footer class="site-footer"><div class="footer-top"><div><div class="footer-brand">${brand()}<p>Thoughtfully made objects for the heart of your home.</p></div><div class="socials"><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="Pinterest">p</a><a href="#" aria-label="Facebook">f</a></div></div><div class="footer-links"><div><b>Shop</b>${categories.slice(0,3).map(c => `<a href="#/category/${c.id}">${c.name}</a>`).join('')}</div><div><b>About</b><a href="#/account">My account</a><a href="#/tracking">Track your order</a><a href="#/wishlist">Wishlist</a></div><div><b>Help</b><a href="#/tracking">Shipping & delivery</a><a href="#/tracking">Returns & warranty</a><a href="#/account">Contact us</a></div></div></div><div class="footer-bottom"><span>© 2026 Sharma Homeware. Made for Indian homes.</span><span class="payment">UPI <i>VISA</i> <i>RuPay</i> <i>COD</i></span></div></footer>`;

export const mobileNav = () => `<nav class="mobile-nav"><a href="#/home">${icon('home')}<span>Home</span></a><a href="#/category/cookware">${icon('tune')}<span>Categories</span></a><button data-action="cart">${icon('bag')}<span>Cart</span></button><a href="#/wishlist">${icon('heart')}<span>Wishlist</span></a><a href="#/account">${icon('user')}<span>Account</span></a></nav>`;

export const cartDrawer = () => {
  const state = getState(); const lines = state.cart.map(line => ({ ...products.find(p => p.id === line.id), qty: line.qty })).filter(Boolean);
  const subtotal = lines.reduce((n, p) => n + p.price * p.qty, 0);
  return `<div class="drawer-scrim ${state.cartOpen ? 'is-open' : ''}" data-action="close-cart"></div><aside class="cart-drawer ${state.cartOpen ? 'is-open' : ''}" aria-label="Shopping bag"><div class="drawer-head"><div><p>Your selection</p><h2>Shopping bag <span>(${lines.length})</span></h2></div><button data-action="close-cart" aria-label="Close cart">${icon('close')}</button></div>${lines.length ? `<div class="cart-lines">${lines.map(p => `<div class="cart-line"><div class="cart-thumb">${productArt(p.image)}</div><div><a href="#/product/${p.id}" class="cart-name">${p.name}</a><p>${p.capacity}</p><b>${money(p.price)}</b><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove-line" data-remove="${p.id}">Remove</button></div>`).join('')}</div><div class="drawer-total"><div><span>Subtotal</span><b>${money(subtotal)}</b></div><small>Shipping and taxes calculated at checkout.</small><a href="#/checkout" class="button button--primary" data-action="checkout">Proceed to checkout ${icon('arrow', 18)}</a><span class="secure-note">${icon('shield', 15)} Secure checkout · COD available</span></div>` : `<div class="empty-state"><span class="empty-mark">SH</span><h3>Your bag is waiting.</h3><p>Add a few beautiful essentials to begin.</p><a class="text-link" href="#/category/cookware" data-action="close-cart">Discover cookware ${icon('arrow', 16)}</a></div>`}</aside>`;

};

export const toast = () => `<div class="toast" id="toast" role="status"></div>`;
export const whatsapp = () => `<a class="whatsapp" href="https://wa.me/919999999999" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><span>◔</span><i>Need a hand?</i></a>`;
