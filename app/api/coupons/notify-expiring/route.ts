import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  // Cron Job認証（Vercelの自動実行のみ許可）
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 3日以内に期限切れになる未使用のuser_couponsを取得
    const ucRes = await fetch(
      `${DIRECTUS}/items/user_coupons?filter[used_at][_null]=true&fields=id,customer_id,coupon_id&limit=200`,
      { headers: H() }
    );
    const userCoupons = (await ucRes.json()).data || [];
    if (userCoupons.length === 0) return NextResponse.json({ sent: 0 });

    // coupon詳細を取得
    const couponIds = [...new Set(userCoupons.map((uc: any) => uc.coupon_id))].join(",");
    const cpRes = await fetch(
      `${DIRECTUS}/items/coupons?filter[id][_in]=${couponIds}&fields=id,code,description,discount_type,discount_value,expires_at,is_active`,
      { headers: H() }
    );
    const cpMap: Record<number, any> = {};
    for (const c of ((await cpRes.json()).data || [])) cpMap[c.id] = c;

    // customer情報を取得
    const customerIds = [...new Set(userCoupons.map((uc: any) => uc.customer_id))].join(",");
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[id][_in]=${customerIds}&fields=id,email,first_name`,
      { headers: H() }
    );
    const cusMap: Record<number, any> = {};
    for (const c of ((await cusRes.json()).data || [])) cusMap[c.id] = c;

    // 3日以内に期限切れになるものを抽出してメール送信
    let sent = 0;
    for (const uc of userCoupons) {
      const coupon = cpMap[uc.coupon_id];
      const customer = cusMap[uc.customer_id];
      if (!coupon || !customer || !coupon.is_active || !coupon.expires_at) continue;

      const expiresAt = new Date(coupon.expires_at);
      if (expiresAt < now || expiresAt > in3days) continue;

      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000);
      const discountLabel = coupon.discount_type === "percent"
        ? `${coupon.discount_value}%OFF`
        : `¥${coupon.discount_value.toLocaleString()}OFF`;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: customer.email,
        subject: `【AI Across ショップ】クーポンの有効期限が迫っています（あと${daysLeft}日）`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#0ABAB5;">🎫 クーポン期限のお知らせ</h2>
            <p>${customer.first_name || "お客様"} 様</p>
            <p>以下のクーポンの有効期限が<strong>あと${daysLeft}日</strong>で切れます。</p>
            <div style="background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="font-size:24px;font-weight:bold;color:#CC2200;margin:0 0 8px;">${discountLabel}</p>
              <p style="margin:0 0 4px;">クーポンコード：<strong>${coupon.code}</strong></p>
              ${coupon.description ? `<p style="margin:0;color:#666;">${coupon.description}</p>` : ""}
              <p style="margin:8px 0 0;color:#666;font-size:13px;">有効期限：${expiresAt.toLocaleDateString("ja-JP")}</p>
            </div>
            <a href="https://aiacrossshop.co.jp/cart" style="display:inline-block;background:#0ABAB5;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;">
              今すぐショッピングする
            </a>
            <p style="margin-top:24px;color:#999;font-size:12px;">
              AI Across ショップ｜<a href="https://aiacrossshop.co.jp" style="color:#0ABAB5;">aiacrossshop.co.jp</a>
            </p>
          </div>
        `,
      });
      sent++;
    }

    return NextResponse.json({ sent, total: userCoupons.length });
  } catch (e) {
    console.error("[coupons/notify-expiring]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
