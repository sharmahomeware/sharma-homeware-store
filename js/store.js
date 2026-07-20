const key = 'sharma-homeware-state-v1';

const seed = {
  cart: [], wishlist: [], offerVisible: true, cartOpen: false, searchOpen: false,
  adminTab: 'overview',
  adminOrders: { 'SH-81472': 'Out for delivery', 'SH-81460': 'Packed', 'SH-81458': 'Payment review' },
  inventory: { 'aurum-tri-ply-kadai': 18, 'heritage-thali-set': 8, 'saffron-vacuum-flask': 26, 'modular-masala-dabba': 5, 'everyday-bowl-set': 11 }
};
let state = (() => {
  try { return { ...seed, ...JSON.parse(localStorage.getItem(key) || '{}') }; }
  catch { return { ...seed }; }
})();

const listeners = new Set();
const save = () => localStorage.setItem(key, JSON.stringify({ ...state, cartOpen: false, searchOpen: false }));
export const getState = () => state;
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
export const setState = (patch) => { state = { ...state, ...patch }; save(); listeners.forEach(fn => fn(state)); };
export const addCart = (id, qty = 1) => {
  const existing = state.cart.find(line => line.id === id);
  const cart = existing ? state.cart.map(line => line.id === id ? { ...line, qty: line.qty + qty } : line) : [...state.cart, { id, qty }];
  setState({ cart, cartOpen: true });
};
export const updateCart = (id, qty) => setState({ cart: qty > 0 ? state.cart.map(line => line.id === id ? { ...line, qty } : line) : state.cart.filter(line => line.id !== id) });
export const toggleWishlist = (id) => setState({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter(x => x !== id) : [...state.wishlist, id] });
export const clearCart = () => setState({ cart: [], cartOpen: false });
export const setAdminTab = (adminTab) => setState({ adminTab });
export const updateAdminOrder = (id, status) => setState({ adminOrders: { ...state.adminOrders, [id]: status } });
export const restock = (id, amount = 6) => setState({ inventory: { ...state.inventory, [id]: (state.inventory[id] || 0) + amount } });
