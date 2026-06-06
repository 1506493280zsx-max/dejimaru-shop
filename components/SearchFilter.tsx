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

const CPU_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "Intel Core i3", value: "Intel Core i3" },
  { label: "Intel Core i5", value: "Intel Core i5" },
  { label: "Intel Core i7", value: "Intel Core i7" },
  { label: "Intel Core i9", value: "Intel Core i9" },
  { label: "AMD Ryzen 3", value: "AMD Ryzen 3" },
  { label: "AMD Ryzen 5", value: "AMD Ryzen 5" },
  { label: "AMD Ryzen 7", value: "AMD Ryzen 7" },
  { label: "Apple M1", value: "Apple M1" },
  { label: "Apple M2", value: "Apple M2" },
  { label: "Apple M3", value: "Apple M3" },
  { label: "Apple M4", value: "Apple M4" },
  { label: "Qualcomm Snapdragon", value: "Qualcomm Snapdragon" },
];

const CPU_GENERATION_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "第6世代", value: "6" },
  { label: "第7世代", value: "7" },
  { label: "第8世代", value: "8" },
  { label: "第9世代", value: "9" },
  { label: "第10世代", value: "10" },
  { label: "第11世代", value: "11" },
  { label: "第12世代", value: "12" },
  { label: "第13世代", value: "13" },
  { label: "第14世代", value: "14" },
];

const SCREEN_SIZE_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "～11インチ", value: "11" },
  { label: "12インチ", value: "12" },
  { label: "13インチ", value: "13" },
  { label: "14インチ", value: "14" },
  { label: "15インチ", value: "15" },
  { label: "16インチ以上", value: "16+" },
];

interface SearchFilterProps {
  brands: Array<{ id: number | string; name: string; slug: string }>;
}

export default function SearchFilter({ brands }: SearchFilterProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [brand, setBrand] = useState("");
  const [grade, setGrade] = useState("");
  const [cpu, setCpu] = useState("");
  const [cpuGeneration, setCpuGeneration] = useState("");
  const [screenSize, setScreenSize] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    if (brand) params.set("brand", brand);
    if (grade) params.set("grade", grade);
    if (cpu) params.set("cpu", cpu);
    if (cpuGeneration) params.set("cpu_generation", cpuGeneration);
    if (screenSize) params.set("screen_size", screenSize);
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setQ("");
    setPriceMin("");
    setPriceMax("");
    setBrand("");
    setGrade("");
    setCpu("");
    setCpuGeneration("");
    setScreenSize("");
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 12,
    border: "1px solid #ccc",
    borderRadius: 2,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "#666",
    marginBottom: 4,
    display: "block",
  };

  const fieldWrapperStyle: React.CSSProperties = {
    marginBottom: 10,
  };

  return (
    <div
      style={{
        background: "#E8F8F8",
        border: "1px solid #B0E0DE",
        borderRadius: 2,
        padding: 12,
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0ABAB5", marginBottom: 12 }}>
        🔍 検索フィルター
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>商品名</label>
        <input
          type="text"
          placeholder="キーワード入力"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            ...selectStyle,
            padding: "6px 8px",
          }}
        />
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>価格(下限)</label>
        <select value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={selectStyle}>
          {PRICE_MIN_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>価格(上限)</label>
        <select value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={selectStyle}>
          {PRICE_MAX_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>メーカー</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} style={selectStyle}>
          <option value="">すべて</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>グレード/総合ランク</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} style={selectStyle}>
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>CPU</label>
        <select value={cpu} onChange={(e) => setCpu(e.target.value)} style={selectStyle}>
          {CPU_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>CPU世代</label>
        <select value={cpuGeneration} onChange={(e) => setCpuGeneration(e.target.value)} style={selectStyle}>
          {CPU_GENERATION_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>画面サイズ</label>
        <select value={screenSize} onChange={(e) => setScreenSize(e.target.value)} style={selectStyle}>
          {SCREEN_SIZE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={handleSearch}
          style={{
            flex: 1,
            background: "#FF6600",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "8px 0",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          🔍 検索
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleClear}
          style={{
            background: "none",
            border: "none",
            color: "#0ABAB5",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
          }}
        >
          検索条件クリア
        </button>
      </div>
    </div>
  );
}
