import type { Brand } from "@/lib/directus";

export const CATEGORY_BRAND_SLUGS = {
  "laptops-used": [
    "apple", "lenovo", "dell", "hp", "microsoft",
    "panasonic", "asus", "sony", "fujitsu", "nec",
    "sharp", "dynabook", "acer", "msi", "galleria",
  ],
  "laptops-new": [
    "apple", "microsoft", "asus", "lenovo", "dell", "hp", "msi", "galleria",
  ],
  "desktops": [
    "apple", "dell", "hp", "lenovo", "asus",
    "fujitsu", "nec", "msi", "galleria",
  ],
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
