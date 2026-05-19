import { NextRequest, NextResponse } from "next/server";
const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

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
