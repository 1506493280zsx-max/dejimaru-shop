"use client";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaYoutube, FaLine, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import PaymentMethods from "./PaymentMethods";

// ─── colour tokens ────────────────────────────────────────────────────────────
const FC = {
  deep:    "#0A1A1A",
  dark:    "#112525",
  base:    "#1A3535",
  border:  "#2A4848",
  sub:     "#243E3E",
  textSub: "#7AACAC",
  heading: "#CCEEEE",
  primary: "#0ABAB5",
};

// ─── navigation ───────────────────────────────────────────────────────────────

const NAV = [
  {
    title: "サポート", en: "Support",
    links: [
      { label: "ショッピングガイド",    href: "/guide" },
      { label: "よくある質問（FAQ）",   href: "/faq" },
      { label: "配送について",          href: "/shipping" },
      { label: "お問い合わせ",          href: "/contact" },
    ],
  },
  {
    title: "会社情報", en: "Company",
    links: [
      { label: "AI Acrossについて",  href: "/company" },
      { label: "採用情報",            href: "/careers" },
    ],
  },
  {
    title: "サービス", en: "Services",
    links: [
      { label: "法人様向けソリューション", href: "https://aiacross.com/services/", external: true },
      { label: "PODカスタムサービス",   href: "/pod-service" },
    ],
  },
  {
    title: "法的情報", en: "Legal",
    links: [
      { label: "プライバシーポリシー",        href: "/privacy" },
      { label: "利用規約",                    href: "/terms" },
      { label: "返品・交換ポリシー",          href: "/returns" },
      { label: "特定商取引法に基づく表記",    href: "/tokushoho" },
    ],
  },
];

// ─── social ───────────────────────────────────────────────────────────────────

const SOCIALS = [
  { name: "X",         Icon: FaXTwitter,  href: "https://x.com/AiAcrossshop",                                bg: "#000000" },
  { name: "Facebook",  Icon: FaFacebook,  href: "https://www.facebook.com/profile.php?id=61586262204119",   bg: "#1877F2" },
  { name: "Instagram", Icon: FaInstagram, href: "https://www.instagram.com/aiacrossllc/",                 bg: "#E1306C" },
  { name: "YouTube",   Icon: FaYoutube,   href: "https://www.youtube.com/channel/UCQuNgDZhGp47dKZH9rSK-DQ",bg: "#FF0000" },
  { name: "LINE",      Icon: FaLine,      href: "https://line.me/ti/p/WupEgxNYTQ",                          bg: "#00B900" },
  { name: "WhatsApp",  Icon: FaWhatsapp,  href: "https://wa.me/817092607341",                               bg: "#25D366" },
  { name: "TikTok",    Icon: FaTiktok,    href: "https://www.tiktok.com/@aiacrossshop",                     bg: "#010101" },
];

// ─── component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const router = useRouter();

  return (
    <footer style={{ fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif" }}>
      <style>{`
        .fn-flex{display:flex;flex-wrap:wrap}
        .fn-col{flex:1;min-width:195px;padding-right:16px;margin-bottom:16px}
        .fs-flex{display:flex;gap:10px;flex-wrap:wrap}
        .fi-flex{display:flex;gap:40px;flex-wrap:wrap}
        .fc-wrap{display:flex;gap:32px;flex-wrap:wrap}
        .fc-left{flex:1;min-width:260px}
        .fc-right{flex:0 0 auto;min-width:240px}
        @media(max-width:600px){
          .fn-col{min-width:46%}
          .fi-flex{flex-direction:column;gap:16px}
          .fc-right{width:100%}
        }
        @media(max-width:400px){.fn-col{min-width:100%}}
      `}</style>

      {/* ① Navigation */}
      <div style={{ background: FC.base, padding: "28px 16px 12px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="fn-flex">
            {NAV.map((col) => (
              <div key={col.title} className="fn-col">
                <div style={{ fontSize: 12, fontWeight: 700, color: FC.heading, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${FC.border}` }}>
                  {col.title}&nbsp;
                  <span style={{ fontSize: 9, color: "#5A8A8A", fontWeight: 400 }}>{col.en}</span>
                </div>
                {col.links.map((link: any) => (
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: FC.textSub, cursor: "pointer", marginBottom: 7, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = FC.primary; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = FC.textSub; }}
                    >
                      <span style={{ fontSize: 8, color: "#3A6A6A" }}>›</span>
                      {link.label}
                    </a>
                  ) : (
                    <div
                      key={link.label}
                      onClick={() => router.push(link.href)}
                      style={{ fontSize: 12, color: FC.textSub, cursor: "pointer", marginBottom: 7, display: "flex", alignItems: "center", gap: 4 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = FC.primary; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = FC.textSub; }}
                    >
                      <span style={{ fontSize: 8, color: "#3A6A6A" }}>›</span>
                      {link.label}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ③ Social Media */}
      <div style={{ background: "#162F2F", padding: "18px 16px", borderTop: `1px solid ${FC.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 10, color: FC.textSub, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            SNSでフォローしてください&ensp;/&ensp;FOLLOW US
          </div>
          <div className="fs-flex">
            {SOCIALS.map(({ name, Icon, href, bg }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 10,
                    background: bg, color: "#fff",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 3, cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.12)",
                    transition: "opacity .15s, transform .15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.78"; el.style.transform = "scale(1.06)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.transform = "scale(1)"; }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: 8, lineHeight: 1 }}>{name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ④ Company Information */}
      <div style={{ background: FC.dark, padding: "22px 16px", borderTop: `1px solid ${FC.base}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="fc-wrap">
            <div className="fc-left">
              <div
                style={{ fontSize: 15, fontWeight: 900, color: FC.primary, fontFamily: "Arial Black,sans-serif", marginBottom: 16, cursor: "pointer" }}
                onClick={() => router.push("/corporate")}
              >
                AI Across合同会社
              </div>
              <div className="fi-flex">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: FC.heading, marginBottom: 5 }}>■ 本社</div>
                  <div style={{ fontSize: 11, color: FC.textSub, lineHeight: 1.9 }}>
                    〒306-0052<br />茨城県古河市大山1331-2
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: FC.heading, marginBottom: 5 }}>■ 関東センター</div>
                  <div style={{ fontSize: 11, color: FC.textSub, lineHeight: 1.9 }}>
                    〒336-0026<br />埼玉県さいたま市南区辻8丁目3-5
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: FC.heading, marginBottom: 5 }}>■ 電話番号</div>
                  <div style={{ fontSize: 11, color: FC.textSub, lineHeight: 1.9 }}>
                    050-3091-0226<br />048-816-3967
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: FC.heading, marginBottom: 5 }}>■ メール</div>
                  <div style={{ fontSize: 11, color: FC.textSub }}>info@aiacross.com</div>
                </div>
              </div>
            </div>
            <div className="fc-right">
              <PaymentMethods />
            </div>
          </div>
        </div>
      </div>

      {/* ⑤ Copyright */}
      <div style={{ background: FC.deep, padding: "10px 16px", borderTop: "1px solid #1A2E2E" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#3A6A6A" }}>© 2024 AI Across合同会社. All Rights Reserved.</span>
          <span style={{ fontSize: 10, color: "#3A6A6A" }}>Operated by AI Across ショップ</span>
        </div>
      </div>
    </footer>
  );
}
