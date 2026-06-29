"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { authFetch } from "@/lib/auth-fetch";

const C = {
  primary:"#0ABAB5", primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", border:"#DDD", white:"#FFF", bg:"#F0F5F5", red:"#CC2200"
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, hasHydrated } = useAuthStore();
  const [form, setForm] = useState({ last_name:"", first_name:"", phone:"" });
  const [pwForm, setPwForm] = useState({ current_password:"", new_password:"", confirm_password:"" });
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [emailForm, setEmailForm] = useState({ current_password:"", new_email:"" });
  const [emailMsg, setEmailMsg] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    authFetch("/api/account/profile")
      .then(r => r.json())
      .then(d => {
        if (d.data) setForm({ last_name: d.data.last_name || "", first_name: d.data.first_name || "", phone: d.data.phone || "" });
      });
  }, [hasHydrated, token]);

  const handleSubmit = async () => {
    setLoading(true); setMsg("");
    const r = await authFetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await r.json();
    setMsg(d.success ? "✅ 更新しました" : `❌ ${d.error}`);
    setLoading(false);
  };

  const handlePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm_password) { setPwMsg("❌ 新しいパスワードが一致しません"); return; }
    setPwLoading(true); setPwMsg("");
    const r = await authFetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password })
    });
    const d = await r.json();
    setPwMsg(d.success ? "✅ パスワードを変更しました" : `❌ ${d.error}`);
    if (d.success) setPwForm({ current_password:"", new_password:"", confirm_password:"" });
    setPwLoading(false);
  };

  const handleEmail = async () => {
    if (!emailForm.current_password || !emailForm.new_email) { setEmailMsg("❌ 入力内容を確認してください"); return; }
    setEmailLoading(true); setEmailMsg("");
    const r = await authFetch("/api/account/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailForm)
    });
    const d = await r.json();
    setEmailMsg(d.success ? "✅ メールアドレスを変更しました。再ログインしてください。" : `❌ ${d.error}`);
    if (d.success) setEmailForm({ current_password:"", new_email:"" });
    setEmailLoading(false);
  };

  if (!user) return <div style={{padding:40,textAlign:"center"}}>ログインが必要です</div>;

  const inputStyle: React.CSSProperties = { width:"100%", border:`1px solid ${C.border}`, padding:"9px 12px", fontSize:13, borderRadius:2, fontFamily:"inherit", boxSizing:"border-box" };
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:700, color:C.textSub, display:"block", marginBottom:4 };

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif", fontSize:13, color:C.text}}>
      <div style={{maxWidth:600, margin:"0 auto", padding:"16px 10px 40px"}}>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16}}>
          <button onClick={()=>router.push("/account")} style={{background:"none", border:"none", cursor:"pointer", color:C.primary, fontSize:13, fontFamily:"inherit"}}>← マイページ</button>
        </div>

        <div style={{background:C.white, border:`1px solid ${C.border}`, borderRadius:2, marginBottom:16}}>
          <div style={{background:C.primary, color:"#fff", padding:"8px 16px", fontSize:13, fontWeight:700}}>会員情報の変更</div>
          <div style={{padding:20}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12}}>
              <div><label style={labelStyle}>姓</label><input style={inputStyle} value={form.last_name} onChange={e=>setForm(f=>({...f,last_name:e.target.value}))} /></div>
              <div><label style={labelStyle}>名</label><input style={inputStyle} value={form.first_name} onChange={e=>setForm(f=>({...f,first_name:e.target.value}))} /></div>
            </div>
            <div style={{marginBottom:16}}><label style={labelStyle}>電話番号</label><input style={inputStyle} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} /></div>
            {msg && <div style={{marginBottom:12, fontSize:12, color: msg.startsWith("✅") ? "#227700" : C.red}}>{msg}</div>}
            <button onClick={handleSubmit} disabled={loading} style={{background:C.primary, color:"#fff", border:"none", padding:"10px 28px", borderRadius:2, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"}}>
              {loading ? "更新中..." : "更新する"}
            </button>
          </div>
        </div>

        <div style={{background:C.white, border:`1px solid ${C.border}`, borderRadius:2}}>
          <div style={{background:C.primary, color:"#fff", padding:"8px 16px", fontSize:13, fontWeight:700}}>パスワードの変更</div>
          <div style={{padding:20}}>
            <div style={{marginBottom:12}}><label style={labelStyle}>現在のパスワード</label><input type="password" style={inputStyle} value={pwForm.current_password} onChange={e=>setPwForm(f=>({...f,current_password:e.target.value}))} /></div>
            <div style={{marginBottom:12}}><label style={labelStyle}>新しいパスワード（8文字以上）</label><input type="password" style={inputStyle} value={pwForm.new_password} onChange={e=>setPwForm(f=>({...f,new_password:e.target.value}))} /></div>
            <div style={{marginBottom:16}}><label style={labelStyle}>新しいパスワード（確認）</label><input type="password" style={inputStyle} value={pwForm.confirm_password} onChange={e=>setPwForm(f=>({...f,confirm_password:e.target.value}))} /></div>
            {pwMsg && <div style={{marginBottom:12, fontSize:12, color: pwMsg.startsWith("✅") ? "#227700" : C.red}}>{pwMsg}</div>}
            <button onClick={handlePassword} disabled={pwLoading} style={{background:C.primary, color:"#fff", border:"none", padding:"10px 28px", borderRadius:2, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"}}>
              {pwLoading ? "変更中..." : "パスワードを変更する"}
            </button>
          </div>
        </div>

        <div style={{background:C.white, border:`1px solid ${C.border}`, borderRadius:2, marginTop:16}}>
          <div style={{background:C.primary, color:"#fff", padding:"8px 16px", fontSize:13, fontWeight:700}}>メールアドレスの変更</div>
          <div style={{padding:20}}>
            <div style={{marginBottom:12}}><label style={labelStyle}>現在のパスワード（確認用）</label><input type="password" style={inputStyle} value={emailForm.current_password} onChange={e=>setEmailForm(f=>({...f,current_password:e.target.value}))} /></div>
            <div style={{marginBottom:16}}><label style={labelStyle}>新しいメールアドレス</label><input type="email" style={inputStyle} value={emailForm.new_email} onChange={e=>setEmailForm(f=>({...f,new_email:e.target.value}))} /></div>
            {emailMsg && <div style={{marginBottom:12, fontSize:12, color: emailMsg.startsWith("✅") ? "#227700" : C.red}}>{emailMsg}</div>}
            <button onClick={handleEmail} disabled={emailLoading} style={{background:C.primary, color:"#fff", border:"none", padding:"10px 28px", borderRadius:2, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"}}>
              {emailLoading ? "変更中..." : "メールアドレスを変更する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
