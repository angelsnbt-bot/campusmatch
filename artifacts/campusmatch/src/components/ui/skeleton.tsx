import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('skeleton', className)} {...props} />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card-premium p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="skeleton-avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton className="skeleton-heading" />
          <Skeleton className="skeleton-text w-1/3" />
        </div>
      </div>
      <Skeleton className="skeleton-text w-full" />
      <Skeleton className="skeleton-text w-4/5" />
      <Skeleton className="skeleton-card" />
    </div>
  );
}

function SkeletonFeed() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonFeed };
