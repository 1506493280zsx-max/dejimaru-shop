import { getCategories } from "@/lib/directus";
import GuideClient from "./GuideClient";

export default async function GuidePage() {
  const categories = await getCategories();
  return <GuideClient categories={categories}/>;
}
