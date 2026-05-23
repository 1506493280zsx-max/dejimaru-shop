"use client";
import { useState } from "react";

const KEYFRAMES = `
@keyframes floatBreath {
  0%   { transform: translateY(0px);  box-shadow: 0 6px 16px rgba(0,0,0,.10); }
  50%  { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,.15); }
  100% { transform: translateY(0px);  box-shadow: 0 6px 16px rgba(0,0,0,.10); }
}
`;

export default function CorporateQuoteWidget({ onOpen }: { onOpen: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: "fixed",
        right: 30,
        bottom: 30,
        zIndex: 1000,
        width: 220,
        height: 68,
        borderRadius: 16,
        animation: "floatBreath 4s ease-in-out infinite",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        fontFamily: "'Meiryo','ＭＳ Ｐゴシック',sans-serif",
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        boxSizing: "border-box",
        gap: 10,
      }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{
            display: "inline-block",
            alignSelf: "flex-start",
            background: "#ffb84d",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 6,
            letterSpacing: 0.3,
          }}>法人限定</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e4572e", lineHeight: 1.2 }}>
            最大¥5,000 OFF
          </div>
          <div style={{ fontSize: 11, color: "#374151", opacity: 0.8, lineHeight: 1.2 }}>
            大量購入見積
          </div>
        </div>

        {/* Right */}
        <button
          onClick={onOpen}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            flexShrink: 0,
            width: 72,
            height: 32,
            background: "#2c3e50",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.15s",
            whiteSpace: "nowrap",
          }}>
          見積開始 →
        </button>
      </div>
    </>
  );
}
