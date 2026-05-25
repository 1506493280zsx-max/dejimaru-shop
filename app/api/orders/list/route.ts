import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";

export async function GET(req: NextRequest) {
  const token =
    process.env.DIRECTUS_TOKEN ||
    process.env.ADMIN_TOKEN ||
    undefined;
  if (!token) {
    console.error("[orders/list] DIRECTUS_TOKEN is not set");
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ data: [] }, { status: 400 });
  }

  try {
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    const cusData = await cusRes.json();
    const customer = cusData.data?.[0];
    if (!customer) return NextResponse.json({ data: [] });

    const ordRes = await fetch(
      `${DIRECTUS}/items/orders?filter[customer_id][_eq]=${customer.id}&fields=id,order_number,status,total,subtotal,shipping_fee,payment_method,created_at,shipping_address&sort=-created_at`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    const ordData = await ordRes.json();
    return NextResponse.json({ data: ordData.data || [] });
  } catch (e) {
    console.error("[orders/list]", e);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
