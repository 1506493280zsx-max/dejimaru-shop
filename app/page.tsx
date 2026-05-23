import { getFeaturedProducts, getNewArrivals, getCategories, getBrands, getHomepageAds } from "@/lib/directus";
import { getBlogPosts } from "@/lib/blog";
import HomeClient from "./HomeClient";

export default async function Home() {
  const [featured, newArrivals, categories, brands, blogPosts, ads] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
    getBrands(),
    getBlogPosts(undefined, 6, 1, true),
    getHomepageAds(),
  ]);

  return (
    <HomeClient
      featured={featured}
      newArrivals={newArrivals}
      categories={categories}
      brands={brands}
      blogPosts={blogPosts}
      ads={ads}
    />
  );
}
