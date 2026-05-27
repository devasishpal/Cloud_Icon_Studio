import { Skeleton } from '@/components/ui/skeleton';

export default function EditorLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="h-14 border-b border-border/50 flex items-center px-4 gap-3">
        <Skeleton className="size-7 rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <div className="flex-1" />
        <Skeleton className="size-7 rounded-lg" />
        <Skeleton className="size-7 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-11 border-r border-border/50 p-1 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-9 rounded-lg" />
          ))}
        </div>
        <div className="w-60 border-r border-border/50 p-3 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <Skeleton className="size-48 rounded-2xl" />
        </div>
        <div className="w-72 border-l border-border/50 p-3 space-y-3">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="size-16 rounded-lg flex-1" />
            <Skeleton className="size-16 rounded-lg flex-1" />
            <Skeleton className="size-16 rounded-lg flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
