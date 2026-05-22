"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";

import { useWishlistStore } from "@/lib/wishlist-store";
import { homepageAds } from "@/lib/homepageAds";
import HomeReviews from "@/components/HomeReviews";
type HpAd = { id:string; image:string; link:string; title:string; subtitle?:string; active:boolean; sort:number };

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryDeep:"#007A76",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
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

const GRID_ADS = [
  {text:"期間限定セール",   url:"/search"},
  {text:"MacBook特集",     url:"/category/laptops-used-mac"},
  {text:"iPhone中古",      url:"/category/smartphones-iphone-used"},
  {text:"ゲーミングPC",    url:"/category/desktops-gaming"},
  {text:"タブレット特集",  url:"/category/tablets"},
  {text:"タイムセール",    url:"/search"},
  {text:"SSD大特集",       url:"/category/storage-ssd-internal"},
  {text:"ビジネスPC",      url:"/category/laptops-used-business"},
  {text:"Android中古",     url:"/category/smartphones-android-used"},
  {text:"周辺機器特集",    url:"/category/peripherals"},
  {text:"Surface特集",     url:"/search?brand=microsoft"},
  {text:"ThinkPad特集",   url:"/search?brand=lenovo"},
  {text:"iMac/Mac mini",  url:"/search?brand=apple"},
  {text:"デスクトップPC",  url:"/category/desktops-used-business"},
  {text:"Galaxyスマホ",    url:"/search?brand=samsung"},
  {text:"Apple製品",       url:"/search?brand=apple"},
  {text:"買取サービス",    url:"/buyback"},
  {text:"法人ご相談",      url:"/corporate"},
  {text:"修理サービス",    url:"/repair"},
  {text:"Chromebook",     url:"/search?brand=google"},
  {text:"モニター特集",    url:"/category/peripherals"},
  {text:"キーボード特集",  url:"/category/peripherals"},
  {text:"PODサービス",     url:"/pod-service"},
  {text:"お問い合わせ",    url:"/contact"},
];

function GridBanner() {
  const router = useRouter();
  const firstRow = GRID_ADS.slice(0, 6);
  const secondRow = GRID_ADS.slice(6, 12);
  const row1Loop = [...firstRow, ...firstRow];
  const row2Loop = [...secondRow, ...secondRow];
  const tile = {width:200,height:160,flexShrink:0,overflow:"hidden",background:"#E0E0E0",border:"1px dashed #AAA",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:2} as const;
  return (
    <>
      <style>{`
        .marqueeWrapper{overflow:hidden;display:flex;flex-direction:column;gap:4px;}
        .scrollLeft{display:flex;gap:4px;width:max-content;animation:scrollLeft 30s linear infinite;}
        .scrollRight{display:flex;gap:4px;width:max-content;animation:scrollRight 30s linear infinite;}
        @keyframes scrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes scrollRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
      `}</style>
      <div className="marqueeWrapper">
        <div className="scrollLeft">
          {row1Loop.map((ad,i)=>(
            <div key={i} onClick={()=>router.push(ad.url)} style={tile}
              onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
              onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
              <div style={{fontSize:13,fontWeight:700,color:"#888",textAlign:"center",padding:"0 8px"}}>{ad.text}</div>
            </div>
          ))}
        </div>
        <div className="scrollRight">
          {row2Loop.map((ad,i)=>(
            <div key={i} onClick={()=>router.push(ad.url)} style={tile}
              onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
              onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
              <div style={{fontSize:13,fontWeight:700,color:"#888",textAlign:"center",padding:"0 8px"}}>{ad.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

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
  const disc=product.compare_at_price?Math.round((1-product.price/product.compare_at_price)*100):0;
  const imgId=product.images?.[0]?.directus_files_id;
  const imgUrl=imgId?getImageUrl(imgId,300,225):null;
  const liked=mounted&&hasItem(String(product.id));

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:size==="small"?8:10,cursor:"pointer",transition:"border-color 0.15s",display:"flex",flexDirection:"column",gap:4}}>
      <div onClick={()=>router.push(`/products/${product.slug}`)}
        style={{background:"#F5FAFA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",aspectRatio:"4/3",position:"relative",border:`1px solid ${C.primaryBorder}`,marginBottom:6,overflow:"hidden"}}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : <span style={{fontSize:size==="small"?10:11,color:C.textLight}}>NO IMAGE</span>
        }
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
        <div onClick={e=>{e.stopPropagation();toggle({id:String(product.id),slug:product.slug,name:product.name,price:product.price,imageUrl:imgUrl,brand:product.brand_id?.name||"",grade:product.grade});}}
          style={{position:"absolute",top:6,left:6,width:26,height:26,background:"rgba(255,255,255,0.9)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
          {liked?"❤️":"🤍"}
        </div>
      </div>
      <div onClick={()=>router.push(`/products/${product.slug}`)}>
        <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"—"}</div>
        <div style={{fontSize:size==="small"?11:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>{product.name}</div>
        {product.grade&&<div style={{marginTop:2}}><GradeBadge grade={product.grade}/></div>}
        <div style={{marginTop:4}}>
          {product.compare_at_price&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>{"定価"} &yen;{product.compare_at_price.toLocaleString()}</div>}
          <div style={{fontSize:size==="small"?14:16,fontWeight:700,color:C.red}}>&yen;{product.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>{"（税込）"}</span></div>
        </div>
      </div>
      <button onClick={()=>router.push(`/products/${product.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        {"詳細を見る"} &rarr;
      </button>
    </div>
  );
}

function CategorySidebar({categories,openCats,setOpenCats}: {categories:any[],openCats:string[],setOpenCats:any}) {
  const router=useRouter();
  const toggle=(id:string)=>setOpenCats((p:string[])=>p.includes(id)?p.filter((x:string)=>x!==id):[...p,id]);
  const roots=categories.filter(c=>!c.parent_id);
  const getChildren=(pid:string)=>categories.filter(c=>String(c.parent_id)===String(pid));

  return (
    <div style={{width:185,flexShrink:0,position:"sticky",top:20,alignSelf:"flex-start",height:"fit-content"}}>
      <div style={{background:C.primary,color:"#fff",padding:"7px 10px",fontSize:12,fontWeight:700,borderBottom:`1px solid ${C.primaryDark}`,display:"flex",alignItems:"center",gap:6}}>
        <span>&#9632;</span> {"カテゴリ"} <span style={{fontSize:9,fontWeight:400,marginLeft:2,opacity:0.8}}>category</span>
      </div>
      {roots.map(cat=>{
        const children=getChildren(String(cat.id));
        const isOpen=openCats.includes(String(cat.id));
        return (
          <div key={cat.id}>
            <div onClick={()=>toggle(String(cat.id))} style={{padding:"8px 10px",background:isOpen?C.primaryBg:"#F9F9F9",borderBottom:"1px solid #D8ECEC",cursor:"pointer",display:"flex",alignItems:"center",gap:6,borderLeft:`3px solid ${isOpen?C.primary:"transparent"}`}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{cat.name}</div></div>
              <span style={{fontSize:10,color:C.primary,fontWeight:700}}>{isOpen?"▲":"▶"}</span>
            </div>
            {isOpen&&(
              <div style={{background:C.white}}>
                {children.map((sub:any)=>(
                  <div key={sub.id} onClick={()=>router.push(`/category/${sub.slug}`)}
                    style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}
                    onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                    onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                    <span style={{color:C.primary,fontSize:9}}>▶</span>
                    <span style={{flex:1}}>{sub.name}</span>
                  </div>
                ))}
                <div onClick={()=>router.push(`/category/${cat.slug}`)}
                  style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.primary,display:"flex",alignItems:"center",gap:4,fontWeight:700}}
                  onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                  <span style={{color:C.primary,fontSize:9}}>▶</span>
                  <span>{"すべて見る"}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
        {[
          {title:"送料について",sub:"全国一律送料"},
          {title:"30日間保証",sub:"全商品保証付き"},
          {title:"お問い合わせ",sub:"03-0000-0000"},
        ].map((item,i)=>(
          <div key={i} style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text}}>{item.title}</div>
            <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const LEFT_ADS = [
  {text:"期間限定\nセール",url:"/search"},
  {text:"MacBook\n特集",url:"/category/laptops-used-mac"},
  {text:"iPhone\n中古",url:"/category/smartphones-iphone-used"},
  {text:"ゲーミング\nPC",url:"/category/desktops-gaming"},
  {text:"タブレット\n特集",url:"/category/tablets"},
  {text:"Surface\n特集",url:"/search?brand=microsoft"},
  {text:"ThinkPad\n特集",url:"/search?brand=lenovo"},
  {text:"iMac\nMac mini",url:"/search?brand=apple"},
  {text:"デスクトップ\nPC",url:"/category/desktops-used-business"},
  {text:"Galaxy\nスマホ",url:"/search?brand=samsung"},
  {text:"Apple\n製品",url:"/search?brand=apple"},
  {text:"SSD\n大特集",url:"/category/storage-ssd-internal"},
  {text:"買取\nサービス",url:"/buyback"},
  {text:"法人\nご相談",url:"/corporate"},
];

const RIGHT_ADS = [
  {text:"本日限定\nタイムセール",url:"/search"},
  {text:"SSD\n大特集",url:"/category/storage-ssd-internal"},
  {text:"ビジネス\nPC",url:"/category/laptops-used-business"},
  {text:"Android\n中古",url:"/category/smartphones-android-used"},
  {text:"周辺機器\n特集",url:"/category/peripherals"},
  {text:"モニター\n特集",url:"/category/peripherals"},
  {text:"キーボード\nマウス",url:"/category/peripherals"},
  {text:"修理\nサービス",url:"/repair"},
  {text:"法人\n一括納品",url:"/wholesale"},
  {text:"Chromebook\n特集",url:"/search?brand=google"},
  {text:"タイム\nセール",url:"/search"},
  {text:"POD\nサービス",url:"/pod-service"},
  {text:"スマホ\nケース",url:"/search"},
  {text:"お問い\n合わせ",url:"/contact"},
];

function AdColumn({ads}: {ads:{text:string,url:string,image?:string}[]}) {
  const router = useRouter();
  return (
    <div style={{width:90,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
      {ads.map((ad,i)=>(
        <div key={i} onClick={()=>router.push(ad.url)}
          style={{width:90,height:400,background:"#E8E8E8",border:"1px dashed #AAA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"opacity 0.15s",writingMode:"vertical-rl",textOrientation:"mixed",overflow:"hidden",position:"relative"}}
          onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
          onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
          {ad.image
            ? <img src={ad.image} alt={ad.text} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{fontSize:11,color:"#999",textAlign:"center",lineHeight:1.8,whiteSpace:"pre-line"}}>{ad.text}</div>
          }
        </div>
      ))}
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

function BannerAd({ad}:{ad:HpAd|undefined}) {
  const router=useRouter();
  if(!ad||!ad.active) return null;
  return (
    <div onClick={()=>router.push(ad.link)}
      style={{width:"100%",height:260,minHeight:260,maxHeight:260,borderRadius:2,overflow:"hidden",position:"relative",background:`linear-gradient(135deg,${C.primaryBg},#B8EAE8)`,border:`1px solid ${C.primaryBorder}`,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
      onMouseEnter={e=>(e.currentTarget.style.opacity="0.9")}
      onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
      {ad.image&&(
        <img src={ad.image} alt={ad.title} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      )}
      {ad.image&&<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.28)"}}/>}
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 32px"}}>
        <div style={{fontSize:22,fontWeight:700,color:ad.image?"#fff":C.primaryDeep,lineHeight:1.4,textShadow:ad.image?"0 1px 4px rgba(0,0,0,0.6)":"none"}}>{ad.title}</div>
        {ad.subtitle&&<div style={{fontSize:13,marginTop:8,color:ad.image?"rgba(255,255,255,0.9)":C.textSub,textShadow:ad.image?"0 1px 3px rgba(0,0,0,0.5)":"none"}}>{ad.subtitle}</div>}
      </div>
    </div>
  );
}

function chunkArray<T>(arr:T[],size:number):T[][] {
  const chunks:T[][]=[];
  for(let i=0;i<arr.length;i+=size) chunks.push(arr.slice(i,i+size));
  return chunks;
}

function AutoSwitchGridCard({ad}:{ad:HpAd}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>router.push(ad.link)}
      style={{position:"relative",height:160,borderRadius:2,overflow:"hidden",cursor:"pointer",background:`linear-gradient(135deg,${C.primaryDeep},#0ABAB5)`,border:`2px solid ${hov?C.primary:C.primaryBorder}`,transition:"border-color 0.15s"}}>
      {ad.image&&<img src={ad.image} alt={ad.title} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:hov?"rgba(0,0,0,0.18)":"rgba(0,0,0,0.35)",transition:"background 0.2s"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:"0 12px",textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.4,textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{ad.title}</div>
        {ad.subtitle&&<div style={{fontSize:10,color:"rgba(255,255,255,0.88)",textShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>{ad.subtitle}</div>}
      </div>
    </div>
  );
}

function AdSlider({ads}:{ads:HpAd[]}) {
  const active=ads.filter(a=>a.active).sort((a,b)=>a.sort-b.sort);
  const pages=chunkArray(active,4);
  const [page,setPage]=useState(0);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    if(paused) return;
    const timer=setInterval(()=>setPage(p=>(p+1)%pages.length),4000);
    return ()=>clearInterval(timer);
  },[paused,pages.length]);
  if(pages.length===0) return null;
  return (
    <div style={{marginBottom:14}}
      onMouseEnter={()=>setPaused(true)}
      onMouseLeave={()=>setPaused(false)}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
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
  {id:"ap1",slug:"apple-iphone-14",     name:"Apple iPhone 14 64GB スペースグレイ 中古",                     brand_id:{name:"Apple"},images:[],grade:"A", price:58000,compare_at_price:89800},
  {id:"ap2",slug:"apple-ipad-10th",     name:"Apple iPad 第10世代 64GB Wi-Fi シルバー 中古",                 brand_id:{name:"Apple"},images:[],grade:"S", price:52000,compare_at_price:68800},
  {id:"ap3",slug:"apple-macbook-air-m1",name:"Apple MacBook Air M1 8GB/256GB スペースグレイ",               brand_id:{name:"Apple"},images:[],grade:"A", price:78000,compare_at_price:112800},
  {id:"ap4",slug:"apple-watch-s8",      name:"Apple Watch Series 8 41mm GPS アルミニウム 中古",             brand_id:{name:"Apple"},images:[],grade:"B", price:28000,compare_at_price:54800},
  {id:"ap5",slug:"apple-airpods-pro2",  name:"Apple AirPods Pro 第2世代 MagSafe充電ケース付き 中古",       brand_id:{name:"Apple"},images:[],grade:"A", price:18000,compare_at_price:39800},
];

const ACCESSORY_PRODUCTS = [
  {id:"ac1",slug:"usb-c-charger-65w",      name:"USB-C 急速充電器 65W GaN対応 3ポート コンパクト",                       brand_id:{name:""},images:[],grade:null,price:2980, compare_at_price:4980},
  {id:"ac2",slug:"wireless-mouse-silent",   name:"ワイヤレスマウス 静音 Bluetooth 充電式 6ボタン",                        brand_id:{name:""},images:[],grade:null,price:1980, compare_at_price:3280},
  {id:"ac3",slug:"mechanical-keyboard-tkl", name:"メカニカルキーボード テンキーレス 日本語配列 USB",                      brand_id:{name:""},images:[],grade:null,price:4980, compare_at_price:8800},
  {id:"ac4",slug:"portable-ssd-500gb",     name:"ポータブルSSD 500GB USB3.2 Gen2対応 高速転送",                          brand_id:{name:""},images:[],grade:null,price:5980, compare_at_price:9800},
  {id:"ac5",slug:"smartphone-case-clear",  name:"スマートフォンケース クリア 耐衝撃 全機種対応",                         brand_id:{name:""},images:[],grade:null,price:980,  compare_at_price:1980},
  {id:"ac6",slug:"wireless-earphones-anc", name:"ワイヤレスイヤホン Bluetooth5.3 アクティブノイズキャンセリング",        brand_id:{name:""},images:[],grade:null,price:3980, compare_at_price:7980},
];

export default function HomeClient({featured,newArrivals,categories,brands}: {featured:any[],newArrivals:any[],categories:any[],brands:any[]}) {
  const router=useRouter();
  const roots=categories.filter(c=>!c.parent_id);
  const [openCats,setOpenCats]=useState(roots.length>0?[String(roots[0]?.id)]:["1"]);

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>

      <div style={{width:"100%",maxWidth:"1800px",margin:"0 auto",padding:"0 12px"}}>
        <GridBanner/>
      </div>

      <div style={{width:"100%",maxWidth:"1800px",margin:"10px auto",padding:"0 12px"}}>
        <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>

          <AdColumn ads={LEFT_ADS}/>
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats}/>

          <div style={{flex:1,minWidth:0}}>

            <div style={{background:`linear-gradient(135deg,${C.primaryBg},#C8EEEC)`,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
              <div>
                <div style={{fontSize:18,fontWeight:900,color:C.primaryDeep}}>{"中古PC・スマートフォンが豊富！"}</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:4}}>{"全商品30日間動作保証付き・即日発送対応"}</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                <button onClick={()=>router.push("/search")} style={{background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{"商品一覧を見る"} &rarr;</button>
              </div>
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"6px 10px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>{"グレードガイド："}</span>
              {[{g:"NEW",l:"未開封・未使用"},{g:"S",l:"新品とほぼ同じ状態"},{g:"A",l:"軽微な使用痕跡あり"},{g:"B",l:"使用痕跡が比較的目立つ"},{g:"C",l:"訳あり品"}].map(({g,l})=>(
                <span key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                  <GradeBadge grade={g}/><span style={{fontSize:10,color:C.textSub}}>{l}</span>
                </span>
              ))}
            </div>

            <BannerAd ad={homepageAds.gradeBanner[0]}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"注目商品一覧"} en="FEATURED ITEMS"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {featured.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
            </div>

            <AdSlider ads={homepageAds.featuredSlider}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"新着商品"} en="NEW ARRIVALS" color={C.primaryDeep}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {newArrivals.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
            </div>

            <AdSlider ads={homepageAds.newSlider}/>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"Appleの商品"} en="APPLE PRODUCTS" color="#555"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {APPLE_PRODUCTS.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
              <AdSlider ads={homepageAds.appleSlider}/>
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader title={"アクセサリ"} en="ACCESSORIES" color="#555"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {ACCESSORY_PRODUCTS.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
              <AdSlider ads={homepageAds.accessorySlider}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {title:"30日間動作保証",body:"全商品に動作保証を付けてお届けします。万が一の際は交換・返金対応いたします。"},
                {title:"即日・翌日発送",body:"平日14時までのご注文は当日発送。最短翌日お届けが可能です（一部地域除く）。"},
                {title:"専門スタッフが対応",body:"商品選びのご相談は電話・メールで承っております。お気軽にお問い合わせください。"},
              ].map((item,i)=>(
                <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,padding:10,borderRadius:"0 0 2px 2px"}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6}}>{item.title}</div>
                  <div style={{fontSize:11,color:C.textSub,lineHeight:1.7}}>{item.body}</div>
                </div>
              ))}
            </div>

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

            <HomeReviews />
          </div>

          <AdColumn ads={RIGHT_ADS}/>
        </div>
      </div>

    </div>
  );
}
