import { cn } from "@/lib/utils";

/**
 * Esqueleto de carga en tono mármol. El pulso solo se anima cuando el usuario
 * NO tiene prefers-reduced-motion activado (motion-safe). Respeta las
 * dimensiones finales del contenido para no generar salto de layout (CLS).
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-md bg-bl-marble motion-safe:animate-pulse",
        className
      )}
    />
  );
}
