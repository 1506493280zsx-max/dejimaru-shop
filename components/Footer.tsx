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
      { label: "法人様向けソリューション", href: "/services" },
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
        .ft-main{display:flex;gap:40px;max-width:1200px;margin:0 auto}
        .ft-left{flex:0 0 260px}
        .ft-right{flex:1;min-width:0}
        .ft-nav{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .ft-social{display:flex;gap:8px;flex-wrap:wrap}
        .ft-pay{max-width:1200px;margin:0 auto}
        .ft-copy{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;align-items:center}
        @media(max-width:768px){
          .ft-main{flex-direction:column;gap:24px}
          .ft-left{flex:1 1 auto}
          .ft-nav{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:400px){.ft-nav{grid-template-columns:1fr}}
      `}</style>

      {/* ① メインエリア（左右2カラム） */}
      <div style={{ background: FC.base, padding: "32px 24px" }}>
        <div className="ft-main">

          {/* 左カラム */}
          <div className="ft-left">
            <div
              onClick={() => router.push("/corporate")}
              style={{ fontSize: 18, fontWeight: 900, color: FC.primary, fontFamily: "Arial Black,sans-serif", cursor: "pointer", marginBottom: 12 }}
            >
              AI Across合同会社
            </div>

            <div style={{ fontSize: 12, color: FC.textSub, lineHeight: 1.7, marginBottom: 16 }}>
              中古PC・スマホ・タブレットの専門店。全商品30日保証・送料無料。
            </div>

            <div style={{ fontSize: 11, color: FC.textSub, lineHeight: 1.9, marginBottom: 16 }}>
              本社：〒306-0052 茨城県古河市大山1331-2<br />
              関東：〒336-0026 埼玉県さいたま市南区辻8丁目3-5<br />
              TEL：050-3091-0226 / info@aiacross.com
            </div>

            <div className="ft-social">
              {SOCIALS.map(({ name, Icon, href, bg }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: bg, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.12)",
                      transition: "opacity .15s, transform .15s",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.78"; el.style.transform = "scale(1.06)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.transform = "scale(1)"; }}
                  >
                    <Icon size={18} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 右カラム（NAV 4列グリッド） */}
          <div className="ft-right">
            <div className="ft-nav">
              {NAV.map((col) => (
                <div key={col.title}>
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
      </div>

      {/* ② 支払方法エリア（全幅・独立区块） */}
      <div style={{ background: FC.dark, padding: 16, borderTop: `1px solid ${FC.border}` }}>
        <div className="ft-pay">
          <div style={{ fontSize: 10, color: FC.textSub, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            安心のお支払い方法&ensp;/&ensp;PAYMENT METHODS
          </div>
          <PaymentMethods />
        </div>
      </div>

      {/* ③ Copyright */}
      <div style={{ background: FC.deep, padding: "10px 16px", borderTop: "1px solid #1A2E2E" }}>
        <div className="ft-copy">
          <span style={{ fontSize: 10, color: "#3A6A6A" }}>© 2024 AI Across合同会社. All Rights Reserved.</span>
          <span style={{ fontSize: 10, color: "#3A6A6A" }}>Operated by AI Across ショップ</span>
        </div>
      </div>
    </footer>
  );
}
