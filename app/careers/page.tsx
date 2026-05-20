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
function JobCard({ title, type, location, body }: { title: string; type: string; location: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.primary}`, borderRadius: "0 2px 2px 0", padding: 14, marginBottom: 10, background: C.white }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{title}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "2px 8px", fontSize: 11, color: C.primary, fontWeight: 700 }}>{type}</span>
          <span style={{ background: "#F5F5F5", border: `1px solid ${C.border}`, borderRadius: 2, padding: "2px 8px", fontSize: 11, color: C.textSub }}>{location}</span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{body}</p>
    </div>
  );
}

export default function CareersPage() {
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
          <span style={{ fontWeight: 700 }}>採用情報</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>採用情報</h1>

        <div style={{ background: `linear-gradient(135deg,${C.primaryBg},#C8EEEC)`, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "16px 20px", marginBottom: 8, lineHeight: 1.9, color: C.textSub }}>
          AI Across合同会社では、リユース・中古デジタル機器市場の拡大を共に担う仲間を募集しています。「モノを大切に、循環する社会へ」というビジョンのもと、EC運営・修理技術・法人営業など幅広いポジションで活躍できる環境です。
        </div>

        <SH title="募集職種" />
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: 16 }}>
          <JobCard
            title="ECサイト運営スタッフ"
            type="正社員"
            location="埼玉・リモート可"
            body="商品登録・在庫管理・受注処理・顧客対応を担当します。ECプラットフォーム（Shopify / 楽天 / Yahoo）の運用経験がある方歓迎。"
          />
          <JobCard
            title="PC・スマホ修理技術者"
            type="正社員 / パート"
            location="埼玉センター"
            body="スマートフォン・ノートPCの診断・修理・検品を担当します。修理経験者優遇。未経験でも研修制度あり。"
          />
          <JobCard
            title="法人営業担当"
            type="正社員"
            location="茨城・埼玉・リモート可"
            body="法人・官公庁・教育機関向けの中古PC一括調達提案営業です。既存顧客フォロー中心で飛び込みなし。"
          />
          <JobCard
            title="物流・倉庫スタッフ"
            type="パート・アルバイト"
            location="埼玉センター"
            body="商品の受入・検品・梱包・発送業務です。土日祝出勤できる方優遇。扶養内OK。"
          />
        </div>

        <SH title="会社の魅力" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { t: "成長市場で働く",   d: "中古デジタル機器市場は年率10%以上で拡大中。成長フェーズの事業に参加できます。" },
              { t: "技術が身につく",   d: "修理・EC・物流・法人営業と幅広いスキルを実務で習得できます。" },
              { t: "柔軟な働き方",     d: "リモートワーク・時差出勤・副業OKなど、ライフスタイルに合わせて選べます。" },
            ].map((item, i) => (
              <div key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.t}</div>
                <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </PL>

        <SH title="待遇・福利厚生" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              ["給与",         "月給 20万円〜（経験・能力考慮） / 時給 1,050円〜（パート）"],
              ["昇給",         "年1回（業績・評価による）"],
              ["賞与",         "年2回（業績連動）"],
              ["勤務時間",     "9:00〜18:00（フレックス制あり）"],
              ["休日・休暇",   "完全週休2日制（土日祝）、年次有給休暇、慶弔休暇"],
              ["保険",         "健康保険・厚生年金・雇用保険・労災保険"],
              ["交通費",       "全額支給（上限月3万円）"],
              ["その他",       "PC・スマホ修理技術研修、副業OK、テレワーク手当"],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontWeight: 700, color: C.text, minWidth: 100, padding: "8px 12px", background: C.primaryBg, borderRight: `1px solid ${C.primaryBorder}`, fontSize: 12 }}>{k}</div>
                <div style={{ padding: "8px 12px", color: C.textSub, fontSize: 12 }}>{v}</div>
              </div>
            ))}
          </div>
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>採用エントリー・お問い合わせ</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>履歴書（PDF）を添付のうえ、お問い合わせフォームよりご連絡ください。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            エントリーする →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
