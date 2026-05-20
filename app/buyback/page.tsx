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
function ReasonCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, padding: 12, borderRadius: "0 0 2px 2px" }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{body}</p>
    </div>
  );
}

const ITEMS = [
  "ノートパソコン（Windows / Mac）",
  "デスクトップPC",
  "スマートフォン（iPhone / Android）",
  "タブレット（iPad / Android）",
  "ゲーム機",
  "周辺機器・その他",
];

const STEPS = [
  { n: 1, t: "無料査定のお申込み", d: "お問い合わせフォームにて機種名・型番・状態・付属品をご連絡ください。" },
  { n: 2, t: "仮査定額のご提示",   d: "お申込みから最短当日、メールにて仮査定額をお知らせします。" },
  { n: 3, t: "商品の発送",         d: "ご承諾後、着払いにて商品をお送りください。梱包材はご用意できます。" },
  { n: 4, t: "実物確認・本査定",   d: "商品到着後2営業日以内に実物を確認し、正式な買取金額を確定します。" },
  { n: 5, t: "ご入金",             d: "金額にご承諾いただき次第、最短3営業日以内に指定口座へ振込します。" },
];

export default function BuybackPage() {
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
          <span style={{ fontWeight: 700 }}>買取サービス</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "20px auto", padding: "0 10px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>買取サービス</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          使わなくなったPC・スマートフォン・タブレットを高価買取いたします。個人・法人どちらも歓迎。全国郵送対応、<strong>査定・キャンセルはすべて無料</strong>です。
        </p>

        <SH title="買取対象品目" />
        <PL>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ITEMS.map((label, i) => (
              <span key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "6px 14px", fontWeight: 700, color: C.text, fontSize: 12 }}>{label}</span>
            ))}
          </div>
          <p style={{ margin: "12px 0 0", padding: "8px 12px", background: "#FFF8E8", border: "1px solid #F0D080", borderRadius: 2, fontSize: 12 }}>
            ※ 水没・重度破損品・改造品・SIMロック解除不可端末は買取不可の場合があります。
          </p>
        </PL>

        <SH title="選ばれる3つの理由" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <ReasonCard title="相場を上回る高価買取"  body="独自の流通ネットワークにより、市場相場を上回る買取価格をご提示できます。" />
            <ReasonCard title="全国対応・着払い発送"  body="郵送での買取に対応。着払いで発送いただくため、お客様の送料負担はありません。" />
            <ReasonCard title="最短3営業日でご入金"   body="査定完了・ご承諾後、最短3営業日以内に指定口座へ振込対応します。" />
          </div>
        </PL>

        <SH title="買取の流れ" />
        <PL>{STEPS.map((s) => <FlowStep key={s.n} {...s} />)}</PL>

        <SH title="お送りいただく前の確認事項" />
        <PL>
          <ul style={{ paddingLeft: 18 }}>
            <li>スマートフォン・タブレットはパスコード・Apple ID・Googleアカウントを必ず解除してください。</li>
            <li>SIMカード・microSDカードはあらかじめ取り出してください（紛失の責任は負いかねます）。</li>
            <li>個人データはご自身で消去をお願いします。残っていた場合は当社で安全に消去します。</li>
            <li>付属品（充電器・ケーブル・元箱等）が揃っていると査定額が上がる場合があります。</li>
            <li>古物営業法に基づき、本人確認書類のご提出をお願いする場合があります。</li>
          </ul>
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>無料査定のお申込み</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>まずはお気軽にご連絡ください。査定・キャンセル無料です。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            無料査定を申し込む →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
