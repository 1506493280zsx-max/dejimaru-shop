"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import type { Brand } from "@/lib/directus";
import { getBrandsForCategory } from "@/lib/category-brands";

import HomeBlogModule from "@/components/HomeBlogModule";
import CategoryBannerSwiper from "@/components/CategoryBannerSwiper";
import SearchFilter from "@/components/SearchFilter";
import { useWishlistStore } from "@/lib/wishlist-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryDeep:"#007A76",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const GRADE_STYLE: Record<string,{label:string,color:string,bg:string,border:string}> = {
  NEW:{label:"新品",color:"#C41717",bg:"#FFF0F0",border:"#C41717"},
  A:  {label:"中古Aランク",color:"#2563EB",bg:"#EFF6FF",border:"#2563EB"},
  B:  {label:"中古Bランク",color:"#D97706",bg:"#FEF3C7",border:"#D97706"},
  C:  {label:"中古Cランク",color:"#DC2626",bg:"#FEE2E2",border:"#DC2626"},
};

function GradeBadge({grade}: {grade:string|null}) {
  if(!grade) return null;
  const s = GRADE_STYLE[grade]||GRADE_STYLE.C;
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",marginRight:4}}>{s.label}</span>;
}

function ProductCard({product, size="normal"}: {product:any, size?:string}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  const { toggle, hasItem } = useWishlistStore();
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const minPrice = product.min_price ?? product.price ?? 0;
  const maxPrice = product.max_price ?? product.price ?? 0;

  // 从变体中取最高的 compare_price，或使用产品的 compare_at_price
  const variantComparePrices = (product.product_variants || [])
    .filter((v: any) => v.status === "active")
    .map((v: any) => v.compare_price)
    .filter(Boolean) as number[];
  const maxVariantComparePrice = variantComparePrices.length > 0 ? Math.max(...variantComparePrices) : null;
  const comparePrice = maxVariantComparePrice ?? product.compare_at_price;

  const disc = comparePrice ? Math.round((1 - minPrice / comparePrice) * 100) : 0;
  const imgId=product.images?.[0]?.image_file_id;
  const imgUrl=imgId?getImageUrl(imgId,300,225):null;
  const liked=mounted&&hasItem(String(product.id));

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:size==="small"?8:10,cursor:"pointer",transition:"border-color 0.15s",display:"flex",flexDirection:"column",gap:4,minHeight:size==="small"?332:undefined}}>
      <div onClick={()=>{console.log("PRODUCT_CLICK",product.slug);router.push(`/products/${product.slug}`);}}
        style={{width:"100%",padding:8,minHeight:148,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#fff",position:"relative"}}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} style={{width:"100%",height:"auto",maxHeight:220,objectFit:"contain",objectPosition:"center",display:"block"}}/>
          : <span style={{fontSize:size==="small"?10:11,color:C.textLight}}>NO IMAGE</span>
        }
        {disc>=1&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
        <div onClick={e=>{e.stopPropagation();toggle({id:String(product.id),slug:product.slug,name:product.name,price:product.price,imageUrl:imgUrl,brand:product.brand_id?.name||"",grade:product.grade});}}
          style={{position:"absolute",top:6,left:6,width:26,height:26,background:"rgba(255,255,255,0.9)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
          {liked?"♥":"♡"}
        </div>
      </div>
      <div onClick={()=>router.push(`/products/${product.slug}`)}>
        <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"―"}</div>
        <div style={{fontSize:size==="small"?11:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>{product.name}</div>
        {(product.is_new||product.grade)&&<div style={{marginTop:2}}><GradeBadge grade={product.is_new?"NEW":product.grade}/></div>}
        <div style={{marginTop:4}}>
          {comparePrice&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>{"定価"} &yen;{comparePrice.toLocaleString()}</div>}
          <div style={{fontSize:size==="small"?14:16,fontWeight:700,color:C.red}}>
            ¥{minPrice.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>(税込)</span>
          </div>
        </div>
      </div>
      <button onClick={()=>router.push(`/products/${product.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        {"詳細を見る"} &rarr;
      </button>
    </div>
  );
}

const SHIPPING_RATES = [
  {r:"北海道",p:1980},{r:"東北",p:1200},{r:"関東",p:980},
  {r:"中部",p:980},{r:"関西",p:1200},{r:"中国",p:1400},
  {r:"四国",p:1400},{r:"九州",p:1600},{r:"沖縄",p:1980},
];

function CategorySidebar({categories,openCats,setOpenCats,brands}: {categories:any[],openCats:string[],setOpenCats:any,brands:Brand[]}) {
  const router=useRouter();
  const toggle=(id:string)=>setOpenCats((p:string[])=>p.includes(id)?p.filter((x:string)=>x!==id):[...p,id]);
  const roots=categories.filter(c=>!c.parent_id);
  const [shippingOpen,setShippingOpen]=useState(false);

  return (
    <div style={{width:185,flexShrink:0,position:"sticky",top:0,alignSelf:"flex-start",height:"100vh",overflowY:"auto",boxSizing:"border-box"}}>
      <div style={{background:C.primary,color:"#fff",padding:"7px 10px",fontSize:12,fontWeight:700,borderBottom:`1px solid ${C.primaryDark}`,display:"flex",alignItems:"center",gap:6}}>
        <span>&#9632;</span> {"カテゴリ"} <span style={{fontSize:9,fontWeight:400,marginLeft:2,opacity:0.8}}>category</span>
      </div>
      {roots.map(cat=>{
        const catBrands=getBrandsForCategory(cat.slug, brands);
        const children=categories.filter(c=>String(c.parent_id)===String(cat.id));
        const isOpen=openCats.includes(String(cat.id));
        return (
          <div key={cat.id}>
            <div onClick={()=>toggle(String(cat.id))} style={{padding:"8px 10px",background:isOpen?C.primaryBg:"#F9F9F9",borderBottom:"1px solid #D8ECEC",cursor:"pointer",display:"flex",alignItems:"center",gap:6,borderLeft:`3px solid ${isOpen?C.primary:"transparent"}`}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{cat.name}</div></div>
              <span style={{fontSize:10,color:C.primary,fontWeight:700}}>{isOpen?"▲":"▼"}</span>
            </div>
            {isOpen&&(
              <div style={{background:C.white}}>
                {(children.length>0 && (cat.slug==="peripherals"||cat.slug==="storage"))
                  ? children.map(child=>(
                      <div key={child.slug}
                        onClick={(e)=>{e.stopPropagation();router.push(`/category/${child.slug}`);}}
                        style={{padding:"8px 10px 8px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub}}
                        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                        {child.name}
                      </div>
                    ))
                  : catBrands.map(b=>(
                      <div key={b.slug}
                        onClick={(e)=>{e.stopPropagation();router.push(`/search?brand=${b.slug}&category=${cat.slug}`);}}
                        style={{padding:"8px 10px 8px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub}}
                        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                        {b.name}
                      </div>
                    ))
                }
              </div>
            )}
          </div>
        );
      })}
      <SearchFilter brands={brands} />
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,overflow:"hidden"}}>
          <div onClick={()=>setShippingOpen(o=>!o)} style={{padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>🚚 送料について</div>
              <div style={{fontSize:10,color:C.textLight,marginTop:2}}>地域別送料</div>
            </div>
            <span style={{fontSize:9,color:C.primary,fontWeight:700,display:"inline-block",transform:shippingOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>▼</span>
          </div>
          <div style={{maxHeight:shippingOpen?320:0,overflow:"hidden",transition:"max-height 0.25s ease"}}>
            <div style={{borderTop:`1px solid ${C.primaryBorder}`,padding:"6px 8px",display:"flex",flexDirection:"column",gap:3}}>
              {SHIPPING_RATES.map(({r,p})=>(
                <div key={r} style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.text}}>
                  <span>{r}</span>
                  <span style={{fontWeight:700,color:C.primaryDeep}}>¥{p.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text}}>🛡️ 30日間保証</div>
          <div style={{fontSize:10,color:C.textLight,marginTop:2}}>全商品保証付き</div>
        </div>
        <div style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text}}>📞 お問い合わせ</div>
          <div style={{fontSize:10,color:C.textLight,marginTop:2}}>048-816-3967</div>
        </div>
      </div>
    </div>
  );
}

function AdColumn({ads}: {ads:any[]}) {
  const router = useRouter();
  return (
    <div style={{width:90,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
      {ads.map((ad,i)=>{
        const imgUrl = ad.image_desktop ? getImageUrl(ad.image_desktop, 90, 400) : null;
        return (
          <div key={ad.id??i} onClick={()=>router.push(ad.link_url||"/")}
            style={{width:90,height:400,background:"#E8E8E8",border:"1px dashed #AAA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"opacity 0.15s",writingMode:"vertical-rl",textOrientation:"mixed",overflow:"hidden",position:"relative"}}
            onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
            onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
            {imgUrl
              ? <img src={imgUrl} alt={ad.title||""} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
              : <div style={{fontSize:11,color:"#999",textAlign:"center",lineHeight:1.8,whiteSpace:"pre-line"}}>{ad.title}</div>
            }
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({title,en,color}:{title:string,en:string,color?:string}) {
  return (
    <div style={{background:color||C.primary,color:"#fff",padding:"6px 10px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",marginBottom:8}}>
      {title}
      <span style={{fontSize:10,fontWeight:400,marginLeft:6,opacity:0.8}}>{en}</span>
    </div>
  );
}

function BannerAd({ad}:{ad:any}) {
  const router=useRouter();
  if(!ad||ad.is_active===false) return null;
  const imgUrl = ad.image_desktop ? getImageUrl(ad.image_desktop, 800, 260) : null;
  return (
    <div onClick={()=>router.push(ad.link_url||"/")}
      style={{width:"100%",height:260,minHeight:260,maxHeight:260,borderRadius:2,overflow:"hidden",position:"relative",background:`linear-gradient(135deg,${C.primaryBg},#B8EAE8)`,border:`1px solid ${C.primaryBorder}`,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
      onMouseEnter={e=>(e.currentTarget.style.opacity="0.9")}
      onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
      {imgUrl&&(
        <img src={imgUrl} alt={ad.title||""} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      )}
      {imgUrl&&<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.28)"}}/>}
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 32px"}}>
        <div style={{fontSize:22,fontWeight:700,color:imgUrl?"#fff":C.primaryDeep,lineHeight:1.4,textShadow:imgUrl?"0 1px 4px rgba(0,0,0,0.6)":"none"}}>{ad.title}</div>
        {ad.subtitle&&<div style={{fontSize:13,marginTop:8,color:imgUrl?"rgba(255,255,255,0.9)":C.textSub,textShadow:imgUrl?"0 1px 3px rgba(0,0,0,0.5)":"none"}}>{ad.subtitle}</div>}
      </div>
    </div>
  );
}

function FeaturedBannerSlider({ads}:{ads:any[]}) {
  const router=useRouter();
  const active=(ads??[]).filter(a=>a.is_active!==false).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const [page,setPage]=useState(0);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    if(active.length<=1||paused) return;
    const timer=setInterval(()=>setPage(p=>(p+1)%active.length),4000);
    return ()=>clearInterval(timer);
  },[active.length,paused]);
  if(active.length===0) return null;
  const ad=active[page];
  const imgUrl=ad.image_desktop?getImageUrl(ad.image_desktop,1400,350):null;
  return (
    <div style={{marginBottom:10,position:"relative"}}
      onMouseEnter={()=>setPaused(true)}
      onMouseLeave={()=>setPaused(false)}>
      <style>{`.fb-banner{width:100%;height:350px;border-radius:2px;overflow:hidden;position:relative;background:linear-gradient(135deg,#E8F8F8,#B8EAE8);border:1px solid #B0E0DE;cursor:pointer;display:flex;align-items:center;justify-content:center}@media(max-width:640px){.fb-banner{height:auto;aspect-ratio:4/1;min-height:120px}}`}</style>
      <div className="fb-banner" onClick={()=>router.push(ad.link_url||"/")}>
        {imgUrl&&<img src={imgUrl} alt={ad.title||""} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>}
        {imgUrl&&<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.25)"}}/>}
        <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 40px"}}>
          <div style={{fontSize:24,fontWeight:700,color:imgUrl?"#fff":C.primaryDeep,lineHeight:1.4,textShadow:imgUrl?"0 1px 4px rgba(0,0,0,0.6)":"none"}}>{ad.title}</div>
          {ad.subtitle&&<div style={{fontSize:13,marginTop:8,color:imgUrl?"rgba(255,255,255,0.9)":C.textSub,textShadow:imgUrl?"0 1px 3px rgba(0,0,0,0.5)":"none"}}>{ad.subtitle}</div>}
        </div>
        {active.length>1&&<>
          <button onClick={e=>{e.stopPropagation();setPage(p=>(p-1+active.length)%active.length);}} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.35)",color:"#fff",border:"none",borderRadius:2,width:32,height:48,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>&#8249;</button>
          <button onClick={e=>{e.stopPropagation();setPage(p=>(p+1)%active.length);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.35)",color:"#fff",border:"none",borderRadius:2,width:32,height:48,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>&#8250;</button>
        </>}
      </div>
      {active.length>1&&(
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:6}}>
          {active.map((_,i)=>(
            <div key={i} onClick={()=>setPage(i)} style={{width:8,height:8,borderRadius:"50%",background:i===page?C.primary:C.border,cursor:"pointer",transition:"background 0.2s"}}/>
          ))}
        </div>
      )}
    </div>
  );
}

function chunkArray<T>(arr:T[],size:number):T[][] {
  const chunks:T[][]=[];
  for(let i=0;i<arr.length;i+=size) chunks.push(arr.slice(i,i+size));
  return chunks;
}

function AutoSwitchGridCard({ad}:{ad:any}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  const imgUrl = ad.image_desktop ? getImageUrl(ad.image_desktop, 400, 160) : null;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>router.push(ad.link_url||"/")}
      style={{position:"relative",height:160,borderRadius:2,overflow:"hidden",cursor:"pointer",background:`linear-gradient(135deg,${C.primaryDeep},#0ABAB5)`,border:`2px solid ${hov?C.primary:C.primaryBorder}`,transition:"border-color 0.15s"}}>
      {imgUrl&&<img src={imgUrl} alt={ad.title||""} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:hov?"rgba(0,0,0,0.18)":"rgba(0,0,0,0.35)",transition:"background 0.2s"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:"0 12px",textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.4,textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{ad.title}</div>
        {ad.subtitle&&<div style={{fontSize:10,color:"rgba(255,255,255,0.88)",textShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>{ad.subtitle}</div>}
      </div>
    </div>
  );
}

function AdSlider({ads}:{ads:any[]}) {
  const active=(ads??[]).filter(a=>a.is_active!==false).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const pages=chunkArray(active,4);
  const [page,setPage]=useState(0);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    if(paused||pages.length<=1) return;
    const timer=setInterval(()=>setPage(p=>(p+1)%pages.length),4000);
    return ()=>clearInterval(timer);
  },[paused,pages.length]);
  if(pages.length===0) return null;
  return (
    <div style={{marginBottom:14}}
      onMouseEnter={()=>setPaused(true)}
      onMouseLeave={()=>setPaused(false)}>
      <style>{`.ad-slider-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}@media(max-width:640px){.ad-slider-grid{grid-template-columns:repeat(2,1fr)}}`}</style>
      <div className="ad-slider-grid">
        {pages[page].map(ad=><AutoSwitchGridCard key={ad.id} ad={ad}/>)}
      </div>
      {pages.length>1&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:8}}>
          <button onClick={()=>setPage(p=>(p-1+pages.length)%pages.length)}
            style={{background:C.primary,color:"#fff",border:"none",borderRadius:2,width:24,height:24,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontFamily:"inherit"}}>&#8249;</button>
          {pages.map((_,i)=>(
            <div key={i} onClick={()=>setPage(i)}
              style={{width:8,height:8,borderRadius:"50%",background:i===page?C.primary:C.border,cursor:"pointer",transition:"background 0.2s"}}/>
          ))}
          <button onClick={()=>setPage(p=>(p+1)%pages.length)}
            style={{background:C.primary,color:"#fff",border:"none",borderRadius:2,width:24,height:24,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontFamily:"inherit"}}>&#8250;</button>
        </div>
      )}
    </div>
  );
}

const APPLE_PRODUCTS = [
  {id:"ap1",slug:"apple-iphone-14",     name:"Apple iPhone 14 64GB スペースグレイ 中古",                  brand_id:{name:"Apple"},images:[],grade:"A", price:58000,compare_at_price:89800},
  {id:"ap2",slug:"apple-ipad-10th",     name:"Apple iPad 第10世代 64GB Wi-Fi シルバー 中古",             brand_id:{name:"Apple"},images:[],grade:"S", price:52000,compare_at_price:68800},
  {id:"ap3",slug:"apple-macbook-air-m1",name:"Apple MacBook Air M1 8GB/256GB スペースグレイ",           brand_id:{name:"Apple"},images:[],grade:"A", price:78000,compare_at_price:112800},
  {id:"ap4",slug:"apple-watch-s8",      name:"Apple Watch Series 8 41mm GPS アルミニウム 中古",         brand_id:{name:"Apple"},images:[],grade:"B", price:28000,compare_at_price:54800},
  {id:"ap5",slug:"apple-airpods-pro2",  name:"Apple AirPods Pro 第2世代 MagSafe充電ケース付き 中古",    brand_id:{name:"Apple"},images:[],grade:"A", price:18000,compare_at_price:39800},
];

const ACCESSORY_PRODUCTS = [
  {id:"ac1",slug:"usb-c-charger-65w",      name:"USB-C 急速充電器 65W GaN対応 3ポート コンパクト",                    brand_id:{name:""},images:[],grade:null,price:2980, compare_at_price:4980},
  {id:"ac2",slug:"wireless-mouse-silent",   name:"ワイヤレスマウス 静音 Bluetooth 充電式 6ボタン",                    brand_id:{name:""},images:[],grade:null,price:1980, compare_at_price:3280},
  {id:"ac3",slug:"mechanical-keyboard-tkl", name:"メカニカルキーボード テンキーレス 日本語配列 USB",                  brand_id:{name:""},images:[],grade:null,price:4980, compare_at_price:8800},
  {id:"ac4",slug:"portable-ssd-500gb",     name:"ポータブルSSD 500GB USB3.2 Gen2対応 高速転送",                     brand_id:{name:""},images:[],grade:null,price:5980, compare_at_price:9800},
  {id:"ac5",slug:"smartphone-case-clear",  name:"スマートフォンケース クリア 耐衝撃 全機種対応",                      brand_id:{name:""},images:[],grade:null,price:980,  compare_at_price:1980},
  {id:"ac6",slug:"wireless-earphones-anc", name:"ワイヤレスイヤホン Bluetooth5.3 アクティブノイズキャンセリング",    brand_id:{name:""},images:[],grade:null,price:3980, compare_at_price:7980},
];

export default function HomeClient({featured,newArrivals,categories,brands,blogPosts,ads}: {featured:any[],newArrivals:any[],categories:any[],brands:any[],blogPosts:any[],ads:any[]}) {
  const router=useRouter();
  const roots=categories.filter(c=>!c.parent_id);
  const [openCats,setOpenCats]=useState([]);

  const adsFor = (prefix: string) =>
    ads.filter(a => a.position === prefix || (a.position && a.position.startsWith(prefix + '-')));

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','游ゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>

      <div style={{width:"100%",maxWidth:"1800px",margin:"0 auto",padding:"0 12px"}}>
        <CategoryBannerSwiper ads={adsFor('hero')}/>
      </div>

      <div style={{width:"100%",maxWidth:"1800px",margin:"10px auto",padding:"0 12px"}}>
        <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>

          <AdColumn ads={adsFor('left')}/>
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats} brands={brands}/>

          <div style={{flex:1,minWidth:0}}>

            <div style={{background:`linear-gradient(135deg,${C.primaryBg},#C8EEEC)`,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
              <div>
                <div style={{fontSize:18,fontWeight:900,color:C.primaryDeep}}>{"中古PC・スマートフォンが激安！"}</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:4}}>{"全商品30日間返金保証付き・当日出荷対応"}</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                <button onClick={()=>router.push("/search")} style={{background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{"商品一覧を見る"} &rarr;</button>
              </div>
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"6px 10px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>{"グレードガイド："}</span>
              {[{g:"NEW",l:"未開封・未使用"},{g:"A",l:"わずかな使用痕あり"},{g:"B",l:"使用痕が比較的目立つ"},{g:"C",l:"傷あり"}].map(({g,l})=>(
                <span key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                  <GradeBadge grade={g}/><span style={{fontSize:10,color:C.textSub}}>{l}</span>
                </span>
              ))}
            </div>

            <FeaturedBannerSlider ads={adsFor('featured-banner-main')}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"注目商品一覧"} en="FEATURED ITEMS"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {featured.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"新着商品"} en="NEW ARRIVALS" color={C.primaryDeep}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {newArrivals.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
            </div>

            <AdSlider ads={adsFor('new-banner')}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"Appleの商品"} en="APPLE PRODUCTS" color="#555"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {APPLE_PRODUCTS.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
              <AdSlider ads={adsFor('apple-banner')}/>
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"アクセサリ"} en="ACCESSORIES" color="#555"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {ACCESSORY_PRODUCTS.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
              <AdSlider ads={adsFor('accessory-banner')}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {title:"30日間返金保証",body:"全商品に返金保証をつけてお届けします。一点一点の商品の確認・清掃対応いたします。"},
                {title:"当日・翌日出荷",body:"年中14時までのご注文で当日出荷・翌日出荷。最速翌日お届け可能です（一部離島除く）。"},
                {title:"専任スタッフが対応",body:"商品選びのお問い合わせは電話・メールで承っております。お気軽にお問い合わせください。"},
              ].map((item,i)=>(
                <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,padding:10,borderRadius:"0 0 2px 2px"}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6}}>{item.title}</div>
                  <div style={{fontSize:11,color:C.textSub,lineHeight:1.7}}>{item.body}</div>
                </div>
              ))}
            </div>

            <HomeBlogModule posts={blogPosts}/>
            <AdSlider ads={adsFor('blog-banner')}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"ブランドから探す"} en="BRANDS" color="#555"/>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,background:C.white,border:`1px solid ${C.border}`,padding:10}}>
                {brands.map((b:any)=>(
                  <div key={b.id} onClick={()=>router.push(`/search?brand=${b.slug}`)}
                    style={{border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"4px 12px",fontSize:11,color:C.primaryDeep,cursor:"pointer",background:C.primaryBg,fontWeight:700}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.primary;(e.currentTarget as HTMLElement).style.color="#fff";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.primaryBg;(e.currentTarget as HTMLElement).style.color=C.primaryDeep;}}
                  >{b.name}</div>
                ))}
              </div>
            </div>
          </div>

          <AdColumn ads={adsFor('right')}/>
        </div>
      </div>

    </div>
  );
}
