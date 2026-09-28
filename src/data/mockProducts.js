// 20+ Premium Editorial Fashion Products for ÉLANE Luxury Brand
export const mockCategories = [
  { id: 'cat-tailoring', name: 'Tailoring & Suiting', slug: 'tailoring-suiting', description: 'Impeccable silhouettes cut from virgin wool, linen blends, and structured cottons.' },
  { id: 'cat-knitwear', name: 'Fine Knitwear', slug: 'fine-knitwear', description: 'Sumptuous cashmere, superfine merino wool, and ribbed organic cotton knits.' },
  { id: 'cat-outerwear', name: 'Outerwear', slug: 'outerwear', description: 'Sculptural trench coats, double-faced wool overcoats, and modern utility jackets.' },
  { id: 'cat-shirts', name: 'Shirts & Tops', slug: 'shirts-tops', description: 'Relaxed poplin, fluid silk blends, and minimalist structural tees.' },
  { id: 'cat-trousers', name: 'Trousers & Denim', slug: 'trousers-denim', description: 'Pleated wide-leg trousers, tailored chinos, and raw Japanese selvedge denim.' },
  { id: 'cat-accessories', name: 'Leather Goods & Accessories', slug: 'leather-accessories', description: 'Full-grain Italian leather bags, minimal cardholders, and brushed brass accessories.' },
];

export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Atelier Double-Breasted Wool Coat',
    slug: 'atelier-double-breasted-wool-coat',
    category_id: 'cat-outerwear',
    categoryName: 'Outerwear',
    base_price: 590,
    sale_price: null,
    brand: 'ÉLANE',
    material: '90% Virgin Wool, 10% Cashmere',
    description: 'A masterclass in modern proportion, the Atelier Coat features an elongated silhouette, broad peak lapels, and horn buttons. Tailored from a substantial virgin wool blend with a soft brushed hand feel.',
    details: [
      'Relaxed drop shoulder with structured internal padding',
      'Dual welt flap pockets and interior chest pockets',
      'Fully lined in cupro silk-touch lining',
      'Made in Portugal'
    ],
    care: 'Dry clean only. Store on shaped wooden hanger with breathable garment cover.',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviewsCount: 28,
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-1-1', size: 'S', color: 'Charcoal Noir', colorHex: '#1C1C1E', sku: 'ELN-COAT-01-S', stock_quantity: 8 },
      { id: 'var-1-2', size: 'M', color: 'Charcoal Noir', colorHex: '#1C1C1E', sku: 'ELN-COAT-01-M', stock_quantity: 12 },
      { id: 'var-1-3', size: 'L', color: 'Charcoal Noir', colorHex: '#1C1C1E', sku: 'ELN-COAT-01-L', stock_quantity: 6 },
      { id: 'var-1-4', size: 'M', color: 'Camel Melange', colorHex: '#C39B77', sku: 'ELN-COAT-02-M', stock_quantity: 9 },
      { id: 'var-1-5', size: 'L', color: 'Camel Melange', colorHex: '#C39B77', sku: 'ELN-COAT-02-L', stock_quantity: 4 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Oversized Poplin Studio Shirt',
    slug: 'oversized-poplin-studio-shirt',
    category_id: 'cat-shirts',
    categoryName: 'Shirts & Tops',
    base_price: 185,
    sale_price: 155,
    brand: 'ÉLANE',
    material: '100% GOTS-Certified Organic Crisp Cotton',
    description: 'An effortless wardrobe cornerstone cut with an architectural, oversized volume. Features a dropped back hem, mother-of-pearl buttons, and a clean concealed placket.',
    details: [
      'High-thread count crisp Italian poplin',
      'Extended French cuffs with double button fastenings',
      'Curved hemline with reinforced side gussets',
      'Garment washed for a soft tactile finish'
    ],
    care: 'Machine wash delicate at 30°C. Warm steam iron inside out.',
    is_featured: true,
    is_active: true,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-2-1', size: 'XS', color: 'Optical White', colorHex: '#FDFCFA', sku: 'ELN-SHIRT-01-XS', stock_quantity: 15 },
      { id: 'var-2-2', size: 'S', color: 'Optical White', colorHex: '#FDFCFA', sku: 'ELN-SHIRT-01-S', stock_quantity: 20 },
      { id: 'var-2-3', size: 'M', color: 'Optical White', colorHex: '#FDFCFA', sku: 'ELN-SHIRT-01-M', stock_quantity: 18 },
      { id: 'var-2-4', size: 'S', color: 'Sky Blue Melange', colorHex: '#A8BDCD', sku: 'ELN-SHIRT-02-S', stock_quantity: 11 },
      { id: 'var-2-5', size: 'M', color: 'Sky Blue Melange', colorHex: '#A8BDCD', sku: 'ELN-SHIRT-02-M', stock_quantity: 14 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Pleated Wide-Leg Wool Trousers',
    slug: 'pleated-wide-leg-wool-trousers',
    category_id: 'cat-trousers',
    categoryName: 'Trousers & Denim',
    base_price: 260,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Lightweight High-Twist Wool',
    description: 'Designed with deep forward pleats that cascade down into a fluid, generous wide-leg profile. Crafted from crease-resistant high-twist tropical wool with exceptional drape.',
    details: [
      'High-rise waist with extended tab closure',
      'Internal curtain waistband construction',
      'Concealed side seam pockets and rear jet pockets',
      'Unfinished hems ready for custom tailoring'
    ],
    care: 'Dry clean only. Steam refresh between wears.',
    is_featured: true,
    is_active: true,
    rating: 5.0,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-3-1', size: 'S', color: 'Oatmeal Taupe', colorHex: '#C5BDB1', sku: 'ELN-TRS-01-S', stock_quantity: 7 },
      { id: 'var-3-2', size: 'M', color: 'Oatmeal Taupe', colorHex: '#C5BDB1', sku: 'ELN-TRS-01-M', stock_quantity: 12 },
      { id: 'var-3-3', size: 'L', color: 'Oatmeal Taupe', colorHex: '#C5BDB1', sku: 'ELN-TRS-01-L', stock_quantity: 5 },
      { id: 'var-3-4', size: 'M', color: 'Jet Black', colorHex: '#151515', sku: 'ELN-TRS-02-M', stock_quantity: 16 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Pure Mongolian Cashmere Mockneck',
    slug: 'pure-mongolian-cashmere-mockneck',
    category_id: 'cat-knitwear',
    categoryName: 'Fine Knitwear',
    base_price: 340,
    sale_price: 295,
    brand: 'ÉLANE',
    material: '100% Grade-A Mongolian Cashmere (2-ply 12-gauge)',
    description: 'Spun from the finest sustainable Mongolian cashmere fibers, this mockneck knit offers cloud-like softness with lightweight thermal insulation. A refined standalone piece or layering anchor.',
    details: [
      'Subtle 3cm structured mock collar',
      'Seamless tubular body knit for unbroken drape',
      'Fine ribbed cuffs and hem with shape retention spandex thread',
      'Anti-pilling treatment applied to spun yarn'
    ],
    care: 'Hand wash cold with wool detergent. Dry flat away from direct sunlight.',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviewsCount: 37,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-4-1', size: 'S', color: 'Warm Alabaster', colorHex: '#ECE7DD', sku: 'ELN-KNIT-01-S', stock_quantity: 10 },
      { id: 'var-4-2', size: 'M', color: 'Warm Alabaster', colorHex: '#ECE7DD', sku: 'ELN-KNIT-01-M', stock_quantity: 14 },
      { id: 'var-4-3', size: 'L', color: 'Warm Alabaster', colorHex: '#ECE7DD', sku: 'ELN-KNIT-01-L', stock_quantity: 8 },
      { id: 'var-4-4', size: 'M', color: 'Espresso Brown', colorHex: '#382B24', sku: 'ELN-KNIT-02-M', stock_quantity: 9 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Sculpted Minimalist Leather Tote',
    slug: 'sculpted-minimalist-leather-tote',
    category_id: 'cat-accessories',
    categoryName: 'Leather Goods & Accessories',
    base_price: 480,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Full-Grain Vegetable-Tanned Italian Leather',
    description: 'An architectural carryall with clean geometric lines, handcrafted in Florence. The vegetable-tanned leather will patina gracefully with time and daily journeys.',
    details: [
      'Accommodates up to 16-inch laptops in dedicated suede compartment',
      'Magnetic bridge closure and interior zipped valuables pouch',
      'Subtle debossed gold-foil ÉLANE serial stamp',
      'Reinforced base with discreet metal protective feet'
    ],
    care: 'Protect with natural leather balm. Store in included organic cotton dust bag.',
    is_featured: true,
    is_active: true,
    rating: 5.0,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-5-1', size: 'One Size', color: 'Cognac Saddle', colorHex: '#8E4A28', sku: 'ELN-BAG-01-OS', stock_quantity: 8 },
      { id: 'var-5-2', size: 'One Size', color: 'Midnight Onyx', colorHex: '#111111', sku: 'ELN-BAG-02-OS', stock_quantity: 12 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Structured Trench with Storm Flap',
    slug: 'structured-trench-with-storm-flap',
    category_id: 'cat-outerwear',
    categoryName: 'Outerwear',
    base_price: 520,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Water-Repellent Dense Cotton Gabardine',
    description: 'A contemporary reimagining of the heritage trench coat. Cut in an elongated silhouette with raglan sleeves, storm flaps, and a generous tie-belt for effortless cinching.',
    details: [
      'Heavyweight 380gsm water-resistant cotton weave',
      'Tortoiseshell horn buttons and leather buckle details',
      'Deep back vent for fluid stride mobility',
      'Contrast woven twill lining'
    ],
    care: 'Specialist dry clean only.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-6-1', size: 'S', color: 'Classic Sand', colorHex: '#D2C2AA', sku: 'ELN-TRN-01-S', stock_quantity: 6 },
      { id: 'var-6-2', size: 'M', color: 'Classic Sand', colorHex: '#D2C2AA', sku: 'ELN-TRN-01-M', stock_quantity: 9 },
      { id: 'var-6-3', size: 'L', color: 'Classic Sand', colorHex: '#D2C2AA', sku: 'ELN-TRN-01-L', stock_quantity: 4 }
    ]
  },
  {
    id: 'prod-7',
    name: 'Relaxed Tailored Single-Breasted Blazer',
    slug: 'relaxed-tailored-single-breasted-blazer',
    category_id: 'cat-tailoring',
    categoryName: 'Tailoring & Suiting',
    base_price: 420,
    sale_price: 360,
    brand: 'ÉLANE',
    material: '80% Tropical Wool, 20% Mulberry Silk',
    description: 'Cut with an unconstructed shoulder and soft canvas chest piece for relaxed modern tailoring. Pairs seamlessly with denim or its coordinating wide-leg trousers.',
    details: [
      'Notch lapel with discreet boutonnière detail',
      'Dual flap pockets and ticket pocket',
      'Partial butterfly cupro lining for warm-weather breathability',
      'Corozo nut buttons'
    ],
    care: 'Dry clean only.',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-7-1', size: '38 (S)', color: 'Slate Heather', colorHex: '#5A636E', sku: 'ELN-BLZ-01-38', stock_quantity: 8 },
      { id: 'var-7-2', size: '40 (M)', color: 'Slate Heather', colorHex: '#5A636E', sku: 'ELN-BLZ-01-40', stock_quantity: 11 },
      { id: 'var-7-3', size: '42 (L)', color: 'Slate Heather', colorHex: '#5A636E', sku: 'ELN-BLZ-01-42', stock_quantity: 7 }
    ]
  },
  {
    id: 'prod-8',
    name: 'Heavyweight Supima Cotton Minimal Tee',
    slug: 'heavyweight-supima-cotton-minimal-tee',
    category_id: 'cat-shirts',
    categoryName: 'Shirts & Tops',
    base_price: 75,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Long-Staple American Supima Cotton (240gsm)',
    description: 'The definitive luxury t-shirt. Dense yet exceptionally smooth jersey with a clean neckline rib that never sags or loses shape after laundry cycles.',
    details: [
      'Substantial 240gsm heavyweight jersey',
      'Pre-shrunk cotton yarn with bio-polish treatment',
      'Boxy modern cut with tailored armhole proportions',
      'Blind stitched sleeves and hem'
    ],
    care: 'Machine wash cold with like colors. Line dry.',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviewsCount: 68,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-8-1', size: 'S', color: 'Bone White', colorHex: '#F6F5F0', sku: 'ELN-TEE-01-S', stock_quantity: 35 },
      { id: 'var-8-2', size: 'M', color: 'Bone White', colorHex: '#F6F5F0', sku: 'ELN-TEE-01-M', stock_quantity: 40 },
      { id: 'var-8-3', size: 'L', color: 'Bone White', colorHex: '#F6F5F0', sku: 'ELN-TEE-01-L', stock_quantity: 28 },
      { id: 'var-8-4', size: 'M', color: 'Deep Olive', colorHex: '#3D4233', sku: 'ELN-TEE-02-M', stock_quantity: 22 }
    ]
  },
  {
    id: 'prod-9',
    name: 'Selvedge Denim Relaxed Jean',
    slug: 'selvedge-denim-relaxed-jean',
    category_id: 'cat-trousers',
    categoryName: 'Trousers & Denim',
    base_price: 240,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Japanese Kurabo Selvedge Cotton (13.5oz)',
    description: 'Woven on vintage shuttle looms in Okayama, Japan. Cut in an easy relaxed straight fit with a mid-rise waist and traditional pink-line selvedge ID at the outer seam.',
    details: [
      'Unwashed raw denim engineered to fade uniquely to your lifestyle',
      'Custom matte black copper rivets and button fly',
      'Reinforced rear pocket lining and chain-stitched hems',
      'Natural vegetable-tanned leather back patch'
    ],
    care: 'Wear raw for 6 months before first soak in cold water. Hang dry.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-9-1', size: '30', color: 'Raw Deep Indigo', colorHex: '#1B243B', sku: 'ELN-DNM-01-30', stock_quantity: 10 },
      { id: 'var-9-2', size: '32', color: 'Raw Deep Indigo', colorHex: '#1B243B', sku: 'ELN-DNM-01-32', stock_quantity: 15 },
      { id: 'var-9-3', size: '34', color: 'Raw Deep Indigo', colorHex: '#1B243B', sku: 'ELN-DNM-01-34', stock_quantity: 8 }
    ]
  },
  {
    id: 'prod-10',
    name: 'Fine Ribbed Merino Cardigan',
    slug: 'fine-ribbed-merino-cardigan',
    category_id: 'cat-knitwear',
    categoryName: 'Fine Knitwear',
    base_price: 280,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Extra-Fine Australian Merino Wool',
    description: 'Knitted with a delicate micro-rib texture that hugs the silhouette while retaining its elastic spring. Accentuated by slim genuine horn buttons and a V-neckline.',
    details: [
      'Ultra-soft 19.5 micron spun merino yarn',
      'Ribbed placket with reinforced grosgrain ribbon backing',
      'Naturally temperature-regulating and odor-resistant',
      'Fully fashioned seamless sleeve construction'
    ],
    care: 'Dry clean or gentle hand wash in lukewarm water with wool detergent.',
    is_featured: false,
    is_active: true,
    rating: 4.7,
    reviewsCount: 14,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-10-1', size: 'S', color: 'Sand Dust', colorHex: '#DACFBC', sku: 'ELN-CRD-01-S', stock_quantity: 9 },
      { id: 'var-10-2', size: 'M', color: 'Sand Dust', colorHex: '#DACFBC', sku: 'ELN-CRD-01-M', stock_quantity: 13 },
      { id: 'var-10-3', size: 'L', color: 'Sand Dust', colorHex: '#DACFBC', sku: 'ELN-CRD-01-L', stock_quantity: 6 }
    ]
  },
  {
    id: 'prod-11',
    name: 'French Linen Relaxed Resort Shirt',
    slug: 'french-linen-relaxed-resort-shirt',
    category_id: 'cat-shirts',
    categoryName: 'Shirts & Tops',
    base_price: 165,
    sale_price: 135,
    brand: 'ÉLANE',
    material: '100% Normandy Flax Linen',
    description: 'Spun from long flax fibers grown in Normandy, France. Delivers an airy, breezy feel with a camp collar that can be worn open or buttoned to the top.',
    details: [
      'Pre-washed with volcanic stones for supreme lived-in softness',
      'Relaxed straight hem with side vents for untucked styling',
      'Mother-of-pearl buttons with cross-stitching',
      'Naturally cooling in warm climates'
    ],
    care: 'Machine wash cold on gentle cycle. Embrace natural rumples or steam lightly.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 23,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-11-1', size: 'S', color: 'Natural Ecru', colorHex: '#EDE6D6', sku: 'ELN-LIN-01-S', stock_quantity: 12 },
      { id: 'var-11-2', size: 'M', color: 'Natural Ecru', colorHex: '#EDE6D6', sku: 'ELN-LIN-01-M', stock_quantity: 16 },
      { id: 'var-11-3', size: 'L', color: 'Natural Ecru', colorHex: '#EDE6D6', sku: 'ELN-LIN-01-L', stock_quantity: 10 }
    ]
  },
  {
    id: 'prod-12',
    name: 'Minimal Italian Calfskin Belt',
    slug: 'minimal-italian-calfskin-belt',
    category_id: 'cat-accessories',
    categoryName: 'Leather Goods & Accessories',
    base_price: 140,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Full-Grain Tuscan Calfskin & Solid Brushed Brass',
    description: 'A refined 30mm width belt tailored with beveled burnished edges and a custom custom-cast solid brass buckle finished in brushed palladium.',
    details: [
      'Full grain vegetable-tanned leather strap with nubuck backing',
      'Custom minimalist square buckle profile',
      'Five precision-punched oblong holes for perfect adjustment',
      'Handcrafted in Tuscany'
    ],
    care: 'Wipe with soft damp cloth. Condition once a year.',
    is_featured: false,
    is_active: true,
    rating: 4.9,
    reviewsCount: 17,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-12-1', size: '85cm', color: 'Midnight Noir', colorHex: '#181818', sku: 'ELN-BLT-01-85', stock_quantity: 14 },
      { id: 'var-12-2', size: '90cm', color: 'Midnight Noir', colorHex: '#181818', sku: 'ELN-BLT-01-90', stock_quantity: 18 },
      { id: 'var-12-3', size: '95cm', color: 'Midnight Noir', colorHex: '#181818', sku: 'ELN-BLT-01-95', stock_quantity: 11 }
    ]
  },
  {
    id: 'prod-13',
    name: 'Silk-Wool Tailored Evening Trouser',
    slug: 'silk-wool-tailored-evening-trouser',
    category_id: 'cat-tailoring',
    categoryName: 'Tailoring & Suiting',
    base_price: 310,
    sale_price: null,
    brand: 'ÉLANE',
    material: '70% Worsted Wool, 30% Mulberry Silk',
    description: 'A sartorial masterpiece for elevated dinners and nocturnal affairs. Features subtle grosgrain side piping and an unbroken center crease for a streamlined stature.',
    details: [
      'Subtle silk sheen with incredible liquid drape',
      'Concealed hook-and-bar waistband with side adjusters',
      'Satin pocket welts and horn buttons',
      'Lined to the knee in anti-static cupro'
    ],
    care: 'Specialist dry clean only.',
    is_featured: false,
    is_active: true,
    rating: 5.0,
    reviewsCount: 8,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-13-1', size: 'S', color: 'Obsidian Black', colorHex: '#0D0D0E', sku: 'ELN-EVN-01-S', stock_quantity: 5 },
      { id: 'var-13-2', size: 'M', color: 'Obsidian Black', colorHex: '#0D0D0E', sku: 'ELN-EVN-01-M', stock_quantity: 7 },
      { id: 'var-13-3', size: 'L', color: 'Obsidian Black', colorHex: '#0D0D0E', sku: 'ELN-EVN-01-L', stock_quantity: 4 }
    ]
  },
  {
    id: 'prod-14',
    name: 'Architectural Poplin Shirtdress',
    slug: 'architectural-poplin-shirtdress',
    category_id: 'cat-shirts',
    categoryName: 'Shirts & Tops',
    base_price: 290,
    sale_price: 245,
    brand: 'ÉLANE',
    material: '100% Dense Compact Cotton Poplin',
    description: 'Engineered with sculptural volume, this mid-calf length dress combines crisp shirting details with a dramatic cocoon silhouette and removable matching sash.',
    details: [
      'Mandarin collar with subtle slit neckline',
      'Deep side seam slip pockets',
      'Curved high-low hemline with generous movement',
      'Includes detachable 5cm wide sash belt'
    ],
    care: 'Machine wash cold. Hang dry. Iron while slightly damp.',
    is_featured: false,
    is_active: true,
    rating: 4.9,
    reviewsCount: 16,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-14-1', size: 'XS', color: 'Pure Chalk', colorHex: '#FBFBFA', sku: 'ELN-DRS-01-XS', stock_quantity: 6 },
      { id: 'var-14-2', size: 'S', color: 'Pure Chalk', colorHex: '#FBFBFA', sku: 'ELN-DRS-01-S', stock_quantity: 10 },
      { id: 'var-14-3', size: 'M', color: 'Pure Chalk', colorHex: '#FBFBFA', sku: 'ELN-DRS-01-M', stock_quantity: 8 }
    ]
  },
  {
    id: 'prod-15',
    name: 'Double-Faced Wool Blanket Wrap',
    slug: 'double-faced-wool-blanket-wrap',
    category_id: 'cat-outerwear',
    categoryName: 'Outerwear',
    base_price: 360,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Hand-Stitched Double-Faced Merino Wool',
    description: 'Two layers of gossamer merino wool hand-split and hand-stitched along the perimeter for an unlined, featherweight wrap with luxurious thermal cocooning.',
    details: [
      'Generous 180cm x 140cm sculptural wrap silhouette',
      'Reversible two-tone colorway',
      'Fringeless clean architectural hems',
      'Signature removable leather carry strap'
    ],
    care: 'Dry clean only.',
    is_featured: false,
    is_active: true,
    rating: 5.0,
    reviewsCount: 11,
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-15-1', size: 'One Size', color: 'Taupe / Charcoal', colorHex: '#B2A89F', sku: 'ELN-WRP-01-OS', stock_quantity: 15 }
    ]
  },
  {
    id: 'prod-16',
    name: 'Washed Silk Habotai Slip Skirt',
    slug: 'washed-silk-habotai-slip-skirt',
    category_id: 'cat-trousers',
    categoryName: 'Trousers & Denim',
    base_price: 220,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Sandwashed Mulberry Silk (19mm)',
    description: 'Cut on the bias to fluidly skim the hips and thighs before ending in a gentle flounce. The sandwashed treatment gives the silk a velvety, matte peachskin feel.',
    details: [
      'Comfortable concealed elastic waistband',
      'Bias cut for natural ergonomic stretch without elastane',
      'Mid-calf midi length with baby hem finish',
      'French seamed interiors'
    ],
    care: 'Hand wash cold with silk detergent or dry clean.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 20,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-16-1', size: 'S', color: 'Champagne Luster', colorHex: '#E8DEC8', sku: 'ELN-SKT-01-S', stock_quantity: 8 },
      { id: 'var-16-2', size: 'M', color: 'Champagne Luster', colorHex: '#E8DEC8', sku: 'ELN-SKT-01-M', stock_quantity: 11 },
      { id: 'var-16-3', size: 'L', color: 'Champagne Luster', colorHex: '#E8DEC8', sku: 'ELN-SKT-01-L', stock_quantity: 6 }
    ]
  },
  {
    id: 'prod-17',
    name: 'Minimal Bifold Card Wallet',
    slug: 'minimal-bifold-card-wallet',
    category_id: 'cat-accessories',
    categoryName: 'Leather Goods & Accessories',
    base_price: 110,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% French Boxcalf Leather',
    description: 'A slim, pocket-friendly bifold wallet engineered to hold up to 8 cards and folded bills with zero unnecessary bulk. Finished with hand-painted edges.',
    details: [
      'Ultra-thin 6mm folded profile',
      'Four quick-access exterior card slots and central cash sleeve',
      'Foil-stamped ÉLANE monogram in muted gold',
      'RFID protective lining'
    ],
    care: 'Keep dry. Buff gently with a microfiber cloth.',
    is_featured: false,
    is_active: true,
    rating: 4.9,
    reviewsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-17-1', size: 'One Size', color: 'Saddle Tan', colorHex: '#9E6746', sku: 'ELN-WLT-01-OS', stock_quantity: 25 },
      { id: 'var-17-2', size: 'One Size', color: 'Raven Black', colorHex: '#121212', sku: 'ELN-WLT-02-OS', stock_quantity: 30 }
    ]
  },
  {
    id: 'prod-18',
    name: 'Chunky Ribbed Wool Fisherman Beanie',
    slug: 'chunky-ribbed-wool-fisherman-beanie',
    category_id: 'cat-accessories',
    categoryName: 'Leather Goods & Accessories',
    base_price: 85,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% British Shetland Wool',
    description: 'A warm, rugged yet refined winter essential knitted in a 5-gauge fisherman rib stitch. Sits neatly above the ears with a snug cuff.',
    details: [
      'Heavyweight 5-gauge chunky rib construction',
      'Folded double-layer brim for ear warmth',
      'Naturally water-shedding Shetland fleece',
      'Made in Scotland'
    ],
    care: 'Hand wash cold. Dry flat.',
    is_featured: false,
    is_active: true,
    rating: 4.7,
    reviewsCount: 18,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-18-1', size: 'One Size', color: 'Granite Grey', colorHex: '#686B6F', sku: 'ELN-BN-01-OS', stock_quantity: 20 },
      { id: 'var-18-2', size: 'One Size', color: 'Bone Cream', colorHex: '#EAE5D9', sku: 'ELN-BN-02-OS', stock_quantity: 18 }
    ]
  },
  {
    id: 'prod-19',
    name: 'Classic Oxford Button-Down Shirt',
    slug: 'classic-oxford-button-down-shirt',
    category_id: 'cat-shirts',
    categoryName: 'Shirts & Tops',
    base_price: 150,
    sale_price: null,
    brand: 'ÉLANE',
    material: '100% Combed Heavy Cotton Oxford Weave',
    description: 'The quintessential smart-casual shirt. Substantial basketweave Oxford cloth that softens with every wash while retaining a clean, structured collar roll.',
    details: [
      'Generous 3.25 inch collar points with perfect arch roll',
      'Single rounded chest pocket and back box pleat with locker loop',
      'Thick genuine pearl buttons',
      'Reinforced side seams with contrasting bar-tacks'
    ],
    care: 'Machine wash warm. Hang dry or tumble low.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-19-1', size: 'S', color: 'Pale Chambray', colorHex: '#B7C9D3', sku: 'ELN-OXF-01-S', stock_quantity: 14 },
      { id: 'var-19-2', size: 'M', color: 'Pale Chambray', colorHex: '#B7C9D3', sku: 'ELN-OXF-01-M', stock_quantity: 22 },
      { id: 'var-19-3', size: 'L', color: 'Pale Chambray', colorHex: '#B7C9D3', sku: 'ELN-OXF-01-L', stock_quantity: 16 }
    ]
  },
  {
    id: 'prod-20',
    name: 'Structured Utility Field Jacket',
    slug: 'structured-utility-field-jacket',
    category_id: 'cat-outerwear',
    categoryName: 'Outerwear',
    base_price: 440,
    sale_price: 380,
    brand: 'ÉLANE',
    material: '100% Waxed British Cotton Canvas',
    description: 'An elevated interpretation of military utility wear. Four bellows pockets, internal cinch cord waist, and a concealed two-way zipper protected by a snap storm flap.',
    details: [
      'Weather-resistant dry-wax cotton finish',
      'Corduroy collar facing and cuff lining for neck comfort',
      'Internal zippered security pocket',
      'Bi-swing back shoulder gussets for unrestricted reach'
    ],
    care: 'Sponge clean with cold water only. Re-wax every 2 years.',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviewsCount: 25,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-20-1', size: 'S', color: 'Field Khaki', colorHex: '#55543F', sku: 'ELN-FLD-01-S', stock_quantity: 7 },
      { id: 'var-20-2', size: 'M', color: 'Field Khaki', colorHex: '#55543F', sku: 'ELN-FLD-01-M', stock_quantity: 12 },
      { id: 'var-20-3', size: 'L', color: 'Field Khaki', colorHex: '#55543F', sku: 'ELN-FLD-01-L', stock_quantity: 6 }
    ]
  },
  {
    id: 'prod-21',
    name: 'Fine Gauge Ribbed Silk-Cotton Polo',
    slug: 'fine-gauge-ribbed-silk-cotton-polo',
    category_id: 'cat-knitwear',
    categoryName: 'Fine Knitwear',
    base_price: 195,
    sale_price: null,
    brand: 'ÉLANE',
    material: '55% Mulberry Silk, 45% Organic Cotton',
    description: 'A luxurious knit polo with a Johnny open collar and seamless ribbing. Offers a subtle luster and silky softness on bare skin.',
    details: [
      'Open Johnny collar with knitted self-facings',
      'Set-in sleeves with clean ribbed cuffs',
      'Breathable, lightweight 16-gauge knit',
      'Garment washed for dimensional stability'
    ],
    care: 'Hand wash cold or gentle machine cycle in a mesh wash bag.',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-21-1', size: 'S', color: 'Sage Slate', colorHex: '#8C9588', sku: 'ELN-POL-01-S', stock_quantity: 11 },
      { id: 'var-21-2', size: 'M', color: 'Sage Slate', colorHex: '#8C9588', sku: 'ELN-POL-01-M', stock_quantity: 14 },
      { id: 'var-21-3', size: 'L', color: 'Sage Slate', colorHex: '#8C9588', sku: 'ELN-POL-01-L', stock_quantity: 8 }
    ]
  }
];
