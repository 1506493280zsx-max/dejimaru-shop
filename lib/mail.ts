import { Resend } from "resend";

export async function sendCorporateQuoteEmail(body: string, company: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
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
    from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
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
    from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "【AI Across ショップ】お問い合わせを受け付けました",
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
          AI Across ショップ
        </p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail({
  to, firstName, orderNumber, items, subtotal, warrantySubtotal, shippingFee, discountAmount, total,
}: {
  to: string; firstName: string; orderNumber: string;
  items: Array<{ product_name: string; quantity: number; unit_price: number; warranty_selected: boolean; warranty_price: number; }>;
  subtotal: number; warrantySubtotal: number; shippingFee: number; discountAmount: number; total: number;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}${item.warranty_selected ? '<br><span style="font-size:11px;color:#0ABAB5;">無期限保障付き</span>' : ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">¥${(item.unit_price * item.quantity).toLocaleString()}</td>
    </tr>
    ${item.warranty_selected ? `<tr><td style="padding:4px 8px;color:#0ABAB5;font-size:11px;">　└ 保証料</td><td style="text-align:center;font-size:11px;">${item.quantity}</td><td style="text-align:right;font-size:11px;">¥${(item.warranty_price * item.quantity).toLocaleString()}</td></tr>` : ''}
  `).join('');
  return resend.emails.send({
    from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
    to,
    subject: `【AI Across Shop】ご注文確認 - ${orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
        <div style="background:#0ABAB5;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:20px;">ご注文ありがとうございます</h1>
        </div>
        <div style="background:#fff;border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
          <p>${firstName || 'お客様'} 様</p>
          <p>以下の内容でご注文を承りました。</p>
          <p style="background:#f0f5f5;padding:12px;border-radius:4px;">注文番号：<strong>${orderNumber}</strong></p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead><tr style="background:#f9f9f9;">
              <th style="padding:8px;text-align:left;border-bottom:2px solid #ddd;min-width:200px;">商品</th>
              <th style="padding:8px;text-align:center;border-bottom:2px solid #ddd;width:60px;">数量</th>
              <th style="padding:8px;text-align:right;border-bottom:2px solid #ddd;width:100px;">金額</th>
            </tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="text-align:right;margin-top:16px;">
            <p style="margin:4px 0;">商品小計：¥${subtotal.toLocaleString()}</p>
            ${warrantySubtotal > 0 ? `<p style="margin:4px 0;color:#0ABAB5;">🛡️ 保証合計：¥${warrantySubtotal.toLocaleString()}</p>` : ''}
            <p style="margin:4px 0;">送料：${shippingFee === 0 ? '無料' : '¥' + shippingFee.toLocaleString()}</p>
            ${discountAmount > 0 ? `<p style="margin:4px 0;color:#2e7d32;">クーポン割引：-¥${discountAmount.toLocaleString()}</p>` : ''}
            <p style="font-size:18px;font-weight:bold;color:#CC2200;margin:8px 0;">合計：¥${total.toLocaleString()}</p>
          </div>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
          <p style="color:#666;font-size:13px;">商品は順次発送いたします。発送後にメールでお知らせします。</p>
          <a href="https://aiacrossshop.co.jp/account/orders" style="display:inline-block;background:#0ABAB5;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;margin-top:12px;">注文履歴を確認する</a>
        </div>
        <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">AI Across Shop｜<a href="https://aiacrossshop.co.jp" style="color:#0ABAB5;">aiacrossshop.co.jp</a></p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, firstName: string, lastName: string = "") {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "【AI Across Shop】会員登録ありがとうございます",
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="background:#0ABAB5;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:22px;">会員登録ありがとうございます</h1>
  </div>
  <div style="background:#fff;border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <p>${lastName || ''}${firstName || 'お客様'}様、AI Across Shopへようこそ！</p>
    <p>会員登録が完了しました。これからお買い物をお楽しみください。</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://aiacrossshop.co.jp" style="background:#0ABAB5;color:#fff;padding:12px 32px;border-radius:4px;text-decoration:none;font-weight:bold;">ショッピングを始める</a>
    </div>
    <p style="color:#888;font-size:12px;">AI Across Shop カスタマーサポート</p>
  </div>
</div>`,
  });
}
