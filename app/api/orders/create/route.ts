import { NextRequest, NextResponse } from "next/server";

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
    const { items, total, email, subtotal, warrantySubtotal, shippingFee, shippingAddress, couponCode, discountAmount } = await req.json();

    const order_number = generateOrderNumber();

    const orderRes = await fetch(`${DIRECTUS}/items/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        order_number,
        guest_email: email || null,
        status: "pending",
        subtotal:       subtotal ?? total,
        warranty_total: warrantySubtotal ?? 0,
        shipping_fee:   shippingFee ?? 0,
        discount_amount: discountAmount ?? 0,
        coupon_code: couponCode ?? null,
        total,
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

    return NextResponse.json({ success: true, orderId, orderNumber: order_number });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
