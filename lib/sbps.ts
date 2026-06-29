import crypto from "crypto";

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
    item_name: input.itemName.slice(0, 40).replace(/[^\x00-\x7F]/g, "").trim(),
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
  params.sps_hashcode = crypto.createHash("sha1").update(hashStr, "utf8").digest("hex");

  return params;
}

export function verifySBPSCallback(params: Record<string, string>): boolean {
  const received = params.sps_hashcode;
  if (!received) return false;

  // 結果CGI(A02-1)の項目定義順（明細dtl_*は無い前提、sps_hashcode除外）
  const CGI_ORDER = [
    "pay_method", "merchant_id", "service_id", "cust_code", "sps_cust_no",
    "sps_payment_no", "order_id", "item_id", "pay_item_id", "item_name",
    "tax", "amount", "pay_type", "auto_charge_type", "service_type",
    "div_settele", "last_charge_month", "camp_type", "tracking_id", "terminal_type",
    "free1", "free2", "free3", "request_date",
    "res_pay_method", "res_result", "res_tracking_id", "res_sps_cust_no",
    "res_sps_payment_no", "res_payinfo_key", "res_payment_date", "res_err_code",
    "res_date", "limit_second",
  ];

  // 各値の前後の半角スペースを除去して項目定義順に連結、末尾にhashkey、UTF-8でSHA1、大文字
  const hashStr = CGI_ORDER.map(f => (params[f] ?? "").trim()).join("") + SBPS_CONFIG.hashKey;
  const expected = crypto.createHash("sha1").update(hashStr, "utf8").digest("hex").toUpperCase();

  return received.toUpperCase() === expected;
}
