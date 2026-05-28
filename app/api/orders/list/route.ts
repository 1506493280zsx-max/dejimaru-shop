import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";

export async function GET(req: NextRequest) {
  const adminToken =
    process.env.DIRECTUS_TOKEN ||
    process.env.ADMIN_TOKEN ||
    undefined;
  if (!adminToken) {
    console.error("[orders/list] DIRECTUS_TOKEN is not set");
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const meRes = await fetch(`${process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app"}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!meRes.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const me = (await meRes.json()).data;

  const email = me.email;
  if (!email) {
    return NextResponse.json({ data: [] }, { status: 400 });
  }

  try {
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`,
      { headers: { Authorization: `Bearer ${adminToken}` }, cache: "no-store" }
    );
    const cusData = await cusRes.json();
    const customer = cusData.data?.[0];
    if (!customer) {
      const guestRes = await fetch(
        `${DIRECTUS}/items/orders?filter[guest_email][_eq]=${encodeURIComponent(email)}&fields=id,order_number,status,total,subtotal,shipping_fee,discount_amount,warranty_total,payment_method,created_at,shipping_address,tracking_number,shipping_carrier,order_items.id,order_items.product_name,order_items.quantity,order_items.unit_price,order_items.total_price,order_items.warranty_selected,order_items.warranty_price&sort=-created_at`,
        { headers: { Authorization: `Bearer ${adminToken}` }, cache: "no-store" }
      );
      const guestData = await guestRes.json();
      return NextResponse.json({ data: guestData.data ?? [] });
    }

    const ordRes = await fetch(
      `${DIRECTUS}/items/orders?filter[customer_id][_eq]=${customer.id}&fields=id,order_number,status,total,subtotal,shipping_fee,discount_amount,warranty_total,payment_method,created_at,shipping_address,tracking_number,shipping_carrier,order_items.id,order_items.product_name,order_items.quantity,order_items.unit_price,order_items.total_price,order_items.warranty_selected,order_items.warranty_price&sort=-created_at`,
      { headers: { Authorization: `Bearer ${adminToken}` }, cache: "no-store" }
    );
    const ordData = await ordRes.json();
    // customer_id で見つからなければ guest_email でフォールバック
    if (!ordData.data || ordData.data.length === 0) {
      const guestRes2 = await fetch(
        `${DIRECTUS}/items/orders?filter[guest_email][_eq]=${encodeURIComponent(email)}&fields=id,order_number,status,total,subtotal,shipping_fee,discount_amount,warranty_total,payment_method,created_at,shipping_address,tracking_number,shipping_carrier,order_items.id,order_items.product_name,order_items.quantity,order_items.unit_price,order_items.total_price,order_items.warranty_selected,order_items.warranty_price&sort=-created_at`,
        { headers: { Authorization: `Bearer ${adminToken}` }, cache: "no-store" }
      );
      const guestData2 = await guestRes2.json();
      return NextResponse.json({ data: guestData2.data ?? [] });
    }
    return NextResponse.json({ data: ordData.data || [] });
  } catch (e) {
    console.error("[orders/list]", e);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
