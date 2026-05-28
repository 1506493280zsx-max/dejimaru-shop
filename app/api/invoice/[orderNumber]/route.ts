import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}` };

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const res = await fetch(
    `${DIRECTUS}/items/orders?filter[order_number][_eq]=${orderNumber}&fields=*,order_items.*&limit=1`,
    { headers: H }
  );
  const order = (await res.json()).data?.[0];
  if (!order) return NextResponse.json({ error: "注文が見つかりません" }, { status: 404 });

  const addr = order.shipping_address || {};
  const customerName = `${addr.lastName || ""}${addr.firstName || ""}`.trim() || "お客様";
  const address = `〒${addr.postalCode || ""} ${addr.prefecture || ""}${addr.city || ""}${addr.address1 || ""}${addr.address2 ? " " + addr.address2 : ""}`;
  const phone = addr.phone || "";
  const issueDate = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const invoiceNumber = `INV-${orderNumber}`;

  const itemRows = (order.order_items || []).map((item: any) => {
    const productTotal = item.unit_price * item.quantity;
    const warrantyTotal = item.warranty_selected ? (item.warranty_price || 0) * item.quantity : 0;
    return `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;">${item.product_name || ""}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">¥${productTotal.toLocaleString("ja-JP")}</td>
    </tr>
    ${item.warranty_selected ? `
    <tr>
      <td style="padding:4px 10px 10px 20px;border-bottom:1px solid #eee;color:#0ABAB5;font-size:13px;">🛡️ プレミアム終身保証</td>
      <td style="padding:4px 10px 10px;border-bottom:1px solid #eee;text-align:center;font-size:13px;">${item.quantity}</td>
      <td style="padding:4px 10px 10px;border-bottom:1px solid #eee;text-align:right;font-size:13px;">¥${warrantyTotal.toLocaleString("ja-JP")}</td>
    </tr>` : ""}`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>適格請求書 ${invoiceNumber}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Hiragino Sans","Yu Gothic",sans-serif;color:#333;padding:40px;max-width:800px;margin:0 auto;}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;border-bottom:3px solid #0ABAB5;padding-bottom:20px;}
.title{font-size:28px;font-weight:bold;color:#0ABAB5;}
.invoice-info{text-align:right;font-size:13px;line-height:1.8;}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:30px;}
.party h3{font-size:12px;color:#888;margin-bottom:8px;border-bottom:1px solid #eee;padding-bottom:4px;}
.party p{font-size:13px;line-height:1.8;}
.total-box{background:#f0fafa;border:2px solid #0ABAB5;border-radius:8px;padding:16px 24px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:center;}
.total-box .label{font-size:16px;}
.total-box .amount{font-size:28px;font-weight:bold;color:#CC2200;}
table{width:100%;border-collapse:collapse;margin-bottom:30px;}
thead tr{background:#0ABAB5;color:white;}
thead td{padding:10px;font-size:13px;}
.stamp-area{display:flex;justify-content:flex-end;margin-top:20px;}
.stamp{width:80px;height:80px;border:2px solid #cc0000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#cc0000;font-size:11px;text-align:center;line-height:1.4;}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#888;text-align:center;}
.cancel-notice{background:#fee;border:2px solid #cc0000;border-radius:8px;padding:20px;text-align:center;font-size:18px;color:#cc0000;margin-bottom:30px;}
@media print{body{padding:20px;}button{display:none;}}
</style>
</head>
<body>
<div class="header">
  <div class="title">適格請求書</div>
  <div class="invoice-info">
    <div>請求書番号：${invoiceNumber}</div>
    <div>発行日：${issueDate}</div>
    <div>注文番号：${orderNumber}</div>
    <div>注文日：${new Date(order.created_at).toLocaleDateString("ja-JP")}</div>
  </div>
</div>
${order.status === "cancelled" ? `<div class="cancel-notice">⚠️ この注文はキャンセルされました。この請求書は無効です。</div>` : ""}
<div class="parties">
  <div class="party">
    <h3>請求先</h3>
    <p><strong>${customerName}</strong> 様</p>
    <p>${address}</p>
    ${phone ? `<p>TEL: ${phone}</p>` : ""}
    ${order.guest_email ? `<p>${order.guest_email}</p>` : ""}
  </div>
  <div class="party">
    <h3>発行者</h3>
    <p><strong>AI Across合同会社</strong></p>
    <p>〒306-0052 茨城県古河市大山1331-2</p>
    <p>TEL: 048-816-3967</p>
    <p>登録番号：T5030003019773</p>
  </div>
</div>
<div class="total-box">
  <span class="label">合計金額（税込）</span>
  <span class="amount">¥${(order.total || 0).toLocaleString("ja-JP")}</span>
</div>
<table>
  <thead><tr>
    <td style="width:60%;">商品名</td>
    <td style="width:15%;text-align:center;">数量</td>
    <td style="width:25%;text-align:right;">金額（税込）</td>
  </tr></thead>
  <tbody>
    ${itemRows}
    ${(order.shipping_fee || 0) > 0 ? `<tr><td style="padding:10px;border-bottom:1px solid #eee;">送料</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">-</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">¥${order.shipping_fee.toLocaleString("ja-JP")}</td></tr>` : ""}
    ${(order.discount_amount || 0) > 0 ? `<tr><td style="padding:10px;border-bottom:1px solid #eee;color:#2e7d32;">クーポン割引</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">-</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:right;color:#2e7d32;">-¥${order.discount_amount.toLocaleString("ja-JP")}</td></tr>` : ""}
  </tbody>
</table>
<div class="stamp-area">
  <div class="stamp">AI Across<br>合同会社<br>代表印</div>
</div>
<div style="text-align:center;margin-top:20px;">
  <button onclick="window.print()" style="background:#0ABAB5;color:white;border:none;padding:12px 32px;border-radius:4px;font-size:16px;cursor:pointer;">🖨️ PDFとして印刷・保存</button>
</div>
<div class="footer">
  <p>AI Across合同会社｜〒306-0052 茨城県古河市大山1331-2｜TEL: 048-816-3967</p>
  <p>適格請求書発行事業者 登録番号：T5030003019773</p>
  <p>※ 本請求書の金額はすべて消費税込みです。</p>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
