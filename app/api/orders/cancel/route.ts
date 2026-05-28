import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    // 注文取得
    const orderRes = await fetch(`${DIRECTUS}/items/orders/${orderId}?fields=id,status,customer_id,total,payment_method`, { headers: H });
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
