import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aiacrossshop@gmail.com",
    pass: "ymwxjxsfogwykvyy",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, type, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });
    }

    // 管理者への通知メール（replyToを客のメールに設定）
    await transporter.sendMail({
      from: `"デジマルショップ" <aiacrossshop@gmail.com>`,
      to: "aiacrossshop@gmail.com",
      replyTo: `"${name}" <${email}>`,
      subject: `【デジマルショップ】お問い合わせ：${type}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0ABAB5;border-bottom:2px solid #0ABAB5;padding-bottom:8px;">
            デジマルショップ お問い合わせ
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;width:30%;border:1px solid #ddd;">お名前</td>
              <td style="padding:10px;border:1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;border:1px solid #ddd;">メールアドレス</td>
              <td style="padding:10px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;border:1px solid #ddd;">種別</td>
              <td style="padding:10px;border:1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;border:1px solid #ddd;">内容</td>
              <td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color:#0ABAB5;font-size:13px;margin-top:16px;font-weight:bold;">
            ※このメールに返信すると ${name} 様（${email}）へ直接返信されます。
          </p>
        </div>
      `,
    });

    // 自動返信メール
    await transporter.sendMail({
      from: `"デジマルショップ" <aiacrossshop@gmail.com>`,
      to: email,
      subject: "【デジマルショップ】お問い合わせを受け付けました",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0ABAB5;border-bottom:2px solid #0ABAB5;padding-bottom:8px;">
            お問い合わせありがとうございます
          </h2>
          <p>${name} 様</p>
          <p>お問い合わせを受け付けました。<br>
          2営業日以内にご返信いたします。しばらくお待ちください。</p>
          <hr style="border:1px solid #eee;margin:20px 0;">
          <h3 style="color:#555;">お問い合わせ内容</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;width:30%;border:1px solid #ddd;">種別</td>
              <td style="padding:10px;border:1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding:10px;background:#E8F8F8;font-weight:bold;border:1px solid #ddd;">内容</td>
              <td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:20px;">
            ※このメールは自動送信です。<br>
            ご返信は aiacrossshop@gmail.com までお願いします。<br>
            デジマルショップ
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
