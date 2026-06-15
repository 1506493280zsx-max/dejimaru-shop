import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ valid: false, message: "認証が必要です" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ valid: false, message: "認証エラー" }, { status: 401 });
    const me = (await meRes.json()).data;

    const { code, cartItems } = await req.json();
    const email = me.email;
    if (!code || !email) {
      return NextResponse.json({ valid: false, message: "コードとメールが必要です" }, { status: 400 });
    }

    // 1. ログインユーザー確認
    const cusR = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`, { headers: H() });
    const cusD = await cusR.json();
    const customer = cusD.data?.[0];
    if (!customer) return NextResponse.json({ valid: false, message: "会員登録が必要です" }, { status: 403 });

    // 2. クーポン取得
    const cpR = await fetch(`${DIRECTUS}/items/coupons?filter[code][_eq]=${encodeURIComponent(code)}&limit=1`, { headers: H() });
    const cpD = await cpR.json();
    const coupon = cpD.data?.[0];
    if (!coupon) return NextResponse.json({ valid: false, message: "クーポンが見つかりません" });

    // 3. 有効・期限チェック
    if (!coupon.is_active) return NextResponse.json({ valid: false, message: "このクーポンは無効です" });
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: "有効期限が切れています" });
    }

    // 4. 領取回数チェック
    const ucR = await fetch(`${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${customer.id}&filter[coupon_id][_eq]=${coupon.id}&filter[used_at][_null]=false`, { headers: H() });
    const ucD = await ucR.json();
    if ((ucD.data?.length || 0) >= coupon.max_claims_per_user) {
      return NextResponse.json({ valid: false, message: "このクーポンはすでに使用済みです" });
    }

    // 5. カテゴリチェック
    if (coupon.category_slug && cartItems?.length > 0) {
      const ids = cartItems.map((i: any) => i.id).join(",");
      const pR = await fetch(`${DIRECTUS}/items/products?filter[id][_in]=${ids}&fields=id,category_id&limit=100`, { headers: H() });
      const pD = await pR.json();
      const catIds = [...new Set((pD.data || []).map((p: any) => p.category_id))].join(",");
      const cR = await fetch(`${DIRECTUS}/items/categories?filter[id][_in]=${catIds}&fields=id,slug`, { headers: H() });
      const cD = await cR.json();
      const slugs = (cD.data || []).map((c: any) => c.slug);
      if (!slugs.includes(coupon.category_slug)) {
        return NextResponse.json({ valid: false, message: `このクーポンは「${coupon.category_slug}」カテゴリ専用です` });
      }
    }

    // 6. 割引額計算
    const subtotal = (cartItems || []).reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return NextResponse.json({ valid: false, message: `${coupon.min_order_amount.toLocaleString()}円以上でご利用いただけます` });
    }
    const discountAmount = coupon.discount_type === "percent"
      ? Math.floor(subtotal * coupon.discount_value / 100)
      : coupon.discount_value;

    return NextResponse.json({
      valid: true,
      coupon,
      discountAmount,
      message: coupon.discount_type === "percent"
        ? `${coupon.discount_value}%割引が適用されました`
        : `${coupon.discount_value.toLocaleString()}円割引が適用されました`
    });
  } catch (e) {
    console.error("[coupons/validate]", e);
    return NextResponse.json({ valid: false, message: "エラーが発生しました" }, { status: 500 });
  }
}
