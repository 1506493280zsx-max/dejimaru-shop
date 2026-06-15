const DIRECTUS_URL_FALLBACK = process.env.DIRECTUS_URL ?? "http://13.158.171.41:8055";

// adminHeadersを固定せず、毎回動的に生成する
function getAdminHeaders(): Record<string, string> {
  const token = process.env.ADMIN_TOKEN ?? "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchDirectus(url: string, opts: { next?: { revalidate?: number } } = {}): Promise<any> {
  const next = opts.next ?? { revalidate: 60 };
  const token = process.env.ADMIN_TOKEN ?? "";
  if (token) {
    const res = await fetch(url, { headers: getAdminHeaders(), next });
    if (res.ok) return res.json();
    if (res.status !== 401 && res.status !== 403) throw new Error(`HTTP ${res.status}`);
    // 401: token expired / 403: forbidden — fall through to public access
  }
  const res = await fetch(url, { next });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── TYPES ────────────────────────────────────────────────────

export type BlogPost = {
  id: string;
  status: "published" | "draft" | "archived";
  type: "tips" | "news";
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  tags: string[];
  featured?: boolean;
  author: { id: string; first_name: string; last_name: string } | null;
  date_published: string | null;
  sort: number;
  date_created: string;
  date_updated: string | null;
};

export type BlogComment = {
  id: string;
  post: string;
  user_id: string;
  user_name: string;
  body: string;
  reply_to: string | null;
  approved: boolean;
  deleted: boolean;
  flagged: boolean;
  date_created: string;
  updated_at: string | null;
};

// ─── BLOG POSTS ───────────────────────────────────────────────

const POST_FIELDS = [
  "id", "status", "sort", "date_created", "date_updated", "date_published",
  "title", "slug", "excerpt", "cover_image", "content", "featured", "type",
].join(",");

export async function getBlogPosts(
  type?: "tips" | "news",
  limit = 20,
  page = 1,
  featured?: boolean
): Promise<BlogPost[]> {
  try {
    const DIRECTUS_URL = DIRECTUS_URL_FALLBACK;
    const params = new URLSearchParams({
      "filter[status][_eq]": "published",
      limit: String(limit),
      page: String(page),
    });
    params.set("fields", POST_FIELDS);
    params.append("sort", "-date_created");
    if (type) params.set("filter[type][_eq]", type);
    if (featured !== undefined) params.set("filter[featured][_eq]", String(featured));
    const json = await fetchDirectus(`${DIRECTUS_URL}/items/Blog_Posts?${params}`, { next: { revalidate: 3600 } });
    const data = json.data || [];
    return data.map((p: any) => ({ ...p, body: p.content ?? "" }));
  } catch (e) { console.error("[BLOG ERROR]", e); return []; }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const DIRECTUS_URL = DIRECTUS_URL_FALLBACK;
    const params = new URLSearchParams();
    params.set("filter[slug][_eq]", slug);
    params.set("filter[status][_eq]", "published");
    params.set("fields", POST_FIELDS);
    const json = await fetchDirectus(`${DIRECTUS_URL}/items/Blog_Posts?${params}`, { next: { revalidate: 3600 } });
    const item = json.data?.[0] || null;
    return item ? { ...item, body: item.content ?? "" } : null;
  } catch (e) { console.error("[BLOG ERROR]", e); return null; }
}

// ─── BLOG COMMENTS ────────────────────────────────────────────

const COMMENT_FIELDS = [
  "id", "post", "user_id", "user_name", "body",
  "reply_to", "approved", "deleted", "flagged",
  "date_created", "updated_at",
].join(",");

export async function getComments(postId: string): Promise<BlogComment[]> {
  try {
    const DIRECTUS_URL = DIRECTUS_URL_FALLBACK;
    const params = new URLSearchParams({
      "filter[post][_eq]": postId,
      "filter[approved][_eq]": "true",
      "filter[deleted][_neq]": "true",
      limit: "200",
    });
    params.set("fields", COMMENT_FIELDS);
    params.append("sort", "date_created");
    const res = await fetch(
      `${DIRECTUS_URL}/items/blog_comments?${params}`,
      { headers: getAdminHeaders(), next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch (e) { console.error("[BLOG ERROR]", e); return []; }
}
