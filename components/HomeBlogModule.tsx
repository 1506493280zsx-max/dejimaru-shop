import { BlogPost } from "@/lib/blog";
import { getImageUrl } from "@/lib/directus";

const C = {
  primary: "#0ABAB5", primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  primaryDeep: "#007A76", text: "#333", textSub: "#666", textLight: "#999", white: "#FFF",
};

function HomeBlogCard({ post }: { post: BlogPost }) {
  const imgUrl = post.cover_image ? getImageUrl(post.cover_image, 200, 200) : null;
  const date = post.date_published
    ? new Date(post.date_published).toLocaleDateString("ja-JP")
    : new Date(post.date_created).toLocaleDateString("ja-JP");

  return (
    <a href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div style={{
        background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 8,
        overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
      }}>
        <div style={{
          aspectRatio: "1/1", background: "#F5FAFA", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {imgUrl
            ? <img src={imgUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 32, opacity: 0.3 }}>📝</span>
          }
        </div>
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
              background: post.type === "tips" ? C.primaryBg : "#FFF8E8",
              color: post.type === "tips" ? C.primaryDeep : "#996600",
              border: `1px solid ${post.type === "tips" ? C.primaryBorder : "#FFE08A"}`,
            }}>
              {post.type === "tips" ? "TIPS" : "NEWS"}
            </span>
            <span style={{ fontSize: 10, color: C.textLight }}>{date}</span>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden",
          }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{
              fontSize: 11, color: C.textSub, lineHeight: 1.5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden",
            }}>
              {post.excerpt}
            </div>
          )}
          <div style={{ marginTop: "auto", paddingTop: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primary }}>続きを読む →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function HomeBlogModule({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        background: C.primary, color: "#fff", padding: "6px 10px",
        fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", marginBottom: 10,
      }}>
        BLOG / NEWS
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>お役立ち情報・お知らせ</span>
        <a href="/blog"
          style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 400 }}>
          すべて見る →
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: 10 }}>
        {posts.map(post => <HomeBlogCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
