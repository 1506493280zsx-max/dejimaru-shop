"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import Header from "@/app/components/Header";
import Footer from "@/components/Footer";
import { useWishlistStore } from "@/lib/wishlist-store";

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

const ICONS: Record<string,string> = {
  pc:"\uD83D\uDCBB",laptop:"\uD83D\uDCBB",desktop:"\uD83D\uDDA5\uFE0F",smartphones:"\uD83D\uDCF1",
  tablets:"\uD83D\uDCF1",peripherals:"\uD83D\uDDA5\uFE0F",parts:"\uD83D\uDD27",accessories:"\uD83C\uDFA7",
};

const GRID_ADS = [
  {text:"\u671F\u9593\u9650\u5B9A\u30BB\u30FC\u30EB",url:"/search"},
  {text:"MacBook\u7279\u96C6",url:"/category/laptops-used-mac"},
  {text:"iPhone\u4E2D\u53E4",url:"/category/smartphones-iphone-used"},
  {text:"\u30B2\u30FC\u30DF\u30F3\u30B0PC",url:"/category/desktops-gaming"},
  {text:"\u30BF\u30D6\u30EC\u30C3\u30C8\u7279\u96C6",url:"/category/tablets"},
  {text:"\u30BF\u30A4\u30E0\u30BB\u30FC\u30EB",url:"/search"},
  {text:"SSD\u5927\u7279\u96C6",url:"/category/storage-ssd-internal"},
  {text:"\u30D3\u30B8\u30CD\u30B9PC",url:"/category/laptops-used-business"},
  {text:"Android\u4E2D\u53E4",url:"/category/smartphones-android-used"},
  {text:"\u5468\u8FBA\u6A5F\u5668\u7279\u96C6",url:"/category/peripherals"},
];

function GridBanner() {
  const router = useRouter();
  const doubled = [...GRID_ADS, ...GRID_ADS];
  const MarqueeRow = ({reversed}: {reversed:boolean}) => (
    <div style={{overflow:"hidden",height:155,marginBottom:4}}>
      <div style={{
        display:"flex",height:"100%",
        animation:`${reversed?"marqueeReverse":"marqueeForward"} 60s linear infinite`,
        width:"max-content",
      }}>
        {doubled.map((ad,i)=>(
          <div key={i} onClick={()=>router.push(ad.url)}
            style={{width:200,height:155,marginRight:4,flexShrink:0,background:"#E0E0E0",border:"1px dashed #AAA",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:2}}
            onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
            onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
            <div style={{fontSize:13,fontWeight:700,color:"#888",textAlign:"center",padding:"0 8px"}}>{ad.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <>
      <style>{`
        @keyframes marqueeForward { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marqueeReverse { from{transform:translateX(-50%)} to{transform:translateX(0)} }
      `}</style>
      <MarqueeRow reversed={false}/>
      <MarqueeRow reversed={true}/>
    </>
  );
}

function GradeBadge({grade}: {grade:string|null}) {
  if(!grade) return null;
  const s = GRADE_STYLE[grade]||GRADE_STYLE.C;
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",marginRight:4}}>{"\u30B0\u30EC\u30FC\u30C9"}{grade}</span>;
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
        {imgUrl?<img src={imgUrl} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:size==="small"?36:48}}>{"\uD83D\uDCBB"}</span>}
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
        <div onClick={e=>{e.stopPropagation();toggle({id:String(product.id),slug:product.slug,name:product.name,price:product.price,imageUrl:imgUrl,brand:product.brand_id?.name||"",grade:product.grade});}}
          style={{position:"absolute",top:6,left:6,width:26,height:26,background:"rgba(255,255,255,0.9)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
          {liked?"\u2764\uFE0F":"\uD83E\uDD0D"}
        </div>
      </div>
      <div onClick={()=>router.push(`/products/${product.slug}`)}>
        <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"—"}</div>
        <div style={{fontSize:size==="small"?11:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>{product.name}</div>
        {product.grade&&<div style={{marginTop:2}}><GradeBadge grade={product.grade}/></div>}
        <div style={{marginTop:4}}>
          {product.compare_at_price&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>{"\u5B9A\u4FA1"} &yen;{product.compare_at_price.toLocaleString()}</div>}
          <div style={{fontSize:size==="small"?14:16,fontWeight:700,color:C.red}}>&yen;{product.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>{"\uFF08\u7A0E\u8FBC\uFF09"}</span></div>
        </div>
      </div>
      <button onClick={()=>router.push(`/products/${product.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        {"\u8A73\u7D30\u3092\u898B\u308B"} &rarr;
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
    <div style={{width:185,flexShrink:0}}>
      <div style={{background:C.primary,color:"#fff",padding:"7px 10px",fontSize:12,fontWeight:700,borderBottom:`1px solid ${C.primaryDark}`,display:"flex",alignItems:"center",gap:6}}>
        <span>&#9632;</span> {"\u30AB\u30C6\u30B4\u30EA"} <span style={{fontSize:9,fontWeight:400,marginLeft:2,opacity:0.8}}>category</span>
      </div>
      {roots.map(cat=>{
        const children=getChildren(String(cat.id));
        const isOpen=openCats.includes(String(cat.id));
        return (
          <div key={cat.id}>
            <div onClick={()=>toggle(String(cat.id))} style={{padding:"8px 10px",background:isOpen?C.primaryBg:"#F9F9F9",borderBottom:"1px solid #D8ECEC",cursor:"pointer",display:"flex",alignItems:"center",gap:6,borderLeft:`3px solid ${isOpen?C.primary:"transparent"}`}}>
              <span style={{fontSize:14}}>{ICONS[cat.slug]||"\uD83D\uDCE6"}</span>
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
                  <span>{"\u3059\u3079\u3066\u898B\u308B"}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
        {[
          {icon:"\uD83D\uDE9A",title:"\u9001\u6599\u306B\u3064\u3044\u3066",sub:"\u5168\u56FD\u4E00\u5F8B\u9001\u6599"},
          {icon:"\uD83D\uDEE1\uFE0F",title:"30\u65E5\u9593\u4FDD\u8A3C",sub:"\u5168\u5546\u54C1\u4FDD\u8A3C\u4ED8\u304D"},
          {icon:"\uD83D\uDCDE",title:"\u304A\u554F\u3044\u5408\u308F\u305B",sub:"03-0000-0000"},
        ].map((item,i)=>(
          <div key={i} style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:5}}><span>{item.icon}</span>{item.title}</div>
            <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const LEFT_ADS = [
  {text:"\u671F\u9593\u9650\u5B9A\n\u30BB\u30FC\u30EB",url:"/search"},
  {text:"MacBook\n\u7279\u96C6",url:"/category/laptops-used-mac"},
  {text:"iPhone\n\u4E2D\u53E4",url:"/category/smartphones-iphone-used"},
  {text:"\u30B2\u30FC\u30DF\u30F3\u30B0\nPC",url:"/category/desktops-gaming"},
  {text:"\u30BF\u30D6\u30EC\u30C3\u30C8\n\u7279\u96C6",url:"/category/tablets"},
];

const RIGHT_ADS = [
  {text:"\u672C\u65E5\u9650\u5B9A\n\u30BF\u30A4\u30E0\u30BB\u30FC\u30EB",url:"/search"},
  {text:"SSD\n\u5927\u7279\u96C6",url:"/category/storage-ssd-internal"},
  {text:"\u30D3\u30B8\u30CD\u30B9\nPC",url:"/category/laptops-used-business"},
  {text:"Android\n\u4E2D\u53E4",url:"/category/smartphones-android-used"},
  {text:"\u5468\u8FBA\u6A5F\u5668\n\u7279\u96C6",url:"/category/peripherals"},
];

function AdColumn({ads}: {ads:{text:string,url:string}[]}) {
  const router = useRouter();
  return (
    <div style={{width:90,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
      {ads.map((ad,i)=>(
        <div key={i} onClick={()=>router.push(ad.url)}
          style={{width:90,height:400,background:"#E8E8E8",border:"1px dashed #AAA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"opacity 0.15s",writingMode:"vertical-rl",textOrientation:"mixed"}}
          onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
          onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
          <div style={{fontSize:11,color:"#999",textAlign:"center",lineHeight:1.8,whiteSpace:"pre-line"}}>{ad.text}</div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({icon,title,en,color}:{icon:string,title:string,en:string,color?:string}) {
  return (
    <div style={{background:color||C.primary,color:"#fff",padding:"6px 10px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
      <span>{icon}</span> {title}
      <span style={{fontSize:10,fontWeight:400,marginLeft:4,opacity:0.8}}>{en}</span>
    </div>
  );
}

export default function HomeClient({featured,newArrivals,categories,brands}: {featured:any[],newArrivals:any[],categories:any[],brands:any[]}) {
  const router=useRouter();
  const roots=categories.filter(c=>!c.parent_id);
  const [openCats,setOpenCats]=useState(roots.length>0?[String(roots[0]?.id)]:["1"]);

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>

      <Header/>
      <div style={{maxWidth:1100,margin:"4px auto",padding:"0 10px",overflow:"hidden"}}>
        <GridBanner/>
      </div>

      <div style={{maxWidth:1100,margin:"10px auto",padding:"0 10px"}}>
        <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>

          <AdColumn ads={LEFT_ADS}/>
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats}/>

          <div style={{flex:1,minWidth:0}}>

            <div style={{background:`linear-gradient(135deg,${C.primaryBg},#C8EEEC)`,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontSize:44}}>{"\uD83D\uDDA5\uFE0F"}</div>
              <div>
                <div style={{fontSize:18,fontWeight:900,color:C.primaryDeep}}>{"\u4E2D\u53E4PC\u30FB\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u304C\u8C4A\u5BCC\uFF01"}</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:4}}>{"\u5168\u5546\u54C130\u65E5\u9593\u52D5\u4F5C\u4FDD\u8A3C\u4ED8\u304D\u30FB\u5373\u65E5\u767A\u9001\u5BFE\u5FDC"}</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                <button onClick={()=>router.push("/search")} style={{background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{"\u5546\u54C1\u4E00\u89A7\u3092\u898B\u308B"} &rarr;</button>
              </div>
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"6px 10px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>{"\u30B0\u30EC\u30FC\u30C9\u30AC\u30A4\u30C9\uFF1A"}</span>
              {[{g:"S",l:"\u672A\u4F7F\u7528\u54C1"},{g:"A",l:"\u7F8E\u54C1"},{g:"B",l:"\u4E2D\u53E4\u826F\u54C1"},{g:"C",l:"\u4E2D\u53E4\u54C1"}].map(({g,l})=>(
                <span key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                  <GradeBadge grade={g}/><span style={{fontSize:10,color:C.textSub}}>{l}</span>
                </span>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader icon="★" title={"\u6CE8\u76EE\u5546\u54C1\u4E00\u89A7"} en="FEATURED ITEMS"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {featured.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader icon="🆕" title={"\u65B0\u7740\u5546\u54C1"} en="NEW ARRIVALS" color={C.primaryDeep}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {newArrivals.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {icon:"\uD83D\uDEE1\uFE0F",title:"30\u65E5\u9593\u52D5\u4F5C\u4FDD\u8A3C",body:"\u5168\u5546\u54C1\u306B\u52D5\u4F5C\u4FDD\u8A3C\u3092\u4ED8\u3051\u3066\u304A\u5C4A\u3051\u3057\u307E\u3059\u3002\u4E07\u304C\u4E00\u306E\u969B\u306F\u4EA4\u63DB\u30FB\u8FD4\u91D1\u5BFE\u5FDC\u3044\u305F\u3057\u307E\u3059\u3002"},
                {icon:"\uD83D\uDE9A",title:"\u5373\u65E5\u30FB\u7FCC\u65E5\u767A\u9001",body:"\u5E73\u65E514\u6642\u307E\u3067\u306E\u3054\u6CE8\u6587\u306F\u5F53\u65E5\u767A\u9001\u3002\u6700\u77ED\u7FCC\u65E5\u304A\u5C4A\u3051\u304C\u53EF\u80FD\u3067\u3059\uFF08\u4E00\u90E8\u5730\u57DF\u9664\u304F\uFF09\u3002"},
                {icon:"\uD83D\uDCDE",title:"\u5C02\u9580\u30B9\u30BF\u30C3\u30D5\u304C\u5BFE\u5FDC",body:"\u5546\u54C1\u9078\u3073\u306E\u3054\u76F8\u8AC7\u306F\u96FB\u8A71\u30FB\u30E1\u30FC\u30EB\u3067\u627F\u3063\u3066\u304A\u308A\u307E\u3059\u3002\u304A\u6C17\u8EFD\u306B\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002"},
              ].map((item,i)=>(
                <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,padding:10,borderRadius:"0 0 2px 2px"}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:20}}>{item.icon}</span>{item.title}
                  </div>
                  <div style={{fontSize:11,color:C.textSub,lineHeight:1.7}}>{item.body}</div>
                </div>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader icon="🏷️" title={"\u30D6\u30E9\u30F3\u30C9\u304B\u3089\u63A2\u3059"} en="BRANDS" color="#555"/>
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

          <AdColumn ads={RIGHT_ADS}/>

        </div>
      </div>

      <Footer />
    </div>
  );
}
