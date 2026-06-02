"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();
  const { count: cartCount } = useCartStore();
  const { count: wishCount } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [pointBalance, setPointBalance] = useState(0);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [notices, setNotices] = useState<{date:string, text:string, slug:string}[]>([]);
  useEffect(()=>setMounted(true),[]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/points/balance?customerId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setPointBalance(d.points || 0))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/orders/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setOrderCount((d.data || []).length))
      .catch(() => {});
  }, [user, token]);

  useEffect(() => {
    fetch("https://directus-production-2cfe.up.railway.app/items/Blog_Posts?sort=-date_published&limit=3&fields=title,date_published,date_created,slug&filter[status][_eq]=published")
      .then(r => r.json())
      .then(d => {
        const posts = (d.data || []).map((p: any) => ({
          date: p.date_published ? new Date(p.date_published).toLocaleDateString("ja-JP", {year:"numeric",month:"2-digit",day:"2-digit"}).replace(/\//g,".") : p.date_created ? new Date(p.date_created).toLocaleDateString("ja-JP", {year:"numeric",month:"2-digit",day:"2-digit"}).replace(/\//g,".") : "—",
          text: p.title || "",
          slug: p.slug || "",
        }));
        setNotices(posts);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (mounted && !user) {
    return (
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13}}>
        <div style={{maxWidth:500,margin:"60px auto",padding:"0 10px",textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:8}}>ログインが必要です</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:20}}>マイページをご利用いただくにはログインが必要です</div>
          <button onClick={()=>router.push("/login")} style={{background:C.primary,color:"#fff",border:"none",padding:"12px 32px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            ログイン / 新規登録
          </button>
        </div>
      </div>
    );
  }

  const MENU_ITEMS = [
    {title:"注文履歴",sub:"過去のご注文を確認できます",path:"/account/orders",badge:null},
    {title:"お気に入りリスト",sub:"気になる商品をチェック",path:"/account/wishlist",badge:mounted?wishCount():null},
    {title:"カート",sub:"現在のカートを確認",path:"/cart",badge:mounted?cartCount():null},
    {title:"会員情報の変更",sub:"お名前・メールアドレスの変更",path:"/account/profile",badge:null},
    {title:"パスワードの変更",sub:"パスワードを変更する",path:"/account/password",badge:null},
    {title:"お届け先の管理",sub:"配送先住所を登録・変更",path:"/account/address",badge:null},
    {title:"🎫 マイクーポン",sub:"保有クーポンを確認",path:"/account/coupons",badge:null},
    {title:"🎯 ポイント履歴",sub:"ポイント獲得・使用履歴",path:"/account/points",badge:null},
  ];

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>


      <div style={{maxWidth:900,margin:"16px auto",padding:"0 10px 40px"}}>

        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,flexShrink:0}}>
            {user?.last_name?.[0]||user?.first_name?.[0]||"？"}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700,color:C.text}}>{user?.last_name} {user?.first_name} 様</div>
            <div style={{fontSize:12,color:C.textSub,marginTop:4}}>{user?.email}</div>
            <div style={{fontSize:11,color:C.primary,marginTop:4}}>会員登録済み</div>
          </div>
          <button onClick={handleLogout}
            style={{background:"#fff",color:C.textSub,border:`1px solid ${C.border}`,padding:"8px 16px",borderRadius:2,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            ログアウト
          </button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {label:"カート",value:mounted?cartCount():0,unit:"点",path:"/cart",color:C.red},
            {label:"お気に入り",value:mounted?wishCount():0,unit:"件",path:"/account/wishlist",color:C.red},
            {label:"注文履歴",value:mounted && orderCount !== null ? orderCount : "—",unit:"件",path:"/account/orders",color:C.primary},
          ].map((s,i)=>(
            <div key={i} onClick={()=>router.push(s.path)}
              style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${s.color}`,borderRadius:"0 0 2px 2px",padding:16,textAlign:"center",cursor:"pointer"}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor=s.color)}
              onMouseLeave={e=>(e.currentTarget.style.borderColor=C.border)}>
              <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.value}<span style={{fontSize:12}}>{s.unit}</span></div>
              <div style={{fontSize:11,color:C.textSub,marginTop:4}}>{s.label}</div>
            </div>
          ))}
          <div style={{background:"#f0fafa",border:"1px solid #0ABAB5",borderRadius:8,padding:16,textAlign:"center",cursor:"pointer"}}
            onClick={()=>router.push("/account/points")}>
            <div style={{fontSize:24,fontWeight:700,color:"#0ABAB5"}}>{pointBalance.toLocaleString()}</div>
            <div style={{fontSize:12,color:"#888",marginTop:4}}>ポイント残高</div>
          </div>
        </div>

        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden",marginBottom:16}}>
          <div style={{background:C.primary,color:"#fff",padding:"8px 16px",fontSize:13,fontWeight:700}}>
            マイメニュー
          </div>
          {MENU_ITEMS.map((item,i)=>(
            <div key={i} onClick={()=>router.push(item.path)}
              style={{padding:"14px 16px",borderBottom:i<MENU_ITEMS.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}
              onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
              onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:8}}>
                  {item.title}
                  {item.badge !== null && item.badge > 0 && (
                    <span style={{background:C.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:900}}>{item.badge}</span>
                  )}
                </div>
                <div style={{fontSize:11,color:C.textSub,marginTop:2}}>{item.sub}</div>
              </div>
              <span style={{color:C.primary,fontSize:14}}>▶</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
