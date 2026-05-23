import Header from "@/app/components/Header";
import Footer from "@/components/Footer";
import CorporateQuoteLauncher from "@/components/CorporateQuoteLauncher";
import { CorporateQuoteProvider } from "@/components/CorporateQuoteContext";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CorporateQuoteProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <CorporateQuoteLauncher />
    </CorporateQuoteProvider>
  );
}
