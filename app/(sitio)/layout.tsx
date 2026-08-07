import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Tracker } from "@/components/tracker";

// La captura de comportamiento SOLO corre en producción (nunca en previews ni
// desarrollo), y nunca en /portal (que tiene su propio layout, sin Tracker).
const capturaActiva = process.env.VERCEL_ENV === "production";

export default function SitioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main id="contenido">{children}</main>
      <Footer />
      {capturaActiva && <Tracker />}
    </>
  );
}
