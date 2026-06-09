"use client";
import { useState, useEffect } from "react";
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

const GRADE_LABEL: Record<string,string> = {NEW:"新品同様",S:"S評価",A:"A評価",B:"B評価",C:"C評価"};

const CORP_FAQS = [
  {q:"いつからの注文ができますか？", a:"1台からご注文いただけます。法人向けサービスは10台以上を対象としたプランです。台数に応じた費用をご提示いたします。"},
  {q:"納期・納品方法は発送していただけますか？", a:"はい。納期・納品書・請求書は発送いたします。インボイス対応、適格請求書も発送可能です。"},
  {q:"請求書の違い・返却・交換は可能ですか？", a:"個人のご連絡に基づき、書き替えや返却・交換対応する場合がございます。弊社までお気軽にお問い合わせください。"},
  {q:"複数ご購入の分割払いに対応してくれますか？", a:"はい。複数のご利用・スペック・業種ごとに分割払いに対応しております。事前にご相談いただければ調整いたします。"},
  {q:"キッティングサービスとはどのようなものですか？", a:"OS設定・ソフトウェアインストール・ドメイン参加・管理レベル設定などを事前に実施するサービスです。ご質問等はお気軽にお問い合わせください。"},
  {q:"保証期間を教えてください", a:"全品納期30日間保証返品いたします。初期不良は迅速に対応いたします。または弊社で対応いたします。長期保証オプションもご利用しております。"},
  {q:"複数台購入は対応してくれますか？", a:"はい。複数台購入については、別途複数台購入対応いたします。"},
  {q:"仕様の確認や入替・交換は可能ですか？", a:"大規模導入の場合には、事前にご相談いただければ可能な限り仕様確認いたします。お気軽にお問い合わせください。"},
  {q:"データ消去対応は行われますか？", a:"はい。当社による環境からのデータ消去実施および秘密保証オプション等も承っております。"},
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
        <span style={{color:C.primary,fontWeight:700,fontSize:12,flexShrink:0}}>{open?"笆ｲ":"笆ｼ"}</span>
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
  const displayPrice = p.price || p.min_price || 0;
  const displayCompare = p.compare_at_price || p.max_price || 0;
  const disc = displayCompare > 0 && displayPrice > 0 ? Math.round((1-displayPrice/displayCompare)*100) : 0;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.white,border:`1px solid ${hov?C.primary:C.border}`,borderRadius:2,padding:10,cursor:"pointer",transition:"border-color 0.15s",display:"flex",flexDirection:"column",gap:4}}>
      <div onClick={()=>router.push(`/products/${p.slug}`)}
        style={{background:"#fff",borderRadius:2,width:"100%",height:220,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.primaryBorder}`,marginBottom:6,overflow:"hidden",position:"relative"}}>
        {disc>=10&&<div style={{position:"absolute",top:4,right:4,background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:1}}>{disc}%OFF</div>}
        <img src={p.images?.[0] ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${p.images[0]}` : '/placeholder.png'} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
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
        <div style={{fontSize:10,color:C.textLight,textDecoration:"line-through"}}>定価 ￥{(displayCompare ?? 0).toLocaleString()}</div>
        <div style={{fontSize:16,fontWeight:700,color:C.red}}>￥{(displayPrice ?? 0).toLocaleString()}<span style={{fontSize:10,fontWeight:400,color:C.textSub}}>（税込）</span></div>
      </div>
      <button onClick={()=>router.push(`/products/${p.slug}`)}
        style={{marginTop:"auto",background:hov?C.primaryDark:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"6px 8px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>
        詳細を見る &#x2192;      </button>
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
  const [corpProducts, setCorpProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/corporate-products?fields=id,name,slug,brand_id.name,grade,price,compare_at_price,min_price,max_price,images`)
      .then(r=>r.json())
      .then(d=>setCorpProducts(d.data||[]));
  }, []);
  const { openModal } = useCorporateQuote();
  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ヒラギノ角ゴシック','Hiragino Kaku Gothic ProN',sans-serif",fontSize:13,color:C.text}}>


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
          <h1 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:12,lineHeight:1.3}}>法人向けサービス</h1>
          <p style={{fontSize:14,color:C.textSub,lineHeight:2,maxWidth:600,margin:"0 auto 28px"}}>
            AI Across法人会社は、企業・学校・官公庁向けに中古PC・スマートフォン・タブレット等の一括調達サービスを提供しています。
            10台以上のまとめ買いから、キッティング・長期保証まで一括対応で対応いたします。
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            <button onClick={openModal}
              style={{background:C.red,color:"#fff",border:"none",padding:"14px 40px",borderRadius:2,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
              無料見積もり
            </button>
            <button onClick={()=>router.push("/contact")}
              style={{background:C.primary,color:"#fff",border:"none",padding:"14px 36px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
              onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
              onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}>
              お問い合わせ &#x2192;            </button>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,background:C.primaryBg,border:`1px solid ${C.primaryBorder}`,borderRadius:2,padding:"12px 24px"}}>
            <span style={{fontSize:22,fontWeight:900,color:C.primaryDeep,letterSpacing:1}}>050-3091-0226</span>
            <span style={{fontSize:11,color:C.textSub,lineHeight:1.6}}>平日 10:00～18:00<br/>日祝日休み</span>
          </div>
        </div>
      </div>

      {/* 3a. POINT 1: left image / right text */}
      <div style={{background:C.bg,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={1} title="全品納期30日間返品保証" sub="注文されたすべての商品に返品保証が付きます。不良品は迅速に対応いたします。" />
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{width:"50%",flex:"0 0 50%",minWidth:0}}>
              <img src="/corporate/points/point1.png" alt="蜈ｨ蝠・刀30譌･髢灘虚菴應ｿ晁ｨｼ" loading="eager" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px" style={{width:"100%",height:"auto",display:"block",borderRadius:12}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <BulletList items={[
                "全品納期で30日間保証返品をお付けします",
                "初期不良は迅速に対応対応",
                "長期保証オプション、最長1年も選択可能",
                "IT専門家による毎日対応をフォロー",
              ]}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3b. POINT 2: right image / left text */}
      <div style={{background:C.white,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={2} title="IT専門家による手厚いサポート" sub="ご注文から納品後まで、IT専門家が手厚くサポートいたします。" />
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:0}}>
              <BulletList items={[
                "法人向け24時間対応で窓口対応",
                "電話・メール・チャットで質問相談",
                "納期・注文書・請求書を発送",
                "インボイス対応、適格請求書も対応",
              ]}/>
            </div>
            <div style={{width:"50%",flex:"0 0 50%",minWidth:0}}>
              <img src="/corporate/points/point2.png" alt="IT専門家による手厚いサポート" loading="eager" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px" style={{width:"100%",height:"auto",display:"block",borderRadius:12}}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3c. POINT 3: multi-image style */}
      <div style={{background:C.bg,padding:"36px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={3} title="確実な情報管理とロセス" sub="独自の厳密な検査体制から出荷まで複数の大切なチェックポイントで確認管理しています。" />
          <div style={{borderRadius:12,overflow:"hidden",maxWidth:580,margin:"16px auto 0"}}>
            <img src="/corporate/points/point3-1.png" alt="確実な情報管理とロセス" loading="eager" sizes="(max-width: 768px) 100vw, 900px" style={{width:"100%",height:"auto",display:"block"}}/>
          </div>
        </div>
      </div>

      {/* 3d. POINT 4: single image style */}
      <div style={{background:C.white,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={4} title="スピーディーな一括納期" sub="大規模導入で貴社指定時期に間に合わせます。複数オフィスの分別納期にも対応しております。" />
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "発送確定後、最短3営業日で出荷対応",
                "50台以上の大量配送も対応可能",
                "複数オフィス・部門別の別納に対応",
                "全国送料無料。一部除外地域あり",
              ]}/>
            </div>
            <div style={{width:"50%",flex:"0 0 50%",minWidth:0}}>
              <div style={{width:"100%",aspectRatio:"4/3",borderRadius:12,overflow:"hidden"}}>
                <img src="/corporate/points/point4.png" alt="スピーディーな一括納期" loading="eager" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block"}}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3e. POINT 5: premium plan */}
      <div style={{background:C.bg,padding:"52px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <PointLabel num={5} title="プレミアムプラン拡大サービス" sub="プレミアムプラン加入時に、全額返金サービスに対応いたします。全期間返金期間後も長期サポートを提供いたします。" />
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{width:"50%",flex:"0 0 50%",minWidth:0}}>
              <div style={{width:"100%",borderRadius:12,overflow:"hidden"}}>
                <img src="/corporate/points/point5.png" alt="プレミアムプラン拡大サービス" style={{width:"100%",height:"auto",display:"block"}}/>
              </div>
            </div>
            <div style={{flex:1,minWidth:220}}>
              <BulletList items={[
                "長期保証オプション（最長1年）も選択可能",
                "IT機器の長期利用へのサポートをフォロー",
                "安心しない持運び時もサポート対応",
                "長期返却用・保証をご利用",
              ]}/>
            </div>
          </div>
        </div>
      </div>

      {/* 3f. POINT 6: full-width emphasis */}
      <div style={{background:C.primaryDeep,padding:"56px 0 0 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:3,marginBottom:8}}>POINT 6</div>
            <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:10,lineHeight:1.3}}>複合的なコストパフォーマンス</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",maxWidth:500,margin:"0 auto",lineHeight:1.9}}>
              新品同様商品をリユース販売で、IT導入補助金に活用しながら、新しい技術な可能性を確認できます。
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:0}}>
            {[
              {num:"最大60%",label:"新品同比コスト削減"},
              {num:"10台～",label:"まとめ買いへの対応"},
              {num:"30日間",label:"全品納期返品保証"},
            ].map(({num,label},i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.1)",borderRadius:2,padding:"22px 16px",textAlign:"center",border:"1px solid rgba(255,255,255,0.18)"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:6}}>{num}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <img src="/corporate/points/point6.png" alt="複合的なコストパフォーマンス" style={{width:"100%",height:"auto",display:"block",marginTop:16}}/>
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
              法人向けのお見積や方法について取得
            </div>
            <div style={{fontSize:13,color:C.textSub,maxWidth:520,margin:"0 auto 22px",lineHeight:1.8}}>
              台数・スペック・内容についてお伝えいただければ、IT専門家が最適なプランをご提案いたします。
            </div>
            <button onClick={e=>{e.stopPropagation();openModal();}}
              style={{background:C.red,color:"#fff",border:"none",padding:"14px 52px",borderRadius:2,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
              無料見積もり
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
              {corpProducts.map(p=><CorpProductCard key={p.id} p={{...p, brand: p.brand_id?.name||''}} />)}
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={()=>router.push("/search")}
                style={{background:C.primary,color:"#fff",border:"none",padding:"9px 28px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
                onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDark)}
                onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}>
                すべての商品を見る &#x2192;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Company Introduction */}
      <div style={{background:C.bg,padding:"44px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:8}}>AI Across法人会社とは</div>
            <div style={{fontSize:13,color:C.textSub,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>
              デジタルをもっと身近に、もっとサステイナブルに、をテーマに取り組んでいます。
            </div>
          </div>
          <style>{`
            .company-intro-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
            @media(max-width:900px){.company-intro-grid{grid-template-columns:repeat(2,1fr);}}
            @media(max-width:520px){.company-intro-grid{grid-template-columns:1fr;}}
          `}</style>
          <div className="company-intro-grid">
            {[
              {num:"年台50,000台+",label:"購入実績",        body:"全国の個人・法人向けに年台5万台以上の中古PCデバイスを購入しています。"},
              {num:"複数台購入保証",label:"保証・コンプライアンス",body:"厳格な環境基準に基づいた適正な情報管理で信頼できる品質提供しています。"},
              {num:"30日間返品保証",  label:"全品納期返品保証",  body:"購入するすべての商品に返品保証を付きます。"},
              {num:"プレミアムプラン",label:"豪華・サービス",      body:"プレミアムプラン加入時に、全額返金サービスに対応いたします。"},
            ].map(({num,label,body},i)=>(
              <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,borderRadius:"0 0 2px 2px",padding:20,textAlign:"center"}}>
                <div style={{width:80,height:80,background:"#D4E4E3",borderRadius:"50%",margin:"0 auto 14px"}}/>
                <div style={{fontSize:18,fontWeight:900,color:C.primary,marginBottom:4}}>{num}</div>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>{label}</div>
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.75}}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Customer Reviews */}
      <div style={{background:C.white,padding:"44px 0"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>ご利用者の声</div>
            <div style={{fontSize:13,color:C.textSub}}>実際にご利用いただいた個人ユーザー様からのご質問をご紹介します。</div>
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
              レビューをもっと見る &#x2192;            </button>
          </div>
        </div>
      </div>

      {/* 9. FAQ */}
      <div style={{background:C.bg,padding:"44px 0"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>よくある質問</div>
            <div style={{fontSize:13,color:C.textSub}}>法人向けサービスに関するよくある質問</div>
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
            リユースPC・デバイスのビジネスに関心のある企業・個人の方、ぜひご連絡ください。
          </div>
          {/* partner logo: /public/corporate/partner/logo.webp */}
          <div style={{width:120,height:56,background:"rgba(255,255,255,0.1)",borderRadius:2,margin:"0 auto 20px"}}/>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.8}}>
            TEL: 050-3091-0226 / info@aiacross.com
          </div>
          <button onClick={()=>router.push("/contact")}
            style={{background:"#fff",color:C.primaryDeep,border:"none",padding:"12px 36px",borderRadius:2,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.primaryBg;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff";}}>
            パートナーに応募する &#x2192;
          </button>
        </div>
      </div>

    </div>
  );
}

