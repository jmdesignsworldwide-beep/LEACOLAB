"use client";

import { Component, type ReactNode } from "react";

import { SeccionError } from "@/components/seccion-error";

/**
 * Límite de error por sección: si el contenido hijo falla al renderizar
 * (incluyendo un componente de servidor async que lanza durante el streaming),
 * solo esta sección muestra su estado de error — el resto de la página sigue
 * viva. El detalle técnico se registra en consola, nunca en pantalla.
 */
export class SectionBoundary extends Component<
  { children: ReactNode; titulo?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <SeccionError titulo={this.props.titulo} />;
    }
    return this.props.children;
  }
}
