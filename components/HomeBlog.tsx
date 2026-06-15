"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const C = {
  primary: "#0ABAB5", primaryDark: "#089490", primaryDeep: "#007A76",
  primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  text: "#333", textSub: "#666", textLight: "#999",
  border: "#DDD", white: "#FFF",
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  date_published: string | null;
  date_created: string;
  type: "tips" | "news";
};

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://13.158.171.41:8055";

function getImageUrl(id: string) {
  return `${DIRECTUS_URL}/assets/${id}?width=400&height=300&fit=cover`;
}

const PAGE_SIZE = 4;
const FIXED_ROWS = 2;
const FIXED_COUNT = PAGE_SIZE * FIXED_ROWS; // 8件固定表示
const SLIDER_PAGES = 3;
const SLIDER_COUNT = PAGE_SIZE * SLIDER_PAGES; // 12件スライダー

export default function HomeBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [sliderPage, setSliderPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch(
      `${DIRECTUS_URL}/items/blog_posts?filter[status][_eq]=published&sort=-date_published&limit=${FIXED_COUNT + SLIDER_COUNT}&fields=id,title,slug,excerpt,cover_image,date_published,date_created,type`
    )
      .then(r => r.json())
      .then(d => setPosts(d.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (paused || sliderPosts.length <= PAGE_SIZE) return;
    const t = setInterval(() => setSliderPage(p => (p + 1) % SLIDER_PAGES), 4000);
    return () => clearInterval(t);
  }, [paused, posts]);

  const fixedPosts = posts.slice(0, FIXED_COUNT);
  const sliderPosts = posts.slice(FIXED_COUNT, FIXED_COUNT + SLIDER_COUNT);
  const sliderVisible = sliderPosts.slice(sliderPage * PAGE_SIZE, sliderPage * PAGE_SIZE + PAGE_SIZE);

  function BlogCard({ post }: { post: BlogPost }) {
    const [hov, setHov] = useState(false);
    const imgUrl = post.cover_image ? getImageUrl(post.cover_image) : null;
    const date = post.date_published
      ? new Date(post.date_published).toLocaleDateString("ja-JP")
      : new Date(post.date_created).toLocaleDateString("ja-JP");

    return (
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => router.push(`/blog/${post.slug}`)}
        style={{
          background: C.white,
          border: `1px solid ${hov ? C.primary : C.border}`,
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: hov ? "0 2px 10px rgba(10,186,181,0.15)" : "0 1px 3px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          aspectRatio: "4/3",
          background: "#F5FAFA",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${C.primaryBorder}`,
        }}>
          {imgUrl
            ? <img src={imgUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s", transform: hov ? "scale(1.04)" : "scale(1)" }} />
            : <span style={{ fontSize: 36, opacity: 0.3 }}>📝</span>
          }
        </div>
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
              background: post.type === "tips" ? C.primaryBg : "#FFF8E8",
              color: post.type === "tips" ? C.primaryDeep : "#996600",
              border: `1px solid ${post.type === "tips" ? C.primaryBorder : "#FFE08A"}`,
            }}>
              {post.type === "tips" ? "TIPS" : "NEWS"}
            </span>
            <span style={{ fontSize: 10, color: C.textLight }}>{date}</span>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: hov ? C.primary : C.text,
            lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden",
            transition: "color 0.15s",
          }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{
              fontSize: 11, color: C.textSub, lineHeight: 1.6, marginTop: 2,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden",
            }}>
              {post.excerpt}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Section Header */}
      <div style={{
        background: C.primary, color: "#fff", padding: "6px 10px",
        fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center",
        marginBottom: 10,
      }}>
        ブログ
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>BLOG</span>
        <a href="/blog" onClick={e => { e.preventDefault(); router.push("/blog"); }}
          style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 400 }}>
          すべて見る →
        </a>
      </div>

      {/* Fixed 2-row grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
        {fixedPosts.map(post => <BlogCard key={post.id} post={post} />)}
      </div>

      {/* Slider section */}
      {sliderPosts.length > 0 && (
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {sliderVisible.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
          {SLIDER_PAGES > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <button onClick={() => setSliderPage(p => (p - 1 + SLIDER_PAGES) % SLIDER_PAGES)}
                style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 2, width: 24, height: 24, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: "inherit" }}>‹</button>
              {Array.from({ length: SLIDER_PAGES }).map((_, i) => (
                <div key={i} onClick={() => setSliderPage(i)}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: i === sliderPage ? C.primary : C.border, cursor: "pointer", transition: "background 0.2s" }} />
              ))}
              <button onClick={() => setSliderPage(p => (p + 1) % SLIDER_PAGES)}
                style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 2, width: 24, height: 24, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: "inherit" }}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
