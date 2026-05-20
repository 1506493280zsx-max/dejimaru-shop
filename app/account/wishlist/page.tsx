"use client";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const GRADE_STYLE: Record<string,{label:string,color:string,bg:string,border:string}> = {
  NEW:{label:"新品",color:"#CC0000",bg:"#FFF0F0",border:"#CC0000"},
  S:  {label:"S品", color:"#007A76",bg:"#E8F8F8",border:"#0ABAB5"},
  A:  {label:"A品", color:"#227700",bg:"#F0FFF0",border:"#44AA44"},
  B:  {label:"B品", color:"#555",   bg:"#F5F5F5",border:"#AAA"},
  C:  {label:"C品", color:"#333",   bg:"#EEEEEE",border:"#888"},
};

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

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
            <button onClick={()=>router.push("/cart")} style={{background:C.red,color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🛒 カート</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span>›</span>
          <span style={{fontWeight:700}}>お気に入り</span>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"12px auto",padding:"0 10px 30px"}}>
        <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          ❤️ お気に入りリスト
          <span style={{fontSize:13,fontWeight:400,color:C.textSub}}>（{items.length}点）</span>
        </div>

        {items.length === 0 ? (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"60px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🤍</div>
            <div style={{fontSize:16,color:C.textSub,marginBottom:8}}>お気に入りに追加された商品がありません</div>
            <div style={{fontSize:12,color:C.textLight,marginBottom:16}}>商品ページの ♥ ボタンで追加できます</div>
            <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              商品を探す
            </button>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {items.map(item=>{
              const gs = GRADE_STYLE[item.grade||"C"]||GRADE_STYLE.C;
              return (
                <div key={item.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:10,display:"flex",flexDirection:"column",gap:6}}>
                  {/* 画像 */}
                  <div style={{background:"#F5FAFA",borderRadius:2,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #B0E0DE",overflow:"hidden",position:"relative",cursor:"pointer"}}
                    onClick={()=>router.push(`/products/${item.slug}`)}>
                    {item.imageUrl
                      ?<img src={item.imageUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:40}}>💻</span>
                    }
                    {/* ♥ 削除ボタン */}
                    <div onClick={e=>{e.stopPropagation();removeItem(item.id);}}
                      style={{position:"absolute",top:6,left:6,width:28,height:28,background:"rgba(255,255,255,0.9)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:C.red,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
                      ❤️
                    </div>
                  </div>

                  <div style={{fontSize:10,color:C.textLight}}>{item.brand}</div>
                  <div style={{fontSize:12,color:C.text,lineHeight:1.5,cursor:"pointer",display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}
                    onClick={()=>router.push(`/products/${item.slug}`)}>
                    {item.name}
                  </div>

                  {item.grade && (
                    <span style={{display:"inline-block",background:gs.bg,color:gs.color,border:`1px solid ${gs.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",alignSelf:"flex-start"}}>
                      {gs.label}
                    </span>
                  )}

                  <div style={{fontSize:16,fontWeight:700,color:C.red}}>
                    ¥{item.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span>
                  </div>

                  <div style={{display:"flex",gap:6,marginTop:"auto"}}>
                    <button
                      onClick={()=>{
                        addItem({id:item.id,slug:item.slug,name:item.name,price:item.price,imageUrl:item.imageUrl,brand:item.brand,grade:item.grade});
                        router.push("/cart");
                      }}
                      style={{flex:1,background:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"7px 4px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                      🛒 カートへ
                    </button>
                    <button onClick={()=>removeItem(item.id)}
                      style={{background:"#fff",color:C.textSub,border:`1px solid ${C.border}`,borderRadius:2,padding:"7px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",fontSize:10,color:"#5A8A8A"}}>
          © 2024 デジマルショップ. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
