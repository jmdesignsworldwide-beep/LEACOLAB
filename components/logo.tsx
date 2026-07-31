import { cn } from "@/lib/utils";

/**
 * Monograma BL de Beauty by Leela como SVG (gráfico de marca).
 * Se usa en vez de texto dorado: el dorado sobre crema no alcanza 4.5:1
 * como texto, pero como logo/gráfico está exento y conserva la identidad.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={cn("w-auto", className)}
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="0"
        y="32"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="36"
        fontWeight="600"
        letterSpacing="1"
        fill="var(--bl-gold)"
      >
        BL
      </text>
    </svg>
  );
}
