"use client";
import { useRouter } from "next/navigation";

const C = {
  primary: "#0ABAB5",
  red: "#CC2200",
  text: "#1A1A2E",
  textSub: "#555",
  border: "#E0E0E0",
  white: "#FFFFFF",
  bg: "#F5F5F5",
};

export default function MicrosoftMailPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Meiryo, sans-serif", color: C.text }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>

        {/* ヘッダー */}
        <div style={{ background: "#FFF0F0", border: "2px solid #E0B0B0", borderRadius: 8, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.red, marginBottom: 8 }}>
            ⚠️ 【重要】Microsoftメール（Hotmail・Outlook・Live等）をご利用のお客様へ
          </div>
          <p style={{ fontSize: 14, color: "#7A0000", margin: 0, lineHeight: 1.8 }}>
            Microsoftのメールサービスをご利用のお客様は、当店からのメールが届かない場合がございます。
            ご注文確認メール・発送通知メールなどの重要なご連絡が受け取れない可能性がありますので、
            以下をご確認ください。
          </p>
        </div>

        {/* 影響するサービス */}
        <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>
            📧 対象となるメールサービス
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
            {["Hotmail（@hotmail.com）", "Outlook（@outlook.com）", "Live（@live.com）", "Live（@live.jp）", "MSN（@msn.com）"].map(service => (
              <div key={service} style={{ background: "#FFF0F0", border: "1px solid #E0B0B0", borderRadius: 4, padding: "6px 14px", fontSize: 13, color: C.red, fontWeight: 700 }}>
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* 原因 */}
        <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>
            ❓ なぜメールが届かないのか
          </h2>
          <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8, margin: 0 }}>
            Microsoftのメールサービスは独自の迷惑メールフィルターを使用しており、
            ショッピングサイトからの自動送信メール（注文確認・発送通知など）を
            迷惑メールと判定してブロックする場合があります。<br /><br />
            当店では正規のメール送信サービスを使用しておりますが、
            Microsoftのフィルターにより受信できないケースがございます。
          </p>
        </div>

        {/* 対処法 */}
        <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${C.primary}` }}>
            ✅ 対処方法
          </h2>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, marginBottom: 10 }}>方法1：迷惑メールフォルダをご確認ください</div>
            <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8, margin: 0 }}>
              当店からのメールが「迷惑メール」フォルダに振り分けられている可能性があります。
              まずは迷惑メールフォルダをご確認ください。
              メールが見つかった場合は「迷惑メールではない」をクリックしてください。
            </p>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, marginBottom: 10 }}>方法2：差出人を安全なリストに追加する</div>
            <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8, marginBottom: 12 }}>
              以下のメールアドレスを「安全な差出人のリスト」に追加してください。
            </p>
            <div style={{ background: "#E8F8F8", border: `1px solid ${C.primary}`, borderRadius: 4, padding: "10px 16px", fontSize: 14, fontWeight: 700, color: C.primary, display: "inline-block" }}>
              noreply@aiacrossshop.co.jp
            </div>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 12, lineHeight: 1.8 }}>
              <strong>設定手順（Outlook.com の場合）：</strong><br />
              1. Outlook.comにログイン<br />
              2. 右上の「設定（歯車アイコン）」→「すべての Outlook の設定を表示」<br />
              3. 「メール」→「迷惑メール」→「安全な差出人とドメイン」<br />
              4. 上記メールアドレスを追加して保存
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, marginBottom: 10 }}>方法3：別のメールアドレスをご利用ください</div>
            <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8, margin: 0 }}>
              上記の方法でも解決しない場合は、GmailやYahoo!メールなど
              他のメールサービスでのご登録をお勧めします。
            </p>
          </div>
        </div>

        {/* メールが届かない場合 */}
        <div style={{ background: "#FFFBF0", borderRadius: 8, border: "1px solid #FFE082", padding: "24px", marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#7A5000", marginBottom: 12 }}>
            📞 それでもメールが届かない場合
          </h2>
          <p style={{ fontSize: 14, color: "#7A5000", lineHeight: 1.8, margin: "0 0 16px 0" }}>
            上記の方法を試してもメールが届かない場合は、お手数ですがお問い合わせフォームよりご連絡ください。
            注文番号をお知らせいただければ、注文状況をご確認いたします。
          </p>
          <button
            onClick={() => router.push("/contact")}
            style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            お問い合わせはこちら →
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => router.push("/")}
            style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 32px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: C.textSub }}
          >
            ← トップページに戻る
          </button>
        </div>

      </div>
    </div>
  );
}
