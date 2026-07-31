import type { MetadataRoute } from "next";

// El sitio completo está en construcción → Disallow: / (se retira en Tanda 12).
// ⚠️ `/portal` queda deshabilitado SIEMPRE, incluso tras el lanzamiento.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Tanda 12: cambiar a disallow: ["/portal"] (NO borrar /portal).
      disallow: ["/", "/portal"],
    },
  };
}
