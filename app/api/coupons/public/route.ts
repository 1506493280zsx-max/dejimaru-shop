import { NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function GET() {
  try {
    const res = await fetch(
      `${DIRECTUS}/items/coupons?filter[is_public][_eq]=true&filter[is_active][_eq]=true&fields=id,code,description,discount_type,discount_value,category_slug,expires_at,max_claims_per_user,max_total_claims&sort=-id`,
      { headers: H(), cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json({ data: data.data ?? [] });
  } catch (e) {
    console.error("[coupons/public]", e);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
