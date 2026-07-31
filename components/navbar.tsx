"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig, navLinks } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="container flex h-16 items-center justify-between md:h-20"
        aria-label="Principal"
      >
        {/* Logo BL */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm"
          aria-label={`BL, ${siteConfig.name} — inicio`}
          onClick={() => setOpen(false)}
        >
          <Logo className="h-6 md:h-7" />
          <span className="hidden font-display text-lg text-foreground sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative inline-flex min-h-11 items-center text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute bottom-2 left-0 h-px w-0 bg-bl-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + hamburguesa */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
              Agendar
            </a>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-foreground md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-3 text-lg text-foreground/90 transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 px-2">
                <Button asChild className="w-full">
                  <a
                    href={siteConfig.setmoreUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Agendar
                  </a>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
