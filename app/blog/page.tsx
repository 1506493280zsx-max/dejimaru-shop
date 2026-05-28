import { getBlogPosts } from "@/lib/blog";
import BlogListClient from "./BlogListClient";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "BLOG | AI Across ショップ",
  description: "中古PC・スマホのお役立ち情報やお知らせ",
};

const C = { primary: "#0ABAB5" };

export default async function BlogPage() {
  const tips = await getBlogPosts("tips", 10);
  const news = await getBlogPosts("news", 10);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 10px" }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: C.primary, marginBottom: 20, borderBottom: `2px solid ${C.primary}`, paddingBottom: 8 }}>
        BLOG
      </div>

      <BlogListClient tips={tips} news={news} />
    </div>
  );
}
