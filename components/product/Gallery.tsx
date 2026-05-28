"use client";
import { useState } from "react";
import { getImageUrl } from "@/lib/directus";

const C = { primary: "#0ABAB5", primaryBorder: "#B0E0DE", border: "#DDD", white: "#FFF" };

export default function Gallery({ product }: { product: any }) {
  const [mainIdx, setMainIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const images = product.images || [];
  const imgUrls: (string | null)[] = images.length > 0
    ? images.map((img: any) => getImageUrl(img.image_file_id, 600, 450))
    : [null];
  const total = imgUrls.length;
  const prev = () => setMainIdx(i => (i - 1 + total) % total);
  const next = () => setMainIdx(i => (i + 1) % total);

  return (
    <div style={{ width: 380, flexShrink: 0 }}>
      {/* Main image */}
      <div onClick={() => setModalOpen(true)} style={{ position: "relative", background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 8, marginBottom: 8, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "zoom-in" }}>
        {imgUrls[mainIdx]
          ? <img src={imgUrls[mainIdx]!} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          : <span style={{ fontSize: 80 }}>💻</span>
        }
        {total > 1 && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 10, pointerEvents: "none" }}>
            {mainIdx + 1} / {total}
          </div>
        )}
        {total > 1 && <>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </>}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {imgUrls.map((url, i) => (
            <div key={i} onClick={() => setMainIdx(i)} style={{ width: 60, height: 60, border: `2px solid ${mainIdx === i ? C.primary : C.border}`, borderRadius: 2, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}>
              {url ? <img src={url} alt={product.name || "商品画像"} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>💻</span>}
            </div>
          ))}
        </div>
      )}

      {/* Video support */}
      {product.video_url && (
        <div style={{ marginTop: 8, borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <video src={product.video_url} controls style={{ width: "100%", display: "block" }} />
        </div>
      )}

      {/* Modal zoom */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            {imgUrls[mainIdx] && (
              <img src={imgUrls[mainIdx]!} alt={product.name} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block" }} />
            )}
            <button onClick={() => setModalOpen(false)} style={{ position: "absolute", top: -14, right: -14, background: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            {total > 1 && <>
              <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: -44, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 22 }}>‹</button>
              <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: -44, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 22 }}>›</button>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
