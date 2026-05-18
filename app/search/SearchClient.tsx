"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";

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
};

const ICONS: Record<string,string> = {
  pc:"💻",laptop:"💻",desktop:"🖥️",smartphones:"📱",
  tablets:"📱",peripherals:"🖥️",parts:"🔧",accessories:"🎧",
};

function GradeBadge({grade}: {grade:string|null}) {
  if(!grade) return null;
  const s = GRADE_STYLE[grade]||GRADE_STYLE.C;
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px"}}>グレード{grade}</span>;
}

function ProductCard({product}: {product:any}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  const disc=product.compare_at_price?Math.round((1-product.price/product.compare_at_price)*100):0;
  const imgId=product.images?.[0]?.directus_files_id;
  const imgUrl=imgId?getImageUrl(imgId,300,225):null;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>router.push(`/products/${product.slug}`)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:10,cursor:"pointer",display:"flex",flexDirection:"column",gap:4,transition:"border-color 0.15s"}}>
      <div style={{background:"#F5FAFA",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",aspectRatio:"4/3",position:"relative",border:`1px solid ${C.primaryBorder}`,marginBottom:6,overflow:"hidden"}}>
        {imgUrl?<img src={imgUrl} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:40}}>💻</span>}
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
      </div>
      <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"—"}</div>
      <div style={{fontSize:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden",transition:"color 0.15s"}}>{product.name}</div>
      {product.grade&&<GradeBadge grade={product.grade}/>}
      <div style={{marginTop:"auto",paddingTop:6}}>
        {product.compare_at_price&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>定価 ¥{product.compare_at_price.toLocaleString()}</div>}
        <div style={{fontSize:16,fontWeight:700,color:C.red}}>¥{product.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span></div>
      </div>
      <button style={{marginTop:4,background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>詳細を見る →</button>
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

export default function SearchClient({initialProducts,brands,categories,query,brandFilter,categoryFilter,gradeFilter,pageTitle}:{
  initialProducts:any[], brands:any[], categories:any[],
  query:string, brandFilter:string, categoryFilter:string, gradeFilter:string,
  pageTitle?:string
}) {
  const router=useRouter();
  const [search,setSearch]=useState(query);
  const [grade,setGrade]=useState(gradeFilter);
  const [sort,setSort]=useState("newest");
  const roots=categories.filter(c=>!c.parent_id);
  const [openCats,setOpenCats]=useState(roots.length>0?[String(roots[0]?.id)]:["1"]);

  const filtered=initialProducts.filter(p=>{
    const q=search.toLowerCase();
    const matchQ=!q||p.name?.toLowerCase().includes(q)||p.brand_id?.name?.toLowerCase().includes(q)||p.short_description?.toLowerCase().includes(q);
    const matchG=!grade||p.grade===grade;
    const matchB=!brandFilter||p.brand_id?.slug===brandFilter;
    return matchQ&&matchG&&matchB;
  }).sort((a,b)=>{
    if(sort==="price-asc") return a.price-b.price;
    if(sort==="price-desc") return b.price-a.price;
    return new Date(b.published_at||0).getTime()-new Date(a.published_at||0).getTime();
  });

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      {/* Header */}
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>router.push("/")}>
              <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
              <div style={{fontSize:9,color:C.textLight}}>中古PC・スマホならデジマルショップ！</div>
            </div>
            <div style={{flex:1,display:"flex",maxWidth:500}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&router.push(`/search?q=${encodeURIComponent(search)}`)}
                placeholder="商品名・型番・キーワードで検索"
                style={{flex:1,border:`2px solid ${C.primary}`,borderRight:"none",padding:"7px 10px",fontSize:13,outline:"none",borderRadius:"2px 0 0 2px",fontFamily:"inherit"}}/>
              <button onClick={()=>router.push(`/search?q=${encodeURIComponent(search)}`)}
                style={{background:C.primary,color:"#fff",border:`2px solid ${C.primary}`,padding:"7px 18px",fontSize:13,fontWeight:700,cursor:"pointer",borderRadius:"0 2px 2px 0",fontFamily:"inherit"}}>検索</button>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0}}>
              {[{label:"会員登録",bg:"#4488CC",icon:"👤"},{label:"ログイン",bg:"#44AA44",icon:"🔑"}].map(b=>(
                <button key={b.label} style={{background:b.bg,color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>{b.icon} {b.label}</button>
              ))}
              <button style={{background:C.red,color:"#fff",border:"none",padding:"6px 12px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🛒 カート</button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex"}}>
          {[{label:"🏠 ホーム",path:"/"},{label:"📋 ショッピングガイド",path:"/"},{label:"🚚 送料・配送について",path:"/"},{label:"❓ よくあるご質問",path:"/"},{label:"🏢 会社概要",path:"/"},{label:"📞 お問い合わせ",path:"/"}].map((item,i)=>(
            <div key={i} onClick={()=>router.push(item.path)} style={{padding:"7px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",borderRight:`1px solid ${C.primaryDark}`,whiteSpace:"nowrap"}}
              onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>{item.label}</div>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{maxWidth:1100,margin:"8px auto",padding:"0 10px",fontSize:11,color:C.textSub}}>
        <span style={{cursor:"pointer",color:C.primary}} onClick={()=>router.push("/")}>ホーム</span>
        <span style={{margin:"0 6px"}}>›</span>
        <span style={{fontWeight:700,color:C.text}}>{pageTitle||query||"検索結果"}</span>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 10px 20px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>

          {/* Sidebar */}
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats}/>

          {/* Main */}
          <div style={{flex:1,minWidth:0}}>

            {/* Page title */}
            <div style={{background:C.primary,color:"#fff",padding:"6px 12px",fontSize:14,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span>📦</span> {pageTitle||`「${query}」の検索結果`}
              <span style={{fontSize:11,fontWeight:400,marginLeft:4,opacity:0.8}}>{filtered.length}件</span>
            </div>

            {/* Filters */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"8px 12px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>グレード：</span>
              {["","S","A","B","C"].map(g=>(
                <button key={g} onClick={()=>setGrade(g)} style={{padding:"3px 10px",borderRadius:2,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                  background:grade===g?C.primary:C.white,
                  color:grade===g?"#fff":C.textSub,
                  border:`1px solid ${grade===g?C.primary:C.border}`,
                }}>{g||"すべて"}</button>
              ))}
              <div style={{display:"flex",gap:4,alignItems:"center",marginLeft:"auto"}}>
                <span style={{fontSize:11,color:C.textSub}}>並び替え：</span>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:2,padding:"4px 8px",fontSize:11,fontFamily:"inherit",outline:"none"}}>
                  <option value="newest">新着順</option>
                  <option value="price-asc">価格が安い順</option>
                  <option value="price-desc">価格が高い順</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filtered.length>0?(
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {filtered.map((p:any)=><ProductCard key={p.id} product={p}/>)}
              </div>
            ):(
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"40px",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <div style={{fontSize:14,color:C.textSub}}>商品が見つかりませんでした</div>
                <button onClick={()=>router.push("/")} style={{marginTop:14,background:C.primary,color:"#fff",border:"none",padding:"8px 20px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>トップへ戻る</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:20,fontWeight:900,color:C.primary,fontFamily:"Arial Black,sans-serif",marginBottom:8,cursor:"pointer"}} onClick={()=>router.push("/")}>デジマルショップ</div>
          <div style={{fontSize:10,color:"#5A8A8A",borderTop:"1px solid #3A6A6A",paddingTop:10,marginTop:8}}>
            © 2024 デジマルショップ. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
