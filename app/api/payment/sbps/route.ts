import { NextRequest, NextResponse } from "next/server";
import { buildSBPSParams, SBPS_CONFIG } from "@/lib/sbps";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN || "";

export async function POST(req: NextRequest) {
  const { orderNumber, itemName, custCode } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp";

  if (!orderNumber) {
    return NextResponse.json({ error: "orderNumber required" }, { status: 400 });
  }

  // DBから実際の注文金額を取得（前端のamountは信頼しない）
  const orderRes = await fetch(
    `${DIRECTUS}/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&fields=id,order_number,total,status&limit=1`,
    { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
  );
  const orderData = await orderRes.json();
  const order = orderData.data?.[0];

  if (!order) {
    return NextResponse.json({ error: "order not found" }, { status: 404 });
  }
  if (order.status === "paid" || order.status === "shipped") {
    return NextResponse.json({ error: "order already paid" }, { status: 400 });
  }

  const serverAmount = Number(order.total);
  if (!serverAmount || serverAmount <= 0) {
    return NextResponse.json({ error: "invalid order amount" }, { status: 400 });
  }

  const params = buildSBPSParams({
    orderNumber: order.order_number,
    orderId: order.id,
    amount: serverAmount,
    itemName,
    custCode: custCode || `GUEST-${order.order_number}`,
    baseUrl,
  });

  return NextResponse.json({
    paymentUrl: SBPS_CONFIG.paymentUrl,
    params,
  });
}
