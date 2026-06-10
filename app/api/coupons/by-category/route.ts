import { NextRequest, NextResponse } from "next/server";
const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });
export async function GET(req: NextRequest) {
  try {
    const catId = req.nextUrl.searchParams.get("category_id");
    const email = req.nextUrl.searchParams.get("email");
    let slug: string | null = null;
    if (catId) {
      const r = await fetch(`${DIRECTUS}/items/categories?filter[id][_eq]=${catId}&fields=slug&limit=1`, { headers: H(), cache: "no-store" });
      slug = (await r.json()).data?.[0]?.slug ?? null;
    }
    const now = new Date().toISOString();
    const base = `filter[is_active][_eq]=true&filter[is_public][_eq]=true&filter[expires_at][_gt]=${now}&fields=id,code,description,discount_type,discount_value,category_slug,expires_at,max_claims_per_user`;
    const r1 = await fetch(`${DIRECTUS}/items/coupons?${base}&filter[category_slug][_null]=true`, { headers: H(), cache: "no-store" });
    const globalC = (await r1.json()).data ?? [];
    let catC: any[] = [];
    if (slug) {
      const r2 = await fetch(`${DIRECTUS}/items/coupons?${base}&filter[category_slug][_eq]=${slug}`, { headers: H(), cache: "no-store" });
      catC = (await r2.json()).data ?? [];
    }
    console.log('[by-category] slug:', slug);
    console.log('[by-category] catC:', JSON.stringify(catC));
    console.log('[by-category] globalC:', JSON.stringify(globalC));
    const coupons = [...globalC, ...catC];
    if (coupons.length === 0) return NextResponse.json({ data: [] });
    let claimedIds: number[] = [];
    if (email) {
      const cr = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`, { headers: H() });
      const customer = (await cr.json()).data?.[0];
      if (customer) {
        const ids = coupons.map((c: any) => c.id).join(",");
        const ur = await fetch(`${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${customer.id}&filter[coupon_id][_in]=${ids}&fields=coupon_id`, { headers: H() });
        claimedIds = ((await ur.json()).data ?? []).map((uc: any) => uc.coupon_id);
      }
    }
    return NextResponse.json({ data: coupons.map((c: any) => ({ ...c, claimed: claimedIds.includes(c.id) })) });
  } catch (e) {
    console.error("[coupons/by-category]", e);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
