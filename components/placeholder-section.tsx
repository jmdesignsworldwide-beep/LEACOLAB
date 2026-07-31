import { Reveal } from "@/components/reveal";

/**
 * Sección "en construcción" reutilizable para las rutas que se
 * desarrollan en tandas posteriores. Mantiene el shell navegable
 * sin enlaces muertos.
 */
export function PlaceholderSection({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="container flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-5 max-w-3xl text-fluid-3xl">{title}</h1>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="bl-rule mx-auto mt-8 w-11 opacity-70" />
      </Reveal>
      <Reveal delay={0.25}>
        <p className="mt-8 max-w-md text-fluid-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </Reveal>
    </section>
  );
}
