"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/directus";

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

  useEffect(() => {
    const imgId = product.images?.[0]?.directus_files_id;
    saveRecentProduct(product, imgId ? getImageUrl(imgId, 200, 150) : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return (
    <div style={{ background: "#F0F5F5", minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック',sans-serif", fontSize: 13, color: C.text }}>

      {/* Breadcrumb */}
      <Breadcrumb product={product} />

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "12px auto", padding: "0 10px" }}>

        {/* Two-column: Gallery (left) + Purchase Panel (right) */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Gallery product={product} />
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
