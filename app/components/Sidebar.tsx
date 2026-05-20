"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
};

export default function Sidebar({categories}: {categories:any[]}) {
  const router = useRouter();
  const roots = categories.filter(c=>!c.parent_id);
  const [openCats, setOpenCats] = useState(roots.length>0?[String(roots[0]?.id)]:["1"]);
  const toggle = (id:string) => setOpenCats(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const getChildren = (pid:string) => categories.filter(c=>String(c.parent_id)===String(pid));

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
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{cat.name}</div></div>
              <span style={{fontSize:10,color:C.primary,fontWeight:700}}>{isOpen?"▲":"▶"}</span>
            </div>
            {isOpen&&(
              <div style={{background:"#fff"}}>
                {children.map((sub:any)=>(
                  <div key={sub.id} onClick={()=>router.push(`/category/${sub.slug}`)}
                    style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.textSub,display:"flex",alignItems:"center",gap:4}}
                    onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                    onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
                    <span style={{color:C.primary,fontSize:9}}>▶</span>
                    <span style={{flex:1}}>{sub.name}</span>
                  </div>
                ))}
                <div onClick={()=>router.push(`/category/${cat.slug}`)}
                  style={{padding:"5px 10px 5px 26px",borderBottom:"1px solid #EEF6F6",cursor:"pointer",fontSize:11,color:C.primary,display:"flex",alignItems:"center",gap:4,fontWeight:700}}
                  onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
                  <span style={{color:C.primary,fontSize:9}}>▶</span>
                  <span>すべて見る</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
        {[{title:"送料について",sub:"全国一律無料"},{title:"30日間保証",sub:"全商品保証付き"},{title:"お問い合わせ",sub:"メールにて受付"}].map((item,i)=>(
          <div key={i} style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"6px 8px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text}}>{item.title}</div>
            <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
