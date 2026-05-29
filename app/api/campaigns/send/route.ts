import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const resend = new Resend(process.env.RESEND_API_KEY);

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
    if (campaign.target === "all") {
      // 全会員
    } else if (campaign.target === "new") {
      // 過去30日以内に登録した会員
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      url += `&filter[date_created][_gte]=${since}`;
    }
    const cusRes = await fetch(url, { headers: H });
    const customers = (await cusRes.json()).data || [];

    // 3. 一件ずつ送信
    let sentCount = 0;
    for (const customer of customers) {
      if (!customer.email) continue;
      try {
        await resend.emails.send({
          from: `AI Across Shop <${process.env.RESEND_FROM_EMAIL}>`,
          to: customer.email,
          subject: campaign.subject,
          html: campaign.html.replace(/\{\{firstName\}\}/g, customer.name_first || "お客様"),
        });
        sentCount++;
      } catch (e) {
        console.error(`[campaigns/send] failed for ${customer.email}:`, e);
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
