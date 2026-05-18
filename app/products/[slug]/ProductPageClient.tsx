"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import { useCartStore } from "@/lib/cart-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryDeep:"#007A76",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const GRADE_STYLE: Record<string,{color:string,bg:string,border:string}> = {
  S:{color:"#CC0000",bg:"#FFF0F0",border:"#CC0000"},
  A:{color:"#007A76",bg:"#E8F8F8",border:"#0ABAB5"},
  B:{color:"#227700",bg:"#F0FFF0",border:"#44AA44"},
  C:{color:"#555",bg:"#F5F5F5",border:"#AAA"},
  JUNK:{color:"#999",bg:"#F0F0F0",border:"#CCC"},
};

export default function ProductPageClient({product}: {product:any}) {
  const router = useRouter();
  const { addItem, count } = useCartStore();
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.images || [];
  const imgUrls = images.length > 0
    ? images.map((img:any) => getImageUrl(img.directus_files_id, 600, 450))
    : [null];

  const disc = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;
  const gradeStyle = GRADE_STYLE[product.grade] || GRADE_STYLE.C;

  const specs = [
    product.cpu          && {key:"CPU",          value:product.cpu},
    product.os           && {key:"OS",            value:product.os},
    product.memory       && {key:"メモリ",        value:product.memory},
    product.storage      && {key:"ストレージ",    value:product.storage},
    product.display_size && {key:"ディスプレイ",  value:product.display_size},
    product.condition    && {key:"状態",          value:product.condition==="used"?"中古品":product.condition==="new"?"新品":"リファービッシュ"},
    product.grade        && {key:"グレード",      value:product.grade},
  ].filter(Boolean) as {key:string,value:string}[];

  const handleAddToCart = () => {
    const imgId = product.images?.[0]?.directus_files_id;
    addItem({
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: imgId ? getImageUrl(imgId, 200, 150) : null,
      brand: product.brand_id?.name || "",
      grade: product.grade,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      {/* Header */}
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flexShrink:0,cursor:"pointer"}} onClick={()=>router.push("/")}>
              <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
              <div style={{fontSize:9,color:C.textLight}}>中古PC・スマホならデジマルショップ！</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
              <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🏠 ホームへ戻る</button>
              <button onClick={()=>router.push("/cart")} style={{background:C.red,color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",position:"relative"}}>
                🛒 カート{count()>0&&<span style={{marginLeft:4,background:"#FFE000",color:"#333",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:900}}>{count()}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav breadcrumb */}
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"7px 10px",fontSize:11,color:"#fff",display:"flex",alignItems:"center",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span style={{opacity:0.6}}>›</span>
          <span style={{cursor:"pointer"}} onClick={()=>router.push(`/category/${product.category_id?.slug||"pc"}`)}>
            {product.category_id?.name||"商品一覧"}
          </span>
          <span style={{opacity:0.6}}>›</span>
          <span style={{opacity:0.8}}>{product.name?.slice(0,25)}...</span>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1100,margin:"12px auto",padding:"0 10px"}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>

          {/* Images */}
          <div style={{width:380,flexShrink:0}}>
            <div style={{background:C.white,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:8,marginBottom:8,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              {imgUrls[mainImg]
                ?<img src={imgUrls[mainImg]} alt={product.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
                :<span style={{fontSize:80}}>💻</span>
              }
            </div>
            {imgUrls.length>1&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {imgUrls.map((url:string|null,i:number)=>(
                  <div key={i} onClick={()=>setMainImg(i)} style={{width:60,height:60,border:`2px solid ${mainImg===i?C.primary:C.border}`,borderRadius:2,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:C.white}}>
                    {url?<img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:24}}>💻</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{flex:1}}>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,marginBottom:10}}>
              <div style={{fontSize:11,color:C.textLight,marginBottom:4}}>{product.brand_id?.name}</div>
              <h1 style={{fontSize:16,fontWeight:700,color:C.text,lineHeight:1.5,margin:"0 0 10px 0"}}>{product.name}</h1>

              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                {product.grade&&(
                  <span style={{background:gradeStyle.bg,color:gradeStyle.color,border:`1px solid ${gradeStyle.border}`,borderRadius:2,fontSize:11,fontWeight:700,padding:"3px 10px"}}>グレード{product.grade}</span>
                )}
                {product.condition&&(
                  <span style={{background:"#F5F5F5",color:"#555",border:"1px solid #CCC",borderRadius:2,fontSize:11,padding:"3px 10px"}}>
                    {product.condition==="used"?"中古品":product.condition==="new"?"新品":"リファービッシュ"}
                  </span>
                )}
              </div>

              {/* Price */}
              <div style={{marginBottom:14,padding:12,background:C.primaryBg,borderRadius:2,border:`1px solid ${C.primaryBorder}`}}>
                {product.compare_at_price&&(
                  <div style={{fontSize:11,color:C.textLight,textDecoration:"line-through",marginBottom:2}}>定価 ¥{product.compare_at_price.toLocaleString()}</div>
                )}
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <div style={{fontSize:26,fontWeight:900,color:C.red}}>¥{product.price.toLocaleString()}</div>
                  <div style={{fontSize:11,color:C.textSub}}>（税込）</div>
                  {disc>=5&&<div style={{background:C.red,color:"#fff",fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:2}}>{disc}%OFF</div>}
                </div>
              </div>

              {product.short_description&&(
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.7,marginBottom:14,padding:10,background:"#FAFAFA",borderRadius:2,border:`1px solid ${C.border}`}}>
                  {product.short_description}
                </div>
              )}

              {/* Qty & Cart */}
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.border}`,borderRadius:2}}>
                  <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:32,height:36,background:"#F5F5F5",border:"none",fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>－</button>
                  <div style={{width:40,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{qty}</div>
                  <button onClick={()=>setQty(q=>q+1)} style={{width:32,height:36,background:"#F5F5F5",border:"none",fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>＋</button>
                </div>
                <button onClick={handleAddToCart}
                  style={{flex:1,background:added?"#227700":C.primary,color:"#fff",border:"none",padding:"10px 20px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background 0.2s"}}>
                  {added?"✓ カートに追加しました！":"🛒 カートに入れる"}
                </button>
              </div>
              <button onClick={()=>{handleAddToCart();router.push("/cart");}}
                style={{width:"100%",background:"#FF6600",color:"#fff",border:"none",padding:"10px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                ⚡ 今すぐ購入
              </button>

              <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
                {["🛡️ 30日間保証","🚚 即日発送","📞 サポート付き"].map(t=>(
                  <div key={t} style={{fontSize:11,color:C.textSub}}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specs & Description */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
          {specs.length>0&&(
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden"}}>
              <div style={{background:C.primary,color:"#fff",padding:"6px 12px",fontSize:13,fontWeight:700}}>📋 スペック</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  {specs.map((s,i)=>(
                    <tr key={i} style={{background:i%2===0?C.white:C.primaryBg}}>
                      <td style={{padding:"7px 12px",fontSize:12,color:C.textSub,width:"40%",borderBottom:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,fontWeight:700}}>{s.key}</td>
                      <td style={{padding:"7px 12px",fontSize:12,color:C.text,borderBottom:`1px solid ${C.border}`}}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {product.description&&(
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden"}}>
              <div style={{background:C.primaryDeep,color:"#fff",padding:"6px 12px",fontSize:13,fontWeight:700}}>📝 商品説明</div>
              <div style={{padding:14,fontSize:12,color:C.text,lineHeight:1.8}}
                dangerouslySetInnerHTML={{__html:product.description}}/>
            </div>
          )}
        </div>

        <div style={{marginTop:14,marginBottom:20}}>
          <button onClick={()=>router.back()} style={{background:C.white,color:C.primary,border:`1px solid ${C.primary}`,padding:"8px 20px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← 一覧に戻る</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:20,fontWeight:900,color:C.primary,fontFamily:"Arial Black,sans-serif",marginBottom:8,cursor:"pointer"}} onClick={()=>router.push("/")}>デジマルショップ</div>
          <div style={{fontSize:10,color:"#5A8A8A",borderTop:"1px solid #3A6A6A",paddingTop:10,marginTop:8}}>© 2024 デジマルショップ. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}
