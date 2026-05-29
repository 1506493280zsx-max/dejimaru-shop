import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/mail";

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";
const TOKEN =
  process.env.DIRECTUS_TOKEN ||
  process.env.ADMIN_TOKEN ||
  "";

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `ORD-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json(
      { success: false, error: "DIRECTUS_TOKEN missing" },
      { status: 500 }
    );
  }

  try {
    const { items, total, email, subtotal, warrantySubtotal, shippingFee, shippingAddress, couponCode, discountAmount, customerId, pointsUsed } = await req.json();

    // サーバー側で金額を再計算（フロントの値を信用しない）
    const itemsRes = await Promise.all(
      items.map(async (item: any) => {
        const productId = item.product_id || item.id;
        const pRes = await fetch(
          `${DIRECTUS}/items/products?filter[id][_eq]=${productId}&fields=price,warranty_price&limit=1`,
          { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
        );
        const pData = await pRes.json();
        const serverPrice = pData.data?.[0]?.price || 0;
        const serverWarrantyPrice = pData.data?.[0]?.warranty_price || 0;
        return { ...item, unit_price: serverPrice, warranty_price: serverWarrantyPrice };
      })
    );
    const serverSubtotal = itemsRes.reduce((sum: number, item: any) => sum + item.unit_price * item.quantity, 0);
    const serverWarrantySubtotal = itemsRes.reduce((sum: number, item: any) =>
      sum + (item.warranty_selected ? (item.warranty_price || 0) * item.quantity : 0), 0);

    // クーポン割引をサーバー側で検証
    let serverDiscount = 0;
    if (couponCode) {
      const cpRes = await fetch(
        `${DIRECTUS}/items/coupons?filter[code][_eq]=${couponCode}&filter[is_active][_eq]=true&limit=1`,
        { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
      );
      const cpData = await cpRes.json();
      const coupon = cpData.data?.[0];
      if (coupon) {
        serverDiscount = coupon.discount_type === "percent"
          ? Math.floor(serverSubtotal * coupon.discount_value / 100)
          : coupon.discount_value;
      }
    }

    // ポイント割引をサーバー側で検証（最大50%換算）
    const serverPointDiscount = Math.min(
      Math.floor((pointsUsed || 0) * 0.5),
      serverSubtotal
    );

    const serverShippingFee = serverSubtotal >= 5000 ? 0 : 800;
    const serverTotal = Math.max(0, serverSubtotal + serverWarrantySubtotal + serverShippingFee - serverDiscount - serverPointDiscount);

    const order_number = generateOrderNumber();

    const orderRes = await fetch(`${DIRECTUS}/items/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        order_number,
        customer_id: customerId || null,
        guest_email: email || null,
        status: "pending",
        subtotal:        serverSubtotal,
        warranty_total:  serverWarrantySubtotal,
        shipping_fee:    serverShippingFee,
        discount_amount: serverDiscount,
        coupon_code:     couponCode ?? null,
        total:           serverTotal,
        currency: "JPY",
        shipping_address: shippingAddress ?? null,
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      const msg = err?.errors?.[0]?.message ?? "Order creation failed";
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }

    const orderId = (await orderRes.json()).data.id;

    if (couponCode) {
      try {
        const cusRes = await fetch(
          `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` } }
        );
        const cusData = await cusRes.json();
        const customerId = cusData.data?.[0]?.id;
        if (customerId) {
          const cpRes = await fetch(
            `${DIRECTUS}/items/coupons?filter[code][_eq]=${encodeURIComponent(couponCode)}&fields=id&limit=1`,
            { headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` } }
          );
          const cpData = await cpRes.json();
          const couponId = cpData.data?.[0]?.id;
          if (couponId) {
            const ucRes = await fetch(
              `${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${customerId}&filter[coupon_id][_eq]=${couponId}&filter[used_at][_null]=true&limit=1`,
              { headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` } }
            );
            const ucData = await ucRes.json();
            const ucId = ucData.data?.[0]?.id;
            if (ucId) {
              await fetch(`${DIRECTUS}/items/user_coupons/${ucId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
                body: JSON.stringify({ used_at: new Date().toISOString(), order_id: orderId }),
              });
            }
          }
        }
      } catch (e) {
        console.error("[orders/create] coupon mark error", e);
      }
    }

    // 確認メール送信
    try {
      let firstName = shippingAddress?.firstName || shippingAddress?.lastName || "";
      if (!firstName && customerId) {
        try {
          const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=first_name,last_name`, {
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
          });
          const userData = (await userRes.json()).data;
          firstName = userData?.last_name || userData?.first_name || "";
        } catch {}
      }
      const mailItems = (items as any[]).map((item: any) => ({
        product_name: item.name || item.product_name || "",
        quantity: item.quantity,
        unit_price: itemsRes.find((ir: any) => ir.id === item.id || ir.product_id === item.id)?.unit_price || item.price || item.unit_price || 0,
        warranty_selected: item.warrantySelected ?? false,
        warranty_price: item.warrantyPrice ?? 0,
      }));
      await sendOrderConfirmationEmail({
        to: email,
        firstName,
        orderNumber: order_number,
        items: mailItems,
        subtotal: serverSubtotal,
        warrantySubtotal: serverWarrantySubtotal,
        shippingFee: serverShippingFee,
        discountAmount: serverDiscount,
        pointsDiscount: serverPointDiscount,
        total: serverTotal,
      });
    } catch (mailErr) {
      console.error("[orders/create] mail error", mailErr);
    }

    // product_id が有効な商品については Directus から正規の商品名を一括取得する
    const productIdList = [...new Set(
      (items as any[])
        .map(item => (item.id !== null && item.id !== undefined && item.id !== "" && Number.isFinite(Number(item.id))) ? Number(item.id) : null)
        .filter((id): id is number => id !== null)
    )];

    const productNameMap: Record<number, string> = {};
    if (productIdList.length > 0) {
      try {
        const pRes = await fetch(
          `${DIRECTUS}/items/products?filter[id][_in]=${productIdList.join(",")}&fields=id,name&limit=${productIdList.length}`,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` } }
        );
        if (pRes.ok) {
          const pData = await pRes.json();
          for (const p of (pData.data ?? [])) {
            productNameMap[p.id] = p.name;
          }
        }
      } catch {
        // 取得失敗時は item.name にフォールバック
      }
    }

    const itemResults = await Promise.all(
      (items as any[]).map((item) => {
        const productId = (item.id !== null && item.id !== undefined && item.id !== "" && Number.isFinite(Number(item.id))) ? Number(item.id) : null;
        // Directus の products.name を優先し、取得できなければカートの name を使用
        const productName = (productId !== null && productNameMap[productId]) ? productNameMap[productId] : item.name;

        return fetch(`${DIRECTUS}/items/order_items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            order_id:          orderId,
            product_name:      productName,
            product_id:        productId,
            quantity:          item.quantity,
            unit_price:        item.price,
            total_price:       (item.price + (item.warrantyPrice ?? 0)) * item.quantity,
            warranty_selected: item.warrantySelected ?? false,
            warranty_price:    item.warrantyPrice    ?? 0,
            snapshot:          item,
          }),
        });
      })
    );

    const createdItemIds: number[] = [];
    for (const result of itemResults) {
      if (result.ok) {
        const data = await result.json();
        createdItemIds.push(data.data.id);
      }
    }

    const failed = createdItemIds.length !== items.length;

    if (failed) {
      for (const id of createdItemIds) {
        await fetch(`${DIRECTUS}/items/order_items/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
      }
      await fetch(`${DIRECTUS}/items/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      return NextResponse.json(
        { success: false, error: "Order item creation failed" },
        { status: 500 }
      );
    }

    // ポイント使用を実際に控除
    if (customerId && pointsUsed && pointsUsed > 0) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp"}/api/points/use`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            points: pointsUsed,
            orderId,
            commit: true,
          }),
        });
      } catch (e) {
        console.error("[orders/create] points use error", e);
      }
    }

    return NextResponse.json({ success: true, orderId, orderNumber: order_number });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
