import Skeleton from './Skeleton';

interface BlogCardSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list';
}

export default function BlogCardSkeleton({ count = 1, variant = 'grid' }: BlogCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <>
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
            {/* Image skeleton */}
            <Skeleton width="120px" height="80px" className="flex-shrink-0 rounded" />

            {/* Content skeleton */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Skeleton height="16px" width="30%" className="mb-2" />
                <Skeleton height="20px" className="mb-1" />
                <Skeleton height="20px" width="70%" />
              </div>
              <Skeleton height="14px" width="40%" />
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image skeleton */}
          <Skeleton height="200px" className="w-full" />

          {/* Content skeleton */}
          <div className="p-4">
            {/* Category */}
            <Skeleton height="14px" width="30%" className="mb-3" />

            {/* Title */}
            <Skeleton height="20px" className="mb-2" />
            <Skeleton height="20px" width="80%" className="mb-3" />

            {/* Excerpt */}
            <Skeleton height="14px" className="mb-1" />
            <Skeleton height="14px" className="mb-1" />
            <Skeleton height="14px" width="60%" className="mb-4" />

            {/* Author and date */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton height="14px" width="40%" className="mb-1" />
                <Skeleton height="12px" width="30%" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
