import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProtocoloDetalle() {
  return (
    <div className="pb-24">
      <section className="container grid items-center gap-10 pt-28 md:grid-cols-2 md:pt-32">
        <div className="space-y-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-px w-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="aspect-[4/5] w-full" />
      </section>
      <section className="container mt-16">
        <div className="mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>
      </section>
    </div>
  );
}
