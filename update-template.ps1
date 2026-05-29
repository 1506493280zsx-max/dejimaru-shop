$BASE="https://directus-production-2cfe.up.railway.app"
$TOKEN="Ef4hSkvM64d8rm7wC3WvQdjbZLJxu7nP"
$H=@{Authorization="Bearer $TOKEN";"Content-Type"="application/json;charset=utf-8"}

$subject = "【AIAcrossShop】ご注文の商品を発送しました - {{orderNumber}}"
$html = "<div style='font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;'><div style='background:#0ABAB5;padding:24px;border-radius:8px 8px 0 0;text-align:center;'><h1 style='color:#fff;margin:0;font-size:22px;'>商品を発送しました</h1></div><div style='background:#fff;border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;'><p>{{firstName}}様</p><p>ご注文の商品を発送いたしました。</p><table style='width:100%;border-collapse:collapse;margin:16px 0;'><tr style='background:#f5f5f5;'><td style='padding:8px;border:1px solid #ddd;'>注文番号</td><td style='padding:8px;border:1px solid #ddd;'>{{orderNumber}}</td></tr><tr><td style='padding:8px;border:1px solid #ddd;'>配送会社</td><td style='padding:8px;border:1px solid #ddd;'>{{shippingCarrier}}</td></tr><tr style='background:#f5f5f5;'><td style='padding:8px;border:1px solid #ddd;'>追跡番号</td><td style='padding:8px;border:1px solid #ddd;'>{{trackingNumber}}</td></tr></table><p>商品のお届けまでしばらくお待ちください。</p><p style='color:#888;font-size:12px;'>AIAcrossShop カスタマーサポート</p></div></div>"

$body = @{subject=$subject;html=$html} | ConvertTo-Json
Invoke-RestMethod "$BASE/items/email_templates/3" -Method PATCH -Headers $H -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
Write-Host "Done"
