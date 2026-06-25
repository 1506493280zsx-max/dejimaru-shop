"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { authFetch } from "@/lib/auth-fetch";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};
const GRADE_LABEL: Record<string,string> = {NEW:"新品",A:"中古Aランク",B:"中古Bランク",C:"中古Cランク"};

const inp: React.CSSProperties = {
  border:"1px solid #DDD", borderRadius:2, padding:"5px 8px",
  fontSize:12, fontFamily:"inherit", outline:"none",
  width:"100%", boxSizing:"border-box",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, productTotal, warrantyTotal, count, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  // ── 既存 state ──────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string|null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // ── 住所入力（ゲスト用） ─────────────────────────────────────
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [postalError, setPostalError] = useState("");

  // ── 送料 state ───────────────────────────────────────────────
  const [shippingFee, setShippingFee] = useState(0);
  const [freeThreshold, setFreeThreshold] = useState(10000);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  // ── クーポン state ────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // ポイント関連
  const [pointBalance, setPointBalance] = useState(0);
  const [pointRate, setPointRate] = useState(100);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [myCoupons, setMyCoupons] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    authFetch(`/api/coupons/my`)
      .then(r => r.json())
      .then(d => {
        const available = (d.data || []).filter((c: any) =>
          c.status === "available" && !c.used_at
        );
        setMyCoupons(available);
      });
  }, [user?.email]);

  // ポイント残高取得（ログイン済みのみ）
  useEffect(() => {
    if (!user?.id) return;
    authFetch(`/api/points/balance?customerId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        setPointBalance(d.points || 0);
        setPointRate(d.rate || 100);
      })
      .catch(() => {});
  }, [user]);

  // ── 既存 effects ─────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    setLoadingAddresses(true);
    authFetch(`/api/address`, { cache: "no-store" })
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

  // ── 郵便番号 → 住所自動補完（400ms debounce） ───────────────
  useEffect(() => {
    const clean = postalCode.replace(/-/g, "");
    if (clean.length !== 7) return;
    const timer = setTimeout(async () => {
      setPostalLoading(true);
      setPostalError("");
      try {
        const res = await fetch("/api/postal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postalCode: clean }),
        });
        if (!res.ok) { setPostalError("住所が見つかりませんでした"); return; }
        const data = await res.json();
        if (data.error) { setPostalError("住所が見つかりませんでした"); return; }
        setPrefecture(data.prefecture ?? "");
        setCity(data.city ?? "");
        setAddress1(data.address1 ?? "");
      } catch { setPostalError("検索に失敗しました"); }
      finally { setPostalLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [postalCode]);

  // ── 送料計算（300ms debounce） ────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const addr = addresses.find(a => String(a.id) === selectedAddressId) ?? null;
    const pref = (user && addr) ? addr.prefecture : prefecture;
    if (!pref) return;
    const productSubtotal = productTotal();
    const timer = setTimeout(async () => {
      setShippingLoading(true);
      try {
        const res = await fetch("/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subtotal: productSubtotal, prefecture: pref }),
        });
        if (!res.ok) return;
        const d = await res.json();
        if (d.error) return;
        setShippingFee(d.shippingFee ?? 0);
        setFreeThreshold(d.freeShippingThreshold ?? 10000);
        setIsFreeShipping(d.isFreeShipping ?? false);
      } catch {}
      finally { setShippingLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [mounted, selectedAddressId, prefecture, items]);

  // ── クーポン適用 ─────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await authFetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartItems: items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      setCouponResult(data);
    } catch {
      setCouponResult({ valid: false, discountAmount: 0, message: "エラーが発生しました" });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleApplyPoints = () => {
    const usable = Math.min(pointBalance, grandTotal);
    setPointsToUse(usable);
    setPointsDiscount(usable);
  };

  const handleClearPoints = () => {
    setPointsToUse(0);
    setPointsDiscount(0);
  };

  // ── 注文確定 ─────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError("");
    try {
      const productSub  = productTotal();
      const warrantySub = warrantyTotal();
      const discount    = couponResult?.valid ? couponResult.discountAmount : 0;
      const grand       = Math.max(0, productSub + warrantySub + shippingFee - discount - pointsDiscount);
      const addr = addresses.find(a => String(a.id) === selectedAddressId) ?? null;
      const sa = user && addr
        ? { lastName: addr.name_last ?? "", firstName: addr.name_first ?? "", phone: addr.phone ?? "", postalCode: addr.postal_code, prefecture: addr.prefecture, city: addr.city, address1: addr.address1, address2: addr.address2 ?? "" }
        : !user && prefecture
        ? { lastName, firstName, phone, postalCode, prefecture, city, address1, address2 }
        : null;

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email:            user?.email ?? guestEmail,
          customerId:       user?.id || null,
          subtotal:         productSub,
          warrantySubtotal: warrantySub,
          shippingFee,
          total:            grand,
          shippingAddress:  sa,
          couponCode:       couponResult?.valid ? couponCode : undefined,
          discountAmount:   couponResult?.valid ? couponResult.discountAmount : 0,
          points_used:      pointsToUse,
          points_discount:  pointsDiscount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // SB Paymentへ遷移
        const payRes = await fetch("/api/payment/sbps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            amount: grand,
            itemName: items.map(i => i.name).join(", "),
            custCode: user?.id ? String(user.id) : null,
          }),
        });
        const payData = await payRes.json();
        const form = document.createElement("form");
        form.method = "POST";
        form.acceptCharset = "Shift_JIS";
        form.action = payData.paymentUrl;
        Object.entries(payData.params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        clearCart();
        document.body.appendChild(form);
        form.submit();
        return;
      } else {
        setPlaceError(data.error ?? "注文処理に失敗しました。もう一度お試しください。");
      }
    } catch {
      setPlaceError("通信エラーが発生しました。もう一度お試しください。");
    }
    setPlacing(false);
  };

  if (!mounted) return null;

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
  const selectedAddress  = addresses.find(a => String(a.id) === selectedAddressId) ?? null;
  const productSubtotal  = productTotal();
  const warrantySubtotal = warrantyTotal();
  const discount         = couponResult?.valid ? couponResult.discountAmount : 0;
  const grandTotal       = Math.max(0, productSubtotal + warrantySubtotal + shippingFee - discount - pointsDiscount);
  const remaining        = Math.max(0, freeThreshold - productSubtotal);

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
                    <div style={{width:64,height:48,background:"#F5FAFA",border:"1px solid #B0E0DE",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <span style={{fontSize:22}}>💻</span>
                      }
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.text,lineHeight:1.4}}>{item.name}</div>
                      {item.grade && <div style={{fontSize:10,color:"#007A76"}}>{GRADE_LABEL[item.grade]||item.grade}</div>}
                      <div style={{fontSize:11,color:C.textSub}}>数量: {item.quantity}</div>
                      {item.warrantySelected && (
                        <div style={{fontSize:10,color:C.primary,fontWeight:700}}>
                          無期限保障 +¥{item.warrantyPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.red,flexShrink:0}}>
                      ¥{((item.price + item.warrantyPrice) * item.quantity).toLocaleString()}
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
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
                    ゲストとして注文します。
                    <span style={{color:C.primary,cursor:"pointer",fontWeight:700,marginLeft:4}} onClick={()=>router.push("/login")}>ログイン</span>
                    するとお届け先を保存できます。
                  </div>
                  {/* メールアドレス */}
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e=>setGuestEmail(e.target.value)}
                    placeholder="メールアドレス（注文確認に使用）"
                    style={inp}
                  />
                  {/* 姓名・電話番号 */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="姓"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="border rounded px-3 py-2 text-sm w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="名"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="border rounded px-3 py-2 text-sm w-full"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="電話番号"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full"
                    required
                  />
                  {/* 郵便番号 */}
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,whiteSpace:"nowrap",color:C.textSub}}>〒</span>
                    <input
                      value={postalCode}
                      onChange={e=>setPostalCode(e.target.value.replace(/[^\d-]/g,""))}
                      placeholder="1500042"
                      maxLength={8}
                      style={{...inp, width:110}}
                    />
                    {postalLoading && <span style={{fontSize:11,color:C.textSub}}>検索中…</span>}
                  </div>
                  {postalError && <div style={{fontSize:11,color:C.red}}>{postalError}</div>}
                  {/* 都道府県 / 市区町村 */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <input value={prefecture} readOnly placeholder="都道府県（自動入力）"
                      style={{...inp, background:"#F5F5F5"}}/>
                    <input value={city} onChange={e=>setCity(e.target.value)} placeholder="市区町村"
                      style={inp}/>
                  </div>
                  {/* 番地 */}
                  <input value={address1} onChange={e=>setAddress1(e.target.value)} placeholder="番地" style={inp}/>
                  {/* 建物 */}
                  <input value={address2} onChange={e=>setAddress2(e.target.value)} placeholder="建物名・部屋番号（任意）" style={inp}/>
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
                      <input type="radio" name="address"
                        checked={String(selectedAddressId)===String(addr.id)}
                        onChange={()=>setSelectedAddressId(String(addr.id))}
                        style={{marginTop:2,accentColor:C.primary}}/>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:C.text}}>{addr.name_last} {addr.name_first}</div>
                        <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
                          〒{addr.postal_code} {addr.prefecture}{addr.city}{addr.address1}{addr.address2?` ${addr.address2}`:""}<br/>
                          {addr.phone&&`TEL: ${addr.phone}`}
                        </div>
                        {addr.is_default&&<span style={{fontSize:10,background:C.primary,color:"#fff",padding:"1px 6px",borderRadius:2}}>デフォルト</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {myCoupons.length > 0 && (
              <div style={{ background: "#E8F8F8", borderRadius: 8, padding: 12, marginTop: 12 }}>
                <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>🎫 利用できるクーポン</p>
                {myCoupons.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #B0E0DE", borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#CC2200", margin: 0 }}>
                        {item.coupon?.discount_type === "percent" ? `${item.coupon.discount_value}% OFF` : `¥${item.coupon?.discount_value?.toLocaleString()} OFF`}
                      </p>
                      {item.coupon?.description && <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0" }}>{item.coupon.description}</p>}
                      {item.coupon?.expires_at && <p style={{ fontSize: 11, color: item.daysLeft <= 3 ? "#CC2200" : "#999", margin: "2px 0 0" }}>有効期限：{new Date(item.coupon.expires_at).toLocaleDateString("ja-JP")}（あと{item.daysLeft}日）</p>}
                    </div>
                    <button
                      onClick={async () => {
                        setCouponCode(item.coupon.code);
                        setCouponResult(null);
                        setCouponLoading(true);
                        try {
                          const res = await authFetch("/api/coupons/validate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              code: item.coupon.code,
                              cartItems: items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity })),
                            }),
                          });
                          const data = await res.json();
                          setCouponResult(data);
                        } finally {
                          setCouponLoading(false);
                        }
                      }}
                      style={{ padding: "4px 12px", background: couponResult?.valid && couponCode === item.coupon.code ? "#999" : "#0ABAB5", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {couponResult?.valid && couponCode === item.coupon.code ? "適用中✅" : "使う"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {user && pointBalance > 0 && (
              <div style={{background:"#f0fafa",border:"1px solid #0ABAB5",borderRadius:8,padding:16,marginTop:8}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:8,color:"#333"}}>
                  🎯 保有ポイントを使う
                </div>
                <div style={{fontSize:12,color:"#888",marginBottom:12}}>
                  現在の保有ポイント：
                  <span style={{color:"#0ABAB5",fontWeight:700}}>{pointBalance.toLocaleString()}pt</span>
                  （1pt = 1円で使用可能）
                </div>
                <div style={{fontSize:12,color:"#555",marginBottom:12}}>
                  この注文で獲得予定：
                  <span style={{color:"#0ABAB5",fontWeight:700}}>
                    {Math.floor(productSubtotal / pointRate).toLocaleString()}pt
                  </span>
                  <span style={{fontSize:11,color:"#888",marginLeft:6}}>
                    （商品合計¥{productSubtotal.toLocaleString()}基準）
                  </span>
                </div>
                {pointsToUse === 0 ? (
                  <button
                    onClick={handleApplyPoints}
                    style={{background:"#0ABAB5",color:"#fff",border:"none",padding:"8px 20px",
                      borderRadius:4,fontSize:13,cursor:"pointer",fontWeight:700}}
                  >
                    全部使う（{Math.min(pointBalance, grandTotal).toLocaleString()}円引き）
                  </button>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:13,color:"#2e7d32",fontWeight:700}}>
                      {pointsToUse.toLocaleString()}pt使用 → {pointsDiscount.toLocaleString()}円引き
                    </span>
                    <button
                      onClick={handleClearPoints}
                      style={{background:"none",border:"1px solid #ccc",padding:"4px 12px",
                        borderRadius:4,fontSize:12,cursor:"pointer",color:"#666"}}
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment placeholder */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                💳 お支払い方法
              </div>
              <div style={{background:"#F0F8FF",border:"1px solid #B0D0F0",borderRadius:2,padding:12,fontSize:12,color:"#333"}}>
                <div style={{fontWeight:700,marginBottom:6}}>💳 クレジットカード決済</div>
                <div style={{color:"#666",fontSize:11,lineHeight:1.8}}>
                  VISA / MasterCard / JCB / AMEX / Diners<br/>
                  「注文を確定する」ボタンを押すと決済画面へ移動します
                </div>
              </div>
            </div>

          </div>
          {/* ── End left column ── */}

          {/* ── Right column — order summary ── */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,position:"sticky",top:10}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>ご注文内容</div>

            {/* 商品小計 */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
              <span style={{color:C.textSub}}>商品小計（{count()}点）</span>
              <span>¥{productSubtotal.toLocaleString()}</span>
            </div>

            {/* 無期限保障 */}
            {warrantySubtotal > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
                <span style={{color:C.textSub}}>無期限保障</span>
                <span style={{color:C.primary,fontWeight:700}}>+¥{warrantySubtotal.toLocaleString()}</span>
              </div>
            )}

            {/* 送料 */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
              <span style={{color:C.textSub}}>送料</span>
              <span style={{color:isFreeShipping?C.primary:C.text, fontWeight:isFreeShipping?700:400}}>
                {shippingLoading ? "計算中…" : isFreeShipping ? "送料無料" : `¥${shippingFee.toLocaleString()}`}
              </span>
            </div>

            {/* 免送まであと */}
            {!isFreeShipping && remaining > 0 && !shippingLoading && (
              <div style={{fontSize:10,color:C.textSub,marginBottom:8,textAlign:"right"}}>
                あと¥{remaining.toLocaleString()}で送料無料
              </div>
            )}

            {/* クーポン割引 */}
            {couponResult?.valid && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#2e7d32", fontWeight: 500 }}>
                <span>クーポン割引</span>
                <span>-¥{couponResult.discountAmount.toLocaleString()}</span>
              </div>
            )}

            {pointsDiscount > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#2e7d32"}}>
                <span>ポイント割引（{pointsToUse.toLocaleString()}pt）</span>
                <span>-¥{pointsDiscount.toLocaleString()}</span>
              </div>
            )}

            {/* 合計 */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:15,fontWeight:700,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
              <span>合計（税込）</span>
              <span style={{color:C.red}}>¥{grandTotal.toLocaleString()}</span>
            </div>

            {user && (
              <div style={{background:"#f0fafa",border:"1px solid #0ABAB5",borderRadius:6,padding:"10px 14px",marginTop:8,fontSize:13}}>
                この注文で <strong style={{color:"#0ABAB5"}}>{Math.floor(productSubtotal / pointRate).toLocaleString()}pt</strong> 獲得予定
                <div style={{fontSize:11,color:"#888",marginTop:2}}>発送後にポイントが付与されます</div>
              </div>
            )}

            {/* お届け先サマリー（ログイン済み） */}
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

            {/* お届け先サマリー（ゲスト） */}
            {!user && prefecture && (
              <div style={{background:C.primaryBg,border:`1px solid ${C.border}`,borderRadius:2,padding:10,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:4}}>お届け先</div>
                <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
                  〒{postalCode}<br/>
                  {prefecture}{city}{address1}{address2?` ${address2}`:""}
                </div>
              </div>
            )}

            {placeError && (
              <div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:12}}>
                {placeError}
              </div>
            )}

            <button onClick={handlePlaceOrder} disabled={placing}
              style={{width:"100%",background:placing?"#AAA":"#FF6600",color:"#fff",border:"none",borderRadius:2,padding:"13px",fontSize:14,fontWeight:700,cursor:placing?"not-allowed":"pointer",fontFamily:"inherit",marginBottom:8}}>
              {placing ? "処理中..." : "注文を確定する"}
            </button>

            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
              {["🛡️ 30日間動作保証","🚚 送料について","🔒 安全な決済"].map(t => (
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
