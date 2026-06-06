export const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton h-4 w-3/4 rounded mb-3" />
    <div className="skeleton h-3 w-1/2 rounded mb-2" />
    <div className="skeleton h-3 w-full rounded mb-2" />
    <div className="skeleton h-3 w-2/3 rounded" />
  </div>
);

export const SkeletonJobCard = () => (
  <div className="card">
    <div className="flex justify-between mb-4">
      <div className="skeleton h-5 w-48 rounded" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="skeleton h-4 w-32 rounded mb-3" />
    <div className="flex gap-2 mb-3">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-14 rounded-full" />
    </div>
    <div className="skeleton h-3 w-full rounded mb-2" />
    <div className="skeleton h-3 w-3/4 rounded" />
  </div>
);

export const SkeletonProfile = () => (
  <div className="space-y-6">
    <div className="card flex items-center gap-4">
      <div className="skeleton w-20 h-20 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-6 w-48 rounded mb-2" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="card">
        <div className="skeleton h-5 w-32 rounded mb-4" />
        <div className="skeleton h-3 w-full rounded mb-2" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    ))}
  </div>
);

export default SkeletonJobCard;
