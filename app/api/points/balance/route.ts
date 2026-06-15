import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const meRes = await fetch(`${process.env.DIRECTUS_URL || "http://13.158.171.41:8055"}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const me = (await meRes.json()).data;

    // customerId が自分のIDと一致するか確認
    const customerId = req.nextUrl.searchParams.get("customerId");
    if (customerId !== me.id) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

    // customerId is a Directus auth UUID — look up email via users endpoint
    const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=email`, { headers: H });
    const email = (await userRes.json()).data?.email;
    if (!email) return NextResponse.json({ error: "user not found" }, { status: 404 });

    // Find customer record by email (customers.id is integer, not UUID)
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer) return NextResponse.json({ error: "customer not found" }, { status: 404 });

    const rateRes = await fetch(
      `${DIRECTUS}/items/point_settings?filter[is_active][_eq]=true&limit=1&sort=-created_at`,
      { headers: H }
    );
    const rate = (await rateRes.json()).data?.[0]?.rate || 100;

    return NextResponse.json({
      points: customer.points || 0,
      rate,
      useRate: 0.5,
    });
  } catch (e) {
    console.error("[points/balance]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
