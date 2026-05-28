import { MetadataRoute } from "next";

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";
const BASE = "https://aiacrossshop.co.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/company`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/tokushoho`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/buyback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/corporate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${DIRECTUS}/items/products?fields=slug,date_updated&filter[status][_eq]=published&limit=500`);
    const data = await res.json();
    productPages = (data.data || []).map((p: any) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: p.date_updated ? new Date(p.date_updated) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${DIRECTUS}/items/categories?fields=slug&limit=100`);
    const data = await res.json();
    categoryPages = (data.data || []).map((c: any) => ({
      url: `${BASE}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${DIRECTUS}/items/Blog_Posts?fields=slug,date_updated&filter[status][_eq]=published&limit=200`);
    const data = await res.json();
    blogPages = (data.data || []).map((b: any) => ({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: b.date_updated ? new Date(b.date_updated) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
