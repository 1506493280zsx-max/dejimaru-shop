import crypto from "crypto";
import * as iconv from "iconv-lite";

export const SBPS_CONFIG = {
  merchantId: process.env.SBPS_MERCHANT_ID || "30132",
  serviceId: process.env.SBPS_SERVICE_ID || "102",
  hashKey: process.env.SBPS_HASH_KEY || "",
  paymentUrl: process.env.SBPS_PAYMENT_URL || "https://stbfep.sps-system.com/f01/FepBuyInfoReceive.do",
};

// 按照仕様書 A01-1 都度課金 的顺序定义哈希字段
const HASH_FIELDS = [
  "merchant_id",
  "service_id",
  "cust_code",
  "sps_cust_no",
  "sps_payment_no",
  "order_id",
  "item_id",
  "pay_item_id",
  "item_name",
  "tax",
  "amount",
  "pay_type",
  "auto_charge_type",
  "service_type",
  "div_settele",
  "last_charge_month",
  "camp_type",
  "tracking_id",
  "terminal_type",
  "success_url",
  "cancel_url",
  "error_url",
  "pagecon_url",
  "free1",
  "free2",
  "free3",
  "free_csv",
  "request_date",
  "limit_second",
  "hashkey",
];

export function buildSBPSParams(input: {
  orderNumber: string;
  orderId: number;
  amount: number;
  itemName: string;
  custCode: string;
  baseUrl: string;
}): Record<string, string> {
  const now = new Date();
  // 用日本时间生成 YYYYMMDDHHMMSS
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const requestDate = jst.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

  const params: Record<string, string> = {
    merchant_id: SBPS_CONFIG.merchantId,
    service_id: SBPS_CONFIG.serviceId,
    cust_code: input.custCode,
    sps_cust_no: "",
    sps_payment_no: "",
    order_id: input.orderNumber,
    item_id: `ORD${input.orderId}`,
    pay_item_id: "",
    item_name: input.itemName.slice(0, 40),
    tax: "",
    amount: String(input.amount),
    pay_type: "0",
    auto_charge_type: "",
    service_type: "0",
    div_settele: "",
    last_charge_month: "",
    camp_type: "",
    tracking_id: "",
    terminal_type: "0",
    success_url: `${input.baseUrl}/checkout/success?orderNumber=${encodeURIComponent(input.orderNumber)}`,
    cancel_url: `${input.baseUrl}/checkout`,
    error_url: `${input.baseUrl}/checkout/error`,
    pagecon_url: `${input.baseUrl}/api/payment/callback`,
    free1: "",
    free2: "",
    free3: "",
    free_csv: "",
    request_date: requestDate,
    limit_second: "",
    hashkey: SBPS_CONFIG.hashKey,
  };

  const hashStr = HASH_FIELDS.map(f => params[f] ?? "").join("");
  params.sps_hashcode = crypto.createHash("sha1").update(iconv.encode(hashStr, "Shift_JIS")).digest("hex");

  return params;
}

export function verifySBPSCallback(params: Record<string, string>): boolean {
  const received = params.sps_hashcode;
  if (!received) return false;
  const copy = { ...params };
  delete copy.sps_hashcode;
  copy.hashkey = SBPS_CONFIG.hashKey;
  const hashStr = HASH_FIELDS.map(f => copy[f] ?? "").join("");
  const expected = crypto.createHash("sha1").update(hashStr, "utf8").digest("hex");
  return received === expected;
}
