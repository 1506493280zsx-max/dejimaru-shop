import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/app/components/BlogCard";

export const metadata = {
  title: "BLOG | デジマルショップ",
  description: "中古PC・スマホのお役立ち情報やお知らせ",
};

const C = {
  primary: "#0ABAB5", textLight: "#999",
};

export default async function BlogPage() {
  const tips = await getBlogPosts("tips", 10);
  const news = await getBlogPosts("news", 10);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 10px" }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: C.primary, marginBottom: 20, borderBottom: `2px solid ${C.primary}`, paddingBottom: 8 }}>
        BLOG
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          TIPS（お役立ち情報）
        </div>
        {tips.length === 0 ? (
          <div style={{ padding: "16px 0", fontSize: 12, color: C.textLight }}>記事はまだありません。</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {tips.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        )}
      </div>

      <div>
        <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          NEWS（お知らせ）
        </div>
        {news.length === 0 ? (
          <div style={{ padding: "16px 0", fontSize: 12, color: C.textLight }}>記事はまだありません。</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {news.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
