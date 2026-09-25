import Footer from "@/components/layout/footer/footer";
import SiteNavbar from "@/components/layout/SiteNavbar";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      <div id="main-content" tabIndex={-1} className="relative outline-none">
        {children}
      </div>
      <Footer />
    </>
  );
}
