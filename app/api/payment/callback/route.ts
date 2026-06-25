import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/mail";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN || "";
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const params = Object.fromEntries(new URLSearchParams(body));

    const orderNumber = params.order_id || "";
    const result = params.res_result || "";

    if (result !== "OK") {
      console.log("[payment/callback] payment not OK:", result, orderNumber);
      return new Response("NG", { status: 200 });
    }

    // order_numberでorderを検索（orders/create/route.tsと同じDIRECTUSを使用）
    const orderRes = await fetch(
      `${DIRECTUS}/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&fields=id,order_number,status,guest_email,customer_id,total,subtotal,warranty_total,shipping_fee,discount_amount,points_discount,shipping_address&limit=1`,
      { headers: H() }
    );
    const orderData = await orderRes.json();
    const order = orderData.data?.[0];

    if (!order) {
      console.error("[payment/callback] order not found:", orderNumber);
      return new Response("NG", { status: 200 });
    }

    // 既にpaid/shipped済みなら二重処理を防ぐ
    if (order.status === "paid" || order.status === "shipped") {
      return new Response("OK", { status: 200 });
    }

    // statusをpendingからpaidに更新（orders/ship/route.tsがshippedに更新する前のステップ）
    await fetch(`${DIRECTUS}/items/orders/${order.id}`, {
      method: "PATCH",
      headers: H(),
      body: JSON.stringify({
        status: "paid",
        paid_at: new Date().toISOString(),
      }),
    });

    console.log("[payment/callback] order paid:", orderNumber, order.id);

    // 付款成功后发送确认邮件
    try {
      // 获取邮件地址和姓名
      let toEmail = order.guest_email || "";
      let firstName = "";
      if (order.customer_id) {
        const userRes = await fetch(
          `${DIRECTUS}/users/${order.customer_id}?fields=email,first_name,last_name`,
          { headers: H() }
        );
        const userInfo = (await userRes.json()).data;
        if (userInfo?.email) toEmail = userInfo.email;
        firstName = userInfo?.last_name || userInfo?.first_name || "";
      }
      if (!firstName && order.shipping_address) {
        const addr = typeof order.shipping_address === "string"
          ? JSON.parse(order.shipping_address)
          : order.shipping_address;
        firstName = addr?.lastName || addr?.firstName || "";
      }

      // 获取订单商品
      const itemsRes = await fetch(
        `${DIRECTUS}/items/order_items?filter[order_id][_eq]=${order.id}&fields=product_name,quantity,unit_price,warranty_selected,warranty_price`,
        { headers: H() }
      );
      const orderItems = (await itemsRes.json()).data || [];

      if (toEmail) {
        await sendOrderConfirmationEmail({
          to: toEmail,
          firstName,
          orderNumber: order.order_number,
          items: orderItems.map((item: any) => ({
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            warranty_selected: item.warranty_selected,
            warranty_price: item.warranty_price,
          })),
          subtotal: order.subtotal || 0,
          warrantySubtotal: order.warranty_total || 0,
          shippingFee: order.shipping_fee || 0,
          discountAmount: order.discount_amount || 0,
          pointsDiscount: order.points_discount || 0,
          total: order.total || 0,
        });
        console.log("[payment/callback] 確認メール送信完了:", toEmail);
      }
    } catch (mailErr) {
      console.error("[payment/callback] メール送信エラー:", mailErr);
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("[payment/callback] error", e);
    return new Response("NG", { status: 200 });
  }
}
