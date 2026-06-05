import { getBrands, getCategories } from "@/lib/directus";
import SearchClient from "./SearchClient";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";

export default async function SearchPage({
  searchParams
}:{
  searchParams:Promise<{
    q?:string
    brand?:string
    category?:string
    grade?:string
  }>
}){

const {
  q,
  brand,
  category,
  grade
}=await searchParams;

  // 构建 Directus 搜索过滤器
  const filters: any[] = [{ is_published: { _eq: true } }];

  if (q && q.trim()) {
    filters.push({
      _or: [
        { name: { _icontains: q.trim() } },
        { description: { _icontains: q.trim() } },
        { sku: { _icontains: q.trim() } }
      ]
    });
  }

  if (grade) filters.push({ grade: { _eq: grade } });

  const filter = filters.length === 1 ? filters[0] : { _and: filters };

  // 获取搜索结果
  const res = await fetch(
    `${DIRECTUS}/items/products?filter=${encodeURIComponent(JSON.stringify(filter))}&fields=id,slug,name,short_description,price,min_price,max_price,compare_at_price,grade,condition,is_featured,is_new,published_at,cpu,cpu_generation,os,memory,storage,display_size,model,release_year,color,battery_health,resolution,refresh_rate,premium_warranty_enabled,premium_warranty_price,brand_id.name,brand_id.slug,category_id.name,category_id.slug,category_id.id,images.image_file_id&limit=100&sort=-published_at`,
    { cache: "no-store" }
  );
  const productsData = await res.json();
  const products = productsData.data || [];

  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories(),
  ]);

  // Client-side filtering for text search
  return (
    <SearchClient
      initialProducts={products}
      brands={brands}
      categories={categories}
      query={q || ""}
      brandFilter={brand || ""}
      categoryFilter={category || ""}
      gradeFilter={grade || ""}
    />
  );
}
