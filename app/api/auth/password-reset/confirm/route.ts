import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const { token, new_password } = await req.json();
    if (!token || !new_password) {
      return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 });
    }
    if (new_password.length < 8) {
      return NextResponse.json({ error: "パスワードは8文字以上で入力してください" }, { status: 400 });
    }

    // トークンでユーザー検索
    const userRes = await fetch(
      `${DIRECTUS}/users?filter[reset_token][_eq]=${token}&fields=id,reset_token_expires_at&limit=1`,
      { headers: H }
    );
    const userData = await userRes.json();
    const user = userData.data?.[0];

    if (!user) {
      return NextResponse.json({ error: "無効または期限切れのリンクです" }, { status: 400 });
    }

    // 有効期限チェック
    const expiresAt = new Date(user.reset_token_expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "リンクの有効期限が切れています。再度お試しください" }, { status: 400 });
    }

    // パスワード更新 + トークンクリア
    await fetch(`${DIRECTUS}/users/${user.id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({
        password: new_password,
        reset_token: null,
        reset_token_expires_at: null,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[password-reset/confirm]", e);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
