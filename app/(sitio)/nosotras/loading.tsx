import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingNosotras() {
  return (
    <div className="pb-24">
      <section className="container grid items-center gap-10 pt-28 md:grid-cols-2 md:pt-32">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-px w-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </section>
    </div>
  );
}
