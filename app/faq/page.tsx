import { getCategories } from "@/lib/directus";
import FaqClient from "./FaqClient";

export default async function FaqPage() {
  const categories = await getCategories();
  return <FaqClient categories={categories}/>;
}
