"use client";
import { useState, useEffect } from "react";
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

interface Variant {
  id: number;
  sku: string;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
  color: string | null;
  memory: string | null;
  storage: string | null;
  capacity: string | null;
  sort_order: number;
}

export default function PurchasePanel({
  product, avgRating = 0, reviewCount = 0, onVariantChange,
}: { product: any; avgRating?: number; reviewCount?: number; onVariantChange?: (variant: any | null) => void }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [warrantySelected, setWarrantySelected] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [stockQty, setStockQty] = useState<number | null>(null);

  const warrantyEnabled = !!product.premium_warranty_enabled;
  const warrantyPrice = product.premium_warranty_price;

  // バリアント取得
  useEffect(() => {
    fetch(`/api/products/${product.id}/variants`)
      .then(r => r.json())
      .then(d => {
        const vs: Variant[] = d.variants || [];
        setVariants(vs);
        if (vs.length === 1) {
          setSelectedVariant(vs[0]);
        }
      })
      .catch(() => setVariants([]));
  }, [product.id]);

  // 库存查询
  useEffect(() => {
    const filterField = selectedVariant ? 'variant_id' : 'product_id';
    const filterValue = selectedVariant ? selectedVariant.id : product.id;
    fetch(`/api/inventory/stock?filterField=${filterField}&filterValue=${filterValue}`)
      .then(r => r.json())
      .then(d => setStockQty(d.available ?? null))
      .catch(() => setStockQty(null));
  }, [selectedVariant, product.id]);

  // 選択肢からバリアントを絞り込む
  useEffect(() => {
    if (variants.length === 0) return;
    const matched = variants.find(v =>
      (selectedColor === null || v.color === selectedColor) &&
      (selectedMemory === null || v.memory === selectedMemory) &&
      (selectedStorage === null || v.storage === selectedStorage) &&
      (selectedCapacity === null || v.capacity === selectedCapacity)
    );
    setSelectedVariant(matched || null);
    if (onVariantChange) onVariantChange(matched || null);
  }, [selectedColor, selectedMemory, selectedStorage, selectedCapacity, variants]);

  // ユニーク選択肢
  const colors    = [...new Set(variants.map(v => v.color).filter(Boolean))] as string[];
  const memories  = [...new Set(variants.map(v => v.memory).filter(Boolean))] as string[];
  const storages  = [...new Set(variants.map(v => v.storage).filter(Boolean))] as string[];
  const capacities = [...new Set(variants.map(v => v.capacity).filter(Boolean))] as string[];

  const hasVariants = variants.length > 0;

  // 表示価格：バリアントがあればバリアント価格、なければ商品価格
  const displayPrice = selectedVariant?.price ?? (hasVariants ? null : product.price);
  const displayCompare = selectedVariant?.compare_price ?? (hasVariants ? null : product.compare_at_price);
  const disc = displayPrice && displayCompare
    ? Math.round((1 - displayPrice / displayCompare) * 100) : 0;
  const gs = GRADE_STYLE[product.grade] || GRADE_STYLE.C;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) return;
    const imgId = product.images?.[0]?.image_file_id;
    const parts = [selectedVariant?.color, selectedVariant?.memory, selectedVariant?.storage, selectedVariant?.capacity].filter(Boolean);
    const snapshot = parts.join(" / ");
    const cartId = selectedVariant ? `${product.id}-${selectedVariant.id}` : String(product.id);
    for (let i = 0; i < qty; i++) {
      addItem({
        id: cartId,
        slug: product.slug,
        name: product.name,
        price: displayPrice ?? 0,
        imageUrl: imgId ? getImageUrl(imgId, 200, 150) : null,
        brand: product.brand_id?.name || "",
        grade: product.grade,
        warrantySelected,
        warrantyPrice: warrantySelected ? (warrantyPrice || 0) : 0,
        variant_id: selectedVariant?.id ?? null,
        variant_snapshot: snapshot,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const SelectorRow = ({ label, options, selected, onSelect }: {
    label: string;
    options: string[];
    selected: string | null;
    onSelect: (v: string) => void;
  }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 6 }}>
        {label}：<span style={{ color: C.text, fontWeight: 400 }}>{selected || "選択してください"}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              padding: "6px 14px",
              border: `1px solid ${selected === opt ? C.primary : C.border}`,
              background: selected === opt ? C.primaryBg : C.white,
              color: selected === opt ? C.primary : C.text,
              borderRadius: 2,
              fontSize: 12,
              fontWeight: selected === opt ? 700 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, padding: 16, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{product.brand_id?.name}</div>
        <h1 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, margin: "0 0 8px 0" }}>{product.name}</h1>

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
          <span style={{ background: "#F0FFF4", color: "#22AA44", border: "1px solid #88DD88", borderRadius: 2, fontSize: 11, padding: "3px 10px" }}>在庫あり</span>
        </div>

        {/* バリアント選択器 */}
        {hasVariants && (
          <div style={{ marginBottom: 14, padding: 12, background: "#FAFAFA", borderRadius: 2, border: `1px solid ${C.border}` }}>
            {colors.length > 0 && (
              <SelectorRow label="カラー" options={colors} selected={selectedColor} onSelect={setSelectedColor} />
            )}
            {memories.length > 0 && (
              <SelectorRow label="メモリ" options={memories} selected={selectedMemory} onSelect={setSelectedMemory} />
            )}
            {storages.length > 0 && (
              <SelectorRow label="ストレージ" options={storages} selected={selectedStorage} onSelect={setSelectedStorage} />
            )}
            {capacities.length > 0 && (
              <SelectorRow label="容量" options={capacities} selected={selectedCapacity} onSelect={setSelectedCapacity} />
            )}
            {hasVariants && !selectedVariant && (
              <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>※ 上記の仕様を選択してください</div>
            )}
          </div>
        )}

        {/* 価格 */}
        <div style={{ marginBottom: 14, padding: 12, background: C.primaryBg, borderRadius: 2, border: `1px solid ${C.primaryBorder}` }}>
          {displayCompare && (
            <div style={{ fontSize: 11, color: C.textLight, textDecoration: "line-through", marginBottom: 2 }}>定価 ¥{displayCompare.toLocaleString()}</div>
          )}
          {displayPrice !== null ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.red }}>¥{displayPrice.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: C.textSub }}>（税込）</div>
              {disc >= 1 && <div style={{ background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>{disc}%OFF</div>}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: C.textSub }}>仕様を選択すると価格が表示されます</div>
          )}
        </div>

        {product.short_description && (
          <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7, marginBottom: 14, padding: 10, background: "#FAFAFA", borderRadius: 2, border: `1px solid ${C.border}` }}>
            {product.short_description}
          </div>
        )}

        {/* Premium 保証 */}
        {warrantyEnabled && warrantyPrice > 0 && (
          <label style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            padding: "10px 12px", marginBottom: 12,
            background: warrantySelected ? C.primaryBg : "#FAFAFA",
            border: `1px solid ${warrantySelected ? C.primary : C.border}`,
            borderRadius: 2, userSelect: "none",
          }}>
            <input
              type="checkbox"
              checked={warrantySelected}
              onChange={e => setWarrantySelected(e.target.checked)}
              style={{ accentColor: C.primary }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>プレミアム保証</div>
              <div style={{ fontSize: 11, color: C.primary, fontWeight: 700 }}>+¥{warrantyPrice.toLocaleString()}</div>
            </div>
          </label>
        )}

        {/* 库存显示 */}
        {stockQty !== null && (
          <div style={{fontSize:12, color: stockQty === 0 ? '#e53e3e' : '#38a169', marginBottom:8}}>
            {stockQty === 0 ? '売り切れ' : `残り${stockQty}点`}
          </div>
        )}

        {/* 数量 + カート */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 36, background: "#F5F5F5", border: "none", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>－</button>
            <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{qty}</div>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 36, background: "#F5F5F5", border: "none", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>＋</button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={(hasVariants && !selectedVariant) || stockQty === 0}
            style={{
              flex: 1, background: added ? "#227700" : ((hasVariants && !selectedVariant) || stockQty === 0 ? "#AAA" : C.primary),
              color: "#fff", border: "none", padding: "10px 20px", borderRadius: 2,
              fontSize: 14, fontWeight: 700,
              cursor: (hasVariants && !selectedVariant) || stockQty === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background 0.2s"
            }}
          >
            {added ? "✓ カートに追加しました！" : "🛒 カートに入れる"}
          </button>
        </div>

        <button
          onClick={() => {
            const cartId = selectedVariant ? `${product.id}-${selectedVariant.id}` : String(product.id);
            const alreadyInCart = useCartStore.getState().items.some((i: any) => i.id === cartId);
            if (!alreadyInCart) {
              handleAddToCart();
            }
            router.push("/cart");
          }}
          disabled={(hasVariants && !selectedVariant) || stockQty === 0}
          style={{
            width: "100%", background: ((hasVariants && !selectedVariant) || stockQty === 0) ? "#AAA" : "#FF6600",
            color: "#fff", border: "none", padding: "10px", borderRadius: 2,
            fontSize: 14, fontWeight: 700,
            cursor: ((hasVariants && !selectedVariant) || stockQty === 0) ? "not-allowed" : "pointer",
            fontFamily: "inherit", marginBottom: 10
          }}
        >
          ⚡ 今すぐ購入
        </button>

        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          {["🛡️ 30日間保証", "🚚 即日発送", "📞 サポート付き"].map(t => (
            <div key={t} style={{ fontSize: 11, color: C.textSub }}>{t}</div>
          ))}
        </div>

        {/* 決済アイコン */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>対応決済方法</div>
          <div style={{ padding: 0, margin: 0, background: "transparent", border: "none", boxShadow: "none", borderRadius: 0, overflow: "hidden" }}>
            <Image
              src="/images/payment-methods.png"
              alt="対応決済方法"
              width={201}
              height={44}
              priority
              style={{ width: "100%", maxWidth: "160px", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}