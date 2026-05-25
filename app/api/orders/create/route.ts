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
    const { items, total, email, subtotal, warrantySubtotal, shippingFee, shippingAddress } = await req.json();

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
        discount_amount: 0,
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

    const itemResults = await Promise.all(
      (items as any[]).map((item) =>
        fetch(`${DIRECTUS}/items/order_items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            order_id:          orderId,
            product_name:      item.name,
            product_id:        item.id !== null && item.id !== undefined && item.id !== "" && Number.isFinite(Number(item.id)) ? Number(item.id) : null,
            quantity:          item.quantity,
            unit_price:        item.price,
            total_price:       item.price * item.quantity,
            warranty_selected: item.warrantySelected ?? false,
            warranty_price:    item.warrantyPrice    ?? 0,
            snapshot:          item,
          }),
        })
      )
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
