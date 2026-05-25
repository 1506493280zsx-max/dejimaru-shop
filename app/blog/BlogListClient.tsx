"use client";
import { useState, useEffect } from "react";
import { BlogPost } from "@/lib/blog";
import BlogCard from "@/app/components/BlogCard";

const C = {
  primary: "#0ABAB5", textLight: "#999",
};

const PAGE_SIZE = 4;

function BlogCarousel({ posts, title }: { posts: BlogPost[]; title: string }) {
  const pages = Math.ceil(posts.length / PAGE_SIZE);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (pages <= 1) return;
    const timer = setInterval(() => setPage(p => (p + 1) % pages), 3000);
    return () => clearInterval(timer);
  }, [pages]);

  const visiblePosts = posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Fixed header */}
      <div style={{ background: C.primary, color: "#fff", padding: "6px 10px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
        {title}
      </div>

      {posts.length === 0 ? (
        <div style={{ padding: "16px 0", fontSize: 12, color: C.textLight }}>記事はまだありません。</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 10 }}>
            {visiblePosts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>

          {pages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <button
                onClick={() => setPage(p => (p - 1 + pages) % pages)}
                style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 2, width: 24, height: 24, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                &#8249;
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <div key={i} onClick={() => setPage(i)} style={{
                  width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                  background: i === page ? C.primary : "#DDD", transition: "background 0.2s",
                }} />
              ))}
              <button
                onClick={() => setPage(p => (p + 1) % pages)}
                style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 2, width: 24, height: 24, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                &#8250;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BlogListClient({ tips, news }: { tips: BlogPost[]; news: BlogPost[] }) {
  return (
    <>
      <BlogCarousel posts={tips} title="TIPS（お役立ち情報）" />
      <BlogCarousel posts={news} title="NEWS（お知らせ）" />
    </>
  );
}
