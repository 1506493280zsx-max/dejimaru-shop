import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = "https://directus-production-2cfe.up.railway.app";
const ADMIN_TOKEN = "a5RnKIXFibE5JV_50ir42Hk84JnMZVMb";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // ユーザー作成
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
    return NextResponse.json({ token: loginData.data.access_token });
  } catch (e) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
