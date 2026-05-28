import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Across ショップ | 中古PC・スマホの専門店";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0ABAB5 0%, #007A76 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 900, color: "white", marginBottom: 24 }}>
        AI Across ショップ
      </div>
      <div style={{ fontSize: 32, color: "rgba(255,255,255,0.9)", textAlign: "center", maxWidth: 800 }}>
        中古PC・スマホの専門店
      </div>
      <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", marginTop: 16 }}>
        全商品30日間動作保証 | 送料無料
      </div>
    </div>,
    { ...size }
  );
}
