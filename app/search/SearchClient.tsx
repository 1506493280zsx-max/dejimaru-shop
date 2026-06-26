"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import type { Brand } from "@/lib/directus";
import { getBrandsForCategory } from "@/lib/category-brands";

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

const ICONS: Record<string,string> = {
  pc:"💻",laptop:"💻",desktop:"🖥️",smartphones:"📱",
  tablets:"📱",peripherals:"🖥️",parts:"🔧",accessories:"🎧",
};

function GradeBadge({grade}: {grade:string|null}) {
  if(!grade) return null;
  const s = GRADE_STYLE[grade]||GRADE_STYLE.C;
  return <span style={{display:"inline-block",background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px"}}>{s.label}</span>;
}

function ProductCard({product}: {product:any}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
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

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>router.push(`/products/${product.slug}`)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:10,cursor:"pointer",display:"flex",flexDirection:"column",gap:4,transition:"border-color 0.15s"}}>
      <div style={{width:"100%",padding:8,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#fff",position:"relative"}}>
        {imgUrl?<img src={imgUrl} alt={product.name} style={{width:"100%",height:"auto",maxHeight:220,objectFit:"contain",objectPosition:"center",display:"block"}}/>:<span style={{fontSize:40}}>💻</span>}
        {disc>=1&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
      </div>
      <div style={{fontSize:10,color:C.textLight}}>{product.brand_id?.name||"—"}</div>
      <div style={{fontSize:12,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden",transition:"color 0.15s"}}>{product.name}</div>
      {(product.is_new||product.grade)&&<GradeBadge grade={product.is_new?"NEW":product.grade}/>}
      <div style={{marginTop:"auto",paddingTop:6}}>
        {comparePrice&&<div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>定価 ¥{comparePrice.toLocaleString()}</div>}
        <div style={{fontSize:16,fontWeight:700,color:C.red}}>
          ¥{minPrice.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span>
        </div>
      </div>
      <button style={{marginTop:4,background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>詳細を見る →</button>
    </div>
  );
}

function CategorySidebar({categories,openCats,setOpenCats,brands}: {categories:any[],openCats:string[],setOpenCats:any,brands:Brand[]}) {
  const router=useRouter();
  const toggle=(id:string)=>setOpenCats((p:string[])=>p.includes(id)?p.filter((x:string)=>x!==id):[...p,id]);
  const roots=categories.filter(c=>!c.parent_id);
  const getChildren=(pid:string)=>categories.filter(c=>String(c.parent_id)===String(pid));

  return (
    <div style={{width:185,flexShrink:0,position:"sticky",top:20,alignSelf:"flex-start",height:"fit-content"}}>
      <div style={{background:C.primary,color:"#fff",padding:"7px 10px",fontSize:12,fontWeight:700,borderBottom:`1px solid ${C.primaryDark}`,display:"flex",alignItems:"center",gap:6}}>
        <span>■</span> カテゴリ <span style={{fontSize:9,fontWeight:400,marginLeft:2,opacity:0.8}}>category</span>
      </div>
      {roots.map(cat=>{
        const children=getChildren(String(cat.id));
        const isOpen=openCats.includes(String(cat.id));
        const catBrands=getBrandsForCategory(cat.slug, brands);
        return (
          <div key={cat.id}>
            <div onClick={()=>router.push(`/category/${cat.slug}`)} style={{padding:"8px 10px",background:isOpen?C.primaryBg:"#F9F9F9",borderBottom:"1px solid #D8ECEC",cursor:"pointer",display:"flex",alignItems:"center",gap:6,borderLeft:`3px solid ${isOpen?C.primary:"transparent"}`}}>
              <span style={{fontSize:14}}>{ICONS[cat.slug]||"📦"}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{cat.name}</div></div>
              <span onClick={(e)=>{e.stopPropagation();toggle(String(cat.id));}} style={{fontSize:10,color:C.primary,fontWeight:700,padding:"2px 4px"}}>{isOpen?"▲":"▶"}</span>
            </div>
            {isOpen&&(
              <div style={{background:C.white}}>
                {(children.length>0 && (cat.slug==="peripherals"||cat.slug==="storage"))
                  ? children.map(child=>(
                      <div key={child.slug}
                        onClick={()=>router.push(`/category/${child.slug}`)}
                        style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}
                        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                        <span style={{color:C.primary,fontSize:9}}>●</span>
                        <span style={{flex:1}}>{child.name}</span>
                      </div>
                    ))
                  : catBrands.map(b=>(
                      <div key={b.slug}
                        onClick={()=>router.push(`/search?brand=${b.slug}&category=${cat.slug}`)}
                        style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}
                        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
                        <span style={{color:C.primary,fontSize:9}}>●</span>
                        <span style={{flex:1}}>{b.name}</span>
                      </div>
                    ))
                }
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

export default function SearchClient({initialProducts,brands,categories,query,brandFilter,categoryFilter,gradeFilter,priceMinFilter,priceMaxFilter,cpuFilter,cpuGenerationFilter,screenSizeFilter,pageTitle}:{
  initialProducts:any[], brands:any[], categories:any[],
  query:string, brandFilter:string, categoryFilter:string, gradeFilter:string,
  priceMinFilter?:string, priceMaxFilter?:string,
  cpuFilter?:string, cpuGenerationFilter?:string, screenSizeFilter?:string,
  pageTitle?:string
}) {
  const router=useRouter();
  const [search,setSearch]=useState(query);
  const [grade,setGrade]=useState(gradeFilter);
  const [sort,setSort]=useState("newest");
  const roots=categories.filter(c=>!c.parent_id);
  const currentCat=categories.find((c:any)=>c.slug===categoryFilter);
  const initOpen=currentCat?.parent_id
    ?[String(currentCat.parent_id)]
    :currentCat?.id?[String(currentCat.id)]
    :roots.length>0?[String(roots[0]?.id)]:["1"];
  const [openCats,setOpenCats]=useState(initOpen);

  const filtered=initialProducts.filter(p=>{
    const q=search.toLowerCase();
    const matchQ=!q||p.name?.toLowerCase().includes(q)||p.brand_id?.name?.toLowerCase().includes(q)||p.short_description?.toLowerCase().includes(q);
    const matchG=!grade||p.grade===grade;
    const matchB=!brandFilter||p.brand_id?.slug===brandFilter||p.brand_id?.name?.toLowerCase()===brandFilter.toLowerCase();
    const matchC =
      !categoryFilter
      || p.category_id?.slug === categoryFilter
      || p.category_id?.name === categoryFilter;
    const activeVariants = (p.product_variants || []).filter((v: any) => v.status === "active" && v.price > 0);
    const hasVariants = activeVariants.length > 0;
    let matchPMin = true;
    let matchPMax = true;
    if (hasVariants) {
      const variantPrices: number[] = activeVariants.map((v: any) => v.price);
      if (priceMinFilter) matchPMin = variantPrices.some((price: number) => price >= parseInt(priceMinFilter, 10));
      if (priceMaxFilter) matchPMax = variantPrices.some((price: number) => price <= parseInt(priceMaxFilter, 10));
    } else {
      const productPrice = p.price ?? 0;
      if (priceMinFilter) matchPMin = productPrice >= parseInt(priceMinFilter, 10);
      if (priceMaxFilter) matchPMax = productPrice <= parseInt(priceMaxFilter, 10);
    }
    const matchCpu = !cpuFilter || p.cpu === cpuFilter;
    const matchCpuGen = !cpuGenerationFilter || (p.cpu_generation && p.cpu_generation.toString().includes(cpuGenerationFilter));
    const matchScreenSize = !screenSizeFilter || (p.display_size && p.display_size.toString().includes(screenSizeFilter));
    return matchQ&&matchG&&matchB&&matchC&&matchPMin&&matchPMax&&matchCpu&&matchCpuGen&&matchScreenSize;
  }).sort((a,b)=>{
    if(sort==="price-asc") return a.price-b.price;
    if(sort==="price-desc") return b.price-a.price;
    return new Date(b.published_at||0).getTime()-new Date(a.published_at||0).getTime();
  });

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>


      <div style={{maxWidth:1100,margin:"8px auto",padding:"0 10px",fontSize:11,color:C.textSub}}>
        <span style={{cursor:"pointer",color:C.primary}} onClick={()=>router.push("/")}>ホーム</span>
        <span style={{margin:"0 6px"}}>›</span>
        <span style={{fontWeight:700,color:C.text}}>{pageTitle||query||"検索結果"}</span>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 10px 20px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <CategorySidebar categories={categories} openCats={openCats} setOpenCats={setOpenCats} brands={brands}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{background:C.primary,color:"#fff",padding:"6px 12px",fontSize:14,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span>📦</span> {pageTitle||`「${query}」の検索結果`}
              <span style={{fontSize:11,fontWeight:400,marginLeft:4,opacity:0.8}}>{filtered.length}件</span>
            </div>
            <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"8px 12px",marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.textSub}}>グレード：</span>
              {[{v:"",l:"すべて"},{v:"NEW",l:"新品"},{v:"A",l:"中古Aランク"},{v:"B",l:"中古Bランク"},{v:"C",l:"中古Cランク"}].map(({v,l})=>(
                <button key={v} onClick={()=>setGrade(v)} style={{padding:"3px 10px",borderRadius:2,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                  background:grade===v?C.primary:C.white,
                  color:grade===v?"#fff":C.textSub,
                  border:`1px solid ${grade===v?C.primary:C.border}`,
                }}>{l}</button>
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

    </div>
  );
}
