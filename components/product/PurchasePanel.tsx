"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/directus";
import { useCartStore } from "@/lib/cart-store";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  red: "#CC2200", text: "#333", textSub: "#666", textLight: "#999",
  border: "#DDD", white: "#FFF",
};

const GRADE_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NEW: { label: "新品", color: "#CC0000", bg: "#FFF0F0", border: "#CC0000" },
  S:   { label: "S品", color: "#007A76", bg: "#E8F8F8", border: "#0ABAB5" },
  A:   { label: "A品", color: "#227700", bg: "#F0FFF0", border: "#44AA44" },
  B:   { label: "B品", color: "#555",    bg: "#F5F5F5", border: "#AAA"    },
  C:   { label: "C品", color: "#333",    bg: "#EEEEEE", border: "#888"    },
};

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? "#FFA000" : "#DDD" }}>★</span>
      ))}
    </span>
  );
}

export default function PurchasePanel({
  product, avgRating = 0, reviewCount = 0,
}: { product: any; avgRating?: number; reviewCount?: number }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [warrantySelected, setWarrantySelected] = useState(false);

  const warrantyEnabled = !!product.premium_warranty_enabled;
  const warrantyPrice = product.premium_warranty_price;

  const disc = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;
  const gs = GRADE_STYLE[product.grade] || GRADE_STYLE.C;

  const handleAddToCart = () => {
    const imgId = product.images?.[0]?.image_file_id;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: String(product.id), slug: product.slug, name: product.name,
        price: product.price,
        imageUrl: imgId ? getImageUrl(imgId, 200, 150) : null,
        brand: product.brand_id?.name || "", grade: product.grade,
        warrantySelected,
        warrantyPrice: warrantySelected ? (warrantyPrice ?? 0) : 0,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, padding: 16, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{product.brand_id?.name}</div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.5, margin: "0 0 8px 0" }}>{product.name}</h1>

        {reviewCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Stars rating={avgRating} size={14} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFA000" }}>{avgRating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: C.textSub }}>（{reviewCount}件のレビュー）</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {product.grade && (
            <span style={{ background: gs.bg, color: gs.color, border: `1px solid ${gs.border}`, borderRadius: 2, fontSize: 11, fontWeight: 700, padding: "3px 10px" }}>{gs.label}</span>
          )}
          {product.condition && (
            <span style={{ background: "#F5F5F5", color: "#555", border: "1px solid #CCC", borderRadius: 2, fontSize: 11, padding: "3px 10px" }}>
              {product.condition === "used" ? "中古品" : product.condition === "new" ? "新品" : "リファービッシュ"}
            </span>
          )}
          <span style={{ background: "#F0FFF4", color: "#22AA44", border: "1px solid #88DD88", borderRadius: 2, fontSize: 11, padding: "3px 10px" }}>在庫あり</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14, padding: 12, background: C.primaryBg, borderRadius: 2, border: `1px solid ${C.primaryBorder}` }}>
          {product.compare_at_price && (
            <div style={{ fontSize: 11, color: C.textLight, textDecoration: "line-through", marginBottom: 2 }}>定価 ¥{product.compare_at_price.toLocaleString()}</div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.red }}>¥{product.price.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: C.textSub }}>（税込）</div>
            {disc >= 5 && <div style={{ background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>{disc}%OFF</div>}
          </div>
        </div>

        {product.short_description && (
          <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7, marginBottom: 14, padding: 10, background: "#FAFAFA", borderRadius: 2, border: `1px solid ${C.border}` }}>
            {product.short_description}
          </div>
        )}

        {/* Premium 保証 */}
        {warrantyEnabled && warrantyPrice > 0 && (
          <label style={{
            display:"flex", alignItems:"center", gap:10, cursor:"pointer",
            padding:"10px 12px", marginBottom:12,
            background: warrantySelected ? C.primaryBg : "#FAFAFA",
            border: `1px solid ${warrantySelected ? C.primary : C.border}`,
            borderRadius:2, userSelect:"none",
          }}>
            <input
              type="checkbox"
              checked={warrantySelected}
              onChange={e => setWarrantySelected(e.target.checked)}
              style={{ accentColor: C.primary, width:16, height:16, flexShrink:0 }}
            />
            <div>
              <div style={{fontSize:12, fontWeight:700, color:C.text}}>
                🛡️ プリミアム保証（終身保証）
              </div>
              <div style={{fontSize:11, color:C.primary, fontWeight:700}}>
                +¥{warrantyPrice.toLocaleString()}
              </div>
            </div>
          </label>
        )}

        {/* Qty + Cart */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 36, background: "#F5F5F5", border: "none", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>－</button>
            <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{qty}</div>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 36, background: "#F5F5F5", border: "none", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>＋</button>
          </div>
          <button onClick={handleAddToCart} style={{ flex: 1, background: added ? "#227700" : C.primary, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
            {added ? "✓ カートに追加しました！" : "🛒 カートに入れる"}
          </button>
        </div>
        <button onClick={() => { handleAddToCart(); router.push("/cart"); }} style={{ width: "100%", background: "#FF6600", color: "#fff", border: "none", padding: "10px", borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
          ⚡ 今すぐ購入
        </button>

        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          {["🛡️ 30日間保証", "🚚 即日発送", "📞 サポート付き"].map(t => (
            <div key={t} style={{ fontSize: 11, color: C.textSub }}>{t}</div>
          ))}
        </div>

        {/* Payment icons */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>対応決済方法</div>
          <div style={{ padding: 0, margin: 0, background: "transparent", border: "none", boxShadow: "none", borderRadius: 0, overflow: "hidden" }}>
            <Image
              src="/images/payment-methods.png"
              alt="対応決済方法"
              width={2000}
              height={300}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
