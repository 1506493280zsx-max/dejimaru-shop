"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRICE_MIN_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "1,000円～", value: "1000" },
  { label: "3,000円～", value: "3000" },
  { label: "5,000円～", value: "5000" },
  { label: "10,000円～", value: "10000" },
  { label: "30,000円～", value: "30000" },
  { label: "50,000円～", value: "50000" },
  { label: "100,000円～", value: "100000" },
  { label: "150,000円～", value: "150000" },
];

const PRICE_MAX_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "～3,000円", value: "3000" },
  { label: "～5,000円", value: "5000" },
  { label: "～10,000円", value: "10000" },
  { label: "～30,000円", value: "30000" },
  { label: "～50,000円", value: "50000" },
  { label: "～100,000円", value: "100000" },
  { label: "～150,000円", value: "150000" },
  { label: "～200,000円", value: "200000" },
];

const GRADE_OPTIONS = [
  { label: "すべて", value: "" },
  { label: "新品", value: "新品" },
  { label: "S品", value: "S" },
  { label: "A品", value: "A" },
  { label: "B品", value: "B" },
  { label: "C品", value: "C" },
  { label: "ジャンク", value: "ジャンク" },
];

interface SearchFilterProps {
  brands: Array<{ id: number | string; name: string; slug: string }>;
}

export default function SearchFilter({ brands }: SearchFilterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [grade, setGrade] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    if (grade) params.set("grade", grade);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setQ("");
    setBrand("");
    setGrade("");
    setPriceMin("");
    setPriceMax("");
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "4px 6px",
    fontSize: 12,
    border: "1px solid #ccc",
    borderRadius: 2,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "#555",
    marginBottom: 2,
    display: "block",
  };

  return (
    <div style={{ marginBottom: 12, boxSizing: "border-box" }}>
      <div
        onClick={() => setIsOpen((o) => !o)}
        style={{
          background: "#e8f4f8",
          border: "1px solid #b0d4e0",
          borderRadius: 2,
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "#0d7a8a",
        }}
      >
        <span>🔍 検索フィルター</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div
          style={{
            border: "1px solid #b0d4e0",
            borderTop: "none",
            borderRadius: "0 0 2px 2px",
            padding: 10,
            background: "#fff",
            maxHeight: 500,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>商品名</label>
            <input
              type="text"
              placeholder="キーワード入力"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ ...selectStyle }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>メーカー</label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} style={selectStyle}>
              <option value="">すべて</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>グレード</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} style={selectStyle}>
              {GRADE_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>価格範囲（下限）</label>
            <select value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={selectStyle}>
              {PRICE_MIN_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>価格範囲（上限）</label>
            <select value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={selectStyle}>
              {PRICE_MAX_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleSearch}
              style={{
                flex: 1,
                background: "#FF6600",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                padding: "6px 0",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🔍 検索
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "6px 10px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 2,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              クリア
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
