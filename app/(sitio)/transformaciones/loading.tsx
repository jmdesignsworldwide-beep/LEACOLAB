import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTransformaciones() {
  return (
    <div className="pb-24">
      <section className="container flex flex-col items-center pt-28 text-center md:pt-32">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-10 w-80 max-w-full" />
        <Skeleton className="mt-6 h-px w-12" />
        <Skeleton className="mt-6 h-4 w-72 max-w-full" />
      </section>
      <section className="container">
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="mt-3 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
