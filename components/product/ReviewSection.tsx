"use client";
import { useState, useEffect } from "react";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  red: "#CC2200", text: "#333", textSub: "#666", textLight: "#999",
  border: "#DDD", white: "#FFF",
};

type Review = { id: string; user_name: string; rating: number; title: string; body: string; created_at: string };

function Stars({ rating, size = 14, interactive = false, onRate }: {
  rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{ fontSize: size, color: (interactive ? (hover || rating) : rating) >= i ? "#FFA000" : "#DDD", cursor: interactive ? "pointer" : "default" }}
          onMouseEnter={() => { if (interactive) setHover(i); }}
          onMouseLeave={() => { if (interactive) setHover(0); }}
          onClick={() => { if (interactive && onRate) onRate(i); }}
        >★</span>
      ))}
    </span>
  );
}

const PER_PAGE = 5;

export default function ReviewSection({
  productId, onStatsChange,
}: { productId: string; onStatsChange?: (avg: number, count: number) => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [form, setForm] = useState({ user_name: "", rating: 5, title: "", body: "" });

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then(d => {
        const list: Review[] = d.data || [];
        setReviews(list);
        if (onStatsChange && list.length > 0) {
          const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
          onStatsChange(avg, list.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5,4,3,2,1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
  const pageItems = reviews.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(reviews.length / PER_PAGE);

  const handleSubmit = async () => {
    if (!form.user_name || !form.body) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: productId }),
      });
      setSubmitDone(true);
      setShowForm(false);
      setForm({ user_name: "", rating: 5, title: "", body: "" });
    } catch {}
    setSubmitting(false);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 14, fontWeight: 700, borderRadius: "2px 2px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>⭐ お客様のレビュー</span>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", padding: "4px 12px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            レビューを書く
          </button>
        )}
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px" }}>

        {/* Stats */}
        {reviews.length > 0 && (
          <div style={{ display: "flex", gap: 24, padding: 16, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#FFA000", lineHeight: 1 }}>{avg.toFixed(1)}</div>
              <Stars rating={avg} size={18} />
              <div style={{ fontSize: 11, color: C.textSub, marginTop: 4 }}>{reviews.length}件のレビュー</div>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              {dist.map(({ star, count }) => (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.textSub, width: 12 }}>{star}</span>
                  <span style={{ fontSize: 12, color: "#FFA000" }}>★</span>
                  <div style={{ flex: 1, height: 8, background: "#EEE", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#FFA000", width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.textSub, width: 20, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write review form */}
        {showForm && (
          <div style={{ padding: 16, borderBottom: `1px solid ${C.border}`, background: "#FAFFFE" }}>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 12 }}>レビューを投稿する</div>
            {submitDone && (
              <div style={{ background: "#F0FFF4", border: "1px solid #88DD88", borderRadius: 2, padding: 10, marginBottom: 12, fontSize: 12, color: "#227700" }}>
                レビューありがとうございます！確認後に公開されます。
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 4 }}>評価 <span style={{ color: C.red }}>*</span></div>
                <Stars rating={form.rating} size={24} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 4 }}>お名前 <span style={{ color: C.red }}>*</span></div>
                <input value={form.user_name} onChange={e => setForm(f => ({ ...f, user_name: e.target.value }))}
                  placeholder="山田 太郎" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 2, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" as any }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 4 }}>タイトル</div>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="レビューのタイトル（任意）" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 2, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" as any }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 4 }}>レビュー内容 <span style={{ color: C.red }}>*</span></div>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  rows={4} placeholder="商品のご感想をお聞かせください"
                  style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 2, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" as any }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSubmit} disabled={submitting || !form.user_name || !form.body}
                  style={{ background: form.user_name && form.body ? C.primary : "#AAA", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: form.user_name && form.body ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                  {submitting ? "送信中..." : "投稿する"}
                </button>
                <button onClick={() => setShowForm(false)} style={{ background: C.white, color: C.textSub, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 2, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review list */}
        <div style={{ padding: "0 16px" }}>
          {loading && <div style={{ padding: 24, textAlign: "center", color: C.textSub }}>読み込み中...</div>}
          {!loading && reviews.length === 0 && !submitDone && (
            <div style={{ padding: 24, textAlign: "center", color: C.textSub }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
              <div>まだレビューがありません。最初のレビューを書いてみませんか？</div>
            </div>
          )}
          {pageItems.map((r, i) => (
            <div key={r.id || String(i)} style={{ padding: "14px 0", borderBottom: i < pageItems.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <Stars rating={r.rating} size={13} />
                  {r.title && <div style={{ fontWeight: 700, color: C.text, fontSize: 13, marginTop: 2 }}>{r.title}</div>}
                </div>
                <div style={{ fontSize: 11, color: C.textLight }}>{r.created_at?.slice(0, 10)}</div>
              </div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 4 }}>{r.body}</div>
              <div style={{ fontSize: 11, color: C.textSub }}>— {r.user_name}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "12px 16px" }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                style={{ width: 28, height: 28, border: `1px solid ${page === i ? C.primary : C.border}`, borderRadius: 2, background: page === i ? C.primary : C.white, color: page === i ? "#fff" : C.text, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
