"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const C = {
  primary: "#0ABAB5",
  red: "#CC2200",
  text: "#1A1A2E",
  textSub: "#666",
  border: "#E0E0E0",
  white: "#FFFFFF",
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async () => {
    if (!email) { setError("メールアドレスを入力してください"); return; }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch {
      setError("エラーが発生しました。再度お試しください");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!password || !confirmPassword) { setError("パスワードを入力してください"); return; }
    if (password !== confirmPassword) { setError("パスワードが一致しません"); return; }
    if (password.length < 8) { setError("パスワードは8文字以上で入力してください"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "エラーが発生しました"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("エラーが発生しました。再度お試しください");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: C.primary,
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 8, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, marginBottom: 4 }}>AI Across ショップ</div>
          <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>
            {token ? "新しいパスワードを設定" : "パスワードをお忘れの方"}
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: "center", color: C.primary }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
            {token
              ? <><p style={{ fontWeight: 700 }}>パスワードを更新しました</p><p style={{ fontSize: 13, color: C.textSub }}>ログイン画面へ移動します...</p></>
              : <><p style={{ fontWeight: 700 }}>メールを送信しました</p><p style={{ fontSize: 13, color: C.textSub }}>受信ボックスをご確認ください。<br/>メールが届かない場合は迷惑メールフォルダをご確認ください。</p></>
            }
          </div>
        ) : token ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>新しいパスワード（8文字以上）</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="新しいパスワード" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>パスワード確認</div>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="もう一度入力" />
            </div>
            {error && <div style={{ color: C.red, fontSize: 13 }}>{error}</div>}
            <button onClick={handleConfirmReset} disabled={loading} style={btnStyle}>
              {loading ? "更新中..." : "パスワードを更新する"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>
              登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
            </p>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>メールアドレス</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRequestReset()} style={inputStyle} placeholder="example@email.com" />
            </div>
            {error && <div style={{ color: C.red, fontSize: 13 }}>{error}</div>}
            <button onClick={handleRequestReset} disabled={loading} style={btnStyle}>
              {loading ? "送信中..." : "リセットメールを送信する"}
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>読み込み中...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
