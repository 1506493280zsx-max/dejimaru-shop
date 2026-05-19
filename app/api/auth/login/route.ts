import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL!;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.errors?.[0]?.message || "ログイン失敗" }, { status: 400 });
    }
    return NextResponse.json({ token: data.data.access_token, refresh_token: data.data.refresh_token });
  } catch (e) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
