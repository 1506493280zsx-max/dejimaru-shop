"use client";
import { useState, useEffect, useRef } from "react";
import { getImageUrl } from "@/lib/directus";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", text: "#333", textSub: "#666",
  border: "#DDD", white: "#FFF",
};

type FeaturedReview = {
  id: string;
  user_name: string;
  rating: number;
  body: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { directus_files_id: string }[];
  } | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 13, color: i <= rating ? "#FFA000" : "#DDD" }}>★</span>
      ))}
    </span>
  );
}

const VISIBLE = 3;
const INTERVAL_MS = 4000;

export default function HomeReviews() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/reviews/featured")
      .then(r => r.json())
      .then(d => setReviews(d.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reviews.length <= VISIBLE || paused) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % reviews.length);
    }, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reviews.length, paused]);

  if (reviews.length === 0) return (
    <div id="customer-reviews" style={{ marginBottom: 14 }}>
      <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", marginBottom: 8 }}>
        お客様の声
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>CUSTOMER REVIEWS</span>
      </div>
      <div style={{ padding: "16px 10px", textAlign: "center", color: "#999", fontSize: 12 }}>Customer reviews coming soon</div>
    </div>
  );

  const visible = Array.from({ length: Math.min(VISIBLE, reviews.length) }, (_, k) =>
    reviews[(index + k) % reviews.length]
  );

  return (
    <div id="customer-reviews" style={{ marginBottom: 14 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", marginBottom: 8 }}>
        お客様の声
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>CUSTOMER REVIEWS</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${visible.length}, 1fr)`, gap: 6 }}>
        {visible.map((r, i) => {
          const imgId = r.product?.images?.[0]?.directus_files_id;
          const imgUrl = imgId ? getImageUrl(imgId, 80, 60) : null;
          return (
            <div key={`${r.id}-${i}`}
              style={{ background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {r.product && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 48, height: 36, background: "#F5FAFA", border: `1px solid ${C.primaryBorder}`, borderRadius: 2, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {imgUrl
                      ? <img src={imgUrl} alt={r.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 16 }}>💻</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: C.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.product.name}</div>
                  </div>
                </div>
              )}
              <div>
                <Stars rating={r.rating} />
                <div style={{ fontSize: 12, color: C.text, marginTop: 6, lineHeight: 1.6, display: "-webkit-box" as any, WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                  {r.body}
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.textSub, marginTop: "auto" }}>— {r.user_name}</div>
            </div>
          );
        })}
      </div>
      {reviews.length > VISIBLE && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
          {reviews.map((_, i) => (
            <div key={i} onClick={() => setIndex(i)}
              style={{ width: 7, height: 7, borderRadius: "50%", background: i === index ? C.primary : C.border, cursor: "pointer", transition: "background 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}
