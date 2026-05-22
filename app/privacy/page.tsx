"use client";
import { useRouter } from "next/navigation";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490",
  primaryBg:"#E8F8F8", primaryBorder:"#B0E0DE",
  text:"#333", textSub:"#666", textLight:"#999",
  border:"#DDD", bg:"#F0F5F5", white:"#FFF",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, borderLeft: `4px solid ${C.primary}`, paddingLeft: 10, marginBottom: 8 }}>{title}</h2>
      <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>プライバシーポリシー</h1>
        <p style={{ fontSize: 12, color: C.textSub, marginBottom: 20 }}>制定日：2024年4月1日　最終改定：2025年1月15日</p>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, padding: 24 }}>
          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9, marginBottom: 20 }}>
            AI Across合同会社（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、個人情報の保護に関する法律（個人情報保護法）およびその他の関連法令を遵守し、以下のプライバシーポリシーを定めます。
          </p>

          <Section title="第1条（取得する個人情報）">
            <p>当社は、以下の個人情報を取得することがあります。</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>氏名・住所・電話番号・メールアドレス等の連絡先情報</li>
              <li>購入履歴・問い合わせ内容等の取引情報</li>
              <li>クレジットカード番号等の支払い情報（決済代行事業者経由で処理）</li>
              <li>IPアドレス・Cookieによるアクセスログ情報</li>
              <li>買取・修理依頼時に提供いただく機器の情報</li>
            </ul>
          </Section>

          <Section title="第2条（利用目的）">
            <p>取得した個人情報は、以下の目的に利用します。</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>商品の販売・発送・代金決済に関する業務処理</li>
              <li>買取・修理サービスの提供および連絡</li>
              <li>お問い合わせへの対応・アフターサービスの提供</li>
              <li>新商品・キャンペーン情報の案内（同意を得た場合）</li>
              <li>サービスの改善・新機能の開発のための統計的分析</li>
              <li>不正アクセス・不正利用の防止</li>
            </ul>
          </Section>

          <Section title="第3条（第三者提供）">
            <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>お客様の事前の同意がある場合</li>
              <li>法令に基づき開示が必要な場合</li>
              <li>人命・財産の保護のために緊急に必要な場合</li>
              <li>業務委託先（配送業者・決済代行業者等）への必要最小限の提供</li>
            </ul>
          </Section>

          <Section title="第4条（安全管理措置）">
            <p>当社は、個人情報の漏えい・滅失・毀損を防ぐため、適切な技術的・組織的安全管理措置を講じます。SSL/TLS暗号化通信の採用、アクセス権限の制限、定期的な従業員教育を実施しています。</p>
          </Section>

          <Section title="第5条（Cookieの利用）">
            <p>当社のウェブサイトでは、利便性の向上およびアクセス解析のためにCookieを使用しています。お使いのブラウザの設定でCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。</p>
          </Section>

          <Section title="第6条（個人情報の開示・訂正・削除）">
            <p>お客様は、当社が保有するご自身の個人情報について開示・訂正・削除・利用停止を求める権利を有します。ご希望の場合は、本人確認書類とともに下記連絡先までお申し付けください。</p>
          </Section>

          <Section title="第7条（お問い合わせ先）">
            <p>個人情報の取扱いに関するお問い合わせ・苦情・ご相談は下記までお願いします。</p>
            <div style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12, marginTop: 8 }}>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>AI Across合同会社　個人情報保護担当</div>
              <div>メール：info@aiacross.com</div>
              <div>電話：050-3091-0226（平日10:00〜18:00）</div>
              <div>住所：〒306-0052　茨城県古河市大山1331-2</div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
