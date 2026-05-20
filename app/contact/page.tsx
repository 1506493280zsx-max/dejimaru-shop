"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({name:"", email:"", type:"商品について", message:""});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = form.name && form.email && form.message;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました");
      } else {
        setSent(true);
      }
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    }
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px",cursor:"pointer"}} onClick={()=>router.push("/")}>
          <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
          <div style={{fontSize:9,color:C.textLight}}>中古PC・スマホならデジマルショップ！</div>
        </div>
      </div>

      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"7px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span>›</span>
          <span style={{fontWeight:700}}>お問い合わせ</span>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"16px auto",padding:"0 10px 40px"}}>
        <h1 style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:8,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          お問い合わせ
        </h1>

        <div style={{background:"#FFF8E8",border:"1px solid #F0D080",borderRadius:2,padding:14,marginBottom:20,fontSize:12,lineHeight:1.9}}>
          <div style={{fontWeight:700,color:"#886600",marginBottom:6}}>【お問い合わせ前にご確認ください】</div>
          <ul style={{paddingLeft:18,color:C.textSub}}>
            <li>よくあるご質問で解決できる場合がございます。まずは<span style={{color:C.primary,cursor:"pointer",textDecoration:"underline"}} onClick={()=>router.push("/faq")}>こちら</span>をご確認ください。</li>
            <li>営業時間：平日 9:00〜18:00（土日祝・年末年始除く）</li>
            <li>お問い合わせへの回答は、原則として2営業日以内にメールにてご連絡いたします。</li>
            <li>Hotmail・Outlook・iCloudメールをご利用の場合、返信が届かない場合があります。</li>
          </ul>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {title:"メール",value:"aiacrossshop@gmail.com",sub:"24時間受付（返信は営業時間内）"},
            {title:"営業時間",value:"平日 9:00〜18:00",sub:"土日祝・年末年始を除く"},
          ].map((item,i)=>(
            <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,padding:14,borderRadius:"0 0 2px 2px"}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6}}>
                {item.title}
              </div>
              <div style={{fontSize:13,fontWeight:700,color:C.primary}}>{item.value}</div>
              <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{item.sub}</div>
            </div>
          ))}
        </div>

        {sent ? (
          <div style={{background:"#F0FFF0",border:"1px solid #44AA44",borderRadius:2,padding:30,textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#227700",marginBottom:8}}>お問い合わせを受け付けました</div>
            <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
              2営業日以内にご登録のメールアドレスへご返信いたします。<br/>
              しばらくお待ちください。
            </div>
            <button onClick={()=>router.push("/")} style={{marginTop:16,background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              トップページへ戻る
            </button>
          </div>
        ) : (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              お問い合わせフォーム
            </div>

            {error && (
              <div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>
                {error}
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>
                  お名前 <span style={{color:C.red,fontSize:10}}>※必須</span>
                </div>
                <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                  placeholder="山田 太郎"
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
              </div>

              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>
                  メールアドレス <span style={{color:C.red,fontSize:10}}>※必須</span>
                </div>
                <input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  type="email" placeholder="example@email.com"
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
              </div>

              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>お問い合わせ種別</div>
                <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any,background:C.white}}>
                  <option>商品について</option>
                  <option>注文・配送について</option>
                  <option>返品・交換について</option>
                  <option>お支払いについて</option>
                  <option>その他</option>
                </select>
              </div>

              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>
                  お問い合わせ内容 <span style={{color:C.red,fontSize:10}}>※必須</span>
                </div>
                <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  rows={6}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any,resize:"vertical"}}/>
              </div>

              <div style={{fontSize:11,color:C.textSub,background:"#F9F9F9",border:`1px solid ${C.border}`,padding:10,borderRadius:2}}>
                送信することで、<span style={{color:C.primary,cursor:"pointer"}} onClick={()=>router.push("/company")}>プライバシーポリシー</span>に同意したものとみなします。
              </div>

              <button onClick={handleSubmit} disabled={!isValid||loading}
                style={{
                  background: isValid && !loading ? C.primary : "#AAAAAA",
                  color:"#fff", border:"none", borderRadius:2,
                  padding:"12px", fontSize:14, fontWeight:700,
                  cursor: isValid && !loading ? "pointer" : "not-allowed",
                  fontFamily:"inherit",
                }}>
                {loading ? "送信中..." : "送信する"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
