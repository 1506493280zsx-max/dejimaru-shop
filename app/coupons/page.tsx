"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary: "#0ABAB5", primaryDark: "#089490", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", text: "#333", textSub: "#666", textLight: "#999",
  border: "#DDD", bg: "#F0F5F5", white: "#FFF", red: "#CC2200",
};

type Coupon = {
  id: number;
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  category_slug: string | null;
  expires_at: string | null;
  max_claims_per_user: number;
};

export default function PublicCouponsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, { text: string; ok: boolean }>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    fetch("/api/coupons/public")
      .then(r => r.json())
      .then(d => setCoupons(d.data || []))
      .finally(() => setLoading(false));
  }, [mounted]);

  const handleClaim = async (coupon: Coupon) => {
    if (!user) {
      router.push(`/login?redirect=/coupons`);
      return;
    }
    setClaiming(coupon.id);
    try {
      const res = await fetch("/api/coupons/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: coupon.code }),
      });
      const data = await res.json();
      setMessages(prev => ({ ...prev, [coupon.id]: { text: data.message, ok: data.success } }));
      if (data.success) {
        setTimeout(() => router.push("/account/coupons"), 1500);
      }
    } catch {
      setMessages(prev => ({ ...prev, [coupon.id]: { text: "エラーが発生しました", ok: false } }));
    } finally {
      setClaiming(null);
    }
  };

  const discountLabel = (c: Coupon) =>
    c.discount_type === "percent" ? `${c.discount_value}% OFF` : `¥${c.discount_value.toLocaleString()} OFF`;

  if (!mounted || loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Meiryo,sans-serif" }}>
      <p style={{ color: C.textSub }}>読み込み中...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Meiryo,'ＭＳ Ｐゴシック',sans-serif", fontSize: 13, color: C.text }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, borderBottom: `2px solid ${C.primary}`, paddingBottom: 8, marginBottom: 8 }}>
          🎫 クーポン一覧
        </h1>
        <p style={{ color: C.textSub, marginBottom: 24, fontSize: 13 }}>
          領取ボタンを押すとマイクーポンに追加されます。会員登録が必要です。
        </p>

        {coupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textSub }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
            <p style={{ fontSize: 15 }}>現在配布中のクーポンはありません</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {coupons.map(coupon => (
              <div key={coupon.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ background: C.primaryBg, padding: "10px 16px", borderBottom: `1px solid ${C.primaryBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: C.red }}>{discountLabel(coupon)}</span>
                  {coupon.expires_at && (
                    <span style={{ fontSize: 11, color: C.textSub }}>
                      {new Date(coupon.expires_at).toLocaleDateString("ja-JP")}まで
                    </span>
                  )}
                </div>
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    {coupon.description && <p style={{ marginBottom: 4 }}>{coupon.description}</p>}
                    {coupon.category_slug && <p style={{ fontSize: 12, color: C.textSub }}>対象：{coupon.category_slug}</p>}
                    <p style={{ fontSize: 12, color: C.textSub }}>お一人様{coupon.max_claims_per_user}回まで</p>
                    {messages[coupon.id] && (
                      <p style={{ fontSize: 12, marginTop: 6, color: messages[coupon.id].ok ? "#2e7d32" : C.red, fontWeight: 600 }}>
                        {messages[coupon.id].text}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleClaim(coupon)}
                    disabled={claiming === coupon.id}
                    style={{ padding: "10px 20px", background: claiming === coupon.id ? C.textLight : C.primary, color: C.white, border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", minWidth: 80 }}
                  >
                    {claiming === coupon.id ? "処理中..." : user ? "領取する" : "ログインして領取"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
