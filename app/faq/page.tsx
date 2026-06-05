import { getCategories, getBrands } from "@/lib/directus";
import FaqClient from "./FaqClient";

export default async function FaqPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  return <FaqClient categories={categories} brands={brands}/>;
}
