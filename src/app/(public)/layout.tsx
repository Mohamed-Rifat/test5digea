import SiteNavbar from "@/components/layout/SiteNavbar";
import Footer from "@/components/layout/footer/footer";
import QuickDial from "@/components/shared/QuickDial";
import { CompareProvider } from "@/context/CompareContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CompareProvider>
      <SiteNavbar />
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <Footer />
      <QuickDial />
    </CompareProvider>
  );
}
