import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL;
const TOKEN = process.env.ADMIN_TOKEN;

async function verifyUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const userToken = authHeader?.replace("Bearer ", "");
  if (!userToken) return null;
  const r = await fetch(`${DIRECTUS}/users/me`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  if (!r.ok) return null;
  const u = await r.json();
  return u.data?.email || null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const email = await verifyUser(req);
    if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json();

    const res = await fetch(`${DIRECTUS}/items/addresses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const email = await verifyUser(req);
    if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const res = await fetch(`${DIRECTUS}/items/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) return NextResponse.json({ error: "削除失敗" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
