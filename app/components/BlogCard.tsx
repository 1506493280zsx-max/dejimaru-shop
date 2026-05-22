import { BlogPost } from "@/lib/blog";
import { getImageUrl } from "@/lib/directus";

type Props = { post: BlogPost };

const C = {
  primary: "#0ABAB5", primaryBorder: "#B0E0DE",
  text: "#333", textSub: "#666", textLight: "#999", white: "#FFF",
};

export default function BlogCard({ post }: Props) {
  const imgUrl = post.cover_image ? getImageUrl(post.cover_image, 400, 200) : null;
  const date = post.date_published
    ? new Date(post.date_published).toLocaleDateString("ja-JP")
    : new Date(post.date_created).toLocaleDateString("ja-JP");
  const excerpt = post.excerpt ? post.excerpt.slice(0, 200) : "";

  return (
    <a href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: 160, background: "#F5FAFA", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {imgUrl
            ? <img src={imgUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 40 }}>📝</span>
          }
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{date}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, lineHeight: 1.5, marginBottom: 6 }}>{post.title}</div>
          {excerpt && (
            <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any }}>
              {excerpt}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
