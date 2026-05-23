import Header from "@/app/components/Header";
import Footer from "@/components/Footer";
import CorporateQuoteLauncher from "@/components/CorporateQuoteLauncher";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CorporateQuoteLauncher />
    </>
  );
}
