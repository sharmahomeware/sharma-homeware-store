# Sharma Homeware Commerce Platform

A locally runnable ecommerce platform foundation with a customer storefront, persistent catalog/content data, and an owner control center.

## Run locally

Use the bundled Node executable or any current Node.js release:

```bash
node server.js
```

Then open `http://127.0.0.1:4173/` for the storefront and `http://127.0.0.1:4173/admin.html` for the control center.

Initial owner credentials are defined in `.env.example`. Change `ADMIN_PASSWORD` before any deployment and remove the default credential.

## Included

- Hash-routed homepage, listings, product page, wishlist, cart drawer, checkout, account, and order tracking
- Role-aware owner/staff control center: dashboard, full product editor, categories, stock adjustments, order updates, coupon offers, review moderation, customer controls, media records, homepage CMS, multilingual copy, SEO, legal pages, and team access
- Persistent JSON platform data at `data/platform-store.json`, created automatically on first server run
- Secure password hashing, httpOnly sessions, login rate limiting, security headers, protected admin APIs, and owner-only team management
- Checkout endpoint with COD support and a Razorpay/online-payment integration contract ready for gateway credentials
- Sitemap and robots endpoints, editable meta/OG settings, and a customer language selector (English, Hindi, Punjabi)

## Notes

## Production integrations

This code includes the application foundation, not live third-party accounts. Before production, connect Razorpay keys and webhook verification, a transactional email provider, object storage for real media uploads, Google Analytics/Meta Pixel, a managed database, backups, HTTPS/reverse proxy, and a stronger multi-factor owner-authentication policy. The JSON store is intentionally for local demonstration and should be replaced with PostgreSQL or another managed database in production.
