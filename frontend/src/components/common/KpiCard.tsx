import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  icon: LucideIcon;
  accentColor?: 'purple' | 'emerald' | 'amber' | 'blue' | 'red';
  progress?: number;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  icon: Icon,
  accentColor = 'purple',
  progress,
  onClick
}) => {
  const colorStyles = {
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      progressBar: 'bg-purple-500',
      glow: 'hover:shadow-glow-purple'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      progressBar: 'bg-emerald-500',
      glow: 'hover:shadow-glow-green'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      progressBar: 'bg-amber-500',
      glow: 'hover:shadow-glow-amber'
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      progressBar: 'bg-blue-500',
      glow: 'hover:shadow-blue-500/20'
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/50',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      progressBar: 'bg-red-500',
      glow: 'hover:shadow-glow-red'
    }
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-5 border transition-all duration-300 ${colorStyles.border} ${colorStyles.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colorStyles.progressBar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 text-xs">
          <span
            className={`font-semibold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                : 'bg-red-950/80 text-red-400 border border-red-800/60'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
