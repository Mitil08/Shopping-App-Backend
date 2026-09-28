-- ==============================================================================
-- ÉLANE LUXURY ATELIER — SEED DATA SCRIPT
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
('cat-tailoring', 'Tailoring & Suiting', 'tailoring-suiting', 'Impeccable silhouettes cut from virgin wool, linen blends, and structured cottons.'),
('cat-knitwear', 'Fine Knitwear', 'fine-knitwear', 'Sumptuous cashmere, superfine merino wool, and ribbed organic cotton knits.'),
('cat-outerwear', 'Outerwear', 'outerwear', 'Sculptural trench coats, double-faced wool overcoats, and modern utility jackets.'),
('cat-shirts', 'Shirts & Tops', 'shirts-tops', 'Relaxed poplin, fluid silk blends, and minimalist structural tees.'),
('cat-trousers', 'Trousers & Denim', 'trousers-denim', 'Pleated wide-leg trousers, tailored chinos, and raw Japanese selvedge denim.'),
('cat-accessories', 'Leather Goods & Accessories', 'leather-accessories', 'Full-grain Italian leather bags, minimal cardholders, and brushed brass accessories.')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Products
INSERT INTO public.products (id, name, slug, description, category_id, base_price, sale_price, brand, material, is_featured, is_active) VALUES
('prod-1', 'Atelier Double-Breasted Wool Coat', 'atelier-double-breasted-wool-coat', 'A masterclass in modern proportion, the Atelier Coat features an elongated silhouette, broad peak lapels, and horn buttons. Tailored from a substantial virgin wool blend.', 'cat-outerwear', 590.00, NULL, 'ÉLANE', '90% Virgin Wool, 10% Cashmere', TRUE, TRUE),
('prod-2', 'Oversized Poplin Studio Shirt', 'oversized-poplin-studio-shirt', 'An effortless wardrobe cornerstone cut with an architectural, oversized volume. Features a dropped back hem and mother-of-pearl buttons.', 'cat-shirts', 185.00, 155.00, 'ÉLANE', '100% GOTS-Certified Organic Crisp Cotton', TRUE, TRUE),
('prod-3', 'Pleated Wide-Leg Wool Trousers', 'pleated-wide-leg-wool-trousers', 'Designed with deep forward pleats that cascade down into a fluid, generous wide-leg profile from crease-resistant high-twist tropical wool.', 'cat-trousers', 260.00, NULL, 'ÉLANE', '100% Lightweight High-Twist Wool', TRUE, TRUE),
('prod-4', 'Pure Mongolian Cashmere Mockneck', 'pure-mongolian-cashmere-mockneck', 'Spun from the finest sustainable Mongolian cashmere fibers, this mockneck knit offers cloud-like softness with lightweight thermal insulation.', 'cat-knitwear', 340.00, 295.00, 'ÉLANE', '100% Grade-A Mongolian Cashmere', TRUE, TRUE),
('prod-5', 'Sculpted Minimalist Leather Tote', 'sculpted-minimalist-leather-tote', 'An architectural carryall with clean geometric lines, handcrafted in Florence from vegetable-tanned leather that patinas gracefully.', 'cat-accessories', 480.00, NULL, 'ÉLANE', '100% Full-Grain Vegetable-Tanned Italian Leather', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
