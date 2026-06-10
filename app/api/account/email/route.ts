import { NextRequest, NextResponse } from "next/server";
const DIRECTUS = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "未認証" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "未認証" }, { status: 401 });
    const me = await meRes.json();
    const userId = me.data?.id;
    const currentEmail = me.data?.email;
    if (!userId || !currentEmail) return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });

    const { current_password, new_email } = await req.json();
    if (!current_password || !new_email) return NextResponse.json({ error: "入力内容を確認してください" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_email)) return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });

    if (new_email === currentEmail) return NextResponse.json({ error: "現在と同じメールアドレスです" }, { status: 400 });

    const loginRes = await fetch(`${DIRECTUS}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentEmail, password: current_password })
    });
    if (!loginRes.ok) return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 400 });

    const updateUserRes = await fetch(`${DIRECTUS}/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: new_email })
    });
    if (!updateUserRes.ok) return NextResponse.json({ error: "メールアドレスの更新に失敗しました" }, { status: 500 });

    const cusRes = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(currentEmail)}&fields=id&limit=1`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    const cusData = await cusRes.json();
    const customer = cusData.data?.[0];
    if (customer) {
      await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: new_email })
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
