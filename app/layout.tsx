import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "AI Across ショップ | 中古PC・スマホの専門店",
  description: "中古PC・スマホならAI Across ショップ！全商品30日間動作保証付き。AI Across合同会社が運営する中古デバイス専門店。",
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
