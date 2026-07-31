import Link from "next/link";

import { siteConfig, navLinks } from "@/lib/site";
import { Logo } from "@/components/logo";

export function Footer() {
  const year = 2026; // fijo: el entorno de build no expone la fecha actual

  return (
    <footer className="border-t border-border bg-bl-marble">
      <div className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-6" />
              <span className="font-display text-lg">{siteConfig.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-6 font-display text-fluid-lg tracking-wide text-bl-charcoal">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Pie de página">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Explorar
            </h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/80">
              <li>
                <a
                  href={`https://wa.me/1${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                >
                  WhatsApp · {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                >
                  Instagram · {siteConfig.contact.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bl-rule mt-12 opacity-40" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.fullName}. Todos los derechos reservados.
          </p>
          <p>
            Diseñado por{" "}
            <a
              href={siteConfig.credit.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {siteConfig.credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
