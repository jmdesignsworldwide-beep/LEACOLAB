import type { MetadataRoute } from "next";

// ⚠️ Bloqueo total mientras el sitio está en construcción.
// RETIRAR EN TANDA 12 (checklist de lanzamiento).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
