"use client";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

function Article({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, borderLeft: `4px solid ${C.primary}`, paddingLeft: 10, marginBottom: 8 }}>
        第{num}条（{title}）
      </h2>
      <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

export default function TermsPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>利用規約</h1>
        <p style={{ fontSize: 12, color: C.textSub, marginBottom: 20 }}>制定日：2024年4月1日　最終改定：2025年1月15日</p>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, padding: 24 }}>
          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9, marginBottom: 20 }}>
            本利用規約（以下「本規約」）は、AI Across合同会社（以下「当社」）が運営するデジマルショップ（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただくことで、本規約に同意いただいたものとみなします。
          </p>

          <Article num={1} title="適用範囲">
            <p>本規約は、本サービスを通じて行われるすべての商品購入・買取・修理・その他サービスに適用されます。未成年者がご利用になる場合は、法定代理人の同意が必要です。</p>
          </Article>

          <Article num={2} title="会員登録">
            <p>会員登録は、正確な情報を入力し、当社が承認することで完了します。以下の場合、登録を拒否または会員資格を取り消すことがあります。</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>虚偽の情報を入力した場合</li>
              <li>過去に本規約違反で退会させられた場合</li>
              <li>反社会的勢力またはその構成員である場合</li>
            </ul>
          </Article>

          <Article num={3} title="商品の購入">
            <p>商品の売買契約は、当社が注文確認メールを送信した時点で成立します。在庫切れや価格表示の誤りが判明した場合、当社はご注文をキャンセルすることができます。その際はご連絡の上、お支払い済みの金額を全額返金します。</p>
          </Article>

          <Article num={4} title="価格・支払い">
            <p>商品価格はすべて税込み表示です。お支払い方法は当社が定める決済手段に限ります。銀行振込の場合、振込手数料はお客様負担となります。</p>
          </Article>

          <Article num={5} title="商品の状態・保証">
            <p>当社が販売する商品は中古品であり、使用感・細かな傷がある場合があります。状態はランク表示（NEW / S / A / B / C）にて説明しますが、写真や説明文と実物が著しく異なる場合は到着後8日以内にご連絡ください。保証内容は各商品ページをご参照ください。</p>
          </Article>

          <Article num={6} title="禁止事項">
            <p>本サービスの利用にあたり、以下の行為を禁止します。</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>法令または公序良俗に違反する行為</li>
              <li>転売目的での大量購入（当社が判断した場合、注文をキャンセルすることがあります）</li>
              <li>当社システムへの不正アクセス・クローリング</li>
              <li>虚偽の返品・買取申告</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </Article>

          <Article num={7} title="免責事項">
            <p>当社は、本サービスの利用により生じた直接・間接の損害について、当社の故意または重過失による場合を除き、責任を負いません。また、天災・通信障害・第三者の行為による損害についても同様です。</p>
          </Article>

          <Article num={8} title="規約の変更">
            <p>当社は必要に応じて本規約を変更することがあります。重要な変更の場合は、本サービス上での告知またはメールにてお知らせします。変更後に本サービスを利用した場合、変更後の規約に同意したものとみなします。</p>
          </Article>

          <Article num={9} title="準拠法・管轄裁判所">
            <p>本規約は日本法に基づき解釈されます。本サービスに関する紛争は、当社本社所在地を管轄する地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </Article>
        </div>
      </div>
    </div>
  );
}
