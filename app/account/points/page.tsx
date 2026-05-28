"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export default function PointsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [rate, setRate] = useState(100);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { router.push("/login"); return; }
    fetch(`/api/points/balance?customerId=${user.id}`)
      .then(r => r.json())
      .then(d => { setBalance(d.points || 0); setRate(d.rate || 100); });
    fetch(`/api/points/history?customerId=${user.id}`)
      .then(r => r.json())
      .then(d => { setTransactions(d.transactions || []); setLoading(false); });
  }, [user]);

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"24px 16px"}}>
      <button onClick={()=>router.back()} style={{background:"none",border:"none",cursor:"pointer",color:"#0ABAB5",fontSize:14,marginBottom:16}}>← 戻る</button>
      <h1 style={{fontSize:20,fontWeight:700,marginBottom:24}}>🎯 ポイント履歴</h1>

      {/* 残高カード */}
      <div style={{background:"#f0fafa",border:"2px solid #0ABAB5",borderRadius:12,padding:24,marginBottom:24,textAlign:"center"}}>
        <div style={{fontSize:36,fontWeight:700,color:"#0ABAB5"}}>{balance.toLocaleString()}<span style={{fontSize:16,marginLeft:4}}>pt</span></div>
        <div style={{fontSize:13,color:"#666",marginTop:8}}>現在のポイント残高</div>
        <div style={{fontSize:12,color:"#888",marginTop:4}}>現在のレート：{rate}円 = 1pt</div>
        <div style={{fontSize:12,color:"#e65100",marginTop:8,background:"#fff3e0",padding:"8px 12px",borderRadius:6}}>
          ⚠️ 今回のお買い物でご利用の場合は0.5倍換算（300pt→150円引き）<br/>
          次回以降のご利用は1pt=1円でご使用いただけます
        </div>
      </div>

      {/* 履歴一覧 */}
      <div style={{background:"#fff",border:"1px solid #eee",borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",background:"#f9f9f9",fontWeight:700,fontSize:14,borderBottom:"1px solid #eee"}}>ポイント獲得・使用履歴</div>
        {loading ? (
          <div style={{padding:24,textAlign:"center",color:"#888"}}>読み込み中...</div>
        ) : transactions.length === 0 ? (
          <div style={{padding:24,textAlign:"center",color:"#888"}}>履歴がありません</div>
        ) : (
          transactions.map((tx, i) => (
            <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{tx.description}</div>
                <div style={{fontSize:11,color:"#888",marginTop:2}}>{new Date(tx.created_at).toLocaleDateString("ja-JP")}</div>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:tx.points>0?"#2e7d32":"#CC2200"}}>
                {tx.points>0?"+":""}{tx.points.toLocaleString()}pt
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
