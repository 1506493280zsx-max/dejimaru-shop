import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ data: [] }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ data: [] }, { status: 401 });
    const me = (await meRes.json()).data;

    const email = me.email;
    if (!email) return NextResponse.json({ data: [] }, { status: 400 });

    // 1. ユーザー確認
    const cusR = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`, { headers: H() });
    const cusD = await cusR.json();
    const customer = cusD.data?.[0];
    if (!customer) return NextResponse.json({ data: [] }, { status: 403 });

    // 2. user_coupons取得
    const ucR = await fetch(`${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${customer.id}&fields=id,coupon_id,claimed_at,used_at,order_id&sort=-claimed_at`, { headers: H() });
    const ucD = await ucR.json();
    const userCoupons = ucD.data || [];
    if (userCoupons.length === 0) return NextResponse.json({ data: [] });

    // 3. クーポン詳細を取得
    const couponIds = userCoupons.map((uc: any) => uc.coupon_id).join(",");
    const cpR = await fetch(`${DIRECTUS}/items/coupons?filter[id][_in]=${couponIds}&fields=id,code,description,discount_type,discount_value,category_slug,expires_at,is_active`, { headers: H() });
    const cpD = await cpR.json();
    const coupons: Record<number, any> = {};
    for (const c of (cpD.data || [])) coupons[c.id] = c;

    // 4. ステータス付きで返す
    const now = new Date();
    const result = userCoupons.map((uc: any) => {
      const coupon = coupons[uc.coupon_id];
      let status: "available" | "used" | "expired" = "available";
      if (uc.used_at) status = "used";
      else if (!coupon?.is_active || (coupon?.expires_at && new Date(coupon.expires_at) < now)) status = "expired";

      const expiresAt = coupon?.expires_at ? new Date(coupon.expires_at) : null;
      const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      return {
        id: uc.id,
        claimed_at: uc.claimed_at,
        used_at: uc.used_at,
        order_id: uc.order_id,
        status,
        daysLeft,
        coupon,
      };
    });

    return NextResponse.json({ data: result });
  } catch (e) {
    console.error("[coupons/my]", e);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
