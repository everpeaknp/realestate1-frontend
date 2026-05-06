import Skeleton from './Skeleton';

interface PropertyCardSkeletonProps {
  count?: number;
}

export default function PropertyCardSkeleton({ count = 1 }: PropertyCardSkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-[#FFFAF3] border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          {/* Image skeleton */}
          <Skeleton height="240px" className="w-full" />

          {/* Content skeleton */}
          <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
            {/* Location */}
            <div className="flex items-center gap-1.5 mb-2">
              <Skeleton variant="circular" width={14} height={14} />
              <Skeleton height="13px" width="60%" />
            </div>

            {/* Title */}
            <Skeleton height="24px" className="mb-2" />
            <Skeleton height="24px" width="80%" className="mb-3" />

            {/* Land size */}
            <Skeleton height="12px" width="40%" className="mb-3" />

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
              <Skeleton height="24px" width="100px" />
              <Skeleton height="16px" width="60px" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
