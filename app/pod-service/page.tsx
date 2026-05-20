"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import FlowStep from "@/components/FlowStep";

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
function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 14 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{body}</p>
    </div>
  );
}

const STEPS = [
  { n: 1, t: "デザイン入稿・打ち合わせ", d: "ロゴ・画像データをご提供ください。デザインの方向性をヒアリングします。" },
  { n: 2, t: "デザイン確認・承認",       d: "仕上がりイメージをデータでご確認いただき、修正・承認を行います。" },
  { n: 3, t: "印刷・加工",               d: "承認後、専用設備にてプリント・貼付け・加工作業を行います。" },
  { n: 4, t: "品質検査",                 d: "全数検品を実施し、色ずれ・剥がれ・傷がないか確認します。" },
  { n: 5, t: "納品",                     d: "個別梱包の上、指定住所へ発送。法人は複数拠点への分散納品にも対応。" },
];

const PRODUCTS = [
  { t: "ノートPC（外装・天板）",       d: "天板へのロゴプリント・ステッカー貼付・シート加工に対応します。" },
  { t: "スマートフォン（背面）",       d: "背面パネルへのフルカラー印刷・資産管理番号の刻印が可能です。" },
  { t: "タブレット（背面・画面枠）",   d: "背面へのブランドロゴ印刷・バーコードラベル貼付に対応します。" },
  { t: "ノベルティ・ギフトセット",     d: "化粧箱・リボン梱包でノベルティ・贈答品としての仕上げも可能です。" },
];

export default function PodServicePage() {
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
          <span style={{ fontWeight: 700 }}>PODカスタムサービス</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>PODカスタムサービス</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          Print On Demand（POD）技術を活用し、中古PC・スマートフォン・タブレットにオリジナルデザインをプリント・刻印します。ノベルティ制作・社内ブランディング・ギフト用途に対応。<strong>1台から注文可能</strong>です。
        </p>

        <SH title="サービスの特徴" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <FeatureCard title="高精細プリント" body="UV印刷技術で鮮明なフルカラーデザインを実現。細かいロゴや文字も再現します。" />
            <FeatureCard title="1台から対応"   body="小ロット・単品から受付。大量注文はボリューム割引があります。" />
            <FeatureCard title="レーザー刻印"  body="金属・プラスチック筐体へのレーザー刻印で半永久的な印字が可能です。" />
          </div>
        </PL>

        <SH title="対応製品・カスタム内容" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PRODUCTS.map((item, i) => (
              <div key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.t}</div>
                <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </PL>

        <SH title="料金プラン" />
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.primaryBg }}>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>プラン</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>数量</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>印刷費（1台）</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>備考</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "スモール",      qty: "1〜9台",   price: "¥2,200〜", note: "初回デザイン確認費含む" },
                { plan: "スタンダード",  qty: "10〜49台", price: "¥1,500〜", note: "複数デザイン対応" },
                { plan: "バルク",        qty: "50台以上", price: "¥1,000〜", note: "専任担当・個別梱包" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #EEF6F6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: C.primary }}>{r.plan}</td>
                  <td style={{ padding: "10px 14px", color: C.textSub }}>{r.qty}</td>
                  <td style={{ padding: "10px 14px", color: "#CC2200", fontWeight: 700 }}>{r.price}</td>
                  <td style={{ padding: "10px 14px", color: C.textSub }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 14px", fontSize: 12, color: C.textSub, background: "#FFF8E8", borderTop: "1px solid #F0D080" }}>
            ※ 印刷費は製品代金とは別途です。デザインデータの作成代行（有償）も承ります。
          </div>
        </div>

        <SH title="ご利用の流れ" />
        <PL>{STEPS.map((s) => <FlowStep key={s.n} {...s} />)}</PL>

        <SH title="入稿データの規格" />
        <PL>
          <ul style={{ paddingLeft: 18 }}>
            <li>対応フォーマット：AI（Adobe Illustrator）・PDF・PNG（300dpi以上推奨）</li>
            <li>カラーモード：CMYKまたはRGB（印刷時CMYKに変換します）</li>
            <li>文字はアウトライン化してください（フォント埋め込みも可）</li>
            <li>トンボ・塗り足し（3mm以上）を付けてご入稿ください</li>
            <li>データが規格外の場合は修正をお願いする場合があります</li>
          </ul>
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>PODカスタムのお見積もり</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>まずはお気軽にご相談ください。サンプルの作成も承ります。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            お見積もりを依頼する →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
