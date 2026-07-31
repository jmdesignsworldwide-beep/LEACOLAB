import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SitioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
