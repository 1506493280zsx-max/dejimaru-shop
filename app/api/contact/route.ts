import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, type, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });
    }

    const replySubject = encodeURIComponent(`Re: 【デジマルショップ】${type}`);
    const replyBody = encodeURIComponent(`${name} 様\n\nお問い合わせありがとうございます。\n\n---\n元のメッセージ:\n${message}`);
    const mailtoLink = `mailto:${email}?subject=${replySubject}&body=${replyBody}`;

    const result = await sendContactEmail({ name, email, type, message, mailtoLink });
    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
