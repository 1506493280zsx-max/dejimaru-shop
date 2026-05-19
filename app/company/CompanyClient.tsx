"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/components/Footer";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

function Row({label,value}:{label:string,value:any}) {
  return (
    <tr>
      <td style={{padding:"10px 14px",fontWeight:700,color:C.textSub,width:"30%",borderBottom:"1px solid #EEF6F6",borderRight:`1px solid ${C.border}`,background:C.primaryBg,verticalAlign:"top"}}>{label}</td>
      <td style={{padding:"10px 14px",color:C.text,borderBottom:"1px solid #EEF6F6",background:C.white,lineHeight:1.8}}>{value}</td>
    </tr>
  );
}

export default function CompanyClient({categories}:{categories:any[]}) {
  const router=useRouter();
  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px",cursor:"pointer"}} onClick={()=>router.push("/")}>
          <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
        </div>
      </div>
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"7px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span>
          <span>›</span><span style={{fontWeight:700}}>会社概要</span>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"10px auto",padding:"0 10px 40px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <Sidebar categories={categories}/>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>🏢 会社概要</h1>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden",marginBottom:20}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  <Row label="会社名" value="AI Across合同会社"/>
                  <Row label="事業内容" value="中古パソコン・スマートフォン・タブレット・周辺機器の販売、買取、修理、法人向け一括調達"/>
                  <Row label="本社所在地" value="〒306-0052　茨城県古河市大山1331-2"/>
                  <Row label="関東センター" value="〒336-0026　埼玉県さいたま市南区辻8丁目3-5"/>
                  <Row label="電話番号" value="050-3091-0226 / 048-816-3967"/>
                  <Row label="メール" value="info@aiacross.com"/>
                  <Row label="営業時間" value="平日 10:00〜18:00（土日祝・年末年始を除く）"/>
                  <Row label="古物商許可番号" value="茨城県公安委員会許可　第081234567890号"/>
                  <Row label="対応地域" value="日本全国（沖縄・一部離島を除く）"/>
                </tbody>
              </table>
            </div>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:16,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>📋 特定商取引法に基づく表記</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  <Row label="販売業者" value="AI Across合同会社"/>
                  <Row label="販売価格" value="各商品ページに記載の価格（税込）"/>
                  <Row label="送料" value="全国一律¥550（税込）／¥5,500以上で送料無料"/>
                  <Row label="お支払い方法" value="クレジットカード・PayPay・楽天ペイ・au PAY・Apple Pay・Google Pay・銀行振込"/>
                  <Row label="商品引渡し時期" value="ご注文確認後1〜3営業日以内に発送"/>
                  <Row label="返品・交換" value="商品到着後8日以内・未使用のもの。初期不良の場合は当社負担"/>
                  <Row label="返品送料" value="初期不良：当社負担　お客様都合：お客様負担"/>
                </tbody>
              </table>
            </div>
            <div style={{textAlign:"center",marginTop:16}}>
              <button onClick={()=>router.push("/")} style={{background:C.primary,color:"#fff",border:"none",padding:"10px 24px",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← トップページへ戻る</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
