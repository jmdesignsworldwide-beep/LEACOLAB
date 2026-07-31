"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Easing editorial — el mismo de la Dirección de Movimiento (entradas)
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Revelado vinculado al scroll (patrón del documento de movimiento):
 * anima al entrar en viewport, una sola vez. No usar sobre el elemento LCP
 * del primer pliegue — ahí el contenido se renderiza visible directamente.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT, delay },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
