import React from 'react';
import { LucideIcon, Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Database,
  actionText,
  onAction
}) => {
  return (
    <div className="glass-panel rounded-2xl border border-[#26333B] p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-300 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#E8E6E3] mb-1 font-sans">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-[#E8E6E3] text-sm font-semibold rounded-lg shadow-glow-manganese transition-all duration-200 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
