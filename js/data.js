export const categories = [
  { id: 'cookware', name: 'Cookware', blurb: 'Kadais, tawas & everyday brilliance.', icon: '◒', tone: 'silver' },
  { id: 'steel-utensils', name: 'Steel Utensils', blurb: 'The pieces your table remembers.', icon: '◌', tone: 'pearl' },
  { id: 'dinner-sets', name: 'Dinner Sets', blurb: 'For generous, gathered tables.', icon: '◐', tone: 'gold' },
  { id: 'storage', name: 'Storage Containers', blurb: 'A calmer kind of kitchen.', icon: '▣', tone: 'rose' },
  { id: 'bottles-flasks', name: 'Bottles & Flasks', blurb: 'Made for long days out.', icon: '◉', tone: 'ink' },
  { id: 'kitchen-tools', name: 'Kitchen Tools', blurb: 'Small tools. Better rituals.', icon: '⌁', tone: 'warm' },
];

export const products = [
  { id: 'aurum-tri-ply-kadai', name: 'Aurum Tri-Ply Kadai', category: 'cookware', price: 2499, oldPrice: 2999, rating: 4.9, reviews: 128, badge: 'Bestseller', material: 'Tri-ply steel', capacity: '2.2 L', image: 'kadai', description: 'A responsive, beautifully balanced kadai for the dishes that bring everyone to the table.', colors: ['Steel', 'Onyx'], sizes: ['20 cm', '24 cm', '26 cm'] },
  { id: 'heritage-thali-set', name: 'Heritage Thali Set', category: 'dinner-sets', price: 3299, oldPrice: 3999, rating: 4.8, reviews: 94, badge: 'Festive edit', material: '304 food-grade steel', capacity: '24 pc', image: 'thali', description: 'A complete dining ritual in mirror-finished food-grade steel.', colors: ['Polished steel'], sizes: ['4 settings', '6 settings'] },
  { id: 'saffron-vacuum-flask', name: 'Saffron Vacuum Flask', category: 'bottles-flasks', price: 1199, oldPrice: 1499, rating: 4.9, reviews: 211, badge: 'New', material: '18/8 steel', capacity: '750 ml', image: 'flask', description: 'Keeps chai warm and water cool, with a silhouette made to leave on the desk.', colors: ['Steel', 'Saffron', 'Charcoal'], sizes: ['500 ml', '750 ml'] },
  { id: 'modular-masala-dabba', name: 'Modular Masala Dabba', category: 'storage', price: 1599, oldPrice: 1899, rating: 4.7, reviews: 81, badge: null, material: '304 food-grade steel', capacity: '7 compartment', image: 'dabba', description: 'The quiet order of seven essential spices, sealed in a weighty steel case.', colors: ['Polished steel'], sizes: ['7 compartment'] },
  { id: 'everyday-bowl-set', name: 'Everyday Katori Set', category: 'steel-utensils', price: 899, oldPrice: 1099, rating: 4.8, reviews: 176, badge: 'Customer favourite', material: '304 food-grade steel', capacity: 'Set of 6', image: 'bowls', description: 'Six precisely weighted bowls for dal, dessert, and everything in between.', colors: ['Polished steel'], sizes: ['Set of 6', 'Set of 12'] },
  { id: 'atelier-tool-set', name: 'Atelier Tool Set', category: 'kitchen-tools', price: 1399, oldPrice: 1699, rating: 4.7, reviews: 66, badge: null, material: 'Stainless steel', capacity: 'Set of 5', image: 'tools', description: 'The five kitchen tools you reach for first, rebuilt with satisfying weight.', colors: ['Steel'], sizes: ['Set of 5'] },
  { id: 'prana-casserole', name: 'Prana Casserole', category: 'cookware', price: 1899, oldPrice: null, rating: 4.9, reviews: 59, badge: 'Limited', material: 'Tri-ply steel', capacity: '3 L', image: 'casserole', description: 'A modern serving pot that holds on to warmth and attention.', colors: ['Steel'], sizes: ['2 L', '3 L'] },
  { id: 'celeste-dinner-set', name: 'Celeste Dinner Set', category: 'dinner-sets', price: 4999, oldPrice: 5899, rating: 4.8, reviews: 48, badge: 'Wedding edit', material: '304 food-grade steel', capacity: '32 pc', image: 'plates', description: 'A refined 32-piece dinner set made for the homes that host everyone.', colors: ['Polished steel'], sizes: ['32 pc'] },
  { id: 'orbit-lunch-box', name: 'Orbit Lunch Box', category: 'storage', price: 1099, oldPrice: null, rating: 4.6, reviews: 38, badge: null, material: '304 food-grade steel', capacity: '1.2 L', image: 'lunchbox', description: 'Compact compartments, a reassuring seal, and a polished everyday finish.', colors: ['Steel', 'Red'], sizes: ['2 tier', '3 tier'] },
];

export const testimonials = [
  { quote: 'It feels like the kind of steel my mother trusted, but designed for the kitchen I have now.', name: 'Aparna Mehta', city: 'Pune', initials: 'AM' },
  { quote: 'The kadai heats evenly, looks beautiful, and somehow makes an ordinary Tuesday dinner feel considered.', name: 'Rohan Sethi', city: 'Gurugram', initials: 'RS' },
  { quote: 'Beautifully packed and genuinely premium. Our dinner set has become the first thing guests notice.', name: 'Nandita Iyer', city: 'Bengaluru', initials: 'NI' },
];

export const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
