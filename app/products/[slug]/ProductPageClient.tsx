"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";
import { useAuthStore } from "@/lib/auth-store";

import Breadcrumb from "@/components/product/Breadcrumb";
import Gallery from "@/components/product/Gallery";
import PurchasePanel from "@/components/product/PurchasePanel";
import DetailSections from "@/components/product/DetailSections";
import ReviewSection from "@/components/product/ReviewSection";
import RecentProducts, { saveRecentProduct } from "@/components/product/RecentProducts";

const C = {
  primary: "#0ABAB5", red: "#CC2200",
  text: "#333", textLight: "#999", white: "#FFF",
};

export default function ProductPageClient({ product }: { product: any }) {
  const router = useRouter();
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const { user } = useAuthStore();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimMsg, setClaimMsg] = useState<Record<number, string>>({});

  useEffect(() => {
    const imgId = product.images?.[0]?.image_file_id;
    saveRecentProduct(product, imgId ? getImageUrl(imgId, 200, 150) : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  useEffect(() => {
    if (!product?.category_id) return;
    const url = `/api/coupons/by-category?category_id=${product.category_id}${user ? `&email=${encodeURIComponent(user.email)}` : ""}`;
    fetch(url).then(r => r.json()).then(d => setCoupons(d.data || []));
  }, [product?.category_id, user?.email]);

  const handleClaim = async (coupon: any) => {
    if (!user) { window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`; return; }
    setClaimingId(coupon.id);
    try {
      const res = await fetch("/api/coupons/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.code, email: user.email }),
      });
      const data = await res.json();
      setClaimMsg(prev => ({ ...prev, [coupon.id]: data.message }));
      if (data.success) setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, claimed: true } : c));
    } finally { setClaimingId(null); }
  };

  return (
    <div style={{ background: "#F0F5F5", minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック',sans-serif", fontSize: 13, color: C.text }}>

      {/* Breadcrumb */}
      <Breadcrumb product={product} />

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "12px auto", padding: "0 10px" }}>

        {/* Two-column: Gallery (left) + Purchase Panel (right) */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Gallery product={product} />
            <div style={{ background: "#fff", border: "1px solid #DDD", borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0ABAB5", marginBottom: 8 }}>🎫 利用できるクーポン</p>
              {[...Array(5)].map((_, i) => {
                const coupon = coupons[i];
                return (
                  <div key={i} style={{ background: coupon ? "#E8F8F8" : "#F9F9F9", border: `1px solid ${coupon ? "#B0E0DE" : "#EEE"}`, borderRadius: 6, padding: "8px 12px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 52 }}>
                    {coupon ? (
                      <>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#CC2200", margin: 0 }}>
                            {coupon.discount_type === "percent" ? `${coupon.discount_value}% OFF` : `¥${coupon.discount_value.toLocaleString()} OFF`}
                          </p>
                          {coupon.description && <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0" }}>{coupon.description}</p>}
                          {claimMsg[coupon.id] && <p style={{ fontSize: 11, color: "#0ABAB5", margin: "2px 0 0" }}>{claimMsg[coupon.id]}</p>}
                        </div>
                        <button
                          onClick={() => handleClaim(coupon)}
                          disabled={coupon.claimed || claimingId === coupon.id}
                          style={{ padding: "4px 12px", background: coupon.claimed ? "#999" : "#0ABAB5", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: coupon.claimed ? "default" : "pointer", whiteSpace: "nowrap", minWidth: 80 }}
                        >
                          {claimingId === coupon.id ? "処理中..." : coupon.claimed ? "領取済み✅" : user ? "領取する" : "ログインして領取"}
                        </button>
                      </>
                    ) : (
                      <p style={{ fontSize: 11, color: "#CCC", margin: 0 }}>—</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <PurchasePanel product={product} avgRating={avgRating} reviewCount={reviewCount} />
        </div>

        {/* Detail content body (8 sections) */}
        <DetailSections product={product} />

        {/* Customer Reviews */}
        <ReviewSection
          productId={String(product.id)}
          onStatsChange={(avg, cnt) => { setAvgRating(avg); setReviewCount(cnt); }}
        />

        {/* Recently Viewed Products */}
        <RecentProducts currentProductId={String(product.id)} />

        <div style={{ marginTop: 14, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: C.white, color: C.primary, border: `1px solid ${C.primary}`, padding: "8px 20px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← 一覧に戻る</button>
        </div>
      </div>

    </div>
  );
}
