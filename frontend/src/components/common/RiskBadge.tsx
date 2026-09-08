import React from 'react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showDot = true, size = 'md' }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let bgClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
  let dotColor = 'bg-emerald-400';

  if (normLevel === 'CRITICAL') {
    bgClasses = 'bg-red-950/70 text-red-400 border-red-800/80 shadow-glow-red';
    dotColor = 'bg-red-500 animate-pulse';
  } else if (normLevel === 'HIGH') {
    bgClasses = 'bg-amber-950/70 text-amber-400 border-amber-800/80 shadow-glow-amber';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (normLevel === 'MODERATE') {
    bgClasses = 'bg-blue-950/60 text-blue-400 border-blue-800/60';
    dotColor = 'bg-blue-400';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wide'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase ${bgClasses} ${sizeClasses} transition-all duration-200`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {normLevel}
    </span>
  );
};
