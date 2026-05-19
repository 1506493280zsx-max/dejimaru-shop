"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import FlowStep from "@/components/FlowStep";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryDeep:"#007A76",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF", red:"#CC2200",
};

function SectionHead({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 14, fontWeight: 700, borderRadius: "2px 2px 0 0", display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
      <span>{icon}</span>{title}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: 16, lineHeight: 1.9, fontSize: 13, color: C.textSub }}>
      {children}
    </div>
  );
}

const PLANS = [
  { label: "スモールプラン",  qty: "10〜29台",  disc: "定価より最大5%OFF",  note: "納品書・見積書発行" },
  { label: "スタンダード",    qty: "30〜99台",  disc: "定価より最大10%OFF", note: "専任担当者配置" },
  { label: "エンタープライズ", qty: "100台以上", disc: "個別見積対応",        note: "キッティング・保守含む" },
];

export default function WholesalePage() {
  const router = useRouter();

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      {/* Header */}
      <div style={{ background: C.white, borderBottom: `2px solid ${C.primary}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, letterSpacing: "-1px", fontFamily: "Arial Black,sans-serif" }}>デジマルショップ</div>
          <div style={{ fontSize: 9, color: C.textLight }}>中古PC・スマホならデジマルショップ！</div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: C.primary, borderBottom: `2px solid ${C.primaryDark}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "7px 10px", fontSize: 11, color: "#fff", display: "flex", gap: 6 }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>ホーム</span>
          <span>›</span>
          <span style={{ fontWeight: 700 }}>法人・卸販売</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>
          🏢 法人・卸販売サービス
        </h1>

        {/* Lead */}
        <div style={{ background: `linear-gradient(135deg,${C.primaryBg},#C8EEEC)`, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "14px 18px", marginBottom: 8, fontSize: 13, color: C.textSub, lineHeight: 1.9 }}>
          デジマルショップでは、法人・教育機関・官公庁向けに中古PC・スマートフォン・タブレット等の一括調達サービスを提供しております。
          10台以上のまとめ買いから、キッティングや保守サポートまで、専任担当者がワンストップで対応いたします。
        </div>

        {/* Target */}
        <SectionHead icon="🎯" title="こんな方におすすめ" />
        <Panel>
          <ul style={{ paddingLeft: 18 }}>
            <li>社員増員・新拠点開設でPCを一括調達したい企業様</li>
            <li>生徒・学生向けに端末を整備したい学校・教育機関様</li>
            <li>自治体・官公庁でコスト削減を検討されている担当者様</li>
            <li>中古端末の再販・リユース事業を展開するリセラー様</li>
            <li>ITインフラの一括更新を低コストで実現したいIT部門様</li>
          </ul>
        </Panel>

        {/* Volume pricing */}
        <SectionHead icon="💰" title="ボリューム価格プラン" />
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.primaryBg }}>
                <th style={{ padding: "10px 14px", fontSize: 12, color: C.primaryDeep, textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>プラン</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: C.primaryDeep, textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>台数目安</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: C.primaryDeep, textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>割引</th>
                <th style={{ padding: "10px 14px", fontSize: 12, color: C.primaryDeep, textAlign: "left", borderBottom: `1px solid ${C.primaryBorder}` }}>特典</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #EEF6F6` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: C.primary }}>{p.label}</td>
                  <td style={{ padding: "10px 14px", color: C.textSub }}>{p.qty}</td>
                  <td style={{ padding: "10px 14px", color: C.red, fontWeight: 700 }}>{p.disc}</td>
                  <td style={{ padding: "10px 14px", color: C.textSub }}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Services */}
        <SectionHead icon="🛠️" title="法人向けオプションサービス" />
        <Panel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "💻", t: "PCキッティング", d: "OS設定・ソフトウェアインストール・ドメイン参加を一括代行します。" },
              { icon: "🏷️", t: "資産管理ラベル貼付", d: "管理番号・バーコードラベルの貼付、台帳作成に対応します。" },
              { icon: "📦", t: "個別梱包・ナンバリング", d: "部門別・社員別に個別梱包し、ナンバリング管理が可能です。" },
              { icon: "🔒", t: "データ消去証明", d: "国際規格準拠のデータ消去を実施し、消去証明書を発行します。" },
              { icon: "🚚", t: "指定日・複数拠点配送", d: "複数の事業所・支店への分散納品にも対応しています。" },
              { icon: "🛡️", t: "延長保証オプション",  d: "標準30日保証に加え、最長1年の延長保証プランをご用意しています。" },
            ].map((item, i) => (
              <div key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>{item.t}
                </div>
                <div style={{ fontSize: 12, color: C.textSub }}>{item.d}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Flow */}
        <SectionHead icon="📋" title="ご利用の流れ" />
        <Panel>
          {[
            { n: 1, t: "お問い合わせ・ヒアリング", d: "必要台数・機種・スペック・納期のご要望をお聞かせください。" },
            { n: 2, t: "お見積もりのご提出",       d: "専任担当者より見積書をメールにてお送りします（最短当日）。" },
            { n: 3, t: "ご発注・契約締結",         d: "発注書または当社所定の注文書にてご発注ください。" },
            { n: 4, t: "商品準備・キッティング",   d: "ご指定のキッティング内容を施工後、検品いたします。" },
            { n: 5, t: "納品・検収",               d: "指定日・指定拠点へ納品。検収完了後に請求書を発行します。" },
          ].map((s) => <FlowStep key={s.n} {...s} />)}
        </Panel>

        {/* CTA */}
        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>法人・卸販売のお問い合わせ</div>
            <div style={{ fontSize: 12, color: C.textSub }}>まずはお気軽にご相談ください。専任担当者が丁寧にご対応いたします。</div>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            お問い合わせはこちら →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
