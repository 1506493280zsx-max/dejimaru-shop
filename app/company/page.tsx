import { getCategories } from "@/lib/directus";
import CompanyClient from "./CompanyClient";

export default async function CompanyPage() {
  const categories = await getCategories();
  return <CompanyClient categories={categories}/>;
}
