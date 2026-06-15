import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://13.158.171.41:8055";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/product_reviews?filter[product][_eq]=${productId}&filter[approved][_eq]=true&fields[]=rating&limit=500`,
      {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
        cache: "no-store",
      }
    );
    const empty = { avg: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    if (!res.ok) return NextResponse.json(empty);
    const json = await res.json();
    const reviews: { rating: number }[] = json.data || [];
    if (reviews.length === 0) return NextResponse.json(empty);
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) distribution[r.rating]++; });
    return NextResponse.json({ avg: Math.round(avg * 10) / 10, count: reviews.length, distribution });
  } catch {
    return NextResponse.json({ avg: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  }
}
