import { getFeaturedProducts, getNewArrivals, getCategories, getBrands } from "@/lib/directus";
import { getBlogPosts } from "@/lib/blog";
import HomeClient from "./HomeClient";

export default async function Home() {
  const [featured, newArrivals, categories, brands, blogPosts] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
    getBrands(),
    getBlogPosts(undefined, 6, 1, true),
  ]);

  return (
    <HomeClient
      featured={featured}
      newArrivals={newArrivals}
      categories={categories}
      brands={brands}
      blogPosts={blogPosts}
    />
  );
}
