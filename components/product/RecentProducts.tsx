"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  red: "#CC2200", text: "#333", textSub: "#666",
  border: "#DDD", white: "#FFF",
};

const GRADE_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NEW: { label: "新品", color: "#CC0000", bg: "#FFF0F0", border: "#CC0000" },
  S:   { label: "S品", color: "#007A76", bg: "#E8F8F8", border: "#0ABAB5" },
  A:   { label: "A品", color: "#227700", bg: "#F0FFF0", border: "#44AA44" },
  B:   { label: "B品", color: "#555",    bg: "#F5F5F5", border: "#AAA"    },
  C:   { label: "C品", color: "#333",    bg: "#EEEEEE", border: "#888"    },
};

type RecentItem = { id: string; slug: string; name: string; price: number; grade: string; imageUrl: string | null };

const STORAGE_KEY = "dejimaru-recent";
const MAX_RECENT = 8;

export function saveRecentProduct(product: any, imageUrl: string | null) {
  if (typeof window === "undefined") return;
  try {
    const existing: RecentItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = existing.filter(p => p.id !== String(product.id));
    const item: RecentItem = {
      id: String(product.id), slug: product.slug, name: product.name,
      price: product.price, grade: product.grade || "", imageUrl,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...filtered].slice(0, MAX_RECENT)));
  } catch {}
}

export default function RecentProducts({ currentProductId }: { currentProductId: string }) {
  const router = useRouter();
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored: RecentItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setItems(stored.filter(p => p.id !== currentProductId));
    } catch {}
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 14, fontWeight: 700, borderRadius: "2px 2px 0 0" }}>
        🕐 最近チェックした商品
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
          {items.map(item => {
            const gs = GRADE_STYLE[item.grade] || GRADE_STYLE.C;
            return (
              <div key={item.id} onClick={() => router.push(`/products/${item.slug}`)}
                style={{ border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden", cursor: "pointer", background: C.white }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.primary)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <div style={{ height: 100, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 32 }}>💻</span>
                  }
                </div>
                <div style={{ padding: 8 }}>
                  {item.grade && (
                    <span style={{ background: gs.bg, color: gs.color, border: `1px solid ${gs.border}`, borderRadius: 2, fontSize: 10, fontWeight: 700, padding: "1px 5px", marginBottom: 4, display: "inline-block" }}>{gs.label}</span>
                  )}
                  <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{item.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: C.red }}>¥{(item.price ?? 0).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
