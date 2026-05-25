import type { Brand } from "@/lib/directus";

const PC_BRANDS = [
  "apple", "lenovo", "fujitsu", "dynabook", "dell",
  "hp", "panasonic", "nec", "asus", "microsoft",
  "vaio", "acer", "msi", "lg", "galleria",
] as const;

export const CATEGORY_BRAND_SLUGS = {
  "laptops-used": PC_BRANDS,
  "laptops-new": PC_BRANDS,
  "desktops": PC_BRANDS,
  "smartphones": [
    "apple", "samsung", "google", "sony", "sharp",
    "xiaomi", "huawei", "oppo", "motorola",
  ],
  "tablets": [
    "apple", "microsoft", "samsung", "lenovo", "asus", "huawei", "sony",
  ],
  "peripherals": [
    "anker", "elecom", "logitech", "asus", "lg", "dell", "hp", "samsung",
  ],
  "storage": [
    "samsung", "sandisk", "kingston", "buffalo", "elecom",
  ],
} as const;

export function getBrandsForCategory(
  categorySlug: string,
  brands: Brand[]
): Brand[] {
  const slugs = CATEGORY_BRAND_SLUGS[
    categorySlug as keyof typeof CATEGORY_BRAND_SLUGS
  ];
  if (!slugs) return [];
  return brands.filter(b => (slugs as readonly string[]).includes(b.slug));
}
