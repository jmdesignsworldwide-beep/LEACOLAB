import Image from "next/image";
import type { CSSProperties } from "react";

import type { Protocolo } from "@/lib/catalogo";
import { urlPublica } from "@/lib/storage";
import { rangoInversion } from "@/lib/format";
import { ViewTransitionLink } from "@/components/view-transition-link";

export function ProtocoloCard({ protocolo }: { protocolo: Protocolo }) {
  const img = urlPublica(protocolo.imagen_path);
  const desde = rangoInversion(protocolo.inversion_min, protocolo.inversion_max);
  const vtName = `proto-img-${protocolo.slug}`;

  return (
    <ViewTransitionLink
      href={`/protocolos/${protocolo.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-16px_rgba(28,26,25,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bl-marble">
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            style={{ viewTransitionName: vtName } as CSSProperties}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="bl-rule w-8 opacity-50" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-fluid-lg">{protocolo.nombre}</h2>
        {(protocolo.descripcion || protocolo.para_quien) && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {protocolo.descripcion ?? protocolo.para_quien}
          </p>
        )}
        {desde && (
          <p className="mt-4 text-sm font-medium text-bl-charcoal">{desde}</p>
        )}
      </div>
    </ViewTransitionLink>
  );
}
