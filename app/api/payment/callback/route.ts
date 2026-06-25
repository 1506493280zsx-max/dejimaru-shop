import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN || "";
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    const orderNumber = params.order_id || "";
    const result = params.res_result || "";

    if (result !== "OK") {
      console.log("[payment/callback] payment not OK:", result, orderNumber);
      return new Response("NG", { status: 200 });
    }

    // order_numberでorderを検索（orders/create/route.tsと同じDIRECTUSを使用）
    const orderRes = await fetch(
      `${DIRECTUS}/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&limit=1`,
      { headers: H() }
    );
    const orderData = await orderRes.json();
    const order = orderData.data?.[0];

    if (!order) {
      console.error("[payment/callback] order not found:", orderNumber);
      return new Response("NG", { status: 200 });
    }

    // 既にpaid/shipped済みなら二重処理を防ぐ
    if (order.status === "paid" || order.status === "shipped") {
      return new Response("OK", { status: 200 });
    }

    // statusをpendingからpaidに更新（orders/ship/route.tsがshippedに更新する前のステップ）
    await fetch(`${DIRECTUS}/items/orders/${order.id}`, {
      method: "PATCH",
      headers: H(),
      body: JSON.stringify({
        status: "paid",
        paid_at: new Date().toISOString(),
      }),
    });

    console.log("[payment/callback] order paid:", orderNumber, order.id);
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("[payment/callback] error", e);
    return new Response("NG", { status: 200 });
  }
}
