"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "販売業者",           value: "AI Across合同会社" },
  { label: "運営責任者",         value: "代表社員　田中 健太" },
  { label: "所在地",             value: "〒306-0052　茨城県古河市大山1331-2" },
  { label: "関東センター",       value: "〒336-0026　埼玉県さいたま市南区辻8丁目3-5" },
  { label: "電話番号",           value: <>050-3091-0226 / 048-816-3967<br />受付時間：平日 10:00〜18:00（土日祝休）</> },
  { label: "メールアドレス",     value: "info@aiacross.com" },
  { label: "ウェブサイト",       value: "https://dejimaru-shop.com" },
  { label: "販売価格",           value: "各商品ページに表示された価格（税込）" },
  { label: "送料",               value: "全国一律 ¥550（税込）／¥5,500以上お買い上げで送料無料（一部地域除く）" },
  { label: "代金の支払時期",     value: "クレジットカード：注文確定時に決済　/ 銀行振込：注文後7日以内" },
  { label: "支払方法",           value: "クレジットカード（VISA / Mastercard / JCB / AMEX）、PayPay、楽天ペイ、au PAY、Apple Pay、Google Pay、銀行振込" },
  { label: "商品の引渡し時期",   value: "ご注文確認後、通常1〜3営業日以内に発送（在庫状況により異なる場合があります）" },
  { label: "返品・交換",         value: <>商品到着後8日以内かつ未開封・未使用品に限り返品可。お客様都合の返品は送料お客様負担。<br />初期不良品は到着後8日以内にご連絡ください（送料当社負担で交換対応）。</> },
  { label: "保証",               value: "販売商品は原則30日間の動作保証付き（保証期間・範囲は商品ページ参照）" },
  { label: "古物商許可番号",     value: "茨城県公安委員会許可　第081234567890号" },
  { label: "個人情報の取扱い",   value: "当社プライバシーポリシーに基づき適切に管理します。第三者への提供は法令に定める場合を除き行いません。" },
];

export default function TokushohoPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>
      <div style={{ background: C.white, borderBottom: `2px solid ${C.primary}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, letterSpacing: "-1px", fontFamily: "Arial Black,sans-serif" }}>デジマルショップ</div>
          <div style={{ fontSize: 9, color: C.textLight }}>中古PC・スマホならデジマルショップ！</div>
        </div>
      </div>
      <div style={{ background: C.primary, borderBottom: `2px solid ${C.primaryDark}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "7px 10px", fontSize: 11, color: "#fff", display: "flex", gap: 6 }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>ホーム</span>
          <span>›</span>
          <span style={{ fontWeight: 700 }}>特定商取引法に基づく表記</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>特定商取引法に基づく表記</h1>
        <p style={{ fontSize: 12, color: C.textSub, lineHeight: 1.8, marginBottom: 16 }}>
          特定商取引に関する法律（特定商取引法）第11条に基づき、以下の事項を表示します。
        </p>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text, background: C.primaryBg, width: "32%", verticalAlign: "top", borderRight: `1px solid ${C.primaryBorder}`, fontSize: 12 }}>{row.label}</td>
                  <td style={{ padding: "12px 16px", color: C.textSub, lineHeight: 1.9, fontSize: 12 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#FFF8E8", border: "1px solid #F0D080", borderRadius: 2, fontSize: 12, color: C.textSub, lineHeight: 1.9 }}>
          ※ 本表記の内容は予告なく変更される場合があります。最新情報は本ページをご確認ください。<br />
          ※ 電話番号は商品・注文に関するお問い合わせ専用です。営業・勧誘のご連絡はお断りします。
        </div>
      </div>
      <Footer />
    </div>
  );
}
