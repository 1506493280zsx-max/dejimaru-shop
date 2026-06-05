import { getCategories, getBrands } from "@/lib/directus";
import GuideClient from "./GuideClient";

export default async function GuidePage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  return <GuideClient categories={categories} brands={brands}/>;
}
