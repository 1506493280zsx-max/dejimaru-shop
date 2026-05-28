import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "https://directus-production-2cfe.up.railway.app";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` };

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "認証エラー" }, { status: 401 });
    const me = (await meRes.json()).data;

    const payload = await req.json();
    const { product, rating, title, body: content } = payload;
    const user_name = `${me.last_name || ""} ${me.first_name || ""}`.trim() || "匿名";
    if (!product || !rating || !content) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    const res = await fetch(`${DIRECTUS_URL}/items/product_reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product,
        user_name,
        rating: Number(rating),
        title: title || "",
        body: content,
        approved: false,
        created_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.errors?.[0]?.message || "投稿に失敗しました" }, { status: 500 });
    }

    // Best-effort: recalculate avg_rating and review_count on product
    try {
      const statsRes = await fetch(
        `${DIRECTUS_URL}/items/product_reviews?filter[product][_eq]=${product}&filter[approved][_eq]=true&fields[]=rating&limit=500`,
        { headers, cache: "no-store" }
      );
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        const reviews: { rating: number }[] = statsJson.data || [];
        if (reviews.length > 0) {
          const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
          await fetch(`${DIRECTUS_URL}/items/products/${product}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              avg_rating: Math.round(avg * 10) / 10,
              review_count: reviews.length,
            }),
          });
        }
      }
    } catch { /* ignore — fields may not exist yet */ }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}
