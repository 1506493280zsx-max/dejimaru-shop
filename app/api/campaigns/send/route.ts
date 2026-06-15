import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const resend = new Resend(process.env.RESEND_API_KEY);

function wrapHtml(innerHtml: string, subject: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F5F5;font-family:'Meiryo',sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:4px;overflow:hidden;border:1px solid #DDD;">
    <div style="background:#0ABAB5;padding:20px 24px;">
      <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700;">AI Across Shop</h1>
    </div>
    <div style="padding:24px;font-size:14px;color:#333;line-height:1.8;">
      ${innerHtml}
    </div>
    <div style="background:#F0F5F5;padding:16px 24px;font-size:11px;color:#999;text-align:center;border-top:1px solid #DDD;">
      <p style="margin:0 0 6px;">このメールはAI Across Shopからお送りしています。</p>
      <p style="margin:0;">
        配信停止をご希望の場合は
        <a href="https://aiacrossshop.co.jp/unsubscribe" style="color:#0ABAB5;">こちら</a>
        からお手続きください。<br>
        AI Across Shop &nbsp;|&nbsp; <a href="https://aiacrossshop.co.jp" style="color:#0ABAB5;">aiacrossshop.co.jp</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "") || body.token;
    if (secret !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const campaignId = body.campaignId || body.keys?.[0];
    if (!campaignId) return NextResponse.json({ error: "campaignId required" }, { status: 400 });

    // 1. キャンペーン取得
    const campRes = await fetch(`${DIRECTUS}/items/email_campaigns/${campaignId}`, { headers: H });
    const campaign = (await campRes.json()).data;
    if (!campaign) return NextResponse.json({ error: "campaign not found" }, { status: 404 });
    if (campaign.status === "sent") return NextResponse.json({ error: "already sent" }, { status: 400 });

    // 2. 送信対象の顧客を取得
    let url = `${DIRECTUS}/items/customers?fields=id,email,name_first&limit=1000`;
    if (campaign.target === "new") {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      url += `&filter[date_created][_gte]=${since}`;
    }
    const cusRes = await fetch(url, { headers: H });
    const customers = (await cusRes.json()).data || [];

    // 3. 一件ずつ送信
    let sentCount = 0;
    for (const customer of customers) {
      if (!customer.email) continue;
      const personalizedHtml = campaign.html.replace(/\{\{firstName\}\}/g, customer.name_first || "お客様");
      const { data: mailData, error: mailError } = await resend.emails.send({
        from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
        to: customer.email,
        subject: campaign.subject,
        html: wrapHtml(personalizedHtml, campaign.subject),
      });
      if (mailError) {
        console.error(`[campaigns/send] failed for ${customer.email}:`, mailError);
      } else {
        console.log(`[campaigns/send] sent to ${customer.email}:`, mailData?.id);
        sentCount++;
      }
    }

    // 4. キャンペーンのステータスを更新
    await fetch(`${DIRECTUS}/items/email_campaigns/${campaignId}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ status: "sent", sent_at: new Date().toISOString(), sent_count: sentCount }),
    });

    return NextResponse.json({ success: true, sentCount });
  } catch (e) {
    console.error("[campaigns/send]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
