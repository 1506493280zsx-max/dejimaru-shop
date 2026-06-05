"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const FAQS = [
  {cat:"注文について",items:[
    {q:"注文後にキャンセルできますか？",a:"発送前であればキャンセル可能です。ご注文確定後すぐにメールにてご連絡ください。発送後のキャンセルはお受けできません。"},
    {q:"注文確認メールが届きません",a:"メールが届かない場合は、迷惑メールフォルダをご確認ください。"},
    {q:"注文内容を変更したい",a:"発送前であれば変更可能な場合がございます。お早めにメールにてご連絡ください。"},
  ]},
  {cat:"支払いについて",items:[
    {q:"支払い方法は何がありますか？",a:"銀行振込・代金引換・クレジットカード（VISA・MasterCard・JCB・AMEX）がご利用いただけます。"},
    {q:"代金引換でクレジットカードは使えますか？",a:"代金引換でのお支払いは現金のみとなっております。"},
    {q:"領収書は発行されますか？",a:"代金引換の場合は配送会社発行の領収書をご利用ください。銀行振込の場合は振込明細書が代わりとなります。"},
  ]},
  {cat:"配送について",items:[
    {q:"送料はいくらですか？",a:"送料については「送料・配送について」ページをご確認ください。"},
    {q:"いつ届きますか？",a:"平日14時までのご注文は当日出荷いたします。出荷翌日〜3営業日程度でお届けします。"},
    {q:"時間指定はできますか？",a:"午前中・14〜16時・16〜18時・18〜20時・19〜21時からご指定いただけます。"},
  ]},
  {cat:"商品・保証について",items:[
    {q:"中古品のグレードとは何ですか？",a:"グレードガイド：\n\n新品：未開封・未使用\nS級：新品とほぼ同じ状態\nA級：わずかな使用痕あり\nB級：使用痕が比較的目立つ\nC級：傷あり"},
    {q:"保証期間はどのくらいですか？",a:"商品到着後30日間の初期不良保証がございます。"},
    {q:"初期不良だった場合どうすればいいですか？",a:"商品到着後30日以内にメールにてご連絡ください。代替品の発送またはご返金にて対応いたします。"},
  ]},
];

function FaqItem({q,a}:{q:string,a:string}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{borderBottom:"1px solid #EEF6F6"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10,background:open?C.primaryBg:C.white}}
        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
        onMouseLeave={e=>(e.currentTarget.style.background=open?C.primaryBg:C.white)}>
        <span style={{color:C.primary,fontWeight:900,fontSize:14,flexShrink:0}}>Q</span>
        <span style={{flex:1,fontSize:13,fontWeight:700,color:C.text}}>{q}</span>
        <span style={{color:C.primary,fontWeight:700,fontSize:12,flexShrink:0}}>{open?"▲":"▼"}</span>
      </div>
      {open&&<div style={{padding:"10px 14px 14px 38px",background:"#F8FFFE",fontSize:13,color:C.textSub,lineHeight:1.8,borderTop:`1px solid ${C.primaryBg}`}}>
        <span style={{color:C.primary,fontWeight:900,marginRight:8}}>A</span>{a}
      </div>}
    </div>
  );
}

const hiddenSidebarRoutes = ["/guide", "/faq", "/shipping"];

export default function FaqClient({categories, brands = []}:{categories:any[], brands?:any[]}) {
  const router=useRouter();
  const pathname = usePathname();
  const hideSidebar = hiddenSidebarRoutes.includes(pathname);
  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>
      <div style={{width:"100%",maxWidth:"1800px",margin:"0 auto",padding:"0 12px 40px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          {!hideSidebar && <Sidebar categories={categories} brands={brands}/>}
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>よくあるご質問</h1>
            {FAQS.map((cat,i)=>(
              <div key={i} style={{marginBottom:20}}>
                <div style={{background:C.primary,color:"#fff",padding:"8px 14px",fontSize:14,fontWeight:700,borderRadius:"2px 2px 0 0"}}>{cat.cat}</div>
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 2px 2px",overflow:"hidden"}}>
                  {cat.items.map((item,j)=><FaqItem key={j} q={item.q} a={item.a}/>)}
                </div>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:16}}>
              <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← トップページへ戻る</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
