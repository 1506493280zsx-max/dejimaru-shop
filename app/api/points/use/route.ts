import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const { customerId, points } = await req.json();
    if (!customerId || !points) {
      return NextResponse.json({ error: "customerId, points required" }, { status: 400 });
    }

    // 現在の残高確認
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[id][_eq]=${customerId}&fields=id,points&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer) return NextResponse.json({ error: "customer not found" }, { status: 404 });

    const currentPoints = customer.points || 0;
    if (currentPoints < points) {
      return NextResponse.json({ error: "ポイントが不足しています" }, { status: 400 });
    }

    // 当次使用：50%換算（300pt → 150円割引）
    const discountAmount = Math.floor(points * 0.5);

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
