import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });
const resend = new Resend(process.env.RESEND_API_KEY);

function renderTemplate(html: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((t, [k, v]) => t.replaceAll(`{{${k}}}`, v), html);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body.orderId || body.keys?.[0];
    const status = body.payload?.status || body.status;
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
    if (status && status !== "shipped") return NextResponse.json({ skipped: true });

    // 1. 注文情報を取得
    const orderRes = await fetch(
      `${DIRECTUS}/items/orders/${orderId}?fields=id,order_number,guest_email,status,tracking_number,shipping_carrier,total,shipping_address,customer_id,shipped_at`,
      { headers: H() }
    );
    const order = (await orderRes.json()).data;
    if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

    // shipped_atが既にセットされていたら重複送信防止でスキップ
    if (order.shipped_at) {
      return NextResponse.json({ skipped: true, reason: "already shipped" });
    }

    // 2. メールアドレスを取得
    let email = order.guest_email;
    let firstName = "";
    if (order.customer_id) {
      const cusRes = await fetch(
        `${DIRECTUS}/items/customers?filter[id][_eq]=${order.customer_id}&fields=email,name_first&limit=1`,
        { headers: H() }
      );
      const customer = (await cusRes.json()).data?.[0];
      if (customer) { email = customer.email; firstName = customer.name_first || ""; }
    }
    if (!email) return NextResponse.json({ error: "no email found" }, { status: 400 });

    // 3. メールテンプレートを取得
    const tmplRes = await fetch(
      `${DIRECTUS}/items/email_templates?filter[key][_eq]=shipping_notify&filter[is_active][_eq]=true&limit=1`,
      { headers: H() }
    );
    const tmplJson = await tmplRes.json();
    console.log("[orders/ship] template:", tmplJson.data?.[0]?.key, "html length:", tmplJson.data?.[0]?.html?.length);
    const template = tmplJson.data?.[0];
    if (!template) return NextResponse.json({ error: "template not found" }, { status: 404 });
    if (!template.html) return NextResponse.json({ error: "template html is empty" }, { status: 500 });

    // 4. 変数を置換
    const carrierMap: Record<string, string> = {
      yamato: "ヤマト運輸",
      sagawa: "佐川急便",
      japanpost: "日本郵便",
      fedex: "FedEx",
      dhl: "DHL",
      other: "その他",
    };
    const vars = {
      firstName: firstName || "お客様",
      orderNumber: order.order_number,
      trackingNumber: order.tracking_number || "—",
      shippingCarrier: carrierMap[order.shipping_carrier] || order.shipping_carrier || "—",
      total: order.total?.toLocaleString() || "0",
    };
    const subject = renderTemplate(template.subject, vars);
    const html = renderTemplate(template.html, vars);

    // 5. メール送信
    const { data: mailData, error: mailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject,
      html,
    });
    if (mailError) {
      console.error("[orders/ship] resend error:", mailError);
      return NextResponse.json({ error: "mail failed", detail: mailError }, { status: 500 });
    }
    console.log("[orders/ship] mail sent:", mailData?.id, "to:", email);

    // 6. 発送済みステータスに更新
    await fetch(`${DIRECTUS}/items/orders/${orderId}`, {
      method: "PATCH",
      headers: H(),
      body: JSON.stringify({ status: "shipped", shipped_at: new Date().toISOString() }),
    });

    return NextResponse.json({ success: true, email });
  } catch (e) {
    console.error("[orders/ship]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
