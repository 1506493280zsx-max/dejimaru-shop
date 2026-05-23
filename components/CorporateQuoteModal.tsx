"use client";
import { useState, useEffect } from "react";

const PRODUCT_TYPES = ["ノートPC", "デスクトップ", "MacBook", "iPhone", "タブレット", "モニター"];
const PURPOSES      = ["法人", "学校", "転売", "イベント", "その他"];
const OS_OPTIONS     = ["Windows 10", "Windows 11", "macOS", "Chrome OS", "Linux", "指定なし"];
const MEMORY_OPTIONS = ["4GB", "8GB", "16GB", "32GB以上", "指定なし"];
const SSD_OPTIONS    = ["128GB", "256GB", "512GB", "1TB以上", "指定なし"];
const BUDGET_OPTIONS = ["〜50万円", "50〜100万円", "100〜300万円", "300万円以上", "要相談"];

type FormData = {
  productTypes: string[];
  quantity: string;
  budget: string;
  purpose: string;
  os: string;
  memory: string;
  ssd: string;
  requirements: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  memo: string;
  website: string;
};

const INITIAL: FormData = {
  productTypes: [], quantity: "", budget: "", purpose: "",
  os: "", memory: "", ssd: "", requirements: "",
  company: "", name: "", phone: "", email: "", memo: "", website: "",
};

function StepIndicator({ step }: { step: number }) {
  const labels = ["ご希望の商品", "詳細条件", "お客様情報"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: i < step ? "#18c7c7" : i === step ? "#2c3e50" : "#e5e7eb",
              color: i <= step ? "#fff" : "#9ca3af",
              fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: 10, color: i === step ? "#2c3e50" : "#9ca3af", fontWeight: i === step ? 700 : 400, whiteSpace: "nowrap" }}>
              {label}
            </div>
          </div>
          {i < labels.length - 1 && (
            <div style={{ width: 48, height: 2, background: i < step ? "#18c7c7" : "#e5e7eb", margin: "0 4px", marginBottom: 18, transition: "background 0.2s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CorporateQuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>(INITIAL);
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep(0); setForm(INITIAL); setSending(false); setDone(false); setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleType = (t: string) =>
    setForm(f => ({
      ...f,
      productTypes: f.productTypes.includes(t)
        ? f.productTypes.filter(x => x !== t)
        : [...f.productTypes, t],
    }));

  const handleSubmit = async () => {
    if (sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/corporate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 403) { setError("送信できませんでした。"); setSending(false); return; }
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("送信エラーが発生しました。しばらくしてからお試しください。");
    }
    setSending(false);
  };

  const canSubmit = !sending && !!form.company && !!form.name && !!form.phone && !!form.email;

  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #e5e7eb", borderRadius: 8,
    padding: "10px 12px", fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };
  const sel: React.CSSProperties = { ...inp, appearance: "auto" as any };
  const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, display: "block" };

  const btnBack: React.CSSProperties = {
    background: "none", border: "1px solid #e5e7eb", color: "#6b7280",
    padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  };
  const btnNext: React.CSSProperties = {
    background: "#2c3e50", color: "#fff", border: "none",
    padding: "12px 32px", borderRadius: 10, fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 2000,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflowY: "auto",
        padding: "40px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 900,
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          fontFamily: "'Meiryo','ＭＳ Ｐゴシック',sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "#2c3e50", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>CORPORATE QUOTE</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>法人・学校向け 大量購入見積</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
            ✕
          </button>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#2c3e50", marginBottom: 10 }}>送信が完了しました</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.9, marginBottom: 28 }}>
                担当者より折り返しご連絡いたします。<br />通常1〜2営業日以内にご返信いたします。
              </div>
              <button onClick={onClose} style={{ background: "#2c3e50", color: "#fff", border: "none", padding: "12px 36px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                閉じる
              </button>
            </div>
          ) : (
            <>
              <StepIndicator step={step} />

              {/* ── Step 1: ご希望の商品 ── */}
              {step === 0 && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#2c3e50", marginBottom: 20 }}>ご希望の商品</div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>商品タイプ（複数選択可）</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {PRODUCT_TYPES.map(t => {
                        const active = form.productTypes.includes(t);
                        return (
                          <div
                            key={t}
                            onClick={() => toggleType(t)}
                            style={{
                              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                              border: `2px solid ${active ? "#18c7c7" : "#e5e7eb"}`,
                              background: active ? "#e6fafa" : "#fff",
                              color: active ? "#18c7c7" : "#374151",
                              fontWeight: active ? 700 : 400,
                              fontSize: 13, transition: "all 0.15s", userSelect: "none",
                            }}>
                            {t}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={lbl}>数量（台）</label>
                      <input type="number" min="1" placeholder="例: 20" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>予算</label>
                      <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} style={sel}>
                        <option value="">選択してください</option>
                        {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={lbl}>用途</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {PURPOSES.map(p => {
                        const active = form.purpose === p;
                        return (
                          <div
                            key={p}
                            onClick={() => setForm(f => ({ ...f, purpose: p }))}
                            style={{
                              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                              border: `2px solid ${active ? "#ffb84d" : "#e5e7eb"}`,
                              background: active ? "#fff8ec" : "#fff",
                              color: active ? "#92400e" : "#374151",
                              fontWeight: active ? 700 : 400,
                              fontSize: 13, transition: "all 0.15s", userSelect: "none",
                            }}>
                            {p}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => setStep(1)} style={btnNext}>次へ →</button>
                  </div>
                </div>
              )}

              {/* ── Step 2: 詳細条件（任意） ── */}
              {step === 1 && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#2c3e50", marginBottom: 4 }}>詳細条件（任意）</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>すべて任意項目です</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={lbl}>OS</label>
                      <select value={form.os} onChange={e => setForm(f => ({ ...f, os: e.target.value }))} style={sel}>
                        <option value="">選択</option>
                        {OS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>メモリ</label>
                      <select value={form.memory} onChange={e => setForm(f => ({ ...f, memory: e.target.value }))} style={sel}>
                        <option value="">選択</option>
                        {MEMORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>SSD</label>
                      <select value={form.ssd} onChange={e => setForm(f => ({ ...f, ssd: e.target.value }))} style={sel}>
                        <option value="">選択</option>
                        {SSD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={lbl}>その他の要件</label>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>例: Office必要 / CPU指定 / Surface希望 / BCD混在</div>
                    <textarea rows={4} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="自由にご記入ください..." style={{ ...inp, resize: "vertical" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={() => setStep(0)} style={btnBack}>← 戻る</button>
                    <button onClick={() => setStep(2)} style={btnNext}>次へ →</button>
                  </div>
                </div>
              )}

              {/* ── Step 3: お客様情報 ── */}
              {step === 2 && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#2c3e50", marginBottom: 20 }}>お客様情報</div>

                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={lbl}>会社名 / 団体名 <span style={{ color: "#ef4444" }}>*</span></label>
                      <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="AI Across合同会社" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>担当者名 <span style={{ color: "#ef4444" }}>*</span></label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="山田 太郎" style={inp} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={lbl}>電話番号 <span style={{ color: "#ef4444" }}>*</span></label>
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="050-0000-0000" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>メールアドレス <span style={{ color: "#ef4444" }}>*</span></label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@example.com" style={inp} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={lbl}>備考・ご連絡事項</label>
                    <textarea rows={3} value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} placeholder="ご不明な点やご要望があればご記入ください" style={{ ...inp, resize: "vertical" }} />
                  </div>

                  {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setStep(1)} style={btnBack}>← 戻る</button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      style={{
                        ...btnNext,
                        background: canSubmit ? "#2c3e50" : "#9ca3af",
                        cursor: canSubmit ? "pointer" : "not-allowed",
                        padding: "12px 36px",
                      }}>
                      {sending ? "送信中..." : "見積を依頼する"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
