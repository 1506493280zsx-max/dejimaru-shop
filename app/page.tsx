import { getFeaturedProducts, getNewArrivals, getCategories, getBrands } from "@/lib/directus";
import HomeClient from "./HomeClient";

export default async function Home() {
  const [featured, newArrivals, categories, brands] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <HomeClient
      featured={featured}
      newArrivals={newArrivals}
      categories={categories}
      brands={brands}
    />
  );
}
