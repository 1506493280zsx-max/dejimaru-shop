"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  primary: "#0ABAB5",
  primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE",
  text: "#333",
  textSub: "#666",
  textLight: "#999",
  border: "#DDD",
  orange: "#FF6600",
};

const PRICE_MIN_OPTIONS = [1000, 3000, 5000, 10000, 30000, 50000, 100000, 150000];
const PRICE_MAX_OPTIONS = [3000, 5000, 10000, 30000, 50000, 100000, 150000, 200000];
const GRADE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "NEW", label: "新品" },
  { value: "S", label: "S品" },
  { value: "A", label: "A品" },
  { value: "B", label: "B品" },
  { value: "C", label: "C品" },
];

export default function SearchFilter({
  brands = [],
  initialValues = {},
}: {
  brands: Array<{ id: number | string; name: string; slug: string }>;
  initialValues?: {
    q?: string;
    brand?: string;
    grade?: string;
    price_min?: string | number;
    price_max?: string | number;
  };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState(String(initialValues.q || ""));
  const [brand, setBrand] = useState(String(initialValues.brand || ""));
  const [grade, setGrade] = useState(String(initialValues.grade || ""));
  const [priceMin, setPriceMin] = useState(String(initialValues.price_min || ""));
  const [priceMax, setPriceMax] = useState(String(initialValues.price_max || ""));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.append("q", q.trim());
    if (brand) params.append("brand", brand);
    if (grade) params.append("grade", grade);
    if (priceMin) params.append("price_min", priceMin);
    if (priceMax) params.append("price_max", priceMax);

    const queryString = params.toString();
    router.push(`/search${queryString ? "?" + queryString : ""}`);
  };

  const handleClear = () => {
    setQ("");
    setBrand("");
    setGrade("");
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: C.primaryBg,
          border: `1px solid ${C.primaryBorder}`,
          borderRadius: 2,
          padding: "8px 10px",
          marginBottom: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
          🔍 検索フィルター
        </span>
        <span style={{ fontSize: 11, color: C.primary, fontWeight: 700 }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            background: C.primaryBg,
            border: `1px solid ${C.primaryBorder}`,
            borderTop: "none",
            borderRadius: "0 0 2px 2px",
            padding: 10,
            marginBottom: 12,
            marginTop: "-12px",
            boxSizing: "border-box",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: C.text,
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: `1px solid ${C.primaryBorder}`,
        }}
      >
        🔍 検索フィルター
      </div>

      {/* 商品名 */}
      <div style={{ marginBottom: 10 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textSub,
            display: "block",
            marginBottom: 4,
          }}
        >
          商品名
        </label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワード入力"
          style={{
            width: "100%",
            padding: "6px 8px",
            fontSize: 11,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            boxSizing: "border-box",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>

      {/* メーカー */}
      {brands.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textSub,
              display: "block",
              marginBottom: 4,
            }}
          >
            メーカー
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              fontSize: 11,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              fontFamily: "inherit",
              outline: "none",
            }}
          >
            <option value="">すべて</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* グレード */}
      <div style={{ marginBottom: 10 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textSub,
            display: "block",
            marginBottom: 4,
          }}
        >
          グレード
        </label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            fontSize: 11,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            fontFamily: "inherit",
            outline: "none",
          }}
        >
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {/* 価格範囲 */}
      <div style={{ marginBottom: 10 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textSub,
            display: "block",
            marginBottom: 4,
          }}
        >
          価格範囲（下限）
        </label>
        <select
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            fontSize: 11,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            fontFamily: "inherit",
            outline: "none",
          }}
        >
          <option value="">指定なし</option>
          {PRICE_MIN_OPTIONS.map((p) => (
            <option key={p} value={p}>
              ¥{p.toLocaleString()}～
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textSub,
            display: "block",
            marginBottom: 4,
          }}
        >
          価格範囲（上限）
        </label>
        <select
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            fontSize: 11,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            fontFamily: "inherit",
            outline: "none",
          }}
        >
          <option value="">指定なし</option>
          {PRICE_MAX_OPTIONS.map((p) => (
            <option key={p} value={p}>
              ～¥{p.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* ボタン */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSearch}
          style={{
            flex: 1,
            background: C.orange,
            color: "#fff",
            border: "none",
            padding: "8px 0",
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          🔍 検索
        </button>
        <button
          onClick={handleClear}
          style={{
            flex: 0,
            background: "#fff",
            color: C.textSub,
            border: `1px solid ${C.border}`,
            padding: "8px 12px",
            borderRadius: 2,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          クリア
        </button>
      </div>
      )}
    </>
  );
}
