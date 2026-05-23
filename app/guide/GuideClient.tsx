"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};

const GUIDE_SECTIONS = [
  {id:"first",   label:"初めてご利用のお客様"},
  {id:"payment", label:"お支払い方法について"},
  {id:"shipping",label:"配送について", path:"/shipping"},
  {id:"warranty",label:"保証について"},
  {id:"defect",  label:"初期不良について"},
  {id:"faq",     label:"よくあるご質問", path:"/faq"},
  {id:"products",label:"掲載商品について"},
  {id:"privacy", label:"プライバシーポリシーについて"},
];

function Section({id,title,children}:{id:string,title:string,children:any}) {
  return (
    <div id={id} style={{marginBottom:28,scrollMarginTop:20}}>
      <div style={{background:C.primary,color:"#fff",padding:"8px 14px",fontSize:14,fontWeight:700,borderRadius:"2px 2px 0 0"}}>{title}</div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",padding:16,borderRadius:"0 0 2px 2px",fontSize:13,lineHeight:1.9,color:C.text}}>{children}</div>
    </div>
  );
}

function Row({label,value}:{label:string,value:any}) {
  return (
    <div style={{display:"flex",borderBottom:`1px solid #EEF6F6`,padding:"9px 0"}}>
      <div style={{width:180,fontWeight:700,color:C.textSub,flexShrink:0}}>{label}</div>
      <div style={{flex:1}}>{value}</div>
    </div>
  );
}

const hiddenSidebarRoutes = ["/guide", "/faq", "/shipping"];

export default function GuideClient({categories}:{categories:any[]}) {
  const router = useRouter();
  const pathname = usePathname();
  const hideSidebar = hiddenSidebarRoutes.includes(pathname);
  const handleNav = (s:typeof GUIDE_SECTIONS[0]) => {
    if(s.path){ router.push(s.path); return; }
    document.getElementById(s.id)?.scrollIntoView({behavior:"smooth"});
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      <div style={{width:"100%",maxWidth:"1800px",margin:"0 auto",padding:"0 12px 40px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          {!hideSidebar && <Sidebar categories={categories}/>}
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>ショッピングガイド</h1>

            {/* Card nav */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>ショッピングガイド</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {GUIDE_SECTIONS.map(s=>(
                  <div key={s.id} onClick={()=>handleNav(s)}
                    style={{border:`1px solid ${C.border}`,borderRadius:2,padding:"14px 10px",textAlign:"center",cursor:"pointer",background:C.white,transition:"all 0.15s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.primary;(e.currentTarget as HTMLElement).style.background=C.primaryBg;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;(e.currentTarget as HTMLElement).style.background=C.white;}}>
                    <div style={{fontSize:11,color:C.text,lineHeight:1.4}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Section id="first" title="初めてご利用のお客様">
              <p>デジマルショップへようこそ！当ショップでの商品のご購入方法をご説明いたします。</p><br/>
              <p style={{fontWeight:700}}>【ご注文の流れ】</p>
              <ol style={{paddingLeft:20,marginTop:8}}>
                <li style={{marginBottom:6}}>商品ページの「カートに入れる」をクリック</li>
                <li style={{marginBottom:6}}>カートページで数量を確認し「ご注文手続きへ」をクリック</li>
                <li style={{marginBottom:6}}>お客様情報・お届け先・お支払い方法を入力</li>
                <li style={{marginBottom:6}}>内容を確認して「注文を確定する」をクリック</li>
                <li style={{marginBottom:6}}>ご注文確認メールが届きましたら完了です</li>
              </ol>
            </Section>

            <Section id="payment" title="お支払い方法について">
              <Row label="銀行振込" value="ご注文後、振込先口座をメールにてご連絡いたします。振込手数料はお客様負担です。"/>
              <Row label="代金引換" value="商品受け取り時に配送員へお支払いください。代引手数料は330円〜です（現金のみ）。"/>
              <Row label="クレジットカード" value="VISA・MasterCard・JCB・AMEX対応。"/>
              <br/><div style={{padding:10,background:"#FFF8E8",border:"1px solid #F0D080",borderRadius:2,fontSize:12,color:"#886600"}}>※30万円以上の場合、代金引換はご利用いただけません。</div>
            </Section>

            <Section id="warranty" title="保証について">
              <Row label="保証期間" value="商品到着後30日間（初期不良対応）"/>
              <Row label="保証内容" value="通常使用における故障・初期不良の場合、交換または返金対応"/>
              <Row label="対象外" value="お客様の過失による破損・水没・改造等"/>
            </Section>

            <Section id="defect" title="初期不良について">
              <p>万が一初期不良があった場合の対応です。</p><br/>
              <ol style={{paddingLeft:20}}>
                <li style={{marginBottom:6}}>商品到着後5日以内にご連絡ください</li>
                <li style={{marginBottom:6}}>当ショップにて状況を確認いたします</li>
                <li style={{marginBottom:6}}>代替品の発送またはご返金にて対応いたします</li>
              </ol>
            </Section>

            <Section id="products" title="掲載商品について">
              <Row label="NEW（新品）" value="未開封・未使用"/>
              <Row label="S（S品）"   value="新品とほぼ同じ状態・目立つ使用痕跡なし"/>
              <Row label="A（A品）"   value="軽微な使用痕跡あり"/>
              <Row label="B（B品）"   value="使用痕跡が比較的目立つ"/>
              <Row label="C（C品）"   value="訳あり品・研究や部品取り向け"/>
            </Section>

            <Section id="privacy" title="プライバシーポリシーについて">
              <Row label="収集する情報" value="氏名・住所・電話番号・メールアドレス・購入履歴など"/>
              <Row label="利用目的" value="商品の発送・お問い合わせへの対応・サービス向上のため"/>
              <Row label="第三者提供" value="法令に基づく場合を除き、第三者への提供は行いません"/>
            </Section>

            <div style={{textAlign:"center",marginTop:16}}>
              <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← トップページへ戻る</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
