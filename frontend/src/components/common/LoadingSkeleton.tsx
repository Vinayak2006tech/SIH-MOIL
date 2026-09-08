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
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-3.5 bg-slate-800 rounded" />
              <div className="w-7 h-7 rounded-xl bg-slate-800" />
            </div>
            <div className="w-32 h-7 bg-slate-800 rounded-lg" />
            <div className="w-40 h-2.5 bg-slate-800/60 rounded" />
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
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="w-48 h-4 bg-slate-800 rounded" />
                <div className="w-32 h-2.5 bg-slate-800/60 rounded" />
              </div>
              <div className="w-20 h-6 bg-slate-800 rounded-lg" />
            </div>
            <div className="w-full h-64 bg-slate-800/40 rounded-xl border border-slate-800/60 flex items-end justify-between p-4 gap-2">
              <div className="w-8 h-24 bg-slate-800 rounded-t" />
              <div className="w-8 h-40 bg-slate-800 rounded-t" />
              <div className="w-8 h-32 bg-slate-800 rounded-t" />
              <div className="w-8 h-48 bg-slate-800 rounded-t" />
              <div className="w-8 h-28 bg-slate-800 rounded-t" />
              <div className="w-8 h-52 bg-slate-800 rounded-t" />
              <div className="w-8 h-36 bg-slate-800 rounded-t" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 animate-pulse shadow-lg">
        <div className="flex items-center justify-between">
          <div className="w-40 h-4 bg-slate-800 rounded" />
          <div className="w-28 h-7 bg-slate-800 rounded-lg" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: effectiveCount }).map((_, i) => (
            <div key={i} className="w-full h-10 bg-slate-800/40 rounded-lg border border-slate-800/50" />
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
          className={`w-full ${height} bg-slate-800/50 rounded-xl border border-slate-700/30`}
        />
      ))}
    </div>
  );
};
