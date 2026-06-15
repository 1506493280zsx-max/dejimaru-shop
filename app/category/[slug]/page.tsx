import { getProducts, getCategories, getBrands } from "@/lib/directus";
import SearchClient from "@/app/search/SearchClient";
import type { Metadata } from "next";

const BASE_URL = "https://aiacrossshop.co.jp";
const DIRECTUS = "http://13.158.171.41:8055";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${DIRECTUS}/items/categories?filter[slug][_eq]=${slug}&fields=name,description&limit=1`);
    const data = await res.json();
    const category = data.data?.[0];
    const name = category?.name || slug;
    const title = `${name}の中古品一覧 | AI Across ショップ`;
    const description = category?.description
      ? category.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `${name}の中古品を多数取り揃えています。全商品30日間動作保証・送料無料。`;

    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/category/${slug}` },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/category/${slug}`,
        images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630 }],
      },
    };
  } catch {
    return { title: "AI Across ショップ" };
  }
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: any) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  const category = categories.find((c: any) => c.slug === slug);
  const childIds = categories
    .filter((c: any) => String(c.parent_id) === String(category?.id))
    .map((c: any) => c.id);

  const categoryIds = category ? [category.id, ...childIds] : [];

  const products = categoryIds.length > 0
    ? await getProducts({ limit: 100, filter: { category_id: { _in: categoryIds } } })
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://aiacrossshop.co.jp" },
              { "@type": "ListItem", "position": 2, "name": category?.name || slug, "item": `https://aiacrossshop.co.jp/category/${slug}` }
            ]
          })
        }}
      />
      <SearchClient
        initialProducts={products}
        brands={brands}
        categories={categories}
        query=""
        brandFilter=""
        categoryFilter={slug}
        gradeFilter=""
        pageTitle={category?.name || slug}
      />
    </>
  );
}
