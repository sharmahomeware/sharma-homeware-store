import { categories, products } from './data.js';

const escapeHtml = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let content;
let locale = localStorage.getItem('sharma-locale') || 'en';
const homeContent = () => content?.home?.[locale] || content?.home?.en || null;

function applyContent() {
  const home = homeContent(); if (!home) return;
  document.documentElement.lang = locale === 'pa' ? 'pa' : locale;
  document.title = content?.seo?.title || document.title;
  const hero = document.querySelector('.hero'); if (hero) {
    const eyebrow = hero.querySelector('.eyebrow'); const title = hero.querySelector('h1'); const copy = hero.querySelector('.hero-text'); const cta = hero.querySelector('.button--primary');
    if (eyebrow) eyebrow.textContent = home.heroEyebrow || eyebrow.textContent;
    if (title) title.innerHTML = `${escapeHtml(home.heroTitle || '')}<br/><em>${escapeHtml(home.heroAccent || '')}</em>`;
    if (copy) copy.textContent = home.heroCopy || copy.textContent;
    if (cta) { cta.href = home.ctaHref || cta.href; cta.firstChild.textContent = `${home.ctaLabel || 'Shop the collection'} `; }
  }
  const festival = document.querySelector('.offer-strip'); if (festival) { const text = festival.querySelector('span:nth-child(2)'); if (text) text.innerHTML = `<b>${escapeHtml((home.festival || '').split('—')[0].trim())}</b>${home.festival?.includes('—') ? ` — ${escapeHtml(home.festival.split('—').slice(1).join('—').trim())}` : ''} <a href="${escapeHtml(home.festivalLink || '#/home')}">Explore the collection →</a>`; }
  const whatsapp = document.querySelector('.whatsapp'); if (whatsapp && content?.contact?.whatsapp) whatsapp.href = `https://wa.me/${content.contact.whatsapp.replace(/\D/g,'')}`;
  const footer = document.querySelector('.footer-brand p'); if (footer && content?.contact?.email) footer.textContent = `${content.contact.email} · ${content.contact.hours || ''}`;
  addLanguageSwitcher();
}
function addLanguageSwitcher() {
  const header = document.querySelector('.site-header'); if (!header || header.querySelector('.language-switcher')) return;
  const switcher = document.createElement('div'); switcher.className = 'language-switcher'; switcher.innerHTML = ['en','hi','pa'].map((code) => `<button data-locale="${code}" class="${locale === code ? 'is-active' : ''}">${code === 'en' ? 'EN' : code === 'hi' ? 'हिं' : 'ਪੰ'}</button>`).join(''); header.querySelector('.nav-shell')?.prepend(switcher);
}
async function hydrate() {
  try {
    const response = await fetch('/api/public/store', { cache: 'no-store' }); if (!response.ok) return; const store = await response.json();
    content = store.storefront; window.__SHARMA_PLATFORM__ = store;
    products.splice(0, products.length, ...store.products);
    categories.splice(0, categories.length, ...store.categories.map((category) => ({ id: category.id, name: category.name, blurb: category.description, icon: '◒', tone: ['silver','pearl','gold','rose','ink','warm'][category.position % 6] || 'silver' })));
    window.dispatchEvent(new Event('sharma:platform-updated'));
    requestAnimationFrame(applyContent);
  } catch { /* The original static preview still works without the platform server. */ }
}
document.addEventListener('click', (event) => { const button = event.target.closest('[data-locale]'); if (!button) return; locale = button.dataset.locale; localStorage.setItem('sharma-locale', locale); window.dispatchEvent(new Event('sharma:platform-updated')); requestAnimationFrame(applyContent); });
window.addEventListener('hashchange', () => requestAnimationFrame(applyContent));
hydrate();
