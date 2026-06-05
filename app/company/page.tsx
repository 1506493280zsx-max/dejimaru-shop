import { getCategories, getBrands } from "@/lib/directus";
import CompanyClient from "./CompanyClient";

export default async function CompanyPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  return <CompanyClient categories={categories} brands={brands}/>;
}
