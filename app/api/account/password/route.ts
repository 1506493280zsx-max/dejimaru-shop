import { NextRequest, NextResponse } from "next/server";
const DIRECTUS = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "未認証" }, { status: 401 });
    const r = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) return NextResponse.json({ error: "未認証" }, { status: 401 });
    const u = await r.json();
    const userId = u.data?.id;
    if (!userId) return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    const { current_password, new_password } = await req.json();
    if (!current_password || !new_password) return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 });
    if (new_password.length < 8) return NextResponse.json({ error: "パスワードは8文字以上で入力してください" }, { status: 400 });
    const loginR = await fetch(`${DIRECTUS}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: u.data.email, password: current_password })
    });
    if (!loginR.ok) return NextResponse.json({ error: "現在のパスワードが正しくありません" }, { status: 400 });
    const updateR = await fetch(`${DIRECTUS}/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password: new_password })
    });
    if (!updateR.ok) return NextResponse.json({ error: "パスワード更新失敗" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
