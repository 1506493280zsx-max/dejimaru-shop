import { getProductBySlug } from "@/lib/directus";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
