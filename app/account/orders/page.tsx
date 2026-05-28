"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};


const CARRIER_LABEL: Record<string, string> = {
  yamato: "ヤマト運輸",
  sagawa: "佐川急便",
  japanpost: "日本郵便",
  fedex: "FedEx",
  dhl: "DHL",
  other: "その他",
};

const STATUS_LABEL: Record<string,{label:string,color:string,bg:string}> = {
  pending:      {label:"注文受付中",  color:"#886600", bg:"#FFF8E8"},
  payment_pending:{label:"入金待ち", color:"#886600", bg:"#FFF8E8"},
  paid:         {label:"入金確認済み",color:"#007A76", bg:"#E8F8F8"},
  processing:   {label:"準備中",     color:"#0055AA", bg:"#E8F0FF"},
  shipped:      {label:"発送済み",   color:"#0055AA", bg:"#E8F0FF"},
  delivered:    {label:"お届け済み", color:"#227700", bg:"#F0FFF0"},
  cancelled:    {label:"キャンセル", color:"#CC2200", bg:"#FFF0F0"},
  refunded:     {label:"返金済み",   color:"#555",    bg:"#F5F5F5"},
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ setMounted(true); },[]);

  useEffect(()=>{
    if (!mounted) return;
    if (!user) { router.push("/login"); return; }
    fetchOrders();
  },[mounted, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/list?email=${encodeURIComponent(user!.email)}`,
        {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setOrders(data.data || []);
    } catch(e) {
      console.error(e);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("この注文をキャンセルしますか？")) return;
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "キャンセルに失敗しました");
        return;
      }
      alert("注文をキャンセルしました");
      router.refresh();
    } catch {
      alert("エラーが発生しました");
    }
  };

  const formatDate = (dt: string) => {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString("ja-JP", {year:"numeric",month:"long",day:"numeric"});
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>


      <div style={{maxWidth:900,margin:"16px auto",padding:"0 10px 40px"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          📦 注文履歴
        </h1>

        {loading ? (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"40px",textAlign:"center",color:C.textSub}}>
            読み込み中...
          </div>
        ) : orders.length === 0 ? (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"60px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>📦</div>
            <div style={{fontSize:16,color:C.textSub,marginBottom:8}}>注文履歴はありません</div>
            <div style={{fontSize:12,color:C.textLight,marginBottom:20}}>ご注文後、こちらに履歴が表示されます</div>
            <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              商品を見る
            </button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {orders.map(order=>{
              const st = STATUS_LABEL[order.status] || {label:order.status,color:C.textSub,bg:"#F5F5F5"};
              const addr = order.shipping_address ? (typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address) : null;
              return (
                <div key={order.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden"}}>
                  {/* 注文ヘッダー */}
                  <div style={{background:"#F9F9F9",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:10,color:C.textLight}}>注文日</div>
                      <div style={{fontSize:12,fontWeight:700}}>{formatDate(order.created_at)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.textLight}}>注文番号</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.primary}}>{order.order_number}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.textLight}}>合計金額</div>
                      <div style={{fontSize:14,fontWeight:700,color:C.red}}>¥{(order.total||0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.textLight}}>お支払い方法</div>
                      <div style={{fontSize:12,fontWeight:700}}>{order.payment_method||"—"}</div>
                    </div>
                    <div style={{marginLeft:"auto"}}>
                      <span style={{background:st.bg,color:st.color,border:`1px solid ${st.color}`,borderRadius:2,padding:"4px 12px",fontSize:11,fontWeight:700}}>
                        {st.label}
                      </span>
                    </div>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-sm text-red-500 border border-red-300 rounded px-3 py-1 hover:bg-red-50 transition"
                      >
                        注文をキャンセル
                      </button>
                    )}
                  </div>

                  {/* 商品一覧 */}
                  <div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0"}}>
                    <div style={{fontSize:12,color:"#888",marginBottom:8}}>購入商品</div>
                    {(order.order_items||[]).map((item:any,i:number)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #f9f9f9"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600}}>{item.product_name}</div>
                          {item.warranty_selected&&<div style={{fontSize:11,color:"#0ABAB5",marginTop:2}}>🛡️ 無期限保障 ¥{(item.warranty_price||0).toLocaleString()}</div>}
                        </div>
                        <div style={{textAlign:"right",minWidth:120}}>
                          <div style={{fontSize:13}}>x{item.quantity}</div>
                          <div style={{fontSize:13,fontWeight:600}}>¥{(item.total_price||0).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 金額内訳 */}
                  <div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0",display:"flex",gap:32,flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:12,color:"#888",marginBottom:4}}>金額内訳</div>
                      <div style={{fontSize:12}}>小計：¥{order.subtotal?.toLocaleString()}</div>
                      {(order.warranty_total||0)>0&&<div style={{fontSize:12,color:"#0ABAB5"}}>無期限保障：¥{order.warranty_total?.toLocaleString()}</div>}
                      {(order.discount_amount||0)>0&&<div style={{fontSize:12,color:"#2e7d32"}}>割引：-¥{order.discount_amount?.toLocaleString()}</div>}
                      <div style={{fontSize:12}}>送料：{order.shipping_fee===0?"無料":"¥"+order.shipping_fee?.toLocaleString()}</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#CC2200",marginTop:4}}>合計：¥{order.total?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{fontSize:12,color:"#888",marginBottom:4}}>お届け先</div>
                      <div style={{fontSize:12}}>〒{order.shipping_address?.postalCode} {order.shipping_address?.prefecture}{order.shipping_address?.city}</div>
                      <div style={{fontSize:12}}>{order.shipping_address?.address1} {order.shipping_address?.address2||""}</div>
                    </div>
                    {order.tracking_number&&(
                      <div>
                        <div style={{fontSize:12,color:"#888",marginBottom:4}}>追跡番号</div>
                        <div style={{fontSize:12,fontWeight:600}}>{order.tracking_number}</div>
                        <div style={{fontSize:11,color:"#888"}}>{CARRIER_LABEL[order.shipping_carrier] || order.shipping_carrier}</div>
                      </div>
                    )}
                  </div>

                  {/* 請求書ボタン */}
                  <div style={{padding:"10px 16px",textAlign:"right"}}>
                    <a href={`/api/invoice/${order.order_number}`} target="_blank"
                      style={{fontSize:12,color:"#0ABAB5",textDecoration:"none",border:"1px solid #0ABAB5",padding:"4px 12px",borderRadius:4}}>
                      📄 請求書を発行
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
