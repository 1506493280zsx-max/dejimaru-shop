"use client";
import { BlogComment } from "@/lib/blog";

type Props = {
  comment: BlogComment;
  isReply: boolean;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onFlag: (id: string) => void;
  onReply: (id: string) => void;
};

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8",
  primaryBorder: "#B0E0DE", border: "#DDD",
  text: "#333", textSub: "#666", textLight: "#999",
  red: "#CC2200", white: "#FFF",
};

export default function BlogCommentItem({ comment, isReply, currentUserId, onDelete, onFlag, onReply }: Props) {
  const isOwn = currentUserId === comment.user_id;
  const date = new Date(comment.date_created).toLocaleDateString("ja-JP");

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${isReply ? C.border : C.primaryBorder}`,
      borderRadius: 2,
      padding: "10px 12px",
      marginLeft: isReply ? 24 : 0,
    }}>
      {comment.deleted ? (
        <div style={{ fontSize: 12, color: C.textLight, fontStyle: "italic" }}>
          コメントは削除されました
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{comment.user_name}</span>
            <span style={{ fontSize: 11, color: C.textLight }}>{date}</span>
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {comment.body}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {!isReply && currentUserId && (
              <button onClick={() => onReply(comment.id)}
                style={{ background: "none", border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 2, fontSize: 11, cursor: "pointer", color: C.textSub, fontFamily: "inherit" }}>
                返信
              </button>
            )}
            {currentUserId && !isOwn && (
              <button onClick={() => onFlag(comment.id)}
                style={{ background: "none", border: "none", padding: "3px 8px", fontSize: 11, cursor: "pointer", color: C.textLight, fontFamily: "inherit" }}>
                通報
              </button>
            )}
            {isOwn && (
              <button onClick={() => onDelete(comment.id)}
                style={{ background: "none", border: "none", padding: "3px 8px", fontSize: 11, cursor: "pointer", color: C.red, fontFamily: "inherit" }}>
                削除
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
