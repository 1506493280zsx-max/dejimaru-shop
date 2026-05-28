import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    // 内部APIのみ許可（ADMIN_TOKENで保護）
    const authHeader = req.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "");
    if (secret !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { customerId, orderId, orderTotal } = await req.json();
    if (!customerId || !orderId || !orderTotal) {
      return NextResponse.json({ error: "customerId, orderId, orderTotal required" }, { status: 400 });
    }

    // 現在のレート取得
    const rateRes = await fetch(
      `${DIRECTUS}/items/point_settings?filter[is_active][_eq]=true&limit=1&sort=-created_at`,
      { headers: H }
    );
    const rate = (await rateRes.json()).data?.[0]?.rate || 100;

    // 獲得ポイント計算
    const earnedPoints = Math.floor(orderTotal / rate);
    if (earnedPoints <= 0) return NextResponse.json({ success: true, earnedPoints: 0 });

    // customerId is a Directus auth UUID — look up email via users endpoint
    const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=email`, { headers: H });
    const email = (await userRes.json()).data?.email;
    if (!email) return NextResponse.json({ error: "user not found" }, { status: 404 });

    // customers.pointsを更新（customers.id is integer, look up by email）
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer) return NextResponse.json({ error: "customer not found" }, { status: 404 });

    const newPoints = (customer.points || 0) + earnedPoints;
    await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ points: newPoints }),
    });

    // 履歴記録
    await fetch(`${DIRECTUS}/items/point_transactions`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        customer_id: customerId,
        order_id: orderId,
        type: "earn",
        points: earnedPoints,
        description: `注文 #${orderId} ポイント獲得`,
      }),
    });

    return NextResponse.json({ success: true, earnedPoints, newBalance: newPoints });
  } catch (e) {
    console.error("[points/earn]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
