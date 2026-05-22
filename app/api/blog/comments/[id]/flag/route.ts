import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const adminHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ADMIN_TOKEN}`,
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    if (!DIRECTUS_URL) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const patchRes = await fetch(`${DIRECTUS_URL}/items/blog_comments/${id}`, {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ flagged: true }),
    });

    if (!patchRes.ok) return NextResponse.json({ error: "Failed to flag" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
