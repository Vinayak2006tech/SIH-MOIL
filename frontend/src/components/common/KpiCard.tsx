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
  accentColor?: 'teal' | 'manganese' | 'purple' | 'emerald' | 'amber' | 'blue' | 'red';
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
  accentColor = 'teal',
  progress,
  onClick
}) => {
  const colorStyles = {
    teal: {
      border: 'border-teal-500/25 hover:border-teal-400/60',
      iconBg: 'bg-teal-500/10 text-black border-teal-500/30',
      progressBar: 'bg-teal-400',
      glow: 'hover:shadow-glow-teal'
    },
    manganese: {
      border: 'border-[#6B5B95]/35 hover:border-[#7E69AB]/70',
      iconBg: 'bg-[#6B5B95]/15 text-black border-[#6B5B95]/40',
      progressBar: 'bg-[#7E69AB]',
      glow: 'hover:shadow-glow-manganese'
    },
    purple: {
      border: 'border-[#6B5B95]/35 hover:border-[#7E69AB]/70',
      iconBg: 'bg-[#6B5B95]/15 text-black border-[#6B5B95]/40',
      progressBar: 'bg-[#7E69AB]',
      glow: 'hover:shadow-glow-manganese'
    },
    emerald: {
      border: 'border-emerald-500/25 hover:border-emerald-400/60',
      iconBg: 'bg-emerald-500/10 text-black border-emerald-500/30',
      progressBar: 'bg-emerald-500',
      glow: 'hover:shadow-glow-green'
    },
    amber: {
      border: 'border-amber-500/25 hover:border-amber-400/60',
      iconBg: 'bg-amber-500/10 text-black border-amber-500/30',
      progressBar: 'bg-amber-500',
      glow: 'hover:shadow-glow-amber'
    },
    blue: {
      border: 'border-cyan-500/25 hover:border-cyan-400/60',
      iconBg: 'bg-cyan-500/10 text-black border-cyan-500/30',
      progressBar: 'bg-cyan-400',
      glow: 'hover:shadow-glow-cyan'
    },
    red: {
      border: 'border-red-500/25 hover:border-red-400/60',
      iconBg: 'bg-red-500/10 text-black border-red-500/30',
      progressBar: 'bg-[#DC5F4E]',
      glow: 'hover:shadow-glow-red'
    }
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all duration-300 hover:border-teal-500 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black mb-1 font-mono">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-black tracking-tight text-black">{value}</span>
            {unit && <span className="text-sm font-bold text-black">{unit}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5 text-black" />
        </div>
      </div>

      {subtitle && <p className="text-xs text-black mt-2 font-medium">{subtitle}</p>}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
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
            className={`font-bold px-1.5 py-0.5 rounded font-mono text-black ${
              trend.isPositive
                ? 'bg-emerald-100 border border-emerald-300'
                : 'bg-red-100 border border-red-300'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-black font-semibold">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
