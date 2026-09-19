import Footer from "@/components/layout/footer/footer";
import SiteNavbar from "@/components/layout/SiteNavbar";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <SiteNavbar/>
      <div className="relative">
        {children}
      </div>
      <Footer />
    </>
  );
}
