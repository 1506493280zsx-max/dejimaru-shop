import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function verifyUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const userToken = authHeader?.replace("Bearer ", "");
  if (!userToken) return null;
  const meRes = await fetch(`${DIRECTUS}/users/me`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  if (!meRes.ok) return null;
  return (await meRes.json()).data;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const me = await verifyUser(req);
    if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    // 住所が本人のものか確認
    const addrRes = await fetch(`${DIRECTUS}/items/addresses/${id}?fields=customer_id`, { headers: H });
    const addr = (await addrRes.json()).data;
    if (!addr) return NextResponse.json({ error: "not found" }, { status: 404 });

    // customerのemailと本人のemailを照合
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(me.email)}&fields=id&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer || addr.customer_id !== customer.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    const res = await fetch(`${DIRECTUS}/items/addresses/${id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify(body),
    });
    if (!res.ok) return NextResponse.json({ error: "update failed" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[address/id PATCH]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const me = await verifyUser(req);
    if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { id } = await params;

    // 住所が本人のものか確認
    const addrRes = await fetch(`${DIRECTUS}/items/addresses/${id}?fields=customer_id`, { headers: H });
    const addr = (await addrRes.json()).data;
    if (!addr) return NextResponse.json({ error: "not found" }, { status: 404 });

    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(me.email)}&fields=id&limit=1`,
      { headers: H }
    );
    const customer = (await cusRes.json()).data?.[0];
    if (!customer || addr.customer_id !== customer.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    await fetch(`${DIRECTUS}/items/addresses/${id}`, {
      method: "DELETE",
      headers: H,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[address/id DELETE]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
