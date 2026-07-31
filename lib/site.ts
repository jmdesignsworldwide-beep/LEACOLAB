/**
 * Configuración central del sitio Beauty by Leela.
 * Datos reales del negocio (Prompt Maestro §6).
 */

export const siteConfig = {
  name: "Beauty by Leela",
  fullName: "Beauty By Leela Estética Avanzada",
  tagline: "CAMBIAMOS VIDAS Y AUTOESTIMAS",
  director: "Marianny Belén Sánchez",
  description:
    "Centro de restauración de piel y autoestima con 8 años de trayectoria en Santo Domingo. Protocolos reales, especialistas expertas y transparencia total.",
  // URL pública — DEUDA (Tanda 12): Production = https://beautybyleela.com
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://beauty-by-leela.vercel.app",
  contact: {
    phone: "(829) 778-0482",
    whatsapp: "8297780482",
    email: "estetica@beautybyleela.com",
    instagram: "@beautybyleela_",
    instagramUrl: "https://instagram.com/beautybyleela_",
  },
  // Deep-link base de agendamiento. Subdominio "bylela" PENDIENTE de confirmar.
  setmoreUrl:
    process.env.NEXT_PUBLIC_SETMORE_BASE_URL ??
    "https://citasbeautybylela.setmore.com/",
  credit: {
    name: "JM Nexus Designs",
    whatsapp: "https://wa.me/18494421919",
    instagram: "https://instagram.com/jm.nexus.designs",
  },
} as const;

export const navLinks = [
  { label: "Protocolos", href: "/protocolos" },
  { label: "Transformaciones", href: "/transformaciones" },
  { label: "Nosotras", href: "/nosotras" },
  { label: "Formación", href: "/formacion" },
  { label: "Contacto", href: "/contacto" },
] as const;
