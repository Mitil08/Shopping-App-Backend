-- ==============================================================================
-- ÉLANE LUXURY ATELIER — PRODUCTION SUPABASE SEED DATA
-- Includes Categories, Core Luxury Products, Tech & Electronics,
-- Product Variants, Stock SKUs, and Demo Admin/Customer Profiles.
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
('cat-tailoring', 'Tailoring & Suiting', 'tailoring-suiting', 'Impeccable silhouettes cut from virgin wool, linen blends, and structured cottons.'),
('cat-knitwear', 'Fine Knitwear', 'fine-knitwear', 'Sumptuous cashmere, superfine merino wool, and ribbed organic cotton knits.'),
('cat-outerwear', 'Outerwear', 'outerwear', 'Sculptural trench coats, double-faced wool overcoats, and modern utility jackets.'),
('cat-shirts', 'Shirts & Tops', 'shirts-tops', 'Relaxed poplin, fluid silk blends, and minimalist structural tees.'),
('cat-trousers', 'Trousers & Denim', 'trousers-denim', 'Pleated wide-leg trousers, tailored chinos, and raw Japanese selvedge denim.'),
('cat-accessories', 'Leather Goods & Accessories', 'leather-accessories', 'Full-grain Italian leather bags, minimal cardholders, and brushed brass accessories.'),
('cat-mobiles-tech', 'Smartphones & Electronics', 'mobiles-electronics', 'Next-generation flagship smartphones, OLED tablets, and high-performance audio.'),
('cat-audio-wearables', 'Smartwatches & Audio', 'smartwatches-audio', 'Spatial audio noise-canceling headphones, titanium smartwatches, and hi-fi soundbars.'),
('cat-mens-fashion', 'Men’s Designer Fashion', 'mens-fashion', 'Tailored suits, organic cotton tees, linen button-downs, and Japanese denim.'),
('cat-womens-fashion', 'Women’s Luxury Fashion', 'womens-fashion', 'Sculptural trench coats, silk evening slip dresses, and cashmere oversized knits.'),
('cat-footwear', 'Footwear & Sneaker Lab', 'footwear-sneakers', 'Handmade Tuscan leather Chelsea boots, Italian suede loafers, and minimalist court sneakers.'),
('cat-beauty-perfumes', 'Beauty & Rare Fragrances', 'beauty-fragrances', 'Artisanal niche perfumes, botanical skincare serums, and 24K restorative gold elixirs.'),
('cat-home-living', 'Home, Decor & Luxury Living', 'home-luxury-living', 'Sculptural ceramic lamps, organic Belgian linen throws, and brass pour-over coffee bars.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    slug = EXCLUDED.slug, 
    description = EXCLUDED.description;

-- 2. Insert Core Products
INSERT INTO public.products (id, name, slug, description, category_id, base_price, sale_price, brand, material, is_featured, is_active, rating, reviews_count) VALUES
('prod-1', 'Atelier Double-Breasted Wool Coat', 'atelier-double-breasted-wool-coat', 'A masterclass in modern proportion, the Atelier Coat features an elongated silhouette, broad peak lapels, and horn buttons. Tailored from a substantial virgin wool blend.', 'cat-outerwear', 41300.00, NULL, 'ÉLANE', '90% Virgin Wool, 10% Cashmere', TRUE, TRUE, 4.9, 28),
('prod-2', 'Oversized Poplin Studio Shirt', 'oversized-poplin-studio-shirt', 'An effortless wardrobe cornerstone cut with an architectural, oversized volume. Features a dropped back hem and mother-of-pearl buttons.', 'cat-shirts', 12950.00, 10850.00, 'ÉLANE', '100% GOTS-Certified Organic Crisp Cotton', TRUE, TRUE, 4.8, 19),
('prod-3', 'Pleated Wide-Leg Wool Trousers', 'pleated-wide-leg-wool-trousers', 'Designed with deep forward pleats that cascade down into a fluid, generous wide-leg profile from crease-resistant high-twist tropical wool.', 'cat-trousers', 18200.00, NULL, 'ÉLANE', '100% Lightweight High-Twist Wool', TRUE, TRUE, 4.9, 34),
('prod-4', 'Pure Mongolian Cashmere Mockneck', 'pure-mongolian-cashmere-mockneck', 'Spun from the finest sustainable Mongolian cashmere fibers, this mockneck knit offers cloud-like softness with lightweight thermal insulation.', 'cat-knitwear', 23800.00, 20650.00, 'ÉLANE', '100% Grade-A Mongolian Cashmere', TRUE, TRUE, 5.0, 42),
('prod-5', 'Sculpted Minimalist Leather Tote', 'sculpted-minimalist-leather-tote', 'An architectural carryall with clean geometric lines, handcrafted in Florence from vegetable-tanned leather that patinas gracefully.', 'cat-accessories', 33600.00, NULL, 'ÉLANE', '100% Full-Grain Vegetable-Tanned Italian Leather', TRUE, TRUE, 4.9, 15),
('prod-tech-1', 'Aether Pro 16 Flagship Smartphone (512GB Ceramic Titanium)', 'aether-pro-16-flagship-smartphone-512gb', 'The pinnacle of mobile engineering. Powered by the 3nm Quantum-Core processor, 6.8-inch 120Hz ProMotion XDR display, and 200MP periscope zoom lens.', 'cat-mobiles-tech', 139900.00, 129990.00, 'AETHER LABS', 'Aerospace-Grade Grade 5 Titanium & Ceramic Shield Glass', TRUE, TRUE, 4.95, 342),
('prod-tech-2', 'Horizon Pad Ultra 13" OLED Tablet with Magic Stylus Pro', 'horizon-pad-ultra-13-oled-tablet', 'An architectural creative canvas. Featuring tandem dual-stack OLED technology for true studio blacks and 1000 nits full-screen brightness.', 'cat-mobiles-tech', 94900.00, 84990.00, 'AETHER LABS', 'Monolithic Recycled Aircraft Aluminum Alloy', TRUE, TRUE, 4.9, 118),
('prod-audio-1', 'Aura Spatial Wireless Studio Headphones (Titanium & Lambskin)', 'aura-spatial-wireless-studio-headphones', 'Engineered with custom 45mm beryllium drivers and lossless acoustic spatial mapping.', 'cat-audio-wearables', 44900.00, 39990.00, 'ÉLANE ACOUSTICS', 'Brushed Aerospace Titanium & French Nappa Lambskin', TRUE, TRUE, 4.95, 215),
('prod-audio-2', 'Chronos Atelier Automatic Horology Timepiece (Sapphire Crystal)', 'chronos-atelier-automatic-horology-timepiece', 'Swiss-engineered mechanical movement with 72-hour power reserve, skeleton exhibition caseback, and anti-reflective sapphire crystal.', 'cat-audio-wearables', 185000.00, NULL, 'CHRONOS GENÈVE', 'Grade 316L Marine Stainless Steel & Hand-stitched Alligator Leather', TRUE, TRUE, 5.0, 48),
('prod-beauty-1', 'Nocturne Ambre Eau de Parfum (100ml Extrait)', 'nocturne-ambre-eau-de-parfum', 'A sensory nocturnal symphony crafted by master perfumers in Grasse. Notes of aged bourbon vanilla, smoked cedarwood, rare saffron, and Indonesian amber.', 'cat-beauty-perfumes', 22500.00, 18900.00, 'ÉLANE PARFUMS', 'Pure Organic Botanical Distillates & French Crystal Flacon', TRUE, TRUE, 4.98, 164),
('prod-footwear-1', 'Tuscan Hand-Burnished Leather Chelsea Boots', 'tuscan-hand-burnished-leather-chelsea-boots', 'Bench-made by generational artisans in Empoli, Italy using traditional Goodyear welt construction.', 'cat-footwear', 38500.00, 32900.00, 'ÉLANE ATELIER', 'Full-Grain Tuscan Calfskin & Dainite Rubber Studded Sole', TRUE, TRUE, 4.9, 93)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    base_price = EXCLUDED.base_price, 
    sale_price = EXCLUDED.sale_price;

-- 3. Insert Product Variants
INSERT INTO public.product_variants (id, product_id, size, color, color_hex, sku, stock_quantity) VALUES
('var-1-1', 'prod-1', 'S', 'Charcoal Noir', '#1C1C1E', 'ELN-COAT-01-S', 8),
('var-1-2', 'prod-1', 'M', 'Charcoal Noir', '#1C1C1E', 'ELN-COAT-01-M', 12),
('var-1-3', 'prod-1', 'L', 'Charcoal Noir', '#1C1C1E', 'ELN-COAT-01-L', 6),
('var-2-1', 'prod-2', 'M', 'Crisp Chalk White', '#FAF9F6', 'ELN-SHIRT-01-M', 14),
('var-3-1', 'prod-3', 'M', 'Oatmeal Taupe', '#D3C5B4', 'ELN-TRSR-01-M', 10),
('var-tech1-1', 'prod-tech-1', '256GB', 'Titanium Graphite', '#2E3033', 'AETH-16-256-GR', 15),
('var-tech1-2', 'prod-tech-1', '512GB', 'Titanium Graphite', '#2E3033', 'AETH-16-512-GR', 28),
('var-audio1-1', 'prod-audio-1', 'Universal', 'Midnight Obsidian', '#121316', 'AURA-HP-OBSID', 22),
('var-beauty1-1', 'prod-beauty-1', '100ml', 'Amber Crystal', '#C27A29', 'PARF-NOCT-100', 40)
ON CONFLICT (id) DO UPDATE SET 
    stock_quantity = EXCLUDED.stock_quantity;

-- 4. Enable Row Level Security (RLS) policies for Production Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read access for Catalog
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (true);
