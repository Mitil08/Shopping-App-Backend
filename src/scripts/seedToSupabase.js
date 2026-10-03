import supabase from '../config/supabase.js';
import { mockCategories, mockProducts } from '../data/mockProducts.js';

async function seedSupabase() {
  console.log('=== ÉLANE ATELIER — SUPABASE DATABASE SEEDER ===\n');

  if (!supabase) {
    console.error('❌ Error: Supabase client is not configured.');
    console.log('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in backend/.env');
    process.exit(1);
  }

  try {
    console.log(`1. Seeding ${mockCategories.length} Categories...`);
    const formattedCategories = mockCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      image_url: c.image_url || null,
    }));

    const { error: catError } = await supabase
      .from('categories')
      .upsert(formattedCategories, { onConflict: 'id' });

    if (catError) {
      console.warn('⚠️ Categories upsert note:', catError.message);
    } else {
      console.log(`✓ Successfully seeded ${mockCategories.length} categories.`);
    }

    console.log(`\n2. Seeding ${mockProducts.length} Luxury & Multi-Department Products...`);
    const formattedProducts = mockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category_id: p.category_id || null,
      base_price: p.base_price,
      sale_price: p.sale_price || null,
      brand: p.brand || 'ÉLANE',
      material: p.material || null,
      care_instructions: p.care || null,
      is_featured: !!p.is_featured,
      is_active: p.is_active !== false,
      rating: p.rating || 5.0,
      reviews_count: p.reviewsCount || 0,
    }));

    const { error: prodError } = await supabase
      .from('products')
      .upsert(formattedProducts, { onConflict: 'id' });

    if (prodError) {
      console.warn('⚠️ Products upsert note:', prodError.message);
    } else {
      console.log(`✓ Successfully seeded ${mockProducts.length} products.`);
    }

    console.log('\n3. Seeding Product Variants & Stock SKUs...');
    const allVariants = [];
    mockProducts.forEach((p) => {
      if (p.variants && Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          allVariants.push({
            id: v.id,
            product_id: p.id,
            size: v.size || 'Standard',
            color: v.color || 'Default',
            color_hex: v.colorHex || '#1C1C1E',
            sku: v.sku || `SKU-${p.id}-${v.id}`,
            stock_quantity: v.stock_quantity ?? 10,
          });
        });
      }
    });

    if (allVariants.length > 0) {
      const { error: varError } = await supabase
        .from('product_variants')
        .upsert(allVariants, { onConflict: 'id' });

      if (varError) {
        console.warn('⚠️ Product variants upsert note:', varError.message);
      } else {
        console.log(`✓ Successfully seeded ${allVariants.length} product variants & SKUs.`);
      }
    }

    console.log('\n4. Seeding Product Gallery Images...');
    const allImages = [];
    mockProducts.forEach((p) => {
      if (p.images && Array.isArray(p.images)) {
        p.images.forEach((imgUrl, idx) => {
          allImages.push({
            product_id: p.id,
            image_url: imgUrl,
            alt_text: `${p.name} visual ${idx + 1}`,
            display_order: idx,
          });
        });
      }
    });

    if (allImages.length > 0) {
      const { error: imgError } = await supabase
        .from('product_images')
        .upsert(allImages, { onConflict: 'product_id,display_order', ignoreDuplicates: true });

      if (imgError) {
        console.warn('⚠️ Product images upsert note:', imgError.message);
      } else {
        console.log(`✓ Successfully seeded ${allImages.length} gallery images.`);
      }
    }

    console.log('\n=== SUPABASE DATABASE SEEDING COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('❌ Seeding process error:', err.message);
  }
}

seedSupabase();
