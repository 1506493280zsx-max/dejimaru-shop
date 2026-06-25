import { NextRequest, NextResponse } from "next/server";
import { buildSBPSParams, SBPS_CONFIG } from "@/lib/sbps";

export async function POST(req: NextRequest) {
  const { orderId, orderNumber, amount, itemName, custCode } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp";

  const params = buildSBPSParams({
    orderNumber,
    orderId,
    amount,
    itemName,
    custCode: custCode || `GUEST-${orderNumber}`,
    baseUrl,
  });

  console.log("[sbps] params:", JSON.stringify(params));
  return NextResponse.json({
    paymentUrl: SBPS_CONFIG.paymentUrl,
    params,
  });
}
