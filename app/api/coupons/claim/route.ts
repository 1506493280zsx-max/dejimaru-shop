import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ success: false, message: "認証が必要です" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ success: false, message: "認証エラー" }, { status: 401 });
    const me = (await meRes.json()).data;

    const { code } = await req.json();
    const email = me.email;
    if (!code || !email) {
      return NextResponse.json({ success: false, message: "コードとメールが必要です" }, { status: 400 });
    }

    // 1. ユーザー確認
    const cusR = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`, { headers: H() });
    const cusD = await cusR.json();
    const customer = cusD.data?.[0];
    if (!customer) return NextResponse.json({ success: false, message: "会員登録が必要です" }, { status: 403 });

    // 2. クーポン取得
    const cpR = await fetch(`${DIRECTUS}/items/coupons?filter[code][_eq]=${encodeURIComponent(code)}&limit=1`, { headers: H() });
    const cpD = await cpR.json();
    const coupon = cpD.data?.[0];
    if (!coupon) return NextResponse.json({ success: false, message: "クーポンが見つかりません" });
    if (!coupon.is_active) return NextResponse.json({ success: false, message: "このクーポンは無効です" });
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: "有効期限が切れています" });
    }

    // 3. 領取回数チェック
    const ucR = await fetch(`${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${customer.id}&filter[coupon_id][_eq]=${coupon.id}`, { headers: H() });
    const ucD = await ucR.json();
    if ((ucD.data?.length || 0) >= coupon.max_claims_per_user) {
      return NextResponse.json({ success: false, message: "このクーポンはすでに領取済みです" });
    }

    // 4. 総発行数チェック
    if (coupon.max_total_claims) {
      const allR = await fetch(`${DIRECTUS}/items/user_coupons?filter[coupon_id][_eq]=${coupon.id}&aggregate[count]=id`, { headers: H() });
      const allD = await allR.json();
      const total = allD.data?.[0]?.count?.id || 0;
      if (total >= coupon.max_total_claims) {
        return NextResponse.json({ success: false, message: "このクーポンは終了しました" });
      }
    }

    // 5. 領取記録を保存
    const saveR = await fetch(`${DIRECTUS}/items/user_coupons`, {
      method: "POST",
      headers: H(),
      body: JSON.stringify({
        customer_id: customer.id,
        coupon_id: coupon.id,
        claimed_at: new Date().toISOString(),
        used_at: null,
        order_id: null,
      }),
    });
    if (!saveR.ok) {
      return NextResponse.json({ success: false, message: "領取に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "クーポンを領取しました！", coupon });
  } catch (e) {
    console.error("[coupons/claim]", e);
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 });
  }
}
