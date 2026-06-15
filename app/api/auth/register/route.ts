import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/mail";
const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // バリデーション
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "全ての項目を入力してください" }, { status: 400 });
    }
    // メールフォーマット検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
    }
    // パスワード強度検証（8文字以上）
    if (password.length < 8) {
      return NextResponse.json({ error: "パスワードは8文字以上で入力してください" }, { status: 400 });
    }
    // 名前の長さ検証
    if (firstName.length > 50 || lastName.length > 50) {
      return NextResponse.json({ error: "名前は50文字以内で入力してください" }, { status: 400 });
    }

    // directus_usersにユーザー作成
    const createRes = await fetch(`${DIRECTUS_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        email, password,
        first_name: firstName,
        last_name: lastName,
        status: "active",
        role: "506b19d2-ae5d-47af-a560-5637ed29febf",
      }),
    });
    const createData = await createRes.json();
    if (!createRes.ok) {
      return NextResponse.json({ error: createData.errors?.[0]?.message || "登録失敗" }, { status: 400 });
    }

    // customersテーブルにも同時作成
    const cusRes = await fetch(`${DIRECTUS_URL}/items/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        email,
        name_last: lastName,
        name_first: firstName,
      }),
    });
    if (!cusRes.ok) {
      const cusError = await cusRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: cusError.errors?.[0]?.message || "顧客情報の作成に失敗しました" },
        { status: 400 }
      );
    }

    // ウェルカムメール送信（失敗してもエラーにしない）
    try {
      await sendWelcomeEmail(email, firstName);
    } catch (e) {
      console.error("[register] welcome email failed:", e);
    }

    // 登録後ログイン
    const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      return NextResponse.json({ error: "登録は完了しましたがログインに失敗しました" }, { status: 400 });
    }
    return NextResponse.json({
      token: loginData.data.access_token,
      refresh_token: loginData.data.refresh_token,
    });
  } catch (e) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
