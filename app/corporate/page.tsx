"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

function SH({ title }: { title: string }) {
  return (
    <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 14, fontWeight: 700, borderRadius: "2px 2px 0 0", display: "flex", alignItems: "center", marginTop: 24 }}>
      {title}
    </div>
  );
}
function PL({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: 16, lineHeight: 1.9, fontSize: 13, color: C.textSub }}>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "9px 14px", border: `1px solid ${C.border}`, background: C.primaryBg, fontWeight: 700, color: C.text, whiteSpace: "nowrap", verticalAlign: "top", width: 160 }}>{label}</td>
      <td style={{ padding: "9px 14px", border: `1px solid ${C.border}`, background: C.white, color: C.textSub }}>{value}</td>
    </tr>
  );
}

const SERVICES = [
  { title: "中古PC・デバイス販売",   body: "動作確認・クリーニング済みの中古パソコン、スマートフォン、タブレットを全国へ販売しています。品質基準を満たした商品のみをご提供します。" },
  { title: "買取サービス",            body: "不要になったPC・スマートフォン・タブレット・ゲーム機を高価買取しています。法人・個人問わず対応。全国郵送買取に対応しています。" },
  { title: "修理サービス",            body: "画面割れ・バッテリー交換・水没対応・データ復旧など、幅広い修理に対応しています。お持ち込みおよび郵送修理を承ります。" },
  { title: "法人・卸販売",            body: "企業・学校・官公庁向けに中古デバイスの一括納品に対応しています。台数・スペックのご要望にお応えします。お見積りはお気軽にご相談ください。" },
  { title: "PODカスタムサービス",     body: "Print On Demand（POD）に対応したオリジナルプリント・カスタマイズサービスを提供しています。ノベルティ・販促品にご活用ください。" },
];

const CENTERS = [
  {
    name: "本社",
    zip: "〒306-0052",
    addr: "茨城県古河市大山1331-2",
    tel: "050-3091-0226",
    access: "JR宇都宮線「古河駅」より車で約10分",
  },
  {
    name: "関東センター",
    zip: "〒336-0026",
    addr: "埼玉県さいたま市南区辻8丁目3-5",
    tel: "048-816-3967",
    access: "JR京浜東北線「浦和駅」より車で約10分",
  },
];

export default function CorporatePage() {
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
          <span style={{ fontWeight: 700 }}>会社概要</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>会社概要</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          AI Across合同会社は、中古デバイスの販売・買取・修理を中心に、法人向け卸販売やPODカスタムサービスを展開しています。
          「デジタルをもっと身近に、もっとサステナブルに」をテーマに、お客様の多様なニーズにお応えします。
        </p>

        <SH title="基本情報" />
        <PL>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              <Row label="法人名"       value="AI Across合同会社" />
              <Row label="運営サービス" value="デジマルショップ（中古PC・スマートフォン通販）" />
              <Row label="事業内容"     value={<>中古PC・スマートフォン・タブレットの販売<br />中古デバイスの買取<br />PC・スマートフォンの修理<br />法人向け一括販売・卸販売<br />PODカスタムサービス</>} />
              <Row label="代表電話"     value="050-3091-0226（平日10:00〜18:00）" />
              <Row label="メール"       value="info@aiacross.com" />
              <Row label="本社所在地"   value={<>〒306-0052<br />茨城県古河市大山1331-2</>} />
            </tbody>
          </table>
        </PL>

        <div id="centers"><SH title="拠点・センター一覧" /></div>
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {CENTERS.map(({ name, zip, addr, tel, access }) => (
              <div key={name} style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, background: C.white, padding: 16, borderRadius: "0 0 2px 2px" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>■ {name}</div>
                <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
                  <tbody>
                    {[
                      ["住所", <>{zip}<br />{addr}</>],
                      ["電話番号", tel],
                      ["アクセス", access],
                    ].map(([label, val], i) => (
                      <tr key={i}>
                        <td style={{ padding: "4px 10px 4px 0", color: C.textLight, whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
                        <td style={{ padding: "4px 0", color: C.textSub }}>{val as React.ReactNode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </PL>

        <SH title="主な事業内容" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {SERVICES.map(({ title, body }) => (
              <div key={title} style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, padding: 14, borderRadius: "0 0 2px 2px" }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 6, fontSize: 13 }}>{title}</div>
                <p style={{ fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </PL>

        <SH title="許認可・登録情報" />
        <PL>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              <Row label="古物商許可"   value="茨城県公安委員会許可（古物商）" />
              <Row label="プライバシー" value="個人情報保護法に基づき個人情報を適切に管理しています" />
              <Row label="適用法令"     value="特定商取引法に基づく表記は特定商取引法ページをご覧ください" />
            </tbody>
          </table>
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>法人・卸のご相談</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>法人向け一括調達・卸販売についてはお気軽にお問い合わせください。</span>
          </div>
          <button onClick={() => router.push("/wholesale")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            法人・卸について →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
