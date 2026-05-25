const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  text:"#333", textSub:"#666",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text,display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:40,textAlign:"center",maxWidth:480,width:"100%"}}>
          <div style={{fontSize:48,marginBottom:16}}>✅</div>
          <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>ご注文ありがとうございます</div>
          {orderNumber && (
            <div style={{background:C.primaryBg,border:`1px solid #B0E0DE`,borderRadius:2,padding:"10px 20px",fontSize:13,color:C.text,marginBottom:20,display:"inline-block"}}>
              注文番号：<strong>{orderNumber}</strong>
            </div>
          )}
          <div style={{fontSize:13,color:C.textSub,marginBottom:28,lineHeight:1.9}}>
            ご注文を受け付けました。<br/>
            準備が整い次第、発送いたします。<br/>
            <span style={{fontSize:11,color:"#AAA"}}>※ 決済連携後、確認メールをお送りします</span>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/" style={{display:"inline-block",background:C.primary,color:"#fff",textDecoration:"none",borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700}}>
              トップページへ戻る
            </a>
            <a href="/account/orders" style={{display:"inline-block",background:C.white,color:C.text,textDecoration:"none",border:`1px solid ${C.border}`,borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700}}>
              注文履歴を見る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
