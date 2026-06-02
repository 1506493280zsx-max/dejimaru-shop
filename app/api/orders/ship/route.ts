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
    // Directus FlowまたはADMIN_TOKENからの呼び出しのみ許可
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "") || body.token;
    if (secret !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const orderId = body.orderId || body.keys?.[0];
    const status = body.payload?.status || body.status;
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
    if (!status || status !== "shipped") return NextResponse.json({ skipped: true });

    // 1. 注文情報を取得
    const orderRes = await fetch(
      `${DIRECTUS}/items/orders/${orderId}?fields=id,order_number,guest_email,status,tracking_number,shipping_carrier,total,subtotal,shipping_address,customer_id,shipped_at`,
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
      const userRes = await fetch(
        `${DIRECTUS}/users/${order.customer_id}?fields=email,first_name,last_name`,
        { headers: H() }
      );
      const userInfo = (await userRes.json()).data;
      if (userInfo) {
        if (userInfo.email) email = userInfo.email;
        const givenName = userInfo.first_name || "";
        const familyName = userInfo.last_name || "";
        firstName = [familyName, givenName].filter(Boolean).join(" ");
      }
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
      from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject,
      html,
    });
    if (mailError) {
      console.error("[orders/ship] resend error:", mailError);
      // メール失敗は無視してポイント付与・ステータス更新を継続
    }
    console.log("[orders/ship] mail sent:", mailData?.id, "to:", email);

    // ── 積分付与（発送確定時）──────────────────────────────────
    // originalTotal = subtotal（商品原価、割引・積分使用・送料を含まない）
    // /api/points/earn 内部で幂等チェック済み（二重付与防止）
    if (order.customer_id) {
      try {
        console.log("[orders/ship] 積分計算基準", {
          subtotal: order.subtotal,
          total: order.total,
          using: order.subtotal ?? order.total ?? 0
        });
        const earnRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp"}/api/points/earn`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
            body: JSON.stringify({
              customerId: order.customer_id,
              orderId: order.id,
              originalTotal: order.subtotal ?? order.total ?? 0,
            }),
          }
        );
        if (!earnRes.ok) {
          console.error("[orders/ship] ポイント付与失敗", await earnRes.text());
        } else {
          const earnData = await earnRes.json();
          console.log("[orders/ship] ポイント付与完了", earnData);
        }
      } catch (e) {
        console.error("[orders/ship] ポイント付与エラー", e);
      }
    }

    // 7. 発送済みステータスに更新
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
