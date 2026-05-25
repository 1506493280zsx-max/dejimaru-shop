"use client";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5",
  red:"#CC2200",
  text:"#333", textSub:"#666",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

export default function CheckoutErrorPage() {
  const router = useRouter();
  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text,display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:40,textAlign:"center",maxWidth:480,width:"100%"}}>
          <div style={{fontSize:48,marginBottom:16}}>❌</div>
          <div style={{fontSize:18,fontWeight:700,color:C.red,marginBottom:12}}>注文処理に失敗しました</div>
          <div style={{fontSize:13,color:C.textSub,marginBottom:28,lineHeight:1.9}}>
            注文の処理中にエラーが発生しました。<br/>
            カートの内容は保持されています。<br/>
            もう一度お試しください。
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button
              onClick={()=>router.push("/checkout")}
              style={{background:C.primary,color:"#fff",border:"none",borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              注文に戻る
            </button>
            <button
              onClick={()=>router.push("/")}
              style={{background:C.white,color:C.text,border:`1px solid ${C.border}`,borderRadius:2,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              トップへ戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
