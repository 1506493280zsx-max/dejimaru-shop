"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", text: "#333", textSub: "#666",
  border: "#DDD", white: "#FFF",
};

type FeaturedReview = {
  id: string;
  company_name: string;
  title: string | null;
  content: string | null;
  product: string | null;
  date_published: string | null;
};

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
        {visible.map((r, i) => (
          <div key={`${r.id}-${i}`}
            style={{ background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {r.title && (
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{r.title}</div>
            )}
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, display: "-webkit-box" as any, WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
              {r.content}
            </div>
            {r.product && (
              <div style={{ fontSize: 10, color: C.primary, background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "2px 6px", alignSelf: "flex-start" }}>
                {r.product}
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textSub, marginTop: "auto", paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
              — {r.company_name}
            </div>
          </div>
        ))}
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
