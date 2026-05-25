"use client";
import { CustomerReview } from "@/lib/directus";
import { getImageUrl } from "@/lib/directus";

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
  const imgId = review.product?.images?.[0]?.image_file_id;
  const imgUrl = imgId ? getImageUrl(imgId, 160, 120) : null;

  return (
    <>
      <style>{`
        .cr-card { display: flex; gap: 16px; background: #fff; border: 1px solid #B0E0DE; border-radius: 4px; padding: 14px; }
        .cr-product { width: 25%; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; align-items: center; }
        .cr-body { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        @media (max-width: 640px) {
          .cr-card { flex-direction: column; }
          .cr-product { width: 100%; flex-direction: row; align-items: center; }
        }
      `}</style>
      <div className="cr-card">
        <div className="cr-product">
          <div style={{ width: "100%", maxWidth: 120, aspectRatio: "4/3", background: "#F5FAFA", border: `1px solid ${C.primaryBorder}`, borderRadius: 2, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {imgUrl
              ? <img src={imgUrl} alt={review.product?.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 28 }}>💻</span>
            }
          </div>
          {review.product?.name && (
            <div style={{ fontSize: 10, color: C.textSub, textAlign: "center", lineHeight: 1.4, wordBreak: "break-all" }}>
              {review.product.name}
            </div>
          )}
        </div>
        <div className="cr-body">
          <Stars rating={review.rating} />
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{review.comment}</div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: C.textSub, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <span>— {review.customer_name}</span>
            <span>{formatDate(review.created_at)}</span>
          </div>
        </div>
      </div>
    </>
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
