/** @type {import('next').NextConfig} */

// Cabeceras de seguridad SIEMPRE activas (no se tocan en el lanzamiento).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' en scripts se endurece con nonce en una tanda posterior
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

// ⚠️ noindex GLOBAL — TEMPORAL mientras el sitio está en construcción.
// RETIRAR EN TANDA 12 (junto con robots.ts y el `robots` del layout raíz).
const noindexGlobal = { key: "X-Robots-Tag", value: "noindex, nofollow" };

// ⚠️ noindex del PORTAL — PERMANENTE. NO RETIRAR NUNCA, ni en la Tanda 12.
const noindexPortal = { key: "X-Robots-Tag", value: "noindex, nofollow" };

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      // El portal primero: su noindex es permanente.
      { source: "/portal/:path*", headers: [...securityHeaders, noindexPortal] },
      // Resto del sitio: seguridad + noindex temporal (se quita en Tanda 12).
      { source: "/:path*", headers: [...securityHeaders, noindexGlobal] },
    ];
  },
};

export default nextConfig;
