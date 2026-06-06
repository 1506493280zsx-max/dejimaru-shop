"use client";
import { CustomerReview } from "@/lib/directus";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", text: "#333", textSub: "#666",
  border: "#DDD", white: "#FFF",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 15, color: i <= rating ? "#FFA000" : "#DDD" }}>★</span>
      ))}
    </span>
  );
}

function formatDate(s: string | null) {
  if (!s) return "";
  const d = new Date(s);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Stars rating={review.rating} />
        <span style={{ fontSize: 11, color: C.textSub, marginLeft: "auto" }}>{formatDate(review.created_at)}</span>
      </div>
      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>{review.comment}</div>
      <div style={{ fontSize: 11, color: C.textSub, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
        — {review.customer_name}
      </div>
    </div>
  );
}

export default function CustomerReviewsList({ reviews }: { reviews: CustomerReview[] }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", marginBottom: 10 }}>
        一般のお客様の声
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>CUSTOMER REVIEWS</span>
      </div>
      {reviews.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#999", fontSize: 13, background: C.white, border: `1px solid ${C.border}`, borderRadius: 2 }}>
          レビューはまだありません
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}
