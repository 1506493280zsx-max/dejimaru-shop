import { getProducts, getCategories, getBrands } from "@/lib/directus";
import SearchClient from "@/app/search/SearchClient";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: any) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [allProducts, categories, brands] = await Promise.all([
    getProducts({ limit: 100, filter: { is_published: { _eq: true } } }),
    getCategories(),
    getBrands(),
  ]);

  const category = categories.find((c:any) => c.slug === slug);
  const childIds = categories
    .filter((c:any) => String(c.parent_id) === String(category?.id))
    .map((c:any) => String(c.id));

  const filtered = allProducts.filter((p:any) =>
    p.category_id?.slug === slug ||
    childIds.includes(String(p.category_id?.id))
  );

  return (
    <SearchClient
      initialProducts={filtered.length > 0 ? filtered : allProducts}
      brands={brands}
      categories={categories}
      query=""
      brandFilter=""
      categoryFilter={slug}
      gradeFilter=""
      pageTitle={category?.name || slug}
    />
  );
}
