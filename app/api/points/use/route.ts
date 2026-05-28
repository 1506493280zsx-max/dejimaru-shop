import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, points, commit, orderId } = body;
    if (!customerId || !points) {
      return NextResponse.json({ error: "customerId, points required" }, { status: 400 });
    }

    // customerId is a Directus auth UUID — look up email via users endpoint
    const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=email`, { headers: H });
    const email = (await userRes.json()).data?.email;
    if (!email) return NextResponse.json({ error: "user not found" }, { status: 404 });

    // Find customer by email (customers.id is integer, not UUID)
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer) return NextResponse.json({ error: "customer not found" }, { status: 404 });

    const currentPoints = customer.points || 0;
    if (currentPoints < points) {
      return NextResponse.json({ error: "ポイントが不足しています" }, { status: 400 });
    }

    // 50%換算（300pt → 150円割引）
    const discountAmount = Math.floor(points * 0.5);

    if (commit) {
      const newPoints = currentPoints - points;
      await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
        method: "PATCH",
        headers: H,
        body: JSON.stringify({ points: newPoints }),
      });
      await fetch(`${DIRECTUS}/items/point_transactions`, {
        method: "POST",
        headers: H,
        body: JSON.stringify({
          customer_id: customerId,
          order_id: orderId || null,
          type: "use",
          points: -points,
          description: `注文でポイント使用`,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      usedPoints: points,
      discountAmount,
      remainingPoints: currentPoints - points,
    });
  } catch (e) {
    console.error("[points/use]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
