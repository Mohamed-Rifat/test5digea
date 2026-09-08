import SiteNavbar from "@/components/layout/SiteNavbar";
import Footer from "@/components/layout/footer/footer";
import { CompareProvider } from "@/context/CompareContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CompareProvider>
      <SiteNavbar />
      {children}
      <Footer />
    </CompareProvider>
  );
}
