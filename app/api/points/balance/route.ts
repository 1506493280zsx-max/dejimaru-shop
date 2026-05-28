import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get("customerId");
    if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });

    // 現在のポイント残高取得
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[id][_eq]=${customerId}&fields=id,points&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer) return NextResponse.json({ error: "customer not found" }, { status: 404 });

    // 現在のレート取得
    const rateRes = await fetch(
      `${DIRECTUS}/items/point_settings?filter[is_active][_eq]=true&limit=1&sort=-created_at`,
      { headers: H }
    );
    const rate = (await rateRes.json()).data?.[0]?.rate || 100;

    return NextResponse.json({
      points: customer.points || 0,
      rate,
      // 当次使用時の換算率（50%）
      useRate: 0.5,
    });
  } catch (e) {
    console.error("[points/balance]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
