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
function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{body}</p>
    </div>
  );
}

const STEPS = [
  { n: 1, t: "修理のお申込み",         d: "お問い合わせフォームまたはお電話にて症状・機種・型番をご連絡ください。" },
  { n: 2, t: "修理可否・お見積もり",   d: "内容確認後、最短当日に修理可否と概算費用をご案内します。" },
  { n: 3, t: "商品の発送または持込み", d: "着払い発送、または関東センターへの直接持込みが可能です。" },
  { n: 4, t: "診断・修理作業",         d: "専門スタッフが診断を行い、承諾後に修理作業を開始します。" },
  { n: 5, t: "検品・返送",             d: "修理完了後に動作検品を実施し、元払い宅配便にてお返しします。" },
];

export default function RepairPage() {
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
          <span style={{ fontWeight: 700 }}>修理サービス</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>修理サービス</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          PC・スマートフォン・タブレットの修理を承ります。画面割れ・バッテリー交換・水没対応など、熟練スタッフが迅速・丁寧に対応。<strong>診断・見積もり無料</strong>です。
        </p>

        <SH title="対応修理メニュー" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            <ServiceCard title="スマートフォン画面修理"   body="iPhone・Androidの画面割れ・タッチ不良・液晶にじみを修理します。" />
            <ServiceCard title="バッテリー交換"           body="充電持ちの低下・膨張したバッテリーを純正同等品に交換します。" />
            <ServiceCard title="ノートPC修理"             body="起動不良・キーボード破損・ヒンジ折れ・液晶不良に対応します。" />
            <ServiceCard title="水没・液体浸入対応"       body="水没端末の洗浄・乾燥・基板修復を行います（要診断）。" />
            <ServiceCard title="充電ポート・コネクタ修理" body="USBポートの緩み・破損・認識不良の修理・交換を行います。" />
            <ServiceCard title="カメラ・スピーカー修理"   body="カメラ映り・スピーカー音質の不具合を部品交換で改善します。" />
          </div>
        </PL>

        <SH title="修理料金の目安" />
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.primaryBg }}>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>修理内容</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>料金目安</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: "#007A76", textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>納期目安</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: "iPhone画面修理",       price: "¥6,800〜", days: "最短即日" },
                { item: "Android画面修理",      price: "¥5,800〜", days: "2〜5営業日" },
                { item: "バッテリー交換",        price: "¥4,500〜", days: "最短即日" },
                { item: "ノートPC液晶交換",      price: "¥14,800〜", days: "3〜7営業日" },
                { item: "水没対応（診断含む）",  price: "¥3,300〜", days: "3〜10営業日" },
                { item: "充電ポート交換",        price: "¥4,800〜", days: "2〜5営業日" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #EEF6F6" }}>
                  <td style={{ padding: "10px 14px", color: C.text, fontWeight: 700 }}>{r.item}</td>
                  <td style={{ padding: "10px 14px", color: "#CC2200", fontWeight: 700 }}>{r.price}</td>
                  <td style={{ padding: "10px 14px", color: C.textSub }}>{r.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 14px", fontSize: 12, color: C.textSub, background: "#FFF8E8", borderTop: "1px solid #F0D080" }}>
            ※ 料金は部品・機種によって異なります。正式金額は診断後にご案内します。診断・キャンセル無料。
          </div>
        </div>

        <SH title="修理の流れ" />
        <PL>{STEPS.map((s) => <FlowStep key={s.n} {...s} />)}</PL>

        <SH title="修理前のご注意" />
        <PL>
          <ul style={{ paddingLeft: 18 }}>
            <li>大切なデータは事前にバックアップをお取りください。修理中にデータが消える可能性があります。</li>
            <li>水没端末は乾燥させずに電源を入れないでください。二次被害の原因になります。</li>
            <li>SIMカード・microSDカードは事前に取り出してください。</li>
            <li>改造・非正規修理歴がある端末は修理をお断りする場合があります。</li>
            <li>修理完了後30日間の動作保証付き（物理破損・水没による再故障は対象外）。</li>
          </ul>
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>修理のお問い合わせ</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>診断・見積もり無料。まずはお気軽にご相談ください。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            修理を申し込む →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
