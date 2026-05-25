const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "";

// ─── Types ────────────────────────────────────────────────────

export type Zone = "mainland" | "hokkaido" | "okinawa";

export interface ShippingRule {
  id: number;
  zone: Zone;
  shipping_fee: number;
  free_shipping_threshold: number;
  enabled: boolean;
  sort: number | null;
}

export interface ShippingResult {
  shippingFee: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  total: number;
}

// ─── Fallback (Directus 到達不可時) ───────────────────────────

const FALLBACK_RULES: ShippingRule[] = [
  { id: 0, zone: "mainland", shipping_fee: 880,  free_shipping_threshold: 10000, enabled: true, sort: 1 },
  { id: 0, zone: "hokkaido", shipping_fee: 1430, free_shipping_threshold: 10000, enabled: true, sort: 2 },
  { id: 0, zone: "okinawa",  shipping_fee: 1980, free_shipping_threshold: 15000, enabled: true, sort: 3 },
];

// ─── Directus からルール取得 ──────────────────────────────────

export async function getShippingRules(): Promise<ShippingRule[]> {
  if (!DIRECTUS_URL) throw new Error("Missing DIRECTUS_URL");
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/shipping_rules?filter[enabled][_eq]=true&sort=sort&limit=50`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return FALLBACK_RULES;
    const data: ShippingRule[] = (await res.json()).data ?? [];
    return data.length > 0 ? data : FALLBACK_RULES;
  } catch {
    return FALLBACK_RULES;
  }
}

// ─── 都道府県 → Zone ──────────────────────────────────────────

export function getZone(prefecture: string): Zone {
  if (prefecture.startsWith("北海道")) return "hokkaido";
  if (prefecture.startsWith("沖縄"))   return "okinawa";
  return "mainland";
}

// ─── メイン: 送料計算 ─────────────────────────────────────────
// 免送判定は subtotal のみで行う（subtotal + shippingFee を使わない）

export async function getShipping(
  subtotal: number,
  zone: string
): Promise<ShippingResult> {
  const rules = await getShippingRules();
  const rule = rules.find((r) => r.zone === zone);

  if (!rule) {
    const isFreeShipping = subtotal >= 10000;
    return {
      shippingFee:           isFreeShipping ? 0 : 880,
      freeShippingThreshold: 10000,
      isFreeShipping,
      total: subtotal + (isFreeShipping ? 0 : 880),
    };
  }

  const isFreeShipping = subtotal >= rule.free_shipping_threshold;
  const shippingFee    = isFreeShipping ? 0 : rule.shipping_fee;

  return {
    shippingFee,
    freeShippingThreshold: rule.free_shipping_threshold,
    isFreeShipping,
    total: subtotal + shippingFee,
  };
}
