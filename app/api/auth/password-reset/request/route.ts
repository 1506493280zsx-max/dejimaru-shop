import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

const DIRECTUS = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${ADMIN_TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });

    // ユーザー検索
    const userRes = await fetch(
      `${DIRECTUS}/users?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,email&limit=1`,
      { headers: H }
    );
    const userData = await userRes.json();
    const user = userData.data?.[0];

    // セキュリティのため、ユーザーが存在しない場合も成功を返す
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // トークン生成（1時間有効）
    const token = randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Directusにトークン保存
    await fetch(`${DIRECTUS}/users/${user.id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({
        reset_token: token,
        reset_token_expires_at: expiresAt,
      }),
    });

    // リセットメール送信
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[password-reset/request]", e);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
