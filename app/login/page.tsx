"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  red:"#CC2200", text:"#333", textSub:"#666", border:"#DDD", white:"#FFF",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"login"|"register">("login");

  const handleLogin = async () => {
    if (!email || !password) { setError("メールとパスワードを入力してください"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "ログインに失敗しました"); setLoading(false); return; }

      // ユーザー情報取得
      const meRes = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${data.token}` },
      });
      const user = await meRes.json();
      setAuth(user, data.token);
      router.push(redirectTo);
    } catch {
      setError("接続エラーが発生しました");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) { setError("すべての項目を入力してください"); return; }
    if (password.length < 8) { setError("パスワードは8文字以上で入力してください"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "登録に失敗しました"); setLoading(false); return; }

      const meRes = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${data.token}` },
      });
      const user = await meRes.json();
      setAuth(user, data.token);
      router.push(redirectTo);
    } catch {
      setError("接続エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div style={{background:"#F0F5F5",minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",display:"flex",flexDirection:"column"}}>

      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,width:"100%",maxWidth:420,overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:`2px solid ${C.primary}`}}>
            {[{id:"login",label:"ログイン"},{id:"register",label:"新規会員登録"}].map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id as any);setError("");}}
                style={{flex:1,padding:"12px",background:tab===t.id?C.primary:C.white,color:tab===t.id?"#fff":C.textSub,border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{padding:24}}>
            {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:3,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:12}}>{error}</div>}

            {tab==="login"?(
              <>
                <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>会員ログイン</div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>メールアドレス</div>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="example@email.com"
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>パスワード</div>
                  <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                    type="password" placeholder="パスワード"
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                </div>
                <button onClick={handleLogin} disabled={loading}
                  style={{width:"100%",background:loading?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:3,padding:"12px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {loading?"ログイン中...":"ログイン"}
                </button>
                <div style={{textAlign:"center",marginTop:12,fontSize:12,color:C.textSub}}>
                  会員でない方は<span style={{color:C.primary,cursor:"pointer",fontWeight:700,marginLeft:4}} onClick={()=>setTab("register")}>新規登録はこちら</span>
                </div>
              </>
            ):(
              <>
                <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>新規会員登録</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>姓</div>
                    <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="山田"
                      style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>名</div>
                    <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="太郎"
                      style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>メールアドレス</div>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="example@email.com"
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:4}}>パスワード（8文字以上）</div>
                  <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="パスワード"
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:3,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
                </div>
                <button onClick={handleRegister} disabled={loading}
                  style={{width:"100%",background:loading?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:3,padding:"12px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {loading?"登録中...":"会員登録する"}
                </button>
                <div style={{textAlign:"center",marginTop:12,fontSize:11,color:C.textSub,lineHeight:1.7}}>
                  登録することで、<span style={{color:C.primary}}>利用規約</span>・<span style={{color:C.primary}}>プライバシーポリシー</span>に同意したものとみなします。
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
