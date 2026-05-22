"use client";
import { useRouter } from "next/navigation";

export default function Breadcrumb({ product }: { product: any }) {
  const router = useRouter();
  return (
    <div style={{ background: "#0ABAB5", borderBottom: "2px solid #089490" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "7px 10px", fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>ホーム</span>
        <span style={{ opacity: 0.6 }}>›</span>
        <span style={{ cursor: "pointer" }} onClick={() => router.push(`/category/${product.category_id?.slug || "pc"}`)}>
          {product.category_id?.name || "商品一覧"}
        </span>
        <span style={{ opacity: 0.6 }}>›</span>
        <span style={{ opacity: 0.8 }}>{product.name?.slice(0, 40)}</span>
      </div>
    </div>
  );
}
