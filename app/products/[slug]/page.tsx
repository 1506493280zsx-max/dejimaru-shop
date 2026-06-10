import { getProducts, getProductBySlug } from "@/lib/directus";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";
const BASE_URL = "https://aiacrossshop.co.jp";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${DIRECTUS}/items/products?filter[slug][_eq]=${slug}&fields=name,description,price,images,category_id&limit=1`);
    const data = await res.json();
    const product = data.data?.[0];
    if (!product) return { title: "商品が見つかりません" };

    const title = `${product.name} | AI Across ショップ`;
    const description = product.description
      ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `${product.name}を${product.price?.toLocaleString()}円で販売中。全商品30日間動作保証付き。`;
    const imageUrl = product.images?.[0]
      ? `${DIRECTUS}/assets/${product.images[0]}?width=1200&height=630&fit=cover`
      : `${BASE_URL}/opengraph-image`;

    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/products/${slug}` },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/products/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "AI Across ショップ" };
  }
}

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product?.name || "",
            "description": product?.description?.replace(/<[^>]*>/g, "") || "",
            "image": product?.images?.[0] ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app"}/assets/${product.images[0]}` : "",
            "offers": {
              "@type": "Offer",
              "price": product?.price || 0,
              "priceCurrency": "JPY",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "AI Across合同会社"
              }
            },
            "brand": {
              "@type": "Brand",
              "name": product?.brand || "AI Across"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://aiacrossshop.co.jp" },
              { "@type": "ListItem", "position": 2, "name": "商品一覧", "item": "https://aiacrossshop.co.jp/products" },
              { "@type": "ListItem", "position": 3, "name": product?.name || "", "item": `https://aiacrossshop.co.jp/products/${product?.slug || ""}` }
            ]
          })
        }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
