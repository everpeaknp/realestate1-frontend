export default function SinglePostLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="h-[500px] bg-gray-200 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
            </div>
            
            <div className="h-96 bg-gray-200 animate-pulse rounded-sm" />
            
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-5/6" />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 bg-gray-200 animate-pulse rounded-sm" />
            <div className="h-64 bg-gray-200 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
