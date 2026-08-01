"use client";

import type { HTMLInputTypeAttribute } from "react";

import { cn } from "@/lib/utils";

type Base = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string | null;
  opcional?: boolean;
};

const baseInput =
  "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Etiqueta({ id, label, opcional }: { id: string; label: string; opcional?: boolean }) {
  return (
    <label htmlFor={id} className="text-sm">
      {label}
      {opcional && <span className="text-muted-foreground"> (opcional)</span>}
    </label>
  );
}

function MensajeError({ id, error }: { id: string; error?: string | null }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-700">
      {error}
    </p>
  );
}

export function Campo({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  opcional,
  type = "text",
  inputMode,
  autoComplete,
}: Base & {
  type?: HTMLInputTypeAttribute;
  inputMode?: "text" | "tel" | "email";
  autoComplete?: string;
}) {
  const errId = `${id}-error`;
  return (
    <div>
      <Etiqueta id={id} label={label} opcional={opcional} />
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(baseInput, error ? "border-red-600" : "border-border")}
      />
      <MensajeError id={errId} error={error} />
    </div>
  );
}

export function CampoArea({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  opcional,
  rows = 4,
}: Base & { rows?: number }) {
  const errId = `${id}-error`;
  return (
    <div>
      <Etiqueta id={id} label={label} opcional={opcional} />
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(baseInput, error ? "border-red-600" : "border-border")}
      />
      <MensajeError id={errId} error={error} />
    </div>
  );
}
