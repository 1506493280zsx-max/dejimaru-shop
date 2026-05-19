"use client";

const C = {
  primary: "#0ABAB5",
  text:    "#333",
  textSub: "#666",
};

export default function FlowStep({ n, t, d }: { n: number; t: string; d: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        background: C.primary, color: "#fff", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
      }}>
        {n}
      </div>
      <div>
        <div style={{ fontWeight: 700, color: C.text }}>{t}</div>
        <div style={{ fontSize: 12, color: C.textSub }}>{d}</div>
      </div>
    </div>
  );
}
