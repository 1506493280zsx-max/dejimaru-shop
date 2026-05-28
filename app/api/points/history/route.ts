import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get("customerId");
    if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });

    const res = await fetch(
      `${DIRECTUS}/items/point_transactions?filter[customer_id][_eq]=${customerId}&sort=-created_at&limit=50`,
      { headers: H }
    );
    const transactions = (await res.json()).data || [];

    return NextResponse.json({ transactions });
  } catch (e) {
    console.error("[points/history]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
