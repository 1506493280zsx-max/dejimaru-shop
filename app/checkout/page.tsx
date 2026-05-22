"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};
const GRADE_LABEL: Record<string,string> = {NEW:"新品",S:"S品",A:"A品",B:"B品",C:"C品"};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string|null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placeError, setPlaceError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    setLoadingAddresses(true);
    fetch(`/api/address?email=${encodeURIComponent(user.email)}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const list: any[] = data.data || [];
        setAddresses(list);
        const def = list.find((a: any) => a.is_default);
        setSelectedAddressId(def ? String(def.id) : list[0] ? String(list[0].id) : null);
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, [mounted, user]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError("");
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          addressId: selectedAddressId,
          total: total(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderPlaced(true);
      } else {
        setPlaceError("注文の作成に失敗しました。もう一度お試しください。");
      }
    } catch {
      setPlaceError("通信エラーが発生しました。もう一度お試しください。");
    }
    setPlacing(false);
  };

  if (!mounted) return null;

  /* ── Order confirmed screen ── */
  if (orderPlaced) {
    return (
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text,display:"flex",flexDirection:"column"}}>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:40,textAlign:"center",maxWidth:480,width:"100%"}}>
            <div style={{fontSize:48,marginBottom:16}}>🕐</div>
            <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:12}}>ご注文を受け付けました</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:24,lineHeight:1.9}}>
              決済システムは現在準備中です。<br/>
              <strong>Payment integration pending</strong><br/>
              Stripe / PayPal 連携後に決済が完了します。
            </div>
            <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              トップページへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty cart guard ── */
  if (items.length === 0) {
    return (
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>
          <div style={{maxWidth:600,margin:"60px auto",textAlign:"center",padding:"0 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🛒</div>
          <div style={{fontSize:15,color:C.textSub,marginBottom:20}}>カートに商品がありません</div>
          <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            商品を見る
          </button>
        </div>
      </div>
    );
  }

  /* ── Checkout screen ── */
  const selectedAddress = addresses.find(a => String(a.id) === selectedAddressId) ?? null;

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      {/* Breadcrumb */}
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span>›</span>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/cart")}>カート</span>
          <span>›</span>
          <span style={{fontWeight:700}}>ご注文手続き</span>
        </div>
      </div>

      <div style={{maxWidth:1000,margin:"16px auto",padding:"0 10px 40px"}}>
        <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          📦 ご注文手続き
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16,alignItems:"flex-start"}}>

          {/* ── Left column ── */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>

            {/* Product list */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                🛒 注文商品（{count()}点）
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {items.map(item => (
                  <div key={item.id} style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:64,height:48,background:"#F5FAFA",border:`1px solid #B0E0DE`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <span style={{fontSize:22}}>💻</span>
                      }
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.text,lineHeight:1.4}}>{item.name}</div>
                      {item.grade && <div style={{fontSize:10,color:"#007A76"}}>{GRADE_LABEL[item.grade]||item.grade}</div>}
                      <div style={{fontSize:11,color:C.textSub}}>数量: {item.quantity}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.red,flexShrink:0}}>
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                📍 お届け先
              </div>
              {!user ? (
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
                  ゲストとして注文します。<br/>
                  <span style={{color:C.primary,cursor:"pointer",fontWeight:700}} onClick={()=>router.push("/login")}>ログイン</span>するとお届け先を保存できます。
                </div>
              ) : loadingAddresses ? (
                <div style={{fontSize:12,color:C.textSub}}>読み込み中...</div>
              ) : addresses.length === 0 ? (
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
                  登録されたお届け先がありません。<br/>
                  <span style={{color:C.primary,cursor:"pointer",fontWeight:700}} onClick={()=>router.push("/account/address")}>お届け先を追加する</span>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {addresses.map(addr => (
                    <label key={addr.id} style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:10,border:`1px solid ${String(selectedAddressId)===String(addr.id)?C.primary:C.border}`,borderRadius:2,background:String(selectedAddressId)===String(addr.id)?C.primaryBg:C.white}}>
                      <input
                        type="radio"
                        name="address"
                        checked={String(selectedAddressId) === String(addr.id)}
                        onChange={() => setSelectedAddressId(String(addr.id))}
                        style={{marginTop:2,accentColor:C.primary}}
                      />
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:C.text}}>{addr.name_last} {addr.name_first}</div>
                        <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
                          〒{addr.postal_code} {addr.prefecture}{addr.city}{addr.address1}{addr.address2 ? ` ${addr.address2}` : ""}<br/>
                          {addr.phone && `TEL: ${addr.phone}`}
                        </div>
                        {addr.is_default && <span style={{fontSize:10,background:C.primary,color:"#fff",padding:"1px 6px",borderRadius:2}}>デフォルト</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment placeholder */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                💳 お支払い方法
              </div>
              <div style={{background:"#FFFBF0",border:"1px solid #FFE082",borderRadius:2,padding:12,fontSize:12,color:"#7A6000",textAlign:"center"}}>
                🚧 Stripe / PayPal coming soon
              </div>
            </div>

          </div>
          {/* ── End left column ── */}

          {/* ── Right column — order summary ── */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,position:"sticky",top:10}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>ご注文内容</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
              <span style={{color:C.textSub}}>商品合計（{count()}点）</span>
              <span>¥{total().toLocaleString()}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
              <span style={{color:C.textSub}}>送料</span>
              <span style={{color:C.primary,fontWeight:700}}>無料</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:15,fontWeight:700,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
              <span>合計（税込）</span>
              <span style={{color:C.red}}>¥{total().toLocaleString()}</span>
            </div>

            {selectedAddress && (
              <div style={{background:C.primaryBg,border:`1px solid ${C.border}`,borderRadius:2,padding:10,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:4}}>お届け先</div>
                <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
                  {selectedAddress.name_last} {selectedAddress.name_first}<br/>
                  〒{selectedAddress.postal_code}<br/>
                  {selectedAddress.prefecture}{selectedAddress.city}{selectedAddress.address1}
                </div>
              </div>
            )}

            {placeError && (
              <div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:12}}>
                {placeError}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{width:"100%",background:placing?"#AAA":"#FF6600",color:"#fff",border:"none",borderRadius:2,padding:"13px",fontSize:14,fontWeight:700,cursor:placing?"not-allowed":"pointer",fontFamily:"inherit",marginBottom:8}}
            >
              {placing ? "処理中..." : "注文を確定する"}
            </button>

            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
              {["🛡️ 30日間動作保証","🚚 送料無料","🔒 安全な決済"].map(t => (
                <div key={t} style={{fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}>{t}</div>
              ))}
            </div>
          </div>
          {/* ── End right column ── */}

        </div>
      </div>
    </div>
  );
}
