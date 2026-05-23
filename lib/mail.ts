import { Resend } from "resend";

export async function sendCorporateQuoteEmail(body: string, company: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: "aiacrossshop@gmail.com",
    subject: "[Corporate Quote] " + company,
    text: body,
  });
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  type: string;
  message: string;
  mailtoLink: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, type, message, mailtoLink } = params;

  const adminResult = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: "aiacrossshop@gmail.com",
    replyTo: `${name} <${email}>`,
    subject: `【お問い合わせ】${name}様 - ${type}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0ABAB5;border-bottom:2px solid #0ABAB5;padding-bottom:8px;">
          新しいお問い合わせが届きました
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:10px;background:#E8F8F8;font-weight:bold;width:30%;border:1px solid #ddd;">お名前</td>
            <td style="padding:10px;border:1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px;background:#E8F8F8;font-weight:bold;border:1px solid #ddd;">メールアドレス</td>
            <td style="padding:10px;border:1px solid #ddd;">${email}</td>
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
        <div style="text-align:center;margin:24px 0;">
          <a href="${mailtoLink}"
            style="display:inline-block;background:#0ABAB5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:4px;font-size:16px;font-weight:bold;">
            ✉️ ${name}様へ返信する
          </a>
        </div>
        <p style="color:#999;font-size:11px;text-align:center;">
          上のボタンをクリックすると、${name}様（${email}）への返信メールが自動で作成されます。
        </p>
      </div>
    `,
  });

  if (adminResult.error) return adminResult;

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
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
          ご不明な点は aiacrossshop@gmail.com までお問い合わせください。<br>
          デジマルショップ
        </p>
      </div>
    `,
  });
}
