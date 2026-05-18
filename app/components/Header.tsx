"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", white:"#FFF",
};

export default function Header() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { count } = useCartStore();
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = () => {
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    clearAuth();
    setShowMenu(false);
    router.push("/");
  };

  const cartCount = mounted ? count() : 0;
  const initials = user ? `${user.last_name?.[0] || ""}${user.first_name?.[0] || ""}`.toUpperCase() : "";

  return (
    <>
      <div style={{background:"#FFF0F0",borderBottom:"1px solid #E0B0B0",padding:"5px 0",textAlign:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 10px",fontSize:11,color:C.red}}>
          【重要】Microsoftメール（Hotmail、Outlook等）をご利用のお客様へ →
          <span style={{textDecoration:"underline",cursor:"pointer"}}> 詳細はこちら</span>
        </div>
      </div>

      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flexShrink:0,cursor:"pointer"}} onClick={()=>router.push("/")}>
              <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",lineHeight:1,fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
              <div style={{fontSize:9,color:C.textLight}}>中古PC・スマホならデジマルショップ！</div>
            </div>
            <div style={{flex:1,display:"flex",maxWidth:500}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSearch()}
                placeholder="商品名・型番・キーワードで検索"
                style={{flex:1,border:`2px solid ${C.primary}`,borderRight:"none",padding:"7px 10px",fontSize:13,outline:"none",borderRadius:"2px 0 0 2px",fontFamily:"inherit"}}/>
              <button onClick={handleSearch} style={{background:C.primary,color:"#fff",border:`2px solid ${C.primary}`,padding:"7px 18px",fontSize:13,fontWeight:700,cursor:"pointer",borderRadius:"0 2px 2px 0",fontFamily:"inherit"}}>検索</button>
            </div>
            <div style={{fontSize:11,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:9,color:C.textLight}}>価格.com評価</div>
              <div style={{fontSize:13,fontWeight:900,color:C.primary}}>★★★★☆ 97%</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0,alignItems:"center"}}>
              {mounted && user ? (
                <div style={{position:"relative"}}>
                  <div onClick={()=>setShowMenu(!showMenu)}
                    style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"6px 10px",borderRadius:2,border:`1px solid ${C.primary}`,background:C.primaryBg}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>
                      {initials||"👤"}
                    </div>
                    <div style={{fontSize:11}}>
                      <div style={{fontWeight:700,color:C.primary}}>{user.last_name} {user.first_name}</div>
                      <div style={{fontSize:9,color:C.textLight}}>マイアカウント ▼</div>
                    </div>
                  </div>
                  {showMenu&&(
                    <div style={{position:"absolute",top:"100%",right:0,marginTop:4,background:C.white,border:`1px solid ${C.border}`,borderRadius:2,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",zIndex:100,minWidth:160}}>
                      <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.border}`,fontSize:11,color:C.textLight}}>{user.email}</div>
                      {[
                        {label:"🏠 マイページ",path:"/account"},
                        {label:"📦 注文履歴",path:"/account/orders"},
                        {label:"❤️ お気に入り",path:"/account/wishlist"},
                      ].map(item=>(
                        <div key={item.path} onClick={()=>{router.push(item.path);setShowMenu(false);}}
                          style={{padding:"9px 14px",fontSize:12,color:C.text,cursor:"pointer",borderBottom:"1px solid #F5F5F5"}}
                          onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                          onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                          {item.label}
                        </div>
                      ))}
                      <div onClick={handleLogout}
                        style={{padding:"9px 14px",fontSize:12,color:C.red,cursor:"pointer",fontWeight:700}}
                        onMouseEnter={e=>(e.currentTarget.style.background="#FFF0F0")}
                        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                        🚪 ログアウト
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={()=>router.push("/login")} style={{background:"#4488CC",color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>👤 会員登録</button>
                  <button onClick={()=>router.push("/login")} style={{background:"#44AA44",color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>🔑 ログイン</button>
                </>
              )}
              <button onClick={()=>router.push("/cart")}
                style={{background:C.red,color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",position:"relative",display:"flex",alignItems:"center",gap:4}}>
                🛒 カート
                {cartCount>0&&<span style={{background:"#FFE000",color:"#333",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:900}}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex"}}>
          {[
            {label:"🏠 ホーム",path:"/"},
            {label:"📋 ショッピングガイド",path:"/guide"},
            {label:"🚚 送料・配送について",path:"/guide"},
            {label:"❓ よくあるご質問",path:"/faq"},
            {label:"🏢 会社概要",path:"/company"},
            {label:"📞 お問い合わせ",path:"/contact"},
          ].map((item,i)=>(
            <div key={i} onClick={()=>router.push(item.path)}
              style={{padding:"7px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",borderRight:`1px solid ${C.primaryDark}`,whiteSpace:"nowrap"}}
              onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {showMenu&&<div onClick={()=>setShowMenu(false)} style={{position:"fixed",inset:0,zIndex:99}}/>}
    </>
  );
}