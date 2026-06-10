import { NextRequest, NextResponse } from "next/server";
const DIRECTUS = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

async function getCustomerByToken(token: string) {
  const r = await fetch(`${DIRECTUS}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) return null;
  const u = await r.json();
  const email = u.data?.email;
  if (!email) return null;
  const r2 = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,first_name,last_name,email,phone&limit=1`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
  });
  const d = await r2.json();
  return d.data?.[0] || null;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "未認証" }, { status: 401 });
    const customer = await getCustomerByToken(token);
    if (!customer) return NextResponse.json({ error: "顧客情報が見つかりません" }, { status: 404 });
    return NextResponse.json({ data: customer });
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "未認証" }, { status: 401 });
    const customer = await getCustomerByToken(token);
    if (!customer) return NextResponse.json({ error: "顧客情報が見つかりません" }, { status: 404 });
    const body = await req.json();
    const allowed: any = {};
    if (body.first_name !== undefined) allowed.first_name = body.first_name;
    if (body.last_name !== undefined) allowed.last_name = body.last_name;
    if (body.phone !== undefined) allowed.phone = body.phone;
    const r = await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(allowed)
    });
    if (!r.ok) return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
