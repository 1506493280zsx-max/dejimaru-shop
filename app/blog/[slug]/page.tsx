import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug, getComments } from "@/lib/blog";
import { getImageUrl } from "@/lib/directus";
import BlogCommentSection from "@/app/components/BlogCommentSection";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません | AI Across ショップ" };
  const description = post.excerpt
    ? post.excerpt.slice(0, 150)
    : post.body.replace(/<[^>]+>/g, "").slice(0, 150);
  return {
    title: `${post.title} | AI Across ショップ`,
    description,
  };
}

const C = {
  primary: "#0ABAB5", primaryBorder: "#B0E0DE",
  text: "#333", textSub: "#666", textLight: "#999", white: "#FFF",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const comments = await getComments(post.id);
  const imgUrl = post.cover_image ? getImageUrl(post.cover_image, 1100, 400) : null;
  const authorName = post.author
    ? `${post.author.last_name ?? ""} ${post.author.first_name ?? ""}`.trim()
    : null;
  const date = post.date_published
    ? new Date(post.date_published).toLocaleDateString("ja-JP")
    : new Date(post.date_created).toLocaleDateString("ja-JP");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 10px" }}>
      <div style={{ background: C.white, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
        {imgUrl && (
          <div style={{ width: "100%", maxHeight: 400, overflow: "hidden" }}>
            <img src={imgUrl} alt={post.title} style={{ width: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, fontSize: 12, color: C.textLight }}>
            <span>{date}</span>
            {authorName && <span>by {authorName}</span>}
            <span style={{ background: C.primary, color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
              {post.type === "tips" ? "TIPS" : "NEWS"}
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: "0 0 20px", lineHeight: 1.5 }}>
            {post.title}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: post.body }}
            style={{ fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}
          />
        </div>
      </div>
      <BlogCommentSection postId={post.id} initialComments={comments} />
    </div>
  );
}
