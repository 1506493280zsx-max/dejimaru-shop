const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const adminHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ADMIN_TOKEN}`,
};

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
  "id", "status", "sort", "date_created", "date_updated",
  "title", "slug", "excerpt", "cover_image", "content", "featured",
].join(",");

export async function getBlogPosts(
  type?: "tips" | "news",
  limit = 20,
  page = 1,
  featured?: boolean
): Promise<BlogPost[]> {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    if (!DIRECTUS_URL) return [];
    const params = new URLSearchParams({
      "filter[status][_eq]": "published",
      limit: String(limit),
      page: String(page),
    });
    params.set("fields", POST_FIELDS);
    params.append("sort", "sort");
    params.append("sort", "-date_created");
    if (type) params.set("filter[type][_eq]", type);
    if (featured !== undefined) params.set("filter[featured][_eq]", String(featured));
    const res = await fetch(
      `${DIRECTUS_URL}/items/Blog_Posts?${params}`,
      { headers: adminHeaders, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data || [];
    return data.map((p: any) => ({ ...p, body: p.content ?? "" }));
  } catch { return []; }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    if (!DIRECTUS_URL) return null;
    const params = new URLSearchParams();
    params.set("filter[slug][_eq]", slug);
    params.set("filter[status][_eq]", "published");
    params.set("fields", POST_FIELDS);
    const res = await fetch(
      `${DIRECTUS_URL}/items/Blog_Posts?${params}`,
      { headers: adminHeaders, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = (await res.json()).data?.[0] || null;
    return item ? { ...item, body: item.content ?? "" } : null;
  } catch { return null; }
}

// ─── BLOG COMMENTS ────────────────────────────────────────────

const COMMENT_FIELDS = [
  "id", "post", "user_id", "user_name", "body",
  "reply_to", "approved", "deleted", "flagged",
  "date_created", "updated_at",
].join(",");

export async function getComments(postId: string): Promise<BlogComment[]> {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    if (!DIRECTUS_URL) return [];
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
      { headers: adminHeaders, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  } catch { return []; }
}
