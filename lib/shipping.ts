const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "";

// ─── Types ────────────────────────────────────────────────────

export type Zone =
  | "standard"          // 南東北・関東・信越・北陸・中部
  | "kitatohoku_kansai" // 北東北・関西
  | "chugoku_shikoku"   // 中国・四国
  | "hokkaido_kyushu"   // 北海道・九州
  | "okinawa";          // 沖縄

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

// free_shipping_threshold: 0 は「送料無料条件なし」を表す（沖縄）
const FALLBACK_RULES: ShippingRule[] = [
  { id: 0, zone: "standard",          shipping_fee: 1430, free_shipping_threshold: 15000, enabled: true, sort: 1 },
  { id: 0, zone: "kitatohoku_kansai", shipping_fee: 1540, free_shipping_threshold: 15000, enabled: true, sort: 2 },
  { id: 0, zone: "chugoku_shikoku",   shipping_fee: 1650, free_shipping_threshold: 15000, enabled: true, sort: 3 },
  { id: 0, zone: "hokkaido_kyushu",   shipping_fee: 1760, free_shipping_threshold: 15000, enabled: true, sort: 4 },
  { id: 0, zone: "okinawa",           shipping_fee: 2420, free_shipping_threshold: 0,     enabled: true, sort: 5 },
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
// prefecture は「東京都」「大阪府」「宮城県」等の接尾辞付きを想定し前方一致で判定

const PREFECTURES_BY_ZONE: Record<Zone, string[]> = {
  standard: [
    "宮城", "山形", "福島",                                     // 南東北
    "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川", "山梨", // 関東
    "新潟", "長野",                                             // 信越
    "富山", "石川", "福井",                                     // 北陸
    "岐阜", "静岡", "愛知", "三重",                             // 中部
  ],
  kitatohoku_kansai: [
    "青森", "岩手", "秋田",                                     // 北東北
    "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",           // 関西
  ],
  chugoku_shikoku: [
    "鳥取", "島根", "岡山", "広島", "山口",                     // 中国
    "徳島", "香川", "愛媛", "高知",                             // 四国
  ],
  hokkaido_kyushu: [
    "北海道",                                                   // 北海道
    "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島",   // 九州
  ],
  okinawa: ["沖縄"],
};

export function getZone(prefecture: string): Zone {
  const pref = prefecture.trim();
  for (const zone of Object.keys(PREFECTURES_BY_ZONE) as Zone[]) {
    if (PREFECTURES_BY_ZONE[zone].some((p) => pref.startsWith(p))) return zone;
  }
  return "standard"; // 不明な都道府県は本州標準料金
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
    const isFreeShipping = subtotal >= 15000;
    return {
      shippingFee:           isFreeShipping ? 0 : 1430,
      freeShippingThreshold: 15000,
      isFreeShipping,
      total: subtotal + (isFreeShipping ? 0 : 1430),
    };
  }

  // free_shipping_threshold が 0（沖縄）の場合は送料無料条件なし
  const hasFreeShipping = rule.free_shipping_threshold > 0;
  const isFreeShipping  = hasFreeShipping && subtotal >= rule.free_shipping_threshold;
  const shippingFee     = isFreeShipping ? 0 : rule.shipping_fee;

  return {
    shippingFee,
    freeShippingThreshold: rule.free_shipping_threshold,
    isFreeShipping,
    total: subtotal + shippingFee,
  };
}
