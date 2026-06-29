"use client";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "販売業者",           value: "AI Across合同会社" },
  { label: "運営責任者",         value: "豊嶋 修来" },
  { label: "所在地",             value: "〒306-0052　茨城県古河市大山1331-2" },
  { label: "関東センター",       value: "〒336-0026　埼玉県さいたま市南区辻8丁目3-5" },
  { label: "電話番号",           value: <>050-3091-0226 / 048-816-3967<br />受付時間：平日 10:00〜18:00（土日祝休）</> },
  { label: "メールアドレス",     value: "info@aiacross.com" },
  { label: "ウェブサイト",       value: "https://aiacrossshop.co.jp/" },
  { label: "販売価格",           value: "各商品ページに表示された価格（税込）" },
  { label: "送料",               value: (
    <div>
      <div style={{ marginBottom: 8, fontSize: 11 }}>全国配送対応。送料（税込・1配送あたり）：</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {([
          { price: "¥1,430", zones: [{ name: "南東北", prefs: "宮城・山形・福島" }, { name: "関東", prefs: "茨城・栃木・群馬・埼玉・千葉・東京・神奈川・山梨" }, { name: "信越", prefs: "新潟・長野" }, { name: "北陸", prefs: "富山・石川・福井" }, { name: "中部", prefs: "岐阜・静岡・愛知・三重" }] },
          { price: "¥1,540", zones: [{ name: "東北", prefs: "青森・岩手・秋田" }, { name: "関西", prefs: "滋賀・京都・大阪・兵庫・奈良・和歌山" }] },
          { price: "¥1,650", zones: [{ name: "中国", prefs: "鳥取・島根・岡山・広島・山口" }, { name: "四国", prefs: "徳島・香川・愛媛・高知" }] },
          { price: "¥1,760", zones: [{ name: "北海道", prefs: "北海道" }, { name: "九州", prefs: "福岡・佐賀・長崎・熊本・大分・宮崎・鹿児島" }] },
          { price: "¥2,420", zones: [{ name: "沖縄", prefs: "沖縄" }] },
        ] as { price: string; zones: { name: string; prefs: string }[] }[]).map(({ price, zones }) => (
          <div key={price} style={{ border: "1px solid #DDD", borderTop: "2px solid #0ABAB5", borderRadius: "0 0 2px 2px", padding: "8px 10px", minWidth: 150, flex: "1 1 150px" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0ABAB5", marginBottom: 5, letterSpacing: "-0.5px" }}>{price}</div>
            {zones.map(({ name, prefs }) => (
              <div key={name} style={{ fontSize: 11, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, color: "#333" }}>{name}：</span>
                <span style={{ color: "#666" }}>{prefs}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#888" }}>※ ¥20,000以上のご購入で送料無料（一部地域・大型商品を除く）</div>
    </div>
  ) },
  { label: "支払方法",           value: "クレジットカード（JCB / AMEX / Diners）" },
  { label: "商品の引渡し時期",   value: "ご注文確認後、通常1〜3営業日以内に発送（在庫状況により異なる場合があります）" },
  { label: "返品・交換",         value: <>商品到着後30日以内かつ未開封・未使用品に限り返品可。お客様都合の返品は送料お客様負担。<br />初期不良品は到着後30日以内にご連絡ください（送料当社負担で交換対応）。</> },
  { label: "保証",               value: (
    <>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: "#333" }}>安心プラン：</span><br />
        販売商品は原則30日間の動作保証付き（保証期間・範囲は商品ページ参照）
      </div>
      <div>
        <span style={{ fontWeight: 700, color: "#333" }}>プレミアムプラン：</span><br />
        一生保証サービス付き（適用条件・保証範囲は商品ページをご確認ください）
      </div>
    </>
  ) },
  { label: "古物商許可番号",     value: "埼玉県公安委員会許可　第431030058175号" },
  { label: "個人情報の取扱い",   value: "当社プライバシーポリシーに基づき適切に管理します。第三者への提供は法令に定める場合を除き行いません。" },
];

export default function TokushohoPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 60px" }}>
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
    </div>
  );
}
