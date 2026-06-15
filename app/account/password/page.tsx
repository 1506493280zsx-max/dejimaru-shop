"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
  text:"#333", textSub:"#666", textLight:"#999",
};

const DIRECTUS = "http://13.158.171.41:8055";

export default function PasswordPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({current:"", newPass:"", confirm:""});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{ setMounted(true); },[]);
  useEffect(()=>{ if(mounted&&!user) router.push("/login"); },[mounted,user]);

  const handleSave = async () => {
    if (!form.newPass || !form.confirm) { setError("新しいパスワードを入力してください"); return; }
    if (form.newPass !== form.confirm) { setError("パスワードが一致しません"); return; }
    if (form.newPass.length < 8) { setError("パスワードは8文字以上で設定してください"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${DIRECTUS}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ password: form.newPass }),
      });
      if (!res.ok) throw new Error("変更に失敗しました");
      setSaved(true);
      setForm({current:"",newPass:"",confirm:""});
      setTimeout(()=>setSaved(false),3000);
    } catch(e:any) {
      setError(e.message||"変更に失敗しました");
    }
    setLoading(false);
  };

  const Input = ({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}) => (
    <div>
      <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>{label}</div>
      <input type="password" value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>

      <div style={{maxWidth:500,margin:"16px auto",padding:"0 10px 40px"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          🔒 パスワードの変更
        </h1>

        {saved&&<div style={{background:"#F0FFF0",border:"1px solid #44AA44",borderRadius:2,padding:"10px 14px",fontSize:12,color:"#227700",marginBottom:14,fontWeight:700}}>✅ パスワードを変更しました</div>}
        {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}

        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="新しいパスワード（8文字以上）" value={form.newPass} onChange={v=>setForm(p=>({...p,newPass:v}))}/>
            <Input label="新しいパスワード（確認）" value={form.confirm} onChange={v=>setForm(p=>({...p,confirm:v}))}/>
            <div style={{padding:10,background:"#F9F9F9",border:`1px solid ${C.border}`,borderRadius:2,fontSize:11,color:C.textSub}}>
              ・8文字以上で設定してください<br/>
              ・英字・数字を組み合わせることを推奨します
            </div>
            <button onClick={handleSave} disabled={loading}
              style={{background:loading?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:2,padding:"12px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
              {loading?"変更中...":"パスワードを変更する"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
