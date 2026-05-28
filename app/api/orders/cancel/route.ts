import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    // 注文取得
    const orderRes = await fetch(`${DIRECTUS}/items/orders/${orderId}?fields=id,status,customer_id,guest_email,total,payment_method`, { headers: H });
    const order = (await orderRes.json()).data;
    if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

    // 本人確認
    if (userId && order.customer_id !== userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    // pending のみキャンセル可能
    if (order.status !== "pending") {
      return NextResponse.json({ error: "この注文はキャンセルできません" }, { status: 400 });
    }

    // ポイント処理（不正防止）
    // customer email: look up via directus_users UUID (customers.id is integer, not UUID)
    let customerEmail = order.guest_email || "";
    if (order.customer_id && !customerEmail) {
      const userRes = await fetch(`${DIRECTUS}/users/${order.customer_id}?fields=email`, { headers: H });
      customerEmail = (await userRes.json()).data?.email || "";
    }

    // 1. 獲得ポイントを取り消す
    const earnTxRes = await fetch(
      `${DIRECTUS}/items/point_transactions?filter[order_id][_eq]=${orderId}&filter[type][_eq]=earn&limit=1`,
      { headers: H }
    );
    const earnTx = (await earnTxRes.json()).data?.[0];
    if (earnTx && order.customer_id && customerEmail) {
      const cusRes2 = await fetch(
        `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(customerEmail)}&fields=id,points&limit=1`,
        { headers: H }
      );
      const customer = (await cusRes2.json()).data?.[0];
      if (customer) {
        const newPoints = Math.max(0, (customer.points || 0) - earnTx.points);
        await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
          method: "PATCH",
          headers: H,
          body: JSON.stringify({ points: newPoints }),
        });
        await fetch(`${DIRECTUS}/items/point_transactions`, {
          method: "POST",
          headers: H,
          body: JSON.stringify({
            customer_id: order.customer_id,
            order_id: orderId,
            type: "earn",
            points: -earnTx.points,
            description: `注文キャンセルによるポイント取消`,
          }),
        });
      }
    }
    // 2. 使用ポイントを返還する
    const useTxRes = await fetch(
      `${DIRECTUS}/items/point_transactions?filter[order_id][_eq]=${orderId}&filter[type][_eq]=use&limit=1`,
      { headers: H }
    );
    const useTx = (await useTxRes.json()).data?.[0];
    if (useTx && order.customer_id && customerEmail) {
      const cusRes3 = await fetch(
        `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(customerEmail)}&fields=id,points&limit=1`,
        { headers: H }
      );
      const customer3 = (await cusRes3.json()).data?.[0];
      if (customer3) {
        const newPoints3 = (customer3.points || 0) + Math.abs(useTx.points);
        await fetch(`${DIRECTUS}/items/customers/${customer3.id}`, {
          method: "PATCH",
          headers: H,
          body: JSON.stringify({ points: newPoints3 }),
        });
        await fetch(`${DIRECTUS}/items/point_transactions`, {
          method: "POST",
          headers: H,
          body: JSON.stringify({
            customer_id: order.customer_id,
            order_id: orderId,
            type: "use",
            points: Math.abs(useTx.points),
            description: `注文キャンセルによるポイント返還`,
          }),
        });
      }
    }

    // ステータス更新
    await fetch(`${DIRECTUS}/items/orders/${orderId}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        refund_status: "pending_refund",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[orders/cancel]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
