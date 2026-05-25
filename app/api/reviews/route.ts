import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "https://directus-production-2cfe.up.railway.app";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const adminHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${ADMIN_TOKEN}`,
};

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id");
  if (!productId) return NextResponse.json({ data: [] });
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/customer_reviews?filter[status][_eq]=published&filter[product][_eq]=${productId}&sort[]=-created_at&limit=50&fields[]=id,customer_name,title,comment,rating,product,created_at`,
      { headers: adminHeaders, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ data: [] });
    const json = await res.json();
    // Map customer_reviews fields → ReviewSection expected shape
    const data = (json.data || []).map((r: any) => ({
      id: r.id,
      user_name: r.customer_name,
      rating: r.rating,
      title: r.title ?? "",
      body: r.comment,
      created_at: r.created_at,
    }));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { product, user_name, rating, title, body: reviewBody } = payload;
    if (!product || !user_name || !rating || !reviewBody) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    const res = await fetch(`${DIRECTUS_URL}/items/customer_reviews`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        customer_name: user_name,
        rating: Number(rating),
        comment: reviewBody,
        product: Number(product),
        status: "published",
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.errors?.[0]?.message || "投稿に失敗しました" }, { status: 500 });
    }
    const saved = await res.json();
    return NextResponse.json({ success: true, id: saved.data?.id });
  } catch {
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}
