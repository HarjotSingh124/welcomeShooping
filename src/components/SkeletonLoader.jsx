export default function SkeletonLoader({ type = 'block', count = 1 }) {
  const getSkeleton = (type) => {
    switch (type) {
      case 'hero':
        return <div className="w-full h-64 md:h-96 bg-gray-300 animate-pulse rounded-lg" />;
      case 'banner':
        return <div className="w-full h-40 md:h-60 bg-gray-300 animate-pulse rounded-lg" />;
      case 'categoryGrid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className="w-20 h-20 bg-gray-300 animate-pulse rounded-full" />
                <div className="w-16 h-4 bg-gray-300 animate-pulse rounded" />
              </div>
            ))}
          </div>
        );
      case 'productRow':
        return (
          <div className="flex overflow-x-auto gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="min-w-[150px] h-40 bg-gray-300 animate-pulse rounded-lg" />
            ))}
          </div>
        );
        case 'productDetail':
  return (
    <div className="space-y-6">
      <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg" />
      <div className="h-6 w-1/2 bg-gray-300 animate-pulse rounded" />
      <div className="h-4 w-1/3 bg-gray-300 animate-pulse rounded" />
      <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded" />
    </div>
  );
  case 'orderRow':
  return Array(count).fill(0).map((_, idx) => (
    <div key={idx} className="border p-4 rounded shadow animate-pulse mb-4 space-y-2">
      <div className="h-4 w-1/2 bg-gray-300 rounded" />
      <div className="h-4 w-1/3 bg-gray-300 rounded" />
      <div className="h-4 w-1/4 bg-gray-300 rounded" />
    </div>
  ));
      default:
        return <div className="w-full h-6 bg-gray-300 animate-pulse rounded mb-2" />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{getSkeleton(type)}</div>
      ))}
    </>
  );
}