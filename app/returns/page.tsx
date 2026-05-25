"use client";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
  warnBg: "#FFF8E8", warnBorder: "#F0D080",
  errBg: "#FFF0F0", errBorder: "#F0B0B0",
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

const RETURN_OK = [
  "商品到着後7日以内にご連絡いただいた場合",
  "初期不良・動作不良が確認された場合",
  "商品説明と著しく異なる状態であった場合（傷・欠品等の記載漏れ）",
  "配送中の破損が確認された場合（配送業者への申告と当社への連絡が必要）",
];

const RETURN_NG = [
  "お客様のご都合による返品・交換（イメージと違う・不要になった等）",
  "商品到着後8日以上が経過した場合",
  "お客様による使用・操作ミス・改造・分解が原因の故障や損傷",
  "付属品（充電器・ケーブル・マニュアル等）の欠品・紛失",
  "商品説明に明記されていた傷・汚れ・動作状態に関するご申告",
  "ソフトウェアのダウンロード購入・ライセンスキーの開封済み商品",
];

const STEPS = [
  { n: 1, t: "ご連絡",       d: "商品到着後7日以内に、注文番号・お名前・返品理由・状況の写真を添えてお問い合わせフォームよりご連絡ください。" },
  { n: 2, t: "確認・承認",   d: "内容を確認の上、1〜2営業日以内に対応可否および返送先住所をメールにてご案内します。" },
  { n: 3, t: "商品の返送",   d: "当社指定の方法で商品を返送してください。初期不良・当社起因の場合は着払い対応。お客様都合の場合は元払いとなります。" },
  { n: 4, t: "検品・確認",   d: "商品到着後2営業日以内に状態を確認します。状況によっては修理対応のご提案をする場合があります。" },
  { n: 5, t: "返金・交換",   d: "確認完了後、交換品の発送またはご返金（元の決済方法）を最短3〜5営業日以内に実施します。" },
];

const FAQ = [
  {
    q: "初期不良の基準はどのようなものですか？",
    a: "電源が入らない・起動しない・画面が映らない・ボタンが機能しない等、通常使用において生じる明らかな動作不良を初期不良とみなします。お客様の操作・設定に起因するものは含まれません。",
  },
  {
    q: "返品・交換の送料は誰が負担しますか？",
    a: "初期不良・商品説明との相違など当社起因の場合は当社が負担します（着払い対応）。お客様都合の場合は元払いにてご返送いただき、返送送料はお客様負担となります。",
  },
  {
    q: "返金はいつ頃になりますか？",
    a: "商品の到着・検品確認後、最短3〜5営業日以内に元の決済方法で返金処理を行います。クレジットカードの場合はカード会社の処理タイミングにより、実際の反映まで1〜2ヶ月かかる場合があります。",
  },
  {
    q: "交換品の在庫がない場合はどうなりますか？",
    a: "同等スペックの代替品をご提案するか、全額返金の対応となります。ご希望をお伺いした上で対応方針を決定します。",
  },
  {
    q: "中古品の細かな傷や汚れも返品対象になりますか？",
    a: "商品ページに記載済みの傷・汚れ・使用感については返品対象外です。商品説明に記載のない著しい損傷や欠品については対応いたします。購入前に商品状態の欄を必ずご確認ください。",
  },
];

export default function ReturnsPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>返品・交換ポリシー</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          AI Across ショップでは、お客様に安心してお買い物いただけるよう、初期不良および商品説明と著しく異なる場合の返品・交換に対応しています。
          中古品の特性上、商品ページに記載の状態をご確認の上、ご購入いただきますようお願いいたします。
        </p>
        <p style={{ padding: "10px 14px", background: C.warnBg, border: `1px solid ${C.warnBorder}`, borderRadius: 2, fontSize: 12, lineHeight: 1.8 }}>
          <strong>重要：</strong>返品・交換のご連絡は<strong>商品到着後7日以内</strong>に必ずお願いします。期間を過ぎた場合はご対応が困難となります。
        </p>

        <SH title="返品・交換をお受けする場合" />
        <PL>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {RETURN_OK.map((item, i) => (
              <li key={i} style={{ marginBottom: i < RETURN_OK.length - 1 ? 6 : 0, color: C.text }}>{item}</li>
            ))}
          </ul>
        </PL>

        <SH title="返品・交換をお受けできない場合" />
        <PL>
          <div style={{ background: C.errBg, border: `1px solid ${C.errBorder}`, borderRadius: 2, padding: "10px 14px", marginBottom: 10, fontSize: 12, lineHeight: 1.7 }}>
            当店は中古品専門店のため、商品ページに記載の状態・付属品・動作確認内容を事前にご確認の上ご購入ください。
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {RETURN_NG.map((item, i) => (
              <li key={i} style={{ marginBottom: i < RETURN_NG.length - 1 ? 6 : 0 }}>{item}</li>
            ))}
          </ul>
        </PL>

        <SH title="返品・交換の手順" />
        <PL>
          {STEPS.map(({ n, t, d }, i) => (
            <div key={n} style={{ display: "flex", gap: 14, borderBottom: i < STEPS.length - 1 ? `1px solid ${C.border}` : "none", paddingBottom: i < STEPS.length - 1 ? 14 : 0, marginBottom: i < STEPS.length - 1 ? 14 : 0, alignItems: "flex-start" }}>
              <div style={{ background: C.primary, color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 3 }}>{t}</div>
                <div>{d}</div>
              </div>
            </div>
          ))}
        </PL>

        <SH title="返金について" />
        <PL>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.primaryBg }}>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>決済方法</th>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>返金方法</th>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>目安期間</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["クレジットカード", "カード会社経由でのキャンセル処理", "カード会社の締め日により1〜2ヶ月程度"],
                ["銀行振込",         "ご指定口座への振込返金",           "確認完了後3〜5営業日以内"],
                ["コンビニ決済",     "ご指定口座への振込返金",           "確認完了後3〜5営業日以内"],
                ["PayPay",           "PayPay残高への返金",               "確認完了後3〜5営業日以内"],
                ["その他電子決済",   "各サービスのポリシーに準拠",       "3〜10営業日程度"],
              ].map(([method, how, period], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.white : "#F8FAFA" }}>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}`, fontWeight: 700, color: C.text }}>{method}</td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}` }}>{how}</td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}`, color: C.primary, fontWeight: 700 }}>{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ margin: "10px 0 0", padding: "8px 12px", background: C.warnBg, border: `1px solid ${C.warnBorder}`, borderRadius: 2, fontSize: 12 }}>
            ※ 返金処理の完了後、実際の口座反映やポイント付与はご利用の金融機関・サービスの処理タイミングに依存します。
          </p>
        </PL>

        <SH title="よくあるご質問（返品・交換）" />
        <PL>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.border}` : "none", paddingBottom: i < FAQ.length - 1 ? 12 : 0, marginBottom: i < FAQ.length - 1 ? 12 : 0 }}>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 4, display: "flex", gap: 8 }}>
                <span style={{ color: C.primary, flexShrink: 0 }}>Q.</span>{q}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: C.primaryDark, fontWeight: 700, flexShrink: 0 }}>A.</span>{a}
              </div>
            </div>
          ))}
        </PL>

        <div style={{ marginTop: 28, background: C.white, border: `1px solid ${C.primaryBorder}`, borderLeft: `4px solid ${C.primary}`, padding: 16, borderRadius: "0 2px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>返品・交換のお問い合わせ</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>注文番号・商品状況の写真を添えてご連絡ください。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            返品・交換を申請する →
          </button>
        </div>
      </div>
    </div>
  );
}
