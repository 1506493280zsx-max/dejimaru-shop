"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCorporateQuote } from "@/components/CorporateQuoteContext";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryDeep:"#007A76",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
  dark:"#1B2E2D",
};

const GRADE_LABEL: Record<string,string> = {NEW:"新品",S:"S品",A:"A品",B:"B品",C:"C品"};

const CORP_PRODUCTS = [
  {id:"co1",slug:"thinkpad-e14-gen4",   name:"Lenovo ThinkPad E14 Gen4 Core i5 / 16GB / 256GB SSD",         brand:"Lenovo",    grade:"A",price:42800,compare_at_price:68000},
  {id:"co2",slug:"surface-pro-9-i5",    name:"Microsoft Surface Pro 9 Core i5 / 8GB / 128GB SSD",           brand:"Microsoft", grade:"S",price:68000,compare_at_price:118000},
  {id:"co3",slug:"macbook-air-m2-256",  name:"Apple MacBook Air M2 8GB / 256GB スペースグレイ 中古",         brand:"Apple",     grade:"A",price:82000,compare_at_price:134800},
  {id:"co4",slug:"hp-elitebook-840-g8", name:"HP EliteBook 840 G8 Core i7 / 16GB / 512GB SSD ビジネス向け", brand:"HP",        grade:"B",price:36800,compare_at_price:54000},
];

const CORP_FAQS = [
  {q:"最低何台から注文できますか？",                   a:"1台からご注文いただけますが、法人まとめ買いサービスは10台以上を対象とした専用プランです。台数に応じた割引をご提供いたします。"},
  {q:"見積書・請求書は発行していただけますか？",        a:"はい。見積書・納品書・請求書を発行いたします。インボイス対応の適格請求書も発行可能です。"},
  {q:"請求書払い（後払い・掛払い）は可能ですか？",      a:"法人のお客様に限り、与信審査のうえ後払いに対応する場合がございます。詳細はお問い合わせください。"},
  {q:"複数拠点への分散納品はできますか？",             a:"はい、複数の事業所・支店・学校への分散納品に対応しています。事前にお知らせいただければ調整いたします。"},
  {q:"キッティングサービスとはどのようなものですか？",  a:"OS設定・ソフトウェアインストール・ドメイン参加・管理ラベル貼付などを出荷前に代行するサービスです。別途お見積りとなります。"},
  {q:"保証内容を教えてください",                       a:"全商品30日間の動作保証付きです。初期不良の場合は代替品の送付または返金で対応いたします。延長保証オプションもご用意しています。"},
  {q:"古物商許可は取得していますか？",                  a:"はい、茨城県公安委員会より古物商許可を取得しています。"},
  {q:"在庫の確保・取り置きはできますか？",              a:"大量注文の場合、事前にご相談いただければ可能な限り在庫を確保いたします。お気軽にお問い合わせください。"},
  {q:"データ消去証明書は発行されますか？",              a:"はい、国際規格準拠のデータ消去を実施し、消去証明書を発行いたします（有償オプション）。"},
];

function FaqItem({q,a}:{q:string,a:string}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{borderBottom:"1px solid #EEF6F6"}}>
      <div onClick={()=>setOpen(!open)}
        style={{padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10,background:open?C.primaryBg:C.white}}
        onMouseEnter={e=>(e.currentTarget.style.background=C.primaryBg)}
        onMouseLeave={e=>(e.currentTarget.style.background=open?C.primaryBg:C.white)}>
        <span style={{color:C.primary,fontWeight:900,fontSize:14,flexShrink:0}}>Q</span>
        <span style={{flex:1,fontSize:13,fontWeight:700,color:C.text}}>{q}</span>
        <span style={{color:C.primary,fontWeight:700,fontSize:12,flexShrink:0}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"10px 14px 14px 38px",background:"#F8FFFE",fontSize:13,color:C.textSub,lineHeight:1.8,borderTop:`1px solid ${C.primaryBg}`}}>
          <span style={{color:C.primary,fontWeight:900,marginRight:8}}>A</span>{a}
        </div>
      )}
    </div>
  );
}

function CorpProductCard({p}:{p:typeof CORP_PRODUCTS[0]}) {
  const [hov,setHov]=useState(false);
  const router=useRouter();
  const disc=Math.round((1-p.price/p.compare_at_price)*100);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:10,cursor:"pointer",transition:"border-color 0.15s",display:"flex",flexDirection:"column",gap:4}}>
      <div onClick={()=>router.push(`/products/${p.slug}`)}
        style={{background:"#F5FAFA",borderRadius:2,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.primaryBorder}`,marginBottom:6,overflow:"hidden",position:"relative"}}>
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
      </div>
      <div style={{fontSize:10,color:C.textLight}}>{p.brand}</div>
      <div onClick={()=>router.push(`/products/${p.slug}`)}
        style={{fontSize:12,fontWeight:600,color:hov?C.primary:C.text,lineHeight:1.5,display:"-webkit-box" as any,WebkitLineClamp:3,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>
        {p.name}
      </div>
      <span style={{display:"inline-block",background:C.primaryBg,color:C.primary,border:`1px solid ${C.primaryBorder}`,borderRadius:2,fontSize:10,fontWeight:700,padding:"1px 5px",marginTop:2,alignSelf:"flex-start"}}>
        {GRADE_LABEL[p.grade]||p.grade}
      </span>
      <div style={{marginTop:2}}>
        <div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>定価 ¥{p.compare_at_price.toLocaleString()}</div>
        <div style={{fontSize:16,fontWeight:700,color:C.red}}>¥{p.price.toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span></div>
      </div>
      <button onClick={()=>router.push(`/products/${p.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        詳細を見る →
      </button>
    </div>
  );
}

function PointLabel({num,title,sub}:{num:number,title:string,sub:string}) {
  return (
    <div style={{textAlign:"center",marginBottom:30}}>
      <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:3,marginBottom:6}}>POINT {num}</div>
      <div style={{fontSize:20,fontWeight:900,color:C.text,marginBottom:8,lineHeight:1.3}}>{title}</div>
      <div style={{fontSize:13,color:C.textSub,maxWidth:520,margin:"0 auto",lineHeight:1.85}}>{sub}</div>
    </div>
  );
}

function BulletList({items}:{items:string[]}) {
  return (
    <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:12}}>
      {items.map((txt,i)=>(
        <li key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{width:22,height:22,borderRadius:"50%",background:C.primary,color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
            {i+1}
          </span>
          <span style={{fontSize:13,color:C.text,lineHeight:1.75}}>{txt}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CorporatePage() {
  const router=useRouter();
  const { openModal } = useCorporateQuote();
  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>


      {/* 1. Hero Banner */}
      <Link href="/contact">
        <div style={{width:"100%",maxWidth:"1600px",margin:"0 auto",aspectRatio:"1920/700",overflow:"hidden",background:"#0ABAB5",cursor:"pointer"}}>
          <img
            src="/corporate/hero/business-banner.png"
            alt="AI Across Corporate"
            style={{width:"100%",height:"100%",objectFit:"contain"}}
          />
        </div>
      </Link>

      {/* 2. About AI Across Business */}
      <div style={{background:C.white,padding:"48px 0"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"0 20px",textAlign:"center"}}>
          <h1 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:12,lineHeight:1.3}}>法人まとめ買いサービス</h1>
          <p style={{fontSize:14,color:C.textSub,lineHeight:2,maxWidth:600,margin:"0 auto 28px"}}>
            AI Across合同会社は、企業・学校・官公庁向けに中古PC・スマートフォン・タブレットの一括調達サービスを提供しています。
            10台以上のまとめ買いから、キッティングや延長保証まで専任担当者がワンストップで対応いたします。
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            <button onClick={openModal}
              style={{background:C.red,color:"#fff",border:"none",padding:"14px 40px",borderRadius:2,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
              無料見積依頼
            </button>
            <button onClick={()=>router.push("/contact")}
              style={{background:C.primary,color:"#fff",border:"none",padding:"14px 36px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
              onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
              onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}>
              お問い合わせ →
            </button>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"12px 24px"}}>
            <span style={{fontSize:22,fontWeight:900,color:C.primaryDeep,letterSpacing:1}}>050-3091-0226</span>
            <span style={{fontSize:11,color:C.textSub,lineHeight:1.6}}>平日 10:00〜18:00<br/>（土日祝休み）</span>
          </div>
        </div>
      </div>

      {/* 3a. POINT 1: left image / right text */}
      <div style={{background:C.bg,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={1} title="全商品30日間動作保証" sub="納品されたすべての商品に動作保証が付きます。万が一の初期不良はすぐに代替品を手配いたします。"/>
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:"0 0 46%",minWidth:260}}>
              {/* /public/corporate/points/point1.webp */}
              <div style={{width:"100%",height:280,background:"#D4E4E3",borderRadius:2}}/>
            </div>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "全商品に標準で30日間の動作保証を付与",
                "初期不良は即時に代替品を手配",
                "延長保証オプション（最長1年）も選択可能",
                "専任担当者が不具合対応をフォロー",
              ]}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3b. POINT 2: right image / left text */}
      <div style={{background:C.white,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={2} title="専任担当者による手厚いサポート" sub="ご注文から納品後まで、専任担当者が一貫してサポートします。"/>
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "法人専用窓口で迅速・丁寧に対応",
                "電話・メール・チャットで相談を受付",
                "見積書・納品書・請求書を即日発行",
                "インボイス対応（適格請求書）に対応",
              ]}/>
            </div>
            <div style={{flex:"0 0 46%",minWidth:260}}>
              {/* /public/corporate/points/point2.webp */}
              <div style={{width:"100%",height:280,background:"#D4E4E3",borderRadius:2}}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3c. POINT 3: multi-image style */}
      <div style={{background:C.bg,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={3} title="徹底した品質管理プロセス" sub="独自の品質基準に基づき、入荷から出荷まで複数のチェックポイントで検品を実施しています。"/>
          <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>
              <p style={{fontSize:13,color:C.textSub,lineHeight:1.9,marginBottom:14}}>
                すべての商品は外観検査・動作確認・バッテリー診断・データ消去の4工程を経てから出荷します。品質基準を満たさない商品は販売いたしません。
              </p>
              <div style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:14}}>
                <div style={{fontWeight:700,color:C.primaryDeep,marginBottom:10,fontSize:13}}>品質チェック4工程</div>
                {["外観検査 — キズ・ヘコみの確認","動作確認 — 全ポート・全機能テスト","バッテリー診断 — 容量・劣化確認","データ消去 — 国際規格準拠"].map((s,i,a)=>(
                  <div key={i} style={{fontSize:12,color:C.textSub,padding:"5px 0",borderBottom:i<a.length-1?`1px solid ${C.primaryBorder}`:"none",display:"flex",gap:8}}>
                    <span style={{color:C.primary,fontWeight:700,flexShrink:0,minWidth:20}}>{String(i+1).padStart(2,"0")}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{flex:"0 0 46%",minWidth:260}}>
              {/* /public/corporate/points/point3-{1-4}.webp */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[0,1,2,3].map(i=>(
                  <div key={i} style={{height:120,background:"#D4E4E3",borderRadius:2}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3d. POINT 4: single image style */}
      <div style={{background:C.white,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={4} title="スピーディーな一括納品" sub="大量注文でも指定納期に間に合わせます。複数拠点への分散配送にも対応しています。"/>
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "発注確定後、最短3営業日で出荷対応",
                "50台以上の大口案件にも対応可能",
                "複数拠点・部門別の個別梱包に対応",
                "全国送料無料（一部離島除く）",
              ]}/>
            </div>
            <div style={{flex:"0 0 38%",minWidth:240}}>
              {/* /public/corporate/points/point4.webp */}
              <div style={{width:"100%",height:260,background:"#D4E4E3",borderRadius:2}}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3e. POINT 5: premium plan */}
      <div style={{background:C.bg,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={5} title="プレミアムプラン生涯保証" sub="プレミアムプラン加入時は、生涯保証に対応いたします。通常保証期間終了後も長期サポートをご提供します。"/>
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:"0 0 46%",minWidth:260}}>
              {/* /public/corporate/points/point5.webp */}
              <div style={{width:"100%",height:280,background:"#D4E4E3",borderRadius:2}}/>
            </div>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "プレミアムプラン加入で生涯保証対応",
                "故障・不具合時も継続サポート",
                "予期しないトラブル時もサポート対応",
                "長期利用時の安心を提供",
              ]}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3f. POINT 6: full-width emphasis */}
      <div style={{background:C.primaryDeep,padding:"56px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:3,marginBottom:8}}>POINT 6</div>
            <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:10,lineHeight:1.3}}>圧倒的なコストパフォーマンス</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",maxWidth:500,margin:"0 auto",lineHeight:1.9}}>
              新品同等品をリユース価格で。IT費用を大幅に削減しながら、業務に必要な性能を確保できます。
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            {[
              {num:"最大60%",label:"新品比コスト削減"},
              {num:"10台〜",label:"まとめ買い割引適用"},
              {num:"30日間",label:"全商品動作保証"},
            ].map(({num,label},i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.1)",borderRadius:2,padding:"22px 16px",textAlign:"center",border:"1px solid rgba(255,255,255,0.18)"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:6}}>{num}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>{label}</div>
              </div>
            ))}
          </div>
          {/* /public/corporate/points/point6.webp */}
          <div style={{width:"100%",height:180,background:"rgba(255,255,255,0.07)",borderRadius:2}}/>
        </div>
      </div>

      {/* 4. Inquiry CTA */}
      <div style={{background:C.bg,padding:"44px 0"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"0 20px"}}>
          <div onClick={()=>router.push("/contact")}
            style={{background:C.white,border:`2px solid ${C.primary}`,borderRadius:2,padding:"36px 32px",cursor:"pointer",textAlign:"center"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.primaryBg;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.white;}}>
            <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:3,marginBottom:10}}>CONTACT</div>
            <div style={{fontSize:20,fontWeight:900,color:C.text,marginBottom:10,lineHeight:1.3}}>
              法人まとめ買いのご相談・お見積りはこちら
            </div>
            <div style={{fontSize:13,color:C.textSub,maxWidth:520,margin:"0 auto 22px",lineHeight:1.8}}>
              台数・スペック・ご予算を教えていただければ、専任担当者が最適なプランをご提案します。
            </div>
            <button onClick={e=>{e.stopPropagation();openModal();}}
              style={{background:C.red,color:"#fff",border:"none",padding:"14px 52px",borderRadius:2,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
              無料見積依頼
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recommended Products */}
      <div style={{background:C.white,padding:"44px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{background:C.primary,color:"#fff",padding:"8px 14px",fontSize:14,fontWeight:700,borderRadius:"2px 2px 0 0",display:"flex",alignItems:"center"}}>
            法人向けおすすめ商品
            <span style={{fontSize:10,fontWeight:400,marginLeft:8,opacity:0.8}}>RECOMMENDED PRODUCTS</span>
          </div>
          <div style={{background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderTop:"none",borderRadius:"0 0 2px 2px",padding:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
              {CORP_PRODUCTS.map(p=><CorpProductCard key={p.id} p={p}/>)}
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={()=>router.push("/search")}
                style={{background:C.primary,color:"#fff",border:"none",padding:"9px 28px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
                onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
                onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}>
                すべての商品を見る →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Company Introduction */}
      <div style={{background:C.bg,padding:"44px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:8}}>AI Across合同会社とは</div>
            <div style={{fontSize:13,color:C.textSub,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>
              茨城県古河市を拠点に、中古デバイスの販売・買取・修理・法人向け卸販売を展開するリユース事業者です。
              「デジタルをもっと身近に、もっとサステナブルに」をテーマに取り組んでいます。
            </div>
          </div>
          <style>{`
            .company-intro-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
            @media(max-width:900px){.company-intro-grid{grid-template-columns:repeat(2,1fr);}}
            @media(max-width:520px){.company-intro-grid{grid-template-columns:1fr;}}
          `}</style>
          <div className="company-intro-grid">
            {[
              {num:"年間150,000台+",label:"販売実績",        body:"全国の法人・個人向けに年間15万台以上の中古デバイスを販売しています。"},
              {num:"古物商許可取得",label:"許認可・コンプライアンス",body:"埼玉県公安委員会許可。法令に基づいた適正な事業運営を行っています。"},
              {num:"30日間保証",  label:"全商品動作保証",  body:"販売するすべての商品に動作保証を付けてお届けします。"},
              {num:"プレミアムプラン",label:"永久保証",      body:"プレミアムプラン加入時は、一生保証対応。故障・不具合・予期しないトラブルも含めて幅広くサポートいたします。"},
            ].map(({num,label,body},i)=>(
              <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,borderRadius:"0 0 2px 2px",padding:20,textAlign:"center"}}>
                {/* achievement image: /public/corporate/company/ach{i+1}.webp */}
                <div style={{width:80,height:80,background:"#D4E4E3",borderRadius:"50%",margin:"0 auto 14px"}}/>
                <div style={{fontSize:18,fontWeight:900,color:C.primary,marginBottom:4}}>{num}</div>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>{label}</div>
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.75}}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Warranty Flow — dark section */}
      <div style={{background:C.dark,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:18,fontWeight:900,color:"#fff",marginBottom:8}}>ご利用の流れ</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>
              お問い合わせから納品・アフターサポートまで安心のステップ
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {[
              {n:"01",t:"問い合わせ",d:"電話・メール・フォームでお気軽にご相談ください。"},
              {n:"02",t:"見積",      d:"台数・スペック・予算に合わせた最適なプランをご提案します。"},
              {n:"03",t:"出荷",      d:"キッティング・梱包・発送を責任を持って対応します。"},
              {n:"04",t:"サポート",  d:"納品後も専任担当者が継続してサポートいたします。"},
            ].map(({n,t,d},i)=>(
              <div key={i} style={{position:"relative"}}>
                {i<3&&<div style={{position:"absolute",top:38,right:-14,fontSize:22,color:"rgba(10,186,181,0.4)",fontWeight:900,zIndex:1}}>›</div>}
                <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(10,186,181,0.25)",borderRadius:2,padding:"22px 14px",textAlign:"center"}}>
                  <div style={{fontSize:32,fontWeight:900,color:C.primary,marginBottom:8,letterSpacing:2}}>{n}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:8}}>{t}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.75}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Customer Reviews */}
      <div style={{background:C.white,padding:"44px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>お客様の声</div>
            <div style={{fontSize:13,color:C.textSub}}>実際にご利用いただいた法人様の声をご紹介します</div>
          </div>
          {/* review images: /public/corporate/reviews/review{1-3}.webp */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{height:200,background:"#D4E4E3",borderRadius:2}}/>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <button onClick={()=>router.push("/search")}
              style={{background:"none",border:`1px solid ${C.primary}`,color:C.primary,padding:"9px 28px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.primaryBg;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="none";}}>
              レビューをもっと見る →
            </button>
          </div>
        </div>
      </div>

      {/* 9. FAQ */}
      <div style={{background:C.bg,padding:"44px 0"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>よくある質問</div>
            <div style={{fontSize:13,color:C.textSub}}>法人まとめ買いに関するよくあるご質問</div>
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden"}}>
            {CORP_FAQS.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
          </div>
        </div>
      </div>

      {/* 10. Partner Recruitment */}
      <div style={{background:C.primaryDeep,padding:"48px 0"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"0 20px",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:3,marginBottom:8}}>PARTNER</div>
          <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:12,lineHeight:1.3}}>パートナー募集</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",maxWidth:520,margin:"0 auto 24px",lineHeight:1.9}}>
            AI Across合同会社では、中古デバイスの法人販売・リユース事業を一緒に展開いただけるビジネスパートナーを募集しています。
            代理店・販売パートナー・協業のご提案をお待ちしております。
          </div>
          {/* partner logo: /public/corporate/partner/logo.webp */}
          <div style={{width:120,height:56,background:"rgba(255,255,255,0.1)",borderRadius:2,margin:"0 auto 20px"}}/>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.8}}>
            〒306-0052 茨城県古河市大山1331-2　AI Across合同会社<br/>
            TEL: 050-3091-0226 / info@aiacross.com
          </div>
          <button onClick={()=>router.push("/contact")}
            style={{background:"#fff",color:C.primaryDeep,border:"none",padding:"12px 36px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.primaryBg;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff";}}>
            パートナーシップについてお問い合わせ →
          </button>
        </div>
      </div>

    </div>
  );
}
