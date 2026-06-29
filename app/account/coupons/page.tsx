"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { authFetch } from "@/lib/auth-fetch";
import { useState, useEffect } from "react";

const C = {
  primary: "#0ABAB5", primaryDark: "#089490", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", text: "#333", textSub: "#666", textLight: "#999",
  border: "#DDD", bg: "#F0F5F5", white: "#FFF", red: "#CC2200",
};

type CouponItem = {
  id: number;
  claimed_at: string;
  used_at: string | null;
  order_id: number | null;
  status: "available" | "used" | "expired";
  daysLeft: number | null;
  coupon: {
    code: string;
    description: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    category_slug: string | null;
    expires_at: string | null;
  };
};

export default function MyCouponsPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasHydrated) return;
    if (!user) { router.push("/login"); return; }
    authFetch("/api/coupons/my")
      .then(r => r.json())
      .then(d => setCoupons(d.data || []))
      .finally(() => setLoading(false));
  }, [mounted, hasHydrated, user]);

  const statusLabel = (s: string) => {
    if (s === "available") return { label: "利用可能", color: C.primary };
    if (s === "used") return { label: "使用済み", color: C.textLight };
    return { label: "期限切れ", color: C.red };
  };

  const discountLabel = (c: CouponItem["coupon"]) =>
    c.discount_type === "percent" ? `${c.discount_value}% OFF` : `¥${c.discount_value.toLocaleString()} OFF`;

  if (!mounted || loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Meiryo,sans-serif" }}>
      <p style={{ color: C.textSub }}>読み込み中...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Meiryo,'ＭＳ Ｐゴシック',sans-serif", fontSize: 13, color: C.text }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, borderBottom: `2px solid ${C.primary}`, paddingBottom: 8, marginBottom: 24 }}>
          🎫 マイクーポン
        </h1>

        {coupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textSub }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
            <p style={{ fontSize: 15, marginBottom: 8 }}>クーポンはありません</p>
            <p style={{ fontSize: 13 }}>クーポンコードを入力して領取してください</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {coupons.map(item => {
              const st = statusLabel(item.status);
              return (
                <div key={item.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden", opacity: item.status === "available" ? 1 : 0.6 }}>
                  <div style={{ background: "#F9F9F9", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{item.coupon.code}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: `${st.color}22`, padding: "2px 8px", borderRadius: 10 }}>{st.label}</span>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: C.red, marginBottom: 4 }}>{discountLabel(item.coupon)}</p>
                    {item.coupon.description && <p style={{ color: C.textSub, marginBottom: 4 }}>{item.coupon.description}</p>}
                    {item.coupon.category_slug && <p style={{ fontSize: 12, color: C.textSub }}>対象カテゴリ：{item.coupon.category_slug}</p>}
                    {item.coupon.expires_at && (
                      <p style={{ fontSize: 12, color: item.daysLeft !== null && item.daysLeft <= 3 ? C.red : C.textSub, marginTop: 4 }}>
                        有効期限：{new Date(item.coupon.expires_at).toLocaleDateString("ja-JP")}
                        {item.daysLeft !== null && item.daysLeft > 0 && item.status === "available" && (
                          <span style={{ marginLeft: 8, fontWeight: 700 }}>（あと{item.daysLeft}日）</span>
                        )}
                      </p>
                    )}
                    {item.used_at && <p style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>使用日：{new Date(item.used_at).toLocaleDateString("ja-JP")}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
