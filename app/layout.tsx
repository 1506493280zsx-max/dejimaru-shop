import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: {
    default: "AI Across ショップ | 中古PC・スマホ・タブレットの専門店",
    template: "%s | AI Across ショップ",
  },
  description: "中古PC・スマートフォン・タブレットならAI Across ショップ！全商品30日間動作保証・送料無料。法人・学校・官公庁のご注文も対応。最安値保証で安心購入。",
  keywords: ["中古PC", "中古パソコン", "中古スマホ", "中古タブレット", "格安PC", "リファービッシュ", "中古Mac", "中古iPhone", "法人PC", "AI Across"],
  authors: [{ name: "AI Across合同会社", url: "https://aiacrossshop.co.jp" }],
  creator: "AI Across合同会社",
  publisher: "AI Across合同会社",
  metadataBase: new URL("https://aiacrossshop.co.jp"),
  alternates: {
    canonical: "https://aiacrossshop.co.jp",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://aiacrossshop.co.jp",
    siteName: "AI Across ショップ",
    title: "AI Across ショップ | 中古PC・スマホの専門店",
    description: "中古PC・スマートフォン・タブレットならAI Across ショップ！全商品30日間動作保証・送料無料。",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AI Across ショップ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Across ショップ | 中古PC・スマホの専門店",
    description: "中古PC・スマートフォン・タブレットならAI Across ショップ！全商品30日間動作保証・送料無料。",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: "'Meiryo','ＭＳ Ｐゴシック','Hiragino Kaku Gothic ProN',sans-serif" }}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
