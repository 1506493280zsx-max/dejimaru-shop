import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const adminHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ADMIN_TOKEN}`,
};

export async function POST(req: NextRequest) {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    if (!DIRECTUS_URL) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const me = (await meRes.json()).data;

    const { post, body, reply_to } = await req.json();

    const text = body?.trim();

    if (!post) {
      return NextResponse.json(
        { error: "post and body are required" },
        { status: 400 }
      );
    }

    if (!text || text.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be 1-1000 characters" },
        { status: 400 }
      );
    }

    if (reply_to) {
      const parentRes = await fetch(
        `${DIRECTUS_URL}/items/blog_comments/${reply_to}?fields=reply_to`,
        { headers: adminHeaders }
      );
      if (!parentRes.ok) return NextResponse.json({ error: "Invalid reply_to" }, { status: 400 });
      const parent = (await parentRes.json()).data;
      if (parent?.reply_to) {
        return NextResponse.json({ error: "Reply depth exceeded" }, { status: 400 });
      }
    }

    const createRes = await fetch(`${DIRECTUS_URL}/items/blog_comments`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        post,
        user_id: me.id,
        user_name: `${me.last_name ?? ""} ${me.first_name ?? ""}`.trim() || me.email,
        body: text,
        reply_to: reply_to || null,
        approved: false,
        deleted: false,
        flagged: false,
      }),
    });

    if (!createRes.ok) return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
