import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

const adminHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ADMIN_TOKEN}`,
};

export async function DELETE(
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
    const me = (await meRes.json()).data;

    const { id } = await context.params;

    const commentRes = await fetch(
      `${DIRECTUS_URL}/items/blog_comments/${id}?fields=user_id`,
      { headers: adminHeaders }
    );
    if (!commentRes.ok) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    const comment = (await commentRes.json()).data;

    if (comment.user_id !== me.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patchRes = await fetch(`${DIRECTUS_URL}/items/blog_comments/${id}`, {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ deleted: true }),
    });

    if (!patchRes.ok) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
