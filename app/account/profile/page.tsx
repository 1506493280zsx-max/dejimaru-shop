"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";
const TOKEN = "a5RnKIXFibE5JV_50ir42Hk84JnMZVMb";

function Input({label,value,onChange,placeholder,required=false,type="text"}:{label:string,value:string,onChange:(v:string)=>void,placeholder?:string,required?:boolean,type?:string}) {
  return (
    <div>
      <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>
        {label}{required&&<span style={{color:C.red,fontSize:10,marginLeft:4}}>※必須</span>}
      </div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, setAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    last_name:"", first_name:"", email:"",
  });

  useEffect(()=>{ setMounted(true); },[]);

  useEffect(()=>{
    if (!mounted) return;
    if (!user) { router.push("/login"); return; }
    setForm({
      last_name: user.last_name || "",
      first_name: user.first_name || "",
      email: user.email || "",
    });
  },[mounted, user]);

  const handleSave = async () => {
    if (!form.last_name || !form.first_name || !form.email) {
      setError("必須項目を入力してください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${DIRECTUS}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          last_name: form.last_name,
          first_name: form.first_name,
          email: form.email,
        }),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
      const data = await res.json();
      setAuth({ ...user!, last_name: form.last_name, first_name: form.first_name, email: form.email }, token!);
      setSaved(true);
      setTimeout(()=>setSaved(false), 3000);
    } catch(e:any) {
      setError(e.message || "更新に失敗しました");
    }
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px",display:"flex",alignItems:"center"}}>
          <div style={{cursor:"pointer"}} onClick={()=>router.push("/")}>
            <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
          </div>
          <button onClick={()=>router.push("/account")} style={{marginLeft:"auto",background:C.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>👤 マイページ</button>
        </div>
      </div>
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span><span>›</span>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/account")}>マイページ</span><span>›</span>
          <span style={{fontWeight:700}}>会員情報の変更</span>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"16px auto",padding:"0 10px 40px"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          👤 会員情報の変更
        </h1>

        {saved && (
          <div style={{background:"#F0FFF0",border:"1px solid #44AA44",borderRadius:2,padding:"10px 14px",fontSize:12,color:"#227700",marginBottom:14,fontWeight:700}}>
            ✅ 保存しました
          </div>
        )}
        {error && (
          <div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>
            {error}
          </div>
        )}

        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Input label="姓" value={form.last_name} onChange={v=>setForm(p=>({...p,last_name:v}))} placeholder="山田" required/>
              <Input label="名" value={form.first_name} onChange={v=>setForm(p=>({...p,first_name:v}))} placeholder="太郎" required/>
            </div>
            <Input label="メールアドレス" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} placeholder="example@email.com" required type="email"/>
            <div style={{padding:10,background:"#FFF8E8",border:"1px solid #F0D080",borderRadius:2,fontSize:11,color:"#886600"}}>
              ※メールアドレスを変更した場合、次回ログイン時から新しいアドレスをご使用ください。
            </div>
            <button onClick={handleSave} disabled={loading}
              style={{background:loading?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:2,padding:"12px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
              {loading?"保存中...":"変更を保存する"}
            </button>
          </div>
        </div>

        <div style={{marginTop:16,display:"flex",gap:10}}>
          <button onClick={()=>router.push("/account/password")}
            style={{flex:1,background:C.white,color:C.primary,border:`1px solid ${C.primary}`,borderRadius:2,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            🔒 パスワードを変更する
          </button>
          <button onClick={()=>router.push("/account/address")}
            style={{flex:1,background:C.white,color:C.primary,border:`1px solid ${C.primary}`,borderRadius:2,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            📍 お届け先を管理する
          </button>
        </div>
      </div>

      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",fontSize:10,color:"#5A8A8A"}}>© 2024 デジマルショップ. All Rights Reserved.</div>
      </div>
    </div>
  );
}
