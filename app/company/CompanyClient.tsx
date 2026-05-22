"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", text:"#333", textSub:"#666",
  textLight:"#999", border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

function SH({ title }: { title: string }) {
  return (
    <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 13, fontWeight: 700, borderRadius: "2px 2px 0 0", display: "flex", alignItems: "center", marginTop: 20 }}>
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
      <td style={{ padding: "10px 14px", fontWeight: 700, color: C.textSub, width: "32%", borderBottom: `1px solid #EEF6F6`, borderRight: `1px solid ${C.border}`, background: C.primaryBg, verticalAlign: "top", fontSize: 12 }}>{label}</td>
      <td style={{ padding: "10px 14px", color: C.text, borderBottom: `1px solid #EEF6F6`, background: C.white, lineHeight: 1.8, fontSize: 12 }}>{value}</td>
    </tr>
  );
}

const SERVICES = [
  {
    title: "リユースPC・デバイス販売",
    body: "動作確認・データ消去・クリーニング済みの中古パソコン、スマートフォン、タブレットをオンラインで全国へ販売。品質基準を満たした商品のみを取り扱い、安心してご使用いただけます。",
  },
  {
    title: "中古機器の買取・データ消去",
    body: "不要になったPC・スマートフォン・タブレット・ゲーム機を高価買取。専門スタッフによる安全なデータ消去を実施し、個人情報の漏洩リスクを排除します。法人の一括処分にも対応。",
  },
  {
    title: "修理・メンテナンスサービス",
    body: "画面割れ・バッテリー交換・水没対応・動作不良など、幅広い修理に対応しています。お持ち込みおよび郵送での修理受付が可能。迅速・丁寧な対応でご返却します。",
  },
  {
    title: "法人向け一括調達・卸販売",
    body: "企業・学校・官公庁向けに中古デバイスの一括納品に対応。台数・スペックのご要望に応じた柔軟なご提案が可能です。見積・導入サポートまでワンストップで対応します。",
  },
  {
    title: "輸出入貿易・国際調達",
    body: "各種通信機器・ゲーム機の輸出入貿易業務を展開。海外市場との取引ネットワークを活かし、国内外の調達ニーズに対応しています。",
  },
  {
    title: "PODカスタムサービス",
    body: "Print On Demand（POD）に対応したオリジナルプリント・カスタマイズサービス。ノベルティ・販促品・ブランドグッズの小ロット製作に対応しています。",
  },
];

const CENTERS = [
  {
    name: "本社",
    zip: "〒306-0052",
    addr: "茨城県古河市大山1331-2",
    tel: "050-3091-0226",
    hours: "平日 10:00〜18:00",
  },
  {
    name: "関東センター",
    zip: "〒336-0026",
    addr: "埼玉県さいたま市南区辻8丁目3-5",
    tel: "048-816-3967",
    hours: "平日 10:00〜18:00",
  },
];

export default function CompanyClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 40px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Sidebar categories={categories} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>会社概要</h1>

            <SH title="会社概要" />
            <PL>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Row label="会社名"       value="AI Across合同会社" />
                  <Row label="代表社員"     value="豊嶋 修来" />
                  <Row label="設立"         value="2022年7月" />
                  <Row label="資本金"       value="500万円" />
                  <Row label="本社所在地"   value={<>〒306-0052<br />茨城県古河市大山1331-2</>} />
                  <Row label="関東センター" value={<>〒336-0026<br />埼玉県さいたま市南区辻8丁目3-5</>} />
                  <Row label="電話番号"     value={<>050-3091-0226 / 048-816-3967<br /><span style={{ fontSize: 11, color: C.textLight }}>平日 10:00〜18:00（土日祝休）</span></>} />
                  <Row label="メール"       value="info@aiacross.com" />
                  <Row label="営業時間"     value="平日 10:00〜18:00（土日祝・年末年始を除く）" />
                  <Row label="対応地域"     value="日本全国（一部離島を除く）および海外（輸出入取引）" />
                </tbody>
              </table>
            </PL>

            <SH title="AI Across合同会社について" />
            <PL>
              <p style={{ margin: "0 0 10px" }}>
                AI Across合同会社は、2022年7月に茨城県古河市に設立された、デジタルリユース事業を中心とする会社です。
                中古パソコン・スマートフォン・タブレット・通信機器の売買・修理・輸出入を主軸に、国内外にわたるデジタル機器の流通ネットワークを構築しています。
              </p>
              <p style={{ margin: 0 }}>
                運営するオンラインショップ「デジマルショップ」では、動作確認・データ消去・クリーニングを施した中古デバイスを全国へ提供しています。
                リユース品の普及を通じて資源の有効活用に貢献し、個人・法人問わず幅広いお客様のデジタルライフをサポートします。
              </p>
            </PL>

            <SH title="企業理念" />
            <PL>
              <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "14px 18px", marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.8 }}>
                  「すべての中古電子機器に新たな命を与え、<br />
                  日本一信頼されるデジタルリユース企業となり、<br />
                  AI時代を共に切り拓く」
                </div>
              </div>
              <div style={{ marginBottom: 12, padding: "10px 14px", background: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.primary}`, borderRadius: "0 2px 2px 0", fontSize: 12 }}>
                <strong style={{ color: C.text }}>企業モットー：</strong>
                「デジタルを再生し、リバースロジスティクス産業の新時代を切り拓く」
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["信頼", "再生", "革新"].map((v) => (
                  <div key={v} style={{ flex: 1, minWidth: 80, background: C.primary, color: "#fff", borderRadius: 2, padding: "10px 8px", textAlign: "center", fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>{v}</div>
                ))}
              </div>
            </PL>

            <SH title="事業内容" />
            <PL>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                <li style={{ marginBottom: 6 }}>各種通信機器・ゲーム機の輸出入貿易業務</li>
                <li style={{ marginBottom: 6 }}>通信機器・ゲーム機・パソコン・スマートフォンの買取および販売</li>
                <li style={{ marginBottom: 6 }}>インターネットを活用した通信販売業務（デジマルショップ）</li>
                <li style={{ marginBottom: 6 }}>中古デバイスの修理・メンテナンス・データ消去</li>
                <li style={{ marginBottom: 6 }}>法人向け中古デバイスの一括調達・卸販売</li>
                <li>PODカスタムサービス（オリジナルプリント・ノベルティ製作）</li>
              </ul>
            </PL>

            <SH title="サービス紹介" />
            <PL>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {SERVICES.map(({ title, body }) => (
                  <div key={title} style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, background: C.white, padding: 12, borderRadius: "0 0 2px 2px" }}>
                    <div style={{ fontWeight: 700, color: C.text, marginBottom: 6, fontSize: 12 }}>{title}</div>
                    <p style={{ fontSize: 11, color: C.textSub, margin: 0, lineHeight: 1.8 }}>{body}</p>
                  </div>
                ))}
              </div>
            </PL>

            <SH title="国内・海外事業展開" />
            <PL>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 14 }}>
                  <div style={{ fontWeight: 700, color: C.text, marginBottom: 8, fontSize: 13 }}>国内事業</div>
                  <p style={{ fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.8 }}>
                    茨城県・埼玉県を拠点に、全国向けオンライン販売・買取・修理サービスを展開。
                    個人から法人まで幅広いニーズに対応し、デジタルリユース文化の普及に取り組んでいます。
                  </p>
                </div>
                <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 14 }}>
                  <div style={{ fontWeight: 700, color: C.text, marginBottom: 8, fontSize: 13 }}>海外事業</div>
                  <p style={{ fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.8 }}>
                    各種通信機器・ゲーム機の輸出入貿易を行い、海外市場との取引ネットワークを構築。
                    国際的な調達・販売ルートを活かし、競争力のある価格での商品提供を実現しています。
                  </p>
                </div>
              </div>
            </PL>

            <SH title="センター情報" />
            <PL>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {CENTERS.map(({ name, zip, addr, tel, hours }) => (
                  <div key={name} style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, background: C.white, padding: 14, borderRadius: "0 0 2px 2px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 10 }}>■ {name}</div>
                    <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                      <tbody>
                        {([
                          ["住所", <>{zip}<br />{addr}</>],
                          ["電話番号", tel],
                          ["受付時間", hours],
                        ] as [string, React.ReactNode][]).map(([lbl, val], i) => (
                          <tr key={i}>
                            <td style={{ padding: "3px 10px 3px 0", color: C.textLight, whiteSpace: "nowrap", verticalAlign: "top" }}>{lbl}</td>
                            <td style={{ padding: "3px 0", color: C.textSub }}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </PL>

            <SH title="お問い合わせ案内" />
            <PL>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
                {([
                  { label: "お電話",    val: <>050-3091-0226<br />048-816-3967<br /><span style={{ fontSize: 11 }}>平日 10:00〜18:00</span></> },
                  { label: "メール",    val: "info@aiacross.com" },
                  { label: "Webサイト", val: "https://aiacross.com/" },
                ] as { label: string; val: React.ReactNode }[]).map(({ label, val }) => (
                  <div key={label} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 12, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>{val}</div>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 12, padding: "8px 12px", background: "#FFF8E8", border: "1px solid #F0D080", borderRadius: 2 }}>
                ※ お電話は商品・注文に関するお問い合わせ専用です。営業・勧誘のご連絡はお断りしています。
              </p>
            </PL>

            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                お問い合わせはこちら →
              </button>
              <button onClick={() => router.push("/")} style={{ background: C.white, color: C.primary, border: `1px solid ${C.primary}`, padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ← トップページへ戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
