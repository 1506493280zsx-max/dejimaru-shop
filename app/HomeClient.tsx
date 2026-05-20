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

const GRID_ADS = [
  {text:"期間限定セール",url:"/search"},
  {text:"MacBook特集",url:"/category/laptops-used-mac"},
  {text:"iPhone中古",url:"/category/smartphones-iphone-used"},
  {text:"ゲーミングPC",url:"/category/desktops-gaming"},
  {text:"タブレット特集",url:"/category/tablets"},
  {text:"タイムセール",url:"/search"},
  {text:"SSD大特集",url:"/category/storage-ssd-internal"},
  {text:"ビジネスPC",url:"/category/laptops-used-business"},
  {text:"Android中古",url:"/category/smartphones-android-used"},
  {text:"周辺機器特集",url:"/category/peripherals"},
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
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",marginRight:4}}>{"グレード"}{grade}</span>;
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
    <div style={{width:185,flexShrink:0}}>
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
];

const RIGHT_ADS = [
  {text:"本日限定\nタイムセール",url:"/search"},
  {text:"SSD\n大特集",url:"/category/storage-ssd-internal"},
  {text:"ビジネス\nPC",url:"/category/laptops-used-business"},
  {text:"Android\n中古",url:"/category/smartphones-android-used"},
  {text:"周辺機器\n特集",url:"/category/peripherals"},
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

function SectionHeader({title,en,color}:{title:string,en:string,color?:string}) {
  return (
    <div style={{background:color||C.primary,color:"#fff",padding:"6px 10px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",marginBottom:8}}>
      {title}
      <span style={{fontSize:10,fontWeight:400,marginLeft:6,opacity:0.8}}>{en}</span>
    </div>
  );
}

export default function HomeClient({featured,newArrivals,categories,brands}: {featured:any[],newArrivals:any[],categories:any[],brands:any[]}) {
  const router=useRouter();
  const roots=categories.filter(c=>!c.parent_id);
  const [openCats,setOpenCats]=useState(roots.length>0?[String(roots[0]?.id)]:["1"]);

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>

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
              {[{g:"S",l:"未使用品"},{g:"A",l:"美品"},{g:"B",l:"中古良品"},{g:"C",l:"中古品"}].map(({g,l})=>(
                <span key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                  <GradeBadge grade={g}/><span style={{fontSize:10,color:C.textSub}}>{l}</span>
                </span>
              ))}
            </div>

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
          </div>

          <AdColumn ads={RIGHT_ADS}/>

        </div>
      </div>

      <Footer />
    </div>
  );
}
