import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'chart' | 'table' | 'row' | 'default';
  count?: number;
  rows?: number;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'default',
  count,
  rows = 4,
  height = 'h-16'
}) => {
  const effectiveCount = count !== undefined ? count : rows;

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: effectiveCount }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#161D22]/80 border border-[#26333B] space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-3.5 bg-[#26333B] rounded" />
              <div className="w-7 h-7 rounded-xl bg-[#26333B]" />
            </div>
            <div className="w-32 h-7 bg-[#26333B] rounded-lg" />
            <div className="w-40 h-2.5 bg-[#26333B]/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {Array.from({ length: effectiveCount }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#161D22]/80 border border-[#26333B] space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="w-48 h-4 bg-[#26333B] rounded" />
                <div className="w-32 h-2.5 bg-[#26333B]/60 rounded" />
              </div>
              <div className="w-20 h-6 bg-[#26333B] rounded-lg" />
            </div>
            <div className="w-full h-64 bg-[#26333B]/40 rounded-xl border border-[#26333B]/60 flex items-end justify-between p-4 gap-2">
              <div className="w-8 h-24 bg-[#26333B] rounded-t" />
              <div className="w-8 h-40 bg-[#26333B] rounded-t" />
              <div className="w-8 h-32 bg-[#26333B] rounded-t" />
              <div className="w-8 h-48 bg-[#26333B] rounded-t" />
              <div className="w-8 h-28 bg-[#26333B] rounded-t" />
              <div className="w-8 h-52 bg-[#26333B] rounded-t" />
              <div className="w-8 h-36 bg-[#26333B] rounded-t" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="p-6 rounded-2xl bg-[#161D22]/80 border border-[#26333B] space-y-4 animate-pulse shadow-lg">
        <div className="flex items-center justify-between">
          <div className="w-40 h-4 bg-[#26333B] rounded" />
          <div className="w-28 h-7 bg-[#26333B] rounded-lg" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: effectiveCount }).map((_, i) => (
            <div key={i} className="w-full h-10 bg-[#26333B]/40 rounded-lg border border-[#26333B]/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: effectiveCount }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} bg-[#161D22]/80 rounded-xl border border-[#26333B]/60`}
        />
      ))}
    </div>
  );
};
