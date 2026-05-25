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
  );
}
