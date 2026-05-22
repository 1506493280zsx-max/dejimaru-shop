"use client";
import { useState } from "react";
import { BlogComment } from "@/lib/blog";
import { useAuthStore } from "@/lib/auth-store";
import BlogCommentItem from "./BlogCommentItem";

type Props = {
  postId: string;
  initialComments: BlogComment[];
};

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", border: "#DDD",
  text: "#333", textSub: "#666", textLight: "#999",
  red: "#CC2200", white: "#FFF",
};

type CommentFormProps = {
  body: string;
  setBody: (v: string) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
  onCancel: () => void;
  replyTo: string | null;
};

function CommentForm({ body, setBody, submitting, error, onSubmit, onCancel, replyTo }: CommentFormProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        maxLength={1000}
        placeholder="コメントを入力してください"
        rows={4}
        disabled={submitting}
        style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 2, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: C.textLight }}>{body.length}/1000</span>
        <div style={{ display: "flex", gap: 8 }}>
          {replyTo && (
            <button onClick={onCancel} disabled={submitting}
              style={{ background: "none", border: `1px solid ${C.border}`, padding: "5px 12px", borderRadius: 2, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              キャンセル
            </button>
          )}
          <button onClick={onSubmit} disabled={submitting || !body.trim()}
            style={{ background: submitting || !body.trim() ? "#CCC" : C.primary, color: "#fff", border: "none", padding: "5px 16px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: submitting || !body.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {submitting ? "送信中..." : "送信"}
          </button>
        </div>
      </div>
      {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

export default function BlogCommentSection({ postId, initialComments }: Props) {
  const { user, token } = useAuthStore();
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topLevel = comments.filter(c => !c.reply_to && !c.flagged);
  const getReplies = (parentId: string) => comments.filter(c => c.reply_to === parentId && !c.flagged);

  const handleDelete = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/blog/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setComments(prev => prev.map(c => c.id === id ? { ...c, deleted: true } : c));
  };

  const handleFlag = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/blog/comments/${id}/flag`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setComments(prev => prev.map(c => c.id === id ? { ...c, flagged: true } : c));
  };

  const handleReply = (id: string) => {
    setReplyingTo(replyingTo === id ? null : id);
    setBody("");
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (replyTo: string | null) => {
    if (!body.trim() || submitting || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ post: postId, body: body.trim(), reply_to: replyTo || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "送信に失敗しました");
        return;
      }
      setSubmitted(true);
      setBody("");
      setReplyingTo(null);
    } catch {
      setError("送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
        コメント
      </div>
      {submitted && (
        <div style={{ padding: "10px 14px", background: C.primaryBg, border: `1px solid ${C.primary}`, borderRadius: 2, fontSize: 12, color: C.primary, marginBottom: 12 }}>
          コメントを受け付けました。管理者の承認後に表示されます。
        </div>
      )}
      {topLevel.length === 0 && (
        <div style={{ padding: "16px 0", textAlign: "center", fontSize: 12, color: C.textLight }}>
          まだコメントがありません
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {topLevel.map(c => (
          <div key={c.id}>
            <BlogCommentItem
              comment={c}
              isReply={false}
              currentUserId={user?.id ?? null}
              onDelete={handleDelete}
              onFlag={handleFlag}
              onReply={handleReply}
            />
            {replyingTo === c.id && (<CommentForm body={body} setBody={setBody} submitting={submitting} error={error} onSubmit={() => handleSubmit(c.id)} onCancel={() => setReplyingTo(null)} replyTo={c.id} />)}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              {getReplies(c.id).map(r => (
                <BlogCommentItem key={r.id}
                  comment={r}
                  isReply={true}
                  currentUserId={user?.id ?? null}
                  onDelete={handleDelete}
                  onFlag={handleFlag}
                  onReply={handleReply}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {!user && (
        <div style={{ marginTop: 16, padding: "10px 14px", background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, fontSize: 12, color: C.textSub }}>
          コメントするには<a href="/login" style={{ color: C.primary, textDecoration: "underline" }}>ログイン</a>が必要です。
        </div>
      )}
      {user && !replyingTo && !submitted && (<CommentForm body={body} setBody={setBody} submitting={submitting} error={error} onSubmit={() => handleSubmit(null)} onCancel={() => setReplyingTo(null)} replyTo={null} />)}
    </div>
  );
}
