import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFormacion() {
  return (
    <div className="pb-24">
      <section className="container flex flex-col items-center pt-28 text-center md:pt-32">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-5 h-10 w-80 max-w-full" />
        <Skeleton className="mt-6 h-px w-12" />
      </section>
      <section className="container mt-14">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
