import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL!;

export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();
    if (!refresh_token) {
      return NextResponse.json({ error: "refresh_token required" }, { status: 400 });
    }
    const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token, mode: "json" }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: "refresh failed" }, { status: 401 });
    }
    return NextResponse.json({
      token: data.data.access_token,
      refresh_token: data.data.refresh_token,
    });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
