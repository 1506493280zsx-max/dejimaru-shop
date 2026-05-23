import { NextRequest, NextResponse } from "next/server";
import { sendCorporateQuoteEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data.website) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const company = data.company || "（未入力）";

  const body = [
    `会社: ${company}`,
    `名前: ${data.name     || "（未入力）"}`,
    `電話: ${data.phone    || "（未入力）"}`,
    `メール: ${data.email   || "（未入力）"}`,
    `商品タイプ: ${(data.productTypes as string[] | undefined)?.join(", ") || "（未入力）"}`,
    `数量: ${data.quantity  || "（未入力）"}`,
    `予算: ${data.budget    || "（未入力）"}`,
    `用途: ${data.purpose   || "（未入力）"}`,
    `OS: ${data.os          || "（未入力）"}`,
    `メモリ: ${data.memory   || "（未入力）"}`,
    `SSD: ${data.ssd        || "（未入力）"}`,
    `備考: ${data.memo      || "（未入力）"}`,
  ].join("\n");

  try {
    const result = await sendCorporateQuoteEmail(body, company);
    if (result.error) {
      console.error("Resend send failed:", result.error);
      return NextResponse.json(
        { ok: false, error: String(result.error.message || result.error) },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, messageId: result.data?.id });
  } catch (error) {
    console.error("Corporate quote error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
