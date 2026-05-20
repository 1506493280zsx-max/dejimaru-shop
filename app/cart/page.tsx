"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};
const GRADE_LABEL: Record<string,string> = {NEW:"新品",S:"S品",A:"A品",B:"B品",C:"C品"};

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, total, count, clearCart } = useCartStore();
  const { user } = useAuthStore();

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      {/* Header */}
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{cursor:"pointer"}} onClick={()=>router.push("/")}>
            <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
          </div>
          <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
            <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🏠 ホーム</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 10px",fontSize:11,color:"#fff"}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span style={{margin:"0 6px"}}>›</span>
          <span style={{fontWeight:700}}>ショッピングカート</span>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"12px auto",padding:"0 10px"}}>
        <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          🛒 ショッピングカート
          <span style={{fontSize:13,fontWeight:400,color:C.textSub}}>（{count()}点）</span>
        </div>

        {items.length===0?(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"60px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🛒</div>
            <div style={{fontSize:16,color:C.textSub,marginBottom:8}}>カートに商品がありません</div>
            <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>
              商品を見る
            </button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:12,alignItems:"flex-start"}}>

            {/* Cart items */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {items.map(item=>(
                <div key={item.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:12,display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:80,height:60,background:"#F5FAFA",border:`1px solid #B0E0DE`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                    {item.imageUrl
                      ?<img src={item.imageUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:28}}>💻</span>
                    }
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:C.textLight,marginBottom:2}}>{item.brand}</div>
                    <div style={{fontSize:12,fontWeight:600,color:C.text,lineHeight:1.4,cursor:"pointer"}}
                      onClick={()=>router.push(`/products/${item.slug}`)}>{item.name}</div>
                    {item.grade&&<div style={{fontSize:10,color:"#007A76",marginTop:2}}>{GRADE_LABEL[item.grade]||item.grade}</div>}
                    <div style={{fontSize:14,fontWeight:700,color:C.red,marginTop:4}}>¥{item.price.toLocaleString()}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.border}`,borderRadius:2}}>
                      <button onClick={()=>updateQty(item.id,item.quantity-1)} style={{width:28,height:28,background:"#F5F5F5",border:"none",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>－</button>
                      <div style={{width:36,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>{item.quantity}</div>
                      <button onClick={()=>updateQty(item.id,item.quantity+1)} style={{width:28,height:28,background:"#F5F5F5",border:"none",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>＋</button>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.text,minWidth:80,textAlign:"right"}}>
                      ¥{(item.price*item.quantity).toLocaleString()}
                    </div>
                    <button onClick={()=>removeItem(item.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:2,padding:"4px 8px",fontSize:11,color:C.textSub,cursor:"pointer",fontFamily:"inherit"}}>削除</button>
                  </div>
                </div>
              ))}
              <div style={{textAlign:"right"}}>
                <button onClick={clearCart} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:2,padding:"6px 14px",fontSize:11,color:C.textSub,cursor:"pointer",fontFamily:"inherit"}}>カートを空にする</button>
              </div>
            </div>

            {/* Summary */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,position:"sticky",top:10}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>ご注文内容</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
                <span style={{color:C.textSub}}>商品合計（{count()}点）</span>
                <span>¥{total().toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
                <span style={{color:C.textSub}}>送料</span>
                <span style={{color:C.primary,fontWeight:700}}>無料</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:16,fontWeight:700,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                <span>合計（税込）</span>
                <span style={{color:C.red}}>¥{total().toLocaleString()}</span>
              </div>

              {user?(
                <button onClick={()=>router.push("/checkout")} style={{width:"100%",background:"#FF6600",color:"#fff",border:"none",borderRadius:2,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
                  ご注文手続きへ →
                </button>
              ):(
                <>
                  <button onClick={()=>router.push("/login")} style={{width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
                    ログインして注文する
                  </button>
                  <button onClick={()=>router.push("/checkout")} style={{width:"100%",background:"#FF6600",color:"#fff",border:"none",borderRadius:2,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    ゲストとして注文する
                  </button>
                </>
              )}

              <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
                {["🛡️ 30日間動作保証","🚚 送料無料","🔒 安全な決済"].map(t=>(
                  <div key={t} style={{fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
