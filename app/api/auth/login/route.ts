import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL!;

const failMap = new Map<string, { count: number; lockedUntil: number }>();
const MAX_FAILS = 10;
const LOCK_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const record = failMap.get(ip);
    if (record && record.lockedUntil > Date.now()) {
      return NextResponse.json(
        { error: "アカウントがロックされています。15分後に再試行してください" },
        { status: 429 }
      );
    }

    const { email, password, recaptchaToken } = await req.json();

    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        });
        const captchaData = await captchaRes.json();
        if (!captchaData.success || (captchaData.score && captchaData.score < 0.5)) {
          return NextResponse.json(
            { error: "不正なアクセスが検出されました" },
            { status: 400 }
          );
        }
      } catch (e) {
        console.error("[login] reCAPTCHA verification error", e);
      }
    }
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      const cur = failMap.get(ip) || { count: 0, lockedUntil: 0 };
      cur.count += 1;
      if (cur.count >= MAX_FAILS) {
        cur.lockedUntil = Date.now() + LOCK_MS;
      }
      failMap.set(ip, cur);
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 400 }
      );
    }

    failMap.delete(ip);
    return NextResponse.json({
      token: data.data.access_token,
      refresh_token: data.data.refresh_token,
    });
  } catch (e) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
