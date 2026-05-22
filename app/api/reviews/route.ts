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
      `${DIRECTUS_URL}/items/product_reviews?filter[product][_eq]=${productId}&filter[approved][_eq]=true&sort[]=-created_at&limit=50&fields[]=id,user_name,rating,title,body,created_at`,
      { headers: adminHeaders, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ data: [] });
    const json = await res.json();
    return NextResponse.json({ data: json.data || [] });
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
    const res = await fetch(`${DIRECTUS_URL}/items/product_reviews`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        product,
        user_name,
        rating: Number(rating),
        title: title || "",
        body: reviewBody,
        approved: false,
        created_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.errors?.[0]?.message || "投稿に失敗しました" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}
