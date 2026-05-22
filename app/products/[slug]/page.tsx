import { getProducts, getProductBySlug } from "@/lib/directus";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: any) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
