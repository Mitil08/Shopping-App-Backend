// Mega E-Commerce Catalog with Diverse Amazon/Flipkart Categories
// Categories: Mobiles & Electronics, Men's Fashion, Women's Fashion, Home & Luxury Living, Beauty & Fragrances, Smart Watches & Audio, Footwear & Sneaker Lab

export const expandedCategories = [
  { id: 'cat-mobiles-tech', name: 'Smartphones & Electronics', slug: 'mobiles-electronics', description: 'Next-generation flagship smartphones, OLED tablets, and high-performance audio.' },
  { id: 'cat-audio-wearables', name: 'Smartwatches & Audio', slug: 'smartwatches-audio', description: 'Spatial audio noise-canceling headphones, titanium smartwatches, and hi-fi soundbars.' },
  { id: 'cat-mens-fashion', name: 'Men’s Designer Fashion', slug: 'mens-fashion', description: 'Tailored suits, organic cotton tees, linen button-downs, and Japanese denim.' },
  { id: 'cat-womens-fashion', name: 'Women’s Luxury Fashion', slug: 'womens-fashion', description: 'Sculptural trench coats, silk evening slip dresses, and cashmere oversized knits.' },
  { id: 'cat-footwear', name: 'Footwear & Sneaker Lab', slug: 'footwear-sneakers', description: 'Handmade Tuscan leather Chelsea boots, Italian suede loafers, and minimalist court sneakers.' },
  { id: 'cat-beauty-perfumes', name: 'Beauty & Rare Fragrances', slug: 'beauty-fragrances', description: 'Artisanal niche perfumes, botanical skincare serums, and 24K restorative gold elixirs.' },
  { id: 'cat-home-living', name: 'Home, Decor & Luxury Living', slug: 'home-luxury-living', description: 'Sculptural ceramic lamps, organic Belgian linen throws, and brass pour-over coffee bars.' },
  { id: 'cat-accessories', name: 'Leather Goods & Accessories', slug: 'leather-accessories', description: 'Full-grain Italian leather bags, minimal cardholders, and brushed brass accessories.' },
];

export const expandedProducts = [
  // --- 1. SMARTPHONES & ELECTRONICS ---
  {
    id: 'prod-tech-1',
    name: 'Aether Pro 16 Flagship Smartphone (512GB Ceramic Titanium)',
    slug: 'aether-pro-16-flagship-smartphone-512gb',
    category_id: 'cat-mobiles-tech',
    categoryName: 'Smartphones & Electronics',
    base_price: 139900,
    sale_price: 129990,
    brand: 'AETHER LABS',
    material: 'Aerospace-Grade Grade 5 Titanium & Ceramic Shield Glass',
    description: 'The pinnacle of mobile engineering. Powered by the 3nm Quantum-Core processor, 6.8-inch 120Hz ProMotion XDR display, and 200MP periscope zoom lens with cinematic color grading.',
    details: [
      '200MP Triple Studio Matrix Camera with 10x Optical Periscope Zoom',
      '6.8-inch Ultra Retina Dynamic AMOLED 2X, 3000 nits peak brightness',
      '5500 mAh battery with 100W HyperCharge (0 to 100% in 19 mins)',
      'Satellite emergency beacon & IP68 military-grade water submersion'
    ],
    care: 'Wipe with microfiber lens cloth. Compatible with all Qi2 wireless charging pads.',
    is_featured: true,
    is_active: true,
    rating: 4.95,
    reviewsCount: 342,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-tech1-1', size: '256GB', color: 'Titanium Graphite', colorHex: '#2E3033', sku: 'AETH-16-256-GR', stock_quantity: 15 },
      { id: 'var-tech1-2', size: '512GB', color: 'Titanium Graphite', colorHex: '#2E3033', sku: 'AETH-16-512-GR', stock_quantity: 28 },
      { id: 'var-tech1-3', size: '1TB', color: 'Ceramic Moonlight White', colorHex: '#EAEBEB', sku: 'AETH-16-1TB-WH', stock_quantity: 8 }
    ]
  },
  {
    id: 'prod-tech-2',
    name: 'Horizon Pad Ultra 13" OLED Tablet with Magic Stylus Pro',
    slug: 'horizon-pad-ultra-13-oled-tablet',
    category_id: 'cat-mobiles-tech',
    categoryName: 'Smartphones & Electronics',
    base_price: 94900,
    sale_price: 84990,
    brand: 'AETHER LABS',
    material: 'Monolithic Recycled Aircraft Aluminum Alloy',
    description: 'An architectural creative canvas. Featuring tandem dual-stack OLED technology for true studio blacks and 1000 nits full-screen brightness. Comes bundled with pressure-sensitive haptic stylus.',
    details: [
      '13.0-inch 3.2K Tandem OLED with 10-bit DCI-P3 color gamut',
      'Quad stereo acoustic array tuned by Master Studio Engineers',
      'Magnetic keyboard and stylus inductive dock included',
      'Runs desktop multitasking workflows seamlessly'
    ],
    care: 'Clean with anti-static display wipes.',
    is_featured: false,
    is_active: true,
    rating: 4.9,
    reviewsCount: 189,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-tech2-1', size: '256GB WiFi', color: 'Space Silver', colorHex: '#C5C7CA', sku: 'HORIZ-TAB-256', stock_quantity: 12 },
      { id: 'var-tech2-2', size: '512GB 5G Cellular', color: 'Space Silver', colorHex: '#C5C7CA', sku: 'HORIZ-TAB-512-5G', stock_quantity: 9 }
    ]
  },

  // --- 2. SMARTWATCHES & HIGH-END AUDIO ---
  {
    id: 'prod-audio-1',
    name: 'Sonosfera Acoustic ANC Wireless Headphones (Bespoke Tuscan Leather)',
    slug: 'sonosfera-acoustic-anc-wireless-headphones',
    category_id: 'cat-audio-wearables',
    categoryName: 'Smartwatches & Audio',
    base_price: 45000,
    sale_price: 38990,
    brand: 'SONOSFERA ATELIER',
    material: 'Beryllium Drivers, Anodized Billet Aluminum & Vegetable-Tanned Lambskin',
    description: 'Audiophile acoustic precision meets luxury fashion craft. Custom 40mm electroplated beryllium drivers deliver zero-distortion playback across 5Hz to 48kHz with adaptive spatial transparency.',
    details: [
      '40mm Custom Electroplated Beryllium drivers for hyper-linear fidelity',
      'Hybrid active noise cancellation with 8 precision beamforming microphones',
      '50-hour continuous playback on single USB-C fast charge',
      'Ultra-soft replaceable memory foam lambskin earcups'
    ],
    care: 'Condition leather headband with natural wax balm. Store in hardshell travel case.',
    is_featured: true,
    is_active: true,
    rating: 4.95,
    reviewsCount: 215,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-aud1-1', size: 'Universal', color: 'Obsidian Noir', colorHex: '#141414', sku: 'SONO-HP-BLK', stock_quantity: 18 },
      { id: 'var-aud1-2', size: 'Universal', color: 'Saddle Cognac', colorHex: '#8E4A28', sku: 'SONO-HP-BRN', stock_quantity: 14 }
    ]
  },
  {
    id: 'prod-audio-2',
    name: 'ChronoMax Pro GPS Titanium Smartwatch with Sapphire Crystal',
    slug: 'chronomax-pro-gps-titanium-smartwatch',
    category_id: 'cat-audio-wearables',
    categoryName: 'Smartwatches & Audio',
    base_price: 68000,
    sale_price: 59990,
    brand: 'CHRONOMAX',
    material: 'Solid Grade 5 Titanium Case with Anti-Reflective Synthetic Sapphire Face',
    description: 'Engineered for extreme expedition durability and executive elegance. Comprehensive ECG heart telemetry, dual-band multiband GNSS satellite tracking, and 21-day solar battery life.',
    details: [
      'Always-On 1.43-inch Sapphire AMOLED display (1500 nits)',
      'Medical-grade ECG rhythm sensor & blood oxygen saturation index',
      '100-meter marine dive certification with integrated depth gauge',
      'Includes both Milanese mesh titanium bracelet and fluoroelastomer sports strap'
    ],
    care: 'Rinse with fresh water after saltwater exposure.',
    is_featured: false,
    is_active: true,
    rating: 4.88,
    reviewsCount: 167,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-watch-1', size: '46mm', color: 'Raw Brushed Titanium', colorHex: '#8C8E91', sku: 'CHRONO-46-TIT', stock_quantity: 10 },
      { id: 'var-watch-2', size: '42mm', color: 'Midnight DLC Black', colorHex: '#1C1C1E', sku: 'CHRONO-42-DLC', stock_quantity: 7 }
    ]
  },

  // --- 3. FOOTWEAR & SNEAKER LAB ---
  {
    id: 'prod-foot-1',
    name: 'The Solstice Minimalist Court Sneaker in Full-Grain Calfskin',
    slug: 'solstice-minimalist-court-sneaker-calfskin',
    category_id: 'cat-footwear',
    categoryName: 'Footwear & Sneaker Lab',
    base_price: 24500,
    sale_price: 19800,
    brand: 'ÉLANE FOOTWEAR',
    material: '100% Italian Buttero Calf Leather with Margom Natural Rubber Cupsole',
    description: 'The definitive architectural low-top sneaker. Hand-stitched in Civitanova Marche, Italy. Clean blind eyelets, calfskin interior lining, and removable cushioned leather footbed for effortless all-day stride.',
    details: [
      'Hand-lasted full-grain Italian calf leather upper that molds to your foot',
      'Authentic Margom Italian vulcanized rubber sole with reinforced stitch',
      'Gold-foil debossed serial number stamped on lateral heel',
      'Comes with waxed cotton laces and organic travel dust covers'
    ],
    care: 'Condition with clear beeswax cream. Use cedar shoe trees between wears.',
    is_featured: true,
    is_active: true,
    rating: 4.92,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-snk1-1', size: '40 (UK 6)', color: 'Chalk Blanc', colorHex: '#FAF9F6', sku: 'SOL-SNK-40', stock_quantity: 6 },
      { id: 'var-snk1-2', size: '41 (UK 7)', color: 'Chalk Blanc', colorHex: '#FAF9F6', sku: 'SOL-SNK-41', stock_quantity: 9 },
      { id: 'var-snk1-3', size: '42 (UK 8)', color: 'Chalk Blanc', colorHex: '#FAF9F6', sku: 'SOL-SNK-42', stock_quantity: 14 },
      { id: 'var-snk1-4', size: '43 (UK 9)', color: 'Chalk Blanc', colorHex: '#FAF9F6', sku: 'SOL-SNK-43', stock_quantity: 11 },
      { id: 'var-snk1-5', size: '44 (UK 10)', color: 'Chalk Blanc', colorHex: '#FAF9F6', sku: 'SOL-SNK-44', stock_quantity: 5 }
    ]
  },
  {
    id: 'prod-foot-2',
    name: 'Florentine Goodyear-Welted Suede Chelsea Boot',
    slug: 'florentine-goodyear-welted-suede-chelsea-boot',
    category_id: 'cat-footwear',
    categoryName: 'Footwear & Sneaker Lab',
    base_price: 36000,
    sale_price: 29500,
    brand: 'ÉLANE FOOTWEAR',
    material: 'Repello Weatherproof Suede with Oak Bark Tanned Leather Outsole',
    description: 'Constructed using centuries-old traditional Goodyear welt method for indefinite resoleability. Features fluid almond toe shape, tonal woven elastic side gussets, and woven grossgrain pull tabs.',
    details: [
      'Scotchgard-treated hydrophobic Italian suede impervious to rains',
      'Cork-filled midsole molds to unique foot arch anatomy over time',
      'Stacked leather heel with recessed rubber protective tap',
      'Bench-crafted in Montegranaro, Italy'
    ],
    care: 'Gently brush with brass suede brush. Apply water repellent spray seasonally.',
    is_featured: false,
    is_active: true,
    rating: 4.89,
    reviewsCount: 96,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-boot-1', size: '41 (UK 7)', color: 'Snuff Suede Tobacco', colorHex: '#5C4033', sku: 'CHL-SNF-41', stock_quantity: 7 },
      { id: 'var-boot-2', size: '42 (UK 8)', color: 'Snuff Suede Tobacco', colorHex: '#5C4033', sku: 'CHL-SNF-42', stock_quantity: 10 },
      { id: 'var-boot-3', size: '43 (UK 9)', color: 'Snuff Suede Tobacco', colorHex: '#5C4033', sku: 'CHL-SNF-43', stock_quantity: 8 }
    ]
  },

  // --- 4. BEAUTY & RARE FRAGRANCES ---
  {
    id: 'prod-beauty-1',
    name: 'Santal Impérial Extrait de Parfum (100ml Pure Niche Essence)',
    slug: 'santal-imperial-extrait-de-parfum-100ml',
    category_id: 'cat-beauty-perfumes',
    categoryName: 'Beauty & Rare Fragrances',
    base_price: 28500,
    sale_price: null,
    brand: 'ÉLANE PARFUMS',
    material: '30% Concentration Extrait with Sustainable Mysore Sandalwood & Florentine Orris',
    description: 'An intoxicating private reserve extrait. Opens with sparkling Calabrian bergamot and cracked pink cardamom, transitioning into velvety Florentine orris butter, Haitian vetiver, and sacred aged Mysore sandalwood.',
    details: [
      '30% Extrait de Parfum concentration for 18+ hour unbroken sillage',
      'Heavy smoked glass flacon with magnetic obsidian zamak cap',
      'Hand-blended in Grasse, France using ethical harvest botanicals',
      'Includes complimentary 5ml travel atomizer and velvet carrying pouch'
    ],
    care: 'Store away from direct sunlight at cool room temperature.',
    is_featured: true,
    is_active: true,
    rating: 4.98,
    reviewsCount: 278,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-perf-1', size: '100ml Extrait', color: 'Smoked Amber Flacon', colorHex: '#9E743A', sku: 'SANT-EXT-100', stock_quantity: 24 },
      { id: 'var-perf-2', size: '50ml Extrait', color: 'Smoked Amber Flacon', colorHex: '#9E743A', sku: 'SANT-EXT-50', stock_quantity: 35 }
    ]
  },
  {
    id: 'prod-beauty-2',
    name: '24K Aurum Cellular Restorative Night Elixir Oil (50ml)',
    slug: '24k-aurum-cellular-restorative-night-elixir',
    category_id: 'cat-beauty-perfumes',
    categoryName: 'Beauty & Rare Fragrances',
    base_price: 16500,
    sale_price: 13900,
    brand: 'ÉLANE BOTANIQUE',
    material: 'Colloidal 24K Gold Flakes, Prickly Pear Seed Oil & Rosehip Retinol Complex',
    description: 'An overnight transformation elixir. Cold-pressed organic Moroccan prickly pear seed oil infused with bio-available 24-karat gold flakes that melt into lipid barriers, dramatically boosting epidermal cellular collagen synthesis.',
    details: [
      'Stimulates microcirculation and smooths fine textural expressions',
      'Non-comedogenic, dry-touch silky oil finish with zero greasy residue',
      'Dermatologically certified clean; free from silicones, parabens, and phthalates',
      'Dispensed via calibrated precision glass dropper'
    ],
    care: 'Warm 3 drops between palms and gently press onto cleansed visage nightly.',
    is_featured: false,
    is_active: true,
    rating: 4.93,
    reviewsCount: 164,
    images: [
      'https://images.unsplash.com/photo-1608248597359-00977d46f534?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-oil-1', size: '50ml Dropper', color: 'Gold Amber', colorHex: '#E5C06A', sku: 'AURUM-OIL-50', stock_quantity: 19 }
    ]
  },

  // --- 5. HOME, DECOR & LUXURY LIVING ---
  {
    id: 'prod-home-1',
    name: 'Sculptural Travertine Marble & Linen Table Lamp',
    slug: 'sculptural-travertine-marble-linen-table-lamp',
    category_id: 'cat-home-living',
    categoryName: 'Home, Decor & Luxury Living',
    base_price: 34000,
    sale_price: 28900,
    brand: 'ÉLANE MAISON',
    material: 'Hand-Carved Italian Roman Travertine & Raw Belgian Slub Linen',
    description: 'An architectural lighting sculpture. Carved from a monolithic block of unfilled Roman travertine stone with natural porous fissures, surmounted by a textural drum shade of unbleached Belgian linen.',
    details: [
      'Integrated touch-sensitive 3-stage warm brass dimmer switch (2200K - 2700K)',
      'Natural hollowed stone base with hand-buffed matte wax sealant',
      'Fabric-wrapped braided bronze power cable with solid brass inline toggle',
      'Includes custom filament LED warm ambient bulb'
    ],
    care: 'Dust with soft dry brush. Do not apply acidic cleaners to natural travertine.',
    is_featured: true,
    is_active: true,
    rating: 4.96,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-lmp-1', size: 'Height: 48cm', color: 'Natural Roman Travertine', colorHex: '#E2D8C7', sku: 'LMP-TRAV-01', stock_quantity: 8 }
    ]
  },
  {
    id: 'prod-home-2',
    name: 'Artisan Solid Brass Manual Espresso & Pour-Over Ritual Stand',
    slug: 'artisan-solid-brass-manual-coffee-ritual-stand',
    category_id: 'cat-home-living',
    categoryName: 'Home, Decor & Luxury Living',
    base_price: 18500,
    sale_price: 15200,
    brand: 'ÉLANE MAISON',
    material: 'Brushed Solid C360 Brass & Walnut Base Board with Heat-Treated Borosilicate Glass',
    description: 'Elevate morning contemplation. Hand-machined solid brass adjustable laboratory pour-over apparatus seated atop a water-resistant American black walnut slab with custom heat-proof cone dripper.',
    details: [
      'CNC-milled solid brass rod with variable height calibration arm',
      'Food-grade double-walled borosilicate glass funnel with vortex extraction ribs',
      'Solid FSC-certified black walnut base with spill runoff gutter',
      'Accommodates all standard size 02 filters and digital espresso scales'
    ],
    care: 'Wipe walnut base dry after each brew. Brass develops a natural living patina.',
    is_featured: false,
    is_active: true,
    rating: 4.91,
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-cof-1', size: 'Single Station', color: 'Living Brass & Walnut', colorHex: '#BFA054', sku: 'COF-BRS-01', stock_quantity: 14 }
    ]
  }
];
