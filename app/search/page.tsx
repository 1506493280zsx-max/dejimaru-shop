import { getProducts, getBrands, getCategories } from "@/lib/directus";
import SearchClient from "./SearchClient";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string, brand?: string, category?: string, grade?: string } }) {
  const { q, brand, category, grade } = searchParams;

  const filter: Record<string,any> = { is_published: { _eq: true } };
  if (grade) filter.grade = { _eq: grade };

  const [products, brands, categories] = await Promise.all([
    getProducts({ limit: 50, filter }),
    getBrands(),
    getCategories(),
  ]);

  // Client-side filtering for text search
  return (
    <SearchClient
      initialProducts={products}
      brands={brands}
      categories={categories}
      query={q || ""}
      brandFilter={brand || ""}
      categoryFilter={category || ""}
      gradeFilter={grade || ""}
    />
  );
}
