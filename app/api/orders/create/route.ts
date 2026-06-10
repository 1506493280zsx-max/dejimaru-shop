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
    const {
      items, total, email, subtotal, warrantySubtotal, shippingFee,
      shippingAddress, couponCode, discountAmount, customerId,
      points_used, points_discount
    } = await req.json();

    // サーバー側で金額を再計算（フロントの値を信用しない）
    const itemsRes = await Promise.all(
      items.map(async (item: any) => {
        const productId = item.product_id || item.id;
        const variantId = item.variant_id || null;

        let serverPrice = 0;
        let serverWarrantyPrice = 0;
        let variantSnapshot = "";

        // variant_idがあればvariantから価格取得、なければproductから取得（後方互換）
        if (variantId) {
          const vRes = await fetch(
            `${DIRECTUS}/items/product_variants/${variantId}?fields=price,color,memory,storage,capacity`,
            { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
          );
          if (vRes.ok) {
            const vData = await vRes.json();
            const v = vData.data;
            serverPrice = v?.price || 0;
            const parts = [v?.color, v?.memory, v?.storage, v?.capacity].filter(Boolean);
            variantSnapshot = parts.join(" / ");
          }
        }

        // variantから価格が取れなかった場合はproductから取得
        if (serverPrice === 0) {
          const pRes = await fetch(
            `${DIRECTUS}/items/products?filter[id][_eq]=${productId}&fields=price,premium_warranty_price&limit=1`,
            { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
          );
          const pData = await pRes.json();
          serverPrice = pData.data?.[0]?.price || 0;
          serverWarrantyPrice = pData.data?.[0]?.premium_warranty_price || 0;
        } else {
          const pRes = await fetch(
            `${DIRECTUS}/items/products?filter[id][_eq]=${productId}&fields=premium_warranty_price&limit=1`,
            { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
          );
          const pData = await pRes.json();
          serverWarrantyPrice = pData.data?.[0]?.premium_warranty_price || 0;
        }

        return {
          ...item,
          unit_price: serverPrice,
          warranty_price: serverWarrantyPrice,
          warranty_selected: !!(item.warranty_selected || item.warrantySelected),
          variant_id: variantId,
          variant_snapshot: variantSnapshot,
        };
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

    // ポイント割引をサーバー側で検証（1pt=1円）
    const pointsToUse = Number(points_used) || 0;
    const serverPointsDiscount = Math.min(pointsToUse, serverSubtotal);
    const serverShippingFee = serverSubtotal >= 5000 ? 0 : 800;
    const serverTotal = Math.max(0,
      serverSubtotal + serverWarrantySubtotal + serverShippingFee
      - serverDiscount - serverPointsDiscount
    );

    // ── クーポン事前マーク（注文作成前に実行、二重使用防止） ──
    let markedUcId: number | null = null;
    if (couponCode && (customerId || email)) {
      try {
        const targetEmail = email;
        let cusId: number | null = null;

        if (customerId) {
          cusId = customerId;
        } else if (targetEmail) {
          const cusRes = await fetch(
            `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(targetEmail)}&fields=id&limit=1`,
            { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
          );
          cusId = (await cusRes.json()).data?.[0]?.id ?? null;
        }

        if (cusId) {
          const cpRes = await fetch(
            `${DIRECTUS}/items/coupons?filter[code][_eq]=${encodeURIComponent(couponCode)}&fields=id&limit=1`,
            { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
          );
          const couponId = (await cpRes.json()).data?.[0]?.id;

          if (couponId) {
            const ucRes = await fetch(
              `${DIRECTUS}/items/user_coupons?filter[customer_id][_eq]=${cusId}&filter[coupon_id][_eq]=${couponId}&filter[used_at][_null]=true&limit=1`,
              { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
            );
            const uc = (await ucRes.json()).data?.[0];

            if (!uc) {
              return NextResponse.json({ success: false, error: "クーポンはすでに使用済みか無効です" }, { status: 400 });
            }

            const markRes = await fetch(`${DIRECTUS}/items/user_coupons/${uc.id}`, {
              method: "PATCH",
              headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
              body: JSON.stringify({ used_at: new Date().toISOString() }),
            });

            if (!markRes.ok) {
              return NextResponse.json({ success: false, error: "クーポンの処理に失敗しました" }, { status: 500 });
            }

            markedUcId = uc.id;
          }
        }
      } catch (e) {
        console.error("[orders/create] クーポン事前マークエラー", e);
      }
    }

    const order_number = generateOrderNumber();

    const orderRes = await fetch(`${DIRECTUS}/items/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        order_number,
        customer_id:          customerId || null,
        guest_email:          email || null,
        status:               "pending",
        subtotal:             serverSubtotal,
        warranty_total:       serverWarrantySubtotal,
        shipping_fee:         serverShippingFee,
        discount_amount:      serverDiscount,
        points_used:          pointsToUse,
        points_discount:      serverPointsDiscount,
        coupon_code:          couponCode ?? null,
        total:                serverTotal,
        currency:             "JPY",
        shipping_address:     shippingAddress ?? null,
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      const msg = err?.errors?.[0]?.message ?? "Order creation failed";
      // クーポンのロールバック
      if (markedUcId) {
        try {
          await fetch(`${DIRECTUS}/items/user_coupons/${markedUcId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ used_at: null }),
          });
        } catch (e) {
          console.error("[orders/create] クーポンロールバックエラー", e);
        }
      }
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }

    const orderId = (await orderRes.json()).data.id;

    // ── 库存检查：验证库存充足 ──
    for (const item of itemsRes) {
      try {
        const filterField = item.variant_id ? 'variant_id' : 'product_id';
        const filterValue = item.variant_id ?? item.product_id;
        const invRes = await fetch(
          `${DIRECTUS}/items/inventory?filter[${filterField}][_eq]=${filterValue}&limit=1`,
          { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
        );
        const invData = await invRes.json();
        const inv = invData.data?.[0];
        if (!inv) continue;
        const available = (inv.quantity ?? 0) - (inv.reserved ?? 0);
        if (available < (item.quantity ?? 1)) {
          return NextResponse.json(
            { success: false, error: `${item.name || '商品'}の在庫が不足しています。残り${available}点です。` },
            { status: 400 }
          );
        }
      } catch (e) {
        console.error('[orders/create] stock check error', e);
      }
    }

    // ── 库存扣减：从 inventory 表扣减 ──
    for (const item of itemsRes) {
      try {
        const filterField = item.variant_id ? 'variant_id' : 'product_id';
        const filterValue = item.variant_id ?? item.product_id;
        const invRes = await fetch(
          `${DIRECTUS}/items/inventory?filter[${filterField}][_eq]=${filterValue}&limit=1`,
          { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
        );
        const invData = await invRes.json();
        const inv = invData.data?.[0];
        if (!inv) continue;
        const newQty = Math.max(0, (inv.quantity ?? 0) - (item.quantity ?? 1));
        await fetch(
          `${DIRECTUS}/items/inventory/${inv.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: newQty }),
          }
        );
        console.log(`[orders/create] inventory扣减: id=${inv.id}, quantity=${item.quantity}, new_qty=${newQty}`);
      } catch (e) {
        console.error("[orders/create] inventory扣减错误", e);
      }
    }

    // 積分使用（1pt=1円、注文確定時に即座に控除）
    if (customerId && pointsToUse > 0) {
      try {
        const useRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://aiacrossshop.co.jp"}/api/points/use`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
            body: JSON.stringify({
              customerId,
              pointsToUse,
              orderId,
            }),
          }
        );
        if (!useRes.ok) {
          console.error("[orders/create] ポイント控除失敗", await useRes.text());
        }
      } catch (e) {
        console.error("[orders/create] ポイント控除エラー", e);
      }
    }
    // 注意：積分付与（earn）は発送確定時（orders/ship）で行う。ここでは呼ばない。

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
        warranty_price: itemsRes.find((ir: any) => ir.id === item.id || ir.product_id === item.id)?.warranty_price ?? item.warrantyPrice ?? 0,
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
        pointsDiscount: serverPointsDiscount,
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
            unit_price:        item.unit_price,
            total_price:       (item.unit_price + (item.warranty_price ?? 0)) * item.quantity,
            warranty_selected: item.warranty_selected ?? false,
            warranty_price:    item.warranty_price    ?? 0,
            variant_id:        item.variant_id        || null,
            variant_snapshot:  item.variant_snapshot  || "",
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
