"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import Header from "@/app/components/Header";

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
  pc:"💻",laptop:"💻",desktop:"🖥️",smartphones:"📱",
  tablets:"📱",peripherals:"🖥️",parts:"🔧",accessories:"🎧",
};

function GradeBadge({grade}: {grade:string|null}) {
  if(!grade) return null;
  const s = GRADE_STYLE[grade]||GRADE_STYLE.C;
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",marginRight:4}}>グレード{grade}</span>;
}

function ProductCard({product, size="normal"}: {product:any, size?:string}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  const disc=product.compare_at_price?Math.round((1-product.price/product.compare_at_price)*100):0;
  const imgId=product.images?.[0]?.directus_files_id;
  const imgUrl=imgId?getImageUrl(imgId,300,225):null;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:size==="small"?8:10,cursor:"pointer",transition:"border-color 0.15s",display:"flex",flexDirection:"column",gap:4}}>
      <div onClick={()=>router.push(`/products/${product.slug}`)}
        style={{background:"#F5FAFA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",aspectRatio:"4/3",position:"relative",border:`1px solid ${C.primaryBorder}`,marginBottom:6,overflow:"hidden"}}>
        {imgUrl?<img src={imgUrl} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:size==="small"?36:48}}>💻</span>}
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
      </div>
      <div onClick={()=>router.push(`/products/${product.slug}`)}>
        <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"—"}</div>
        <div style={{fontSize:size==="small"?11:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>{product.name}</div>
        {product.grade&&<div style={{marginTop:2}}><GradeBadge grade={product.grade}/></div>}
        <div style={{marginTop:4}}>
          {product.compare_at_price&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>定価 ¥{product.compare_at_price.toLocaleString()}</div>}
          <div style={{fontSize:size==="small"?14:16,fontWeight:700,color:C.red}}>¥{product.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span></div>
        </div>
      </div>
      <button onClick={()=>router.push(`/products/${product.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        詳細を見る →
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
        <span>■</span> カテゴリ <span style={{fontSize:9,fontWeight:400,marginLeft:2,opacity:0.8}}>category</span>
      </div>
      {roots.map(cat=>{
        const children=getChildren(String(cat.id));
        const isOpen=openCats.includes(String(cat.id));
        return (
          <div key={cat.id}>
            <div onClick={()=>toggle(String(cat.id))} style={{padding:"8px 10px",background:isOpen?C.primaryBg:"#F9F9F9",borderBottom:"1px solid #D8ECEC",cursor:"pointer",display:"flex",alignItems:"center",gap:6,borderLeft:`3px solid ${isOpen?C.primary:"transparent"}`}}>
              <span style={{fontSize:14}}>{ICONS[cat.slug]||"📦"}</span>
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
                  <span>すべて見る</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
        {[{icon:"🚚",title:"送料について",sub:"全国一律送料"},{icon:"🛡️",title:"30日間保証",sub:"全商品保証付き"},{icon:"📞",title:"お問い合わせ",sub:"03-0000-0000"}].map((item,i)=>(
          <div key={i} style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:5}}><span>{item.icon}</span>{item.title}</div>
            <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{item.sub}</div>
          </div>
        ))}
      </div>
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
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>

      <Header/>

      <div style={{maxWidth:1100,margin:"10px auto",padding:"0 10px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats}/>
          <div style={{flex:1,minWidth:0}}>

            <div style={{background:`linear-gradient(135deg,${C.primaryBg},#C8EEEC)`,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontSize:44}}>🖥️</div>
              <div>
                <div style={{fontSize:18,fontWeight:900,color:C.primaryDeep}}>中古PC・スマートフォンが豊富！</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:4}}>全商品30日間動作保証付き・即日発送対応</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                <button onClick={()=>router.push("/search")} style={{background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>商品一覧を見る →</button>
              </div>
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"6px 10px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>グレードガイド：</span>
              {[{g:"S",l:"未使用品"},{g:"A",l:"美品"},{g:"B",l:"中古良品"},{g:"C",l:"中古品"}].map(({g,l})=>(
                <span key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                  <GradeBadge grade={g}/><span style={{fontSize:10,color:C.textSub}}>{l}</span>
                </span>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader icon="★" title="注目商品一覧" en="FEATURED ITEMS"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {featured.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <SectionHeader icon="🆕" title="新着商品" en="NEW ARRIVALS" color={C.primaryDeep}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {newArrivals.map((p:any)=><ProductCard key={p.id} product={p} size="small"/>)}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {icon:"🛡️",title:"30日間動作保証",body:"全商品に動作保証を付けてお届けします。万が一の際は交換・返金対応いたします。"},
                {icon:"🚚",title:"即日・翌日発送",body:"平日14時までのご注文は当日発送。最短翌日お届けが可能です（一部地域除く）。"},
                {icon:"📞",title:"専門スタッフが対応",body:"商品選びのご相談は電話・メールで承っております。お気軽にお問い合わせください。"},
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
              <SectionHeader icon="🏷️" title="ブランドから探す" en="BRANDS" color="#555"/>
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
        </div>
      </div>

      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px",marginTop:10}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:20,fontWeight:900,color:C.primary,fontFamily:"Arial Black,sans-serif",marginBottom:8,cursor:"pointer"}} onClick={()=>router.push("/")}>デジマルショップ</div>
          <div style={{display:"flex",gap:20,marginBottom:10,flexWrap:"wrap"}}>
            {["会社概要","特定商取引法に基づく表記","プライバシーポリシー","ショッピングガイド","お問い合わせ"].map(l=>(
              <span key={l} style={{fontSize:11,cursor:"pointer",color:"#7AACAC"}}>{l}</span>
            ))}
          </div>
          <div style={{fontSize:10,color:"#5A8A8A",borderTop:"1px solid #3A6A6A",paddingTop:10}}>
            © 2024 デジマルショップ. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
