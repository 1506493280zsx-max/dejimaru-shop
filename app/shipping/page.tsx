"use client";
import { useRouter } from "next/navigation";

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
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "12px 0 0", padding: "10px 14px", background: "#FFF8E8", border: "1px solid #F0D080", borderRadius: 2, fontSize: 12, lineHeight: 1.8 }}>
      {children}
    </p>
  );
}

const FEES = [
  { region: "本州・四国・九州", standard: "¥880（税込）", over: "¥10,000以上で送料無料" },
  { region: "北海道",           standard: "¥1,430（税込）", over: "¥10,000以上で送料無料" },
  { region: "沖縄・離島",       standard: "¥1,980（税込）", over: "¥15,000以上で送料無料" },
];

const TIMES = [
  "午前中（～12:00）",
  "14:00 ～ 16:00",
  "16:00 ～ 18:00",
  "18:00 ～ 20:00",
  "19:00 ～ 21:00",
];

const FAQ = [
  {
    q: "注文確定後に配送先を変更できますか？",
    a: "発送前であれば変更可能です。お早めにお問い合わせフォームよりご連絡ください。発送完了後の住所変更は承れません。",
  },
  {
    q: "複数の商品をまとめて注文した場合、同梱されますか？",
    a: "原則として同梱発送いたします。ただし、商品サイズや在庫状況により分割発送となる場合があります。その場合も送料は1回分のみとなります。",
  },
  {
    q: "配送状況はどこで確認できますか？",
    a: "発送完了メールに記載の問い合わせ番号を使って、ヤマト運輸の公式サイト（クロネコヤマト）またはゆうパックの追跡サービスよりご確認いただけます。",
  },
  {
    q: "不在で受け取れなかった場合はどうなりますか？",
    a: "不在票が投函されます。配送業者へ直接ご連絡いただくか、送付されたSMSまたはメールの再配達URLよりお手続きください。一定期間内に受け取りがない場合、商品は返送されます。",
  },
  {
    q: "離島・山間部への配送はできますか？",
    a: "一部の離島・山間部地域では配送が困難な場合があります。その際はご注文確認後にご連絡いたします。",
  },
];

export default function ShippingPage() {
  const router = useRouter();
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif", fontSize: 13, color: C.text }}>

      <div style={{ width: "100%", maxWidth: "1800px", margin: "0 auto", padding: "0 12px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>配送について</h1>
        <p style={{ lineHeight: 1.9, color: C.textSub, marginBottom: 4 }}>
          デジマルショップでは、ヤマト運輸（クロネコヤマト）・日本郵便（ゆうパック）にて全国発送に対応しております。
          安全・確実にお届けできるよう、梱包・出荷に万全を期しております。
        </p>

        <SH title="配送業者" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {[
              { name: "ヤマト運輸（クロネコヤマト）", note: "主力配送業者。宅急便コンパクト対応。追跡・時間指定・再配達が可能です。" },
              { name: "日本郵便（ゆうパック）",         note: "一部商品・地域で利用。追跡番号発行。郵便局への持ち込み受け取りも可能です。" },
            ].map(({ name, note }) => (
              <div key={name} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 4, fontSize: 13 }}>{name}</div>
                <p style={{ margin: 0, fontSize: 12 }}>{note}</p>
              </div>
            ))}
          </div>
          <InfoBox>※ 商品サイズ・重量・在庫拠点により配送業者が異なる場合があります。ご指定はお受けできません。</InfoBox>
        </PL>

        <SH title="送料" />
        <PL>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.primaryBg }}>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>お届け地域</th>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>通常送料</th>
                <th style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 700, color: C.text }}>送料無料条件</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map(({ region, standard, over }, i) => (
                <tr key={region} style={{ background: i % 2 === 0 ? C.white : "#F8FAFA" }}>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}` }}>{region}</td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}`, fontWeight: 700, color: C.primary }}>{standard}</td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${C.border}` }}>{over}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <InfoBox>※ 代金引換をご利用の場合、別途手数料 ¥330（税込）が加算されます。</InfoBox>
        </PL>

        <SH title="お届けまでの目安" />
        <PL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[
              { label: "在庫あり商品",   days: "1～3営業日",  note: "平日12時までのご注文は当日発送" },
              { label: "取り寄せ商品",   days: "3～7営業日",  note: "商品ページに別途納期を記載" },
              { label: "カスタム・修理", days: "5～14営業日", note: "内容により異なります" },
            ].map(({ label, days, note }) => (
              <div key={label} style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, background: C.white, padding: 12, borderRadius: "0 0 2px 2px" }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.primary, lineHeight: 1.4 }}>{days}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>{note}</div>
              </div>
            ))}
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li>土曜・日曜・祝日・年末年始・お盆期間中は発送業務をお休みしております。</li>
            <li>天候・災害・交通事情等により配達が遅れる場合があります。</li>
            <li>複数商品のご注文で在庫状況が異なる場合は、揃い次第まとめて発送いたします。</li>
          </ul>
        </PL>

        <SH title="配達時間帯指定" />
        <PL>
          <p style={{ margin: "0 0 10px" }}>ご注文時に以下の時間帯をご指定いただけます。</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {TIMES.map((t) => (
              <span key={t} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: "6px 14px", fontWeight: 700, color: C.text, fontSize: 12 }}>{t}</span>
            ))}
          </div>
          <InfoBox>※ 時間帯指定はご注文確定後の変更はお受けできません。また、交通状況等により指定時間内にお届けできない場合があります。</InfoBox>
        </PL>

        <SH title="配送に関する注意事項" />
        <PL>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li>ご不在の場合は不在票が投函されます。配送業者へ直接ご連絡いただくか、SMS・メールの案内より再配達のお手続きをお願いします。</li>
            <li>長期不在・受け取り拒否により商品が返送された場合、往復の送料・手数料はお客様負担となります。</li>
            <li>商品到着後、外箱に破損がある場合は開封前に配送業者へ申告し、弊社までご連絡ください。</li>
            <li>マンション・アパートへの配送は指定の場所（宅配ボックス・管理室等）への投函をご希望の方はお問い合わせください。</li>
            <li>発送完了後の配送先変更・転送はお受けできません。</li>
          </ul>
        </PL>

        <SH title="よくあるご質問（配送）" />
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
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>配送に関するお問い合わせ</h3>
            <span style={{ fontSize: 12, color: C.textSub }}>配送状況・お届け予定など、お気軽にご連絡ください。</span>
          </div>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            お問い合わせ →
          </button>
        </div>
      </div>
    </div>
  );
}
