import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export async function POST(req: NextRequest) {
  try {
    // ADMIN_TOKEN認証
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== TOKEN) {
      console.error("[points/earn] 認証失敗: 無効なトークン");
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // パラメータ検証
    const { customerId, orderId, originalTotal } = await req.json();
    if (!customerId || !orderId || originalTotal === undefined || originalTotal === null) {
      console.error("[points/earn] パラメータ不足", { customerId, orderId, originalTotal });
      return NextResponse.json({ error: "customerId, orderId, originalTotal required" }, { status: 400 });
    }

    // ステップ1: 汇率取得
    console.log(`[points/earn] 注文#${orderId} のポイント付与処理開始`);
    const rateRes = await fetch(
      `${DIRECTUS}/items/point_settings?filter[is_active][_eq]=true&limit=1&sort=-created_at`,
      { headers: H }
    );
    if (!rateRes.ok) {
      console.error("[points/earn] 汇率取得失败", rateRes.status);
      return NextResponse.json({ error: "failed to fetch rate" }, { status: 500 });
    }
    const rateData = await rateRes.json();
    const rate = rateData.data?.[0]?.rate || 100;
    console.log(`[points/earn] 汇率: ${rate}`);

    // ステップ2: 幂等校验 - 同じ注文で既にポイント付与済みかチェック
    console.log(`[points/earn] 幂等校验: orderId=${orderId} の既存記録チェック`);
    const txCheckRes = await fetch(
      `${DIRECTUS}/items/point_transactions?filter[order_id][_eq]=${orderId}&filter[type][_eq]=earn&limit=1`,
      { headers: H }
    );
    if (!txCheckRes.ok) {
      console.error("[points/earn] 幂等校验失败", txCheckRes.status);
      return NextResponse.json({ error: "failed to check transaction history" }, { status: 500 });
    }
    const txCheckData = await txCheckRes.json();
    if (txCheckData.data && txCheckData.data.length > 0) {
      console.log(`[points/earn] 重复付与防止: 注文#${orderId} は既にポイント付与済み`);
      const existingTx = txCheckData.data[0];
      return NextResponse.json({
        success: true,
        alreadyEarned: true,
        earnedPoints: existingTx.points,
        message: `注文#${orderId} は既にポイント付与済みです`
      });
    }

    // ステップ3: customerId から email を取得
    console.log(`[points/earn] customerId=${customerId} からメール取得`);
    const userRes = await fetch(`${DIRECTUS}/users/${customerId}?fields=email`, { headers: H });
    if (!userRes.ok) {
      console.error("[points/earn] ユーザー取得失败", userRes.status);
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    const userData = await userRes.json();
    const email = userData.data?.email;
    if (!email) {
      console.error("[points/earn] メールアドレス取得失败", { customerId });
      return NextResponse.json({ error: "user email not found" }, { status: 404 });
    }
    console.log(`[points/earn] メール: ${email}`);

    // ステップ4: email から customers レコードを取得
    console.log(`[points/earn] email=${email} からカスタマーレコード取得`);
    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,points&limit=1`,
      { headers: H }
    );
    if (!cusRes.ok) {
      console.error("[points/earn] カスタマー取得失败", cusRes.status);
      return NextResponse.json({ error: "failed to fetch customer" }, { status: 500 });
    }
    const cusData = await cusRes.json();
    const customer = cusData.data?.[0];
    if (!customer) {
      console.error("[points/earn] カスタマー見つからず", { email });
      return NextResponse.json({ error: "customer not found" }, { status: 404 });
    }
    console.log(`[points/earn] カスタマーID: ${customer.id}, 現在のポイント: ${customer.points || 0}`);

    // ステップ5: ポイント計算
    const earnedPoints = Math.floor(originalTotal / rate);
    console.log(`[points/earn] ポイント計算: ${originalTotal} / ${rate} = ${earnedPoints}pt`);

    if (earnedPoints <= 0) {
      console.log(`[points/earn] 獲得ポイント0以下のため付与スキップ`);
      return NextResponse.json({ success: true, earnedPoints: 0, newBalance: customer.points || 0 });
    }

    // ステップ6: customers.points 更新
    const newPoints = (customer.points || 0) + earnedPoints;
    console.log(`[points/earn] ポイント更新: ${customer.points || 0} → ${newPoints}`);
    const patchRes = await fetch(`${DIRECTUS}/items/customers/${customer.id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ points: newPoints }),
    });
    if (!patchRes.ok) {
      console.error("[points/earn] ポイント更新失败", patchRes.status);
      return NextResponse.json({ error: "failed to update points" }, { status: 500 });
    }

    // ステップ7: point_transactions に記録
    const description = `注文 #${orderId} のポイント付与`;
    console.log(`[points/earn] トランザクション記録: ${description}`);
    const txRes = await fetch(`${DIRECTUS}/items/point_transactions`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        customer_id: customerId,
        order_id: orderId,
        type: "earn",
        points: earnedPoints,
        description,
      }),
    });
    if (!txRes.ok) {
      console.error("[points/earn] トランザクション記録失败", txRes.status);
      console.error("[points/earn] 警告: ポイントは更新されましたがトランザクション記録失败");
      // ポイントは既に更新されているため、成功として返す
    }

    console.log(`[points/earn] 完了: 注文#${orderId}, 獲得ポイント: ${earnedPoints}pt, 新残高: ${newPoints}pt`);
    return NextResponse.json({
      success: true,
      earnedPoints,
      newBalance: newPoints
    });
  } catch (e) {
    console.error("[points/earn] 予期しないエラー", e);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
