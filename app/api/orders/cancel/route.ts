import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    // Authorizationヘッダーからtokenを取得して本人確認
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // tokenでDirectusから現在のユーザーを取得
    const meRes = await fetch(`${process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app"}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const me = (await meRes.json()).data;

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    // 注文取得
    const orderRes = await fetch(`${DIRECTUS}/items/orders/${orderId}?fields=id,status,customer_id,guest_email,total,payment_method`, { headers: H });
    const order = (await orderRes.json()).data;
    if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

    // 本人確認
    if (order.customer_id && order.customer_id !== me.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    // pending のみキャンセル可能
    if (order.status !== "pending") {
      return NextResponse.json({ error: "この注文はキャンセルできません" }, { status: 400 });
    }

    // ── 積分処理（キャンセル時）──────────────────────────────────
    // この注文に紐づく全ての積分トランザクションを取得して逆転させる
    if (order.customer_id) {
      try {
        // STEP A: この注文の全積分履歴を取得
        const txRes = await fetch(
          `${DIRECTUS}/items/point_transactions?filter[order_id][_eq]=${orderId}&limit=100`,
          { headers: H }
        );
        const txData = await txRes.json();
        const transactions = txData.data || [];

        if (transactions.length > 0) {
          // STEP B: customerのemailを取得
          const userRes = await fetch(
            `${DIRECTUS}/users/${order.customer_id}?fields=email`,
            { headers: H }
          );
          const email = (await userRes.json()).data?.email;
          if (!email) throw new Error("customer email not found");

          // STEP C: customersレコードを取得
          const cusRes = await fetch(
            `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
            { headers: H }
          );
          const customer = (await cusRes.json()).data?.[0];
          if (!customer) throw new Error("customer record not found");

          // STEP D: 全トランザクションの合計を逆転させた値を計算
          // earn(プラス)はマイナスに、use(マイナス)はプラスに戻す
          const totalReverse = transactions.reduce(
            (sum: number, tx: any) => sum - tx.points,
            0
          );

          // STEP E: customers.pointsを更新（マイナスにならないようにガード）
          const newPoints = Math.max(0, (customer.points || 0) + totalReverse);
          await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
            method: "PATCH",
            headers: H,
            body: JSON.stringify({ points: newPoints }),
          });

          // STEP F: キャンセル履歴を1件記録
          await fetch(`${DIRECTUS}/items/point_transactions`, {
            method: "POST",
            headers: H,
            body: JSON.stringify({
              customer_id: order.customer_id,
              order_id: orderId,
              type: "cancel",
              points: totalReverse,
              description: `注文#${orderId} キャンセルによる積分調整（${totalReverse > 0 ? "+" : ""}${totalReverse}pt）`,
            }),
          });

          console.log("[orders/cancel] 積分調整完了", {
            orderId,
            totalReverse,
            newPoints,
          });
        }
      } catch (e) {
        // 積分処理失敗はログのみ。キャンセル自体は続行する。
        console.error("[orders/cancel] 積分処理エラー", e);
      }
    }

    // ── 库存恢复：取消时还原 inventory 表 ──
    try {
      const orderItemsRes = await fetch(
        `${DIRECTUS}/items/order_items?filter[order_id][_eq]=${orderId}&fields=variant_id,quantity,product_id`,
        { headers: H }
      );
      const orderItemsData = await orderItemsRes.json();
      for (const item of orderItemsData.data ?? []) {
        try {
          const filterField = item.variant_id ? 'variant_id' : 'product_id';
          const filterValue = item.variant_id ?? item.product_id;
          const invRes = await fetch(
            `${DIRECTUS}/items/inventory?filter[${filterField}][_eq]=${filterValue}&limit=1`,
            { headers: H }
          );
          const invData = await invRes.json();
          const inv = invData.data?.[0];
          if (!inv) continue;
          await fetch(
            `${DIRECTUS}/items/inventory/${inv.id}`,
            {
              method: "PATCH",
              headers: H,
              body: JSON.stringify({ quantity: (inv.quantity ?? 0) + (item.quantity ?? 1) }),
            }
          );
          console.log(`[orders/cancel] inventory恢复: id=${inv.id}, quantity=${item.quantity}, new_qty=${(inv.quantity ?? 0) + (item.quantity ?? 1)}`);
        } catch (e) {
          console.error("[orders/cancel] inventory恢复错误", e);
        }
      }
    } catch (e) {
      console.error("[orders/cancel] inventory恢复流程错误", e);
    }

    // ── クーポン還元：キャンセル時にused_atをnullに戻す ──
    try {
      const orderDetailRes = await fetch(
        `${DIRECTUS}/items/orders/${orderId}?fields=coupon_code,customer_id,guest_email`,
        { headers: H }
      );
      const orderDetail = (await orderDetailRes.json()).data;
      const couponCode = orderDetail?.coupon_code;
      const orderEmail = orderDetail?.guest_email;
      const orderCustomerId = orderDetail?.customer_id;

      if (couponCode) {
        // couponのIDを取得
        const cpRes = await fetch(
          `${DIRECTUS}/items/coupons?filter[code][_eq]=${encodeURIComponent(couponCode)}&fields=id&limit=1`,
          { headers: H }
        );
        const couponId = (await cpRes.json()).data?.[0]?.id;

        if (couponId) {
          // customer_idかemailでuser_couponsを検索
          let ucFilter = `filter[coupon_id][_eq]=${couponId}&filter[used_at][_nnull]=true&limit=1`;
          if (orderCustomerId) {
            ucFilter = `filter[customer_id][_eq]=${orderCustomerId}&filter[coupon_id][_eq]=${couponId}&filter[used_at][_nnull]=true&limit=1`;
          } else if (orderEmail) {
            const cusRes = await fetch(
              `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(orderEmail)}&fields=id&limit=1`,
              { headers: H }
            );
            const cusId = (await cusRes.json()).data?.[0]?.id;
            if (cusId) ucFilter = `filter[customer_id][_eq]=${cusId}&filter[coupon_id][_eq]=${couponId}&filter[used_at][_nnull]=true&limit=1`;
          }

          const ucRes = await fetch(
            `${DIRECTUS}/items/user_coupons?${ucFilter}`,
            { headers: H }
          );
          const ucId = (await ucRes.json()).data?.[0]?.id;

          if (ucId) {
            await fetch(`${DIRECTUS}/items/user_coupons/${ucId}`, {
              method: "PATCH",
              headers: H,
              body: JSON.stringify({ used_at: null }),
            });
            console.log(`[orders/cancel] クーポン還元完了: coupon=${couponCode}, ucId=${ucId}`);
          }
        }
      }
    } catch (e) {
      console.error("[orders/cancel] クーポン還元エラー", e);
    }

    // ステータス更新
    await fetch(`${DIRECTUS}/items/orders/${orderId}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        refund_status: "pending_refund",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[orders/cancel]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
