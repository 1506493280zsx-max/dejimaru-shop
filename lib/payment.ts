export interface PaymentMethod {
  id: string;
  name: string;
  src: string;
  w: number;
  h: number;
}

export interface PaymentGroup {
  label: string;
  methods: PaymentMethod[];
}

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    label: "クレジット・デビット",
    methods: [
      { id: "visa",       name: "Visa",             src: "/payment/visa.svg",       w: 50, h: 32 },
      { id: "mastercard", name: "Mastercard",        src: "/payment/mastercard.svg", w: 50, h: 32 },
      { id: "jcb",        name: "JCB",               src: "/payment/jcb.svg",        w: 50, h: 32 },
      { id: "amex",       name: "American Express",  src: "/payment/amex.svg",       w: 50, h: 32 },
      { id: "discover",   name: "Discover",          src: "/payment/discover.svg",   w: 50, h: 32 },
      { id: "diners",     name: "Diners Club",       src: "/payment/diners.svg",     w: 50, h: 32 },
    ],
  },
  {
    label: "デジタル決済",
    methods: [
      { id: "paypay",     name: "PayPay",            src: "/payment/paypay.svg",     w: 50, h: 32 },
      { id: "rakutenpay", name: "楽天ペイ",           src: "/payment/rakutenpay.svg", w: 50, h: 32 },
      { id: "dpay",       name: "d払い",             src: "/payment/dpay.svg",       w: 50, h: 32 },
      { id: "aupay",      name: "au PAY",            src: "/payment/aupay.svg",      w: 50, h: 32 },
      { id: "googlepay",  name: "Google Pay",        src: "/payment/googlepay.svg",  w: 50, h: 32 },
      { id: "applepay",   name: "Apple Pay",         src: "/payment/applepay.svg",   w: 50, h: 32 },
      { id: "shoppay",    name: "Shop Pay",          src: "/payment/shoppay.svg",    w: 50, h: 32 },
    ],
  },
  {
    label: "コンビニ支払い",
    methods: [
      { id: "seven",      name: "セブン-イレブン",   src: "/payment/seven.svg",      w: 50, h: 32 },
      { id: "familymart", name: "ファミリーマート",   src: "/payment/familymart.svg", w: 50, h: 32 },
      { id: "lawson",     name: "ローソン",           src: "/payment/lawson.svg",     w: 50, h: 32 },
      { id: "ministop",   name: "ミニストップ",       src: "/payment/ministop.svg",   w: 50, h: 32 },
      { id: "seicomart",  name: "セイコーマート",     src: "/payment/seicomart.svg",  w: 50, h: 32 },
      { id: "daily",      name: "デイリーヤマザキ",   src: "/payment/daily.svg",      w: 50, h: 32 },
    ],
  },
];
