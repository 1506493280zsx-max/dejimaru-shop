import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "http://13.158.171.41:8055";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    // STEP 1 — 認証校験
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== TOKEN) {
      console.error("[points/use] unauthorized");
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // STEP 2 — パラメータ受け取り与校験
    const { customerId, pointsToUse: rawPointsToUse, orderId } = await req.json();
    const pointsToUseInt = Math.floor(Number(rawPointsToUse));
    if (!customerId || !pointsToUseInt || pointsToUseInt <= 0) {
      console.error("[points/use] invalid params", { customerId, rawPointsToUse, pointsToUseInt });
      return NextResponse.json({ error: "invalid params" }, { status: 400 });
    }

    // STEP 3 — customerId からメール取得
    const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=email`, { headers: H });
    if (!userRes.ok) {
      console.error("[points/use] user not found", customerId, userRes.status);
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    const userData = await userRes.json();
    const email = userData.data?.email;
    if (!email) {
      console.error("[points/use] user not found", customerId);
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // STEP 4 — email から customers レコード取得
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
      { headers: H }
    );
    if (!cusRes.ok) {
      console.error("[points/use] failed to fetch customer", email, cusRes.status);
      return NextResponse.json({ error: "failed to fetch customer" }, { status: 500 });
    }
    const cusData = await cusRes.json();
    const customer = cusData.data?.[0];
    if (!customer) {
      console.error("[points/use] customer not found", email);
      return NextResponse.json({ error: "customer not found" }, { status: 404 });
    }

    // STEP 5 — 余額校験
    const currentPoints = customer.points || 0;
    if (currentPoints < pointsToUseInt) {
      console.error("[points/use] insufficient points", { currentPoints, pointsToUseInt });
      return NextResponse.json({
        error: "ポイント残高が不足しています",
        currentPoints,
        pointsToUse: pointsToUseInt
      }, { status: 400 });
    }

    // STEP 6 — ポイント余額を扣除
    const newPoints = currentPoints - pointsToUseInt;
    const patchRes = await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ points: newPoints }),
    });
    if (!patchRes.ok) {
      console.error("[points/use] failed to update points", customer.id, patchRes.status);
      return NextResponse.json({ error: "failed to update points" }, { status: 500 });
    }

    // STEP 7 — 積分流水を記録（失敗時も完了として返す）
    try {
      const txRes = await fetch(`${DIRECTUS}/items/point_transactions`, {
        method: "POST",
        headers: H,
        body: JSON.stringify({
          customer_id: customerId,
          order_id: orderId || null,
          type: "use",
          points: -pointsToUseInt,
          description: `注文#${orderId} ポイント使用 ${pointsToUseInt}pt → ¥${pointsToUseInt}割引`,
        }),
      });
      if (!txRes.ok) {
        console.error("[points/use] failed to write transaction", txRes.status);
        // 流水記録失敗は非致命的、積分は既に扣かっているため
      }
    } catch (e) {
      console.error("[points/use] failed to write transaction", e);
      // 流水記録失敗は非致命的、積分は既に扣かっているため
    }

    // STEP 8 — 成功応答
    const discountAmount = pointsToUseInt; // 1pt = 1円
    console.log("[points/use] done", { orderId, pointsToUseInt, remainingPoints: newPoints });
    return NextResponse.json({
      success: true,
      usedPoints: pointsToUseInt,
      discountAmount,
      remainingPoints: newPoints,
    });
  } catch (e) {
    console.error("[points/use] unexpected error", e);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
