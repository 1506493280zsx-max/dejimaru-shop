const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "https://directus-production-2cfe.up.railway.app";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

// ─── TYPES ────────────────────────────────────────────────────
export interface Brand {
  id: number | string;
  name: string;
  slug: string;
}

const adminHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${ADMIN_TOKEN}`,
};

const publicHeaders = {
  "Content-Type": "application/json",
};

// ─── PRODUCTS ─────────────────────────────────────────────────
export async function getProducts(options: {
  limit?: number;
  filter?: Record<string, any>;
  sort?: string[];
} = {}) {
  const { limit = 20, filter = {}, sort = ["-published_at"] } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    sort: sort.join(","),
    "fields[]": "id,slug,name,short_description,price,compare_at_price,grade,condition,is_featured,is_new,published_at,cpu,cpu_generation,os,memory,storage,display_size,model,release_year,color,battery_health,resolution,refresh_rate,premium_warranty_enabled,premium_warranty_price,brand_id.name,brand_id.slug,category_id.name,category_id.slug,category_id.id,images.image_file_id,variants.price",
  });
  if (Object.keys(filter).length > 0) params.append("filter", JSON.stringify(filter));
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/products?${params}`, { headers: publicHeaders, next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) { console.error("[getProducts]", e); return []; }
}

export async function getFeaturedProducts() {
  return getProducts({ limit: 8, filter: { is_featured: { _eq: true } } });
}

export async function getNewArrivals() {
  return getProducts({ limit: 8, sort: ["-published_at"] });
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/products?filter[slug][_eq]=${slug}&fields[]=id,slug,name,description,short_description,price,compare_at_price,grade,condition,cpu,cpu_generation,os,memory,storage,display_size,model,release_year,color,battery_health,resolution,refresh_rate,premium_warranty_enabled,premium_warranty_price,brand_id.name,category_id.name,category_id.slug,images.image_file_id`,
      { headers: publicHeaders, next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data?.[0] || null;
  } catch (e) { console.error("[getProductBySlug]", e); return null; }
}

export async function getCategories() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/categories?limit=50&sort[]=sort_order&fields[]=id,name,slug,parent_id`, { headers: publicHeaders, next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) { console.error("[getCategories]", e); return []; }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/brands?limit=50&sort[]=sort_order&fields[]=id,name,slug`, { headers: publicHeaders, next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) { console.error("[getBrands]", e); return []; }
}

export async function getHomepageAds() {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/homepage_ads?filter[is_active][_eq]=true&sort[]=sort_order&limit=200&fields[]=id,title,subtitle,image_desktop,image_mobile,link_url,position,sort_order`,
      { headers: publicHeaders, next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) { console.error("[getHomepageAds]", e); return []; }
}

export function getImageUrl(fileId: string, width = 400, height = 300) {
  if (!fileId) return null;
  return `${DIRECTUS_URL}/assets/${fileId}?width=${width}&height=${height}&fit=cover`;
}

// ─── AUTH ─────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "ログイン失敗");
    return { success: true, token: data.data.access_token, refresh_token: data.data.refresh_token };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
  try {
    // Directusのユーザー登録
    const res = await fetch(`${DIRECTUS_URL}/users`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        status: "active",
        role: "506b19d2-ae5d-47af-a560-5637ed29febf", // 一般ユーザーロール
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "登録失敗");
    // 登録後すぐログイン
    return loginUser(email, password);
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getCurrentUser(token: string) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { ...publicHeaders, "Authorization": `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()).data || null;
  } catch { return null; }
}

export async function logoutUser(token: string) {
  try {
    await fetch(`${DIRECTUS_URL}/auth/logout`, {
      method: "POST",
      headers: { ...publicHeaders, "Authorization": `Bearer ${token}` },
    });
  } catch {}
}

// ─── REVIEWS ─────────────────────────────────────────────────
export type CustomerReview = {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string | null;
  product: {
    id: number;
    name: string;
    slug: string;
    images: { image_file_id: string }[];
  } | null;
};

export async function getCustomerReviews(limit = 20): Promise<CustomerReview[]> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/customer_reviews?filter[status][_eq]=published&sort[]=-created_at&limit=${limit}&fields[]=id,customer_name,rating,comment,created_at,product.id,product.name,product.slug,product.images.image_file_id`,
      { headers: adminHeaders, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch { return []; }
}

export async function getFeaturedReviews(limit = 10) {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/product_reviews?filter[approved][_eq]=true&filter[rating][_gte]=4&sort[]=-created_at&limit=${limit}&fields[]=id,user_name,rating,body,created_at,product.id,product.name,product.slug,product.images.image_file_id`,
      { headers: adminHeaders, cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch { return []; }
}

export async function getReviews(productId: string | number) {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/product_reviews?filter[product][_eq]=${productId}&filter[approved][_eq]=true&sort[]=-created_at&limit=50&fields[]=id,user_name,rating,title,body,created_at`,
      { headers: adminHeaders, cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch { return []; }
}

export async function createReview(data: {
  product: string | number;
  user_name: string;
  rating: number;
  title?: string;
  body: string;
}) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/product_reviews`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ ...data, approved: false, created_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error("Failed");
    return (await res.json()).data;
  } catch { return null; }
}

// ─── PRODUCT VARIANTS ─────────────────────────────────────────
export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  status: string;
  color: string | null;
  memory: string | null;
  storage: string | null;
  capacity: string | null;
  sort_order: number;
}

export async function getProductVariants(productId: number | string): Promise<ProductVariant[]> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/product_variants?filter[product_id][_eq]=${productId}&filter[status][_eq]=active&sort[]=sort_order&limit=100`,
      { headers: publicHeaders, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) {
    console.error("[getProductVariants]", e);
    return [];
  }
}
