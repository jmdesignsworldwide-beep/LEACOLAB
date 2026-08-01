"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode, MouseEvent } from "react";

/**
 * Link que usa la View Transitions API para animar el elemento compartido
 * (la imagen "viaja" entre tarjeta y detalle). Degrada a navegación normal
 * en navegadores sin soporte.
 */
export function ViewTransitionLink({
  href,
  className,
  children,
  ...rest
}: LinkProps & { className?: string; children: ReactNode }) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (
      doc.startViewTransition &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      e.button === 0
    ) {
      e.preventDefault();
      doc.startViewTransition(() => router.push(String(href)));
    }
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
