import React, { useState } from 'react';
import { ShieldCheck, Satellite, AlertTriangle, ExternalLink, Database, Info } from 'lucide-react';
import type { DataSourceType } from '../../types';
import { DataSourceModal } from './DataSourceModal';

interface ProvenanceBadgeProps {
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  dataType?: DataSourceType | string;
  isSynthetic?: boolean;
  size?: 'sm' | 'md';
  compact?: boolean;
  showDetailsOnClick?: boolean;
  onClick?: () => void;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  sourceId = 'src-moil-ar-2025',
  sourceName,
  sourceUrl,
  dataType = 'OFFICIAL_MOIL',
  isSynthetic = false,
  size = 'sm',
  compact = false,
  showDetailsOnClick = true,
  onClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSyn = isSynthetic || dataType === 'SYNTHETIC_DEMO';
  const isSat = dataType === 'PUBLIC_SATELLITE' || dataType === 'PUBLIC_WEATHER';
  const isGov = dataType === 'PUBLIC_GOVERNMENT';

  const badgeConfig = isSyn
    ? {
        label: compact ? 'Demo' : 'Synthetic / Demo',
        fullLabel: sourceName || 'Synthetic Demonstration Data',
        bg: 'bg-amber-950/80 border-amber-800/80 text-amber-300 hover:bg-amber-900/80',
        icon: AlertTriangle,
        desc: 'Not Official MOIL Operational Data'
      }
    : isSat
    ? {
        label: compact ? 'Satellite' : 'Public Satellite / Weather',
        fullLabel: sourceName || 'Copernicus / NASA Earth Observation',
        bg: 'bg-cyan-950/80 border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/80',
        icon: Satellite,
        desc: 'Public Earth Observation & Meteorological Data'
      }
    : isGov
    ? {
        label: compact ? 'IBM / Govt' : 'IBM / Govt Data',
        fullLabel: sourceName || 'Indian Bureau of Mines Disclosures',
        bg: 'bg-blue-950/80 border-blue-800/80 text-blue-300 hover:bg-blue-900/80',
        icon: Database,
        desc: 'National Mineral Inventory & Regulatory Records'
      }
    : {
        label: compact ? 'MOIL' : 'Official MOIL Disclosures',
        fullLabel: sourceName || 'MOIL Limited Annual Reports',
        bg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80',
        icon: ShieldCheck,
        desc: 'Official PSU Statutory Disclosures'
      };

  const Icon = badgeConfig.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (showDetailsOnClick) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        title={`${badgeConfig.fullLabel} (${badgeConfig.desc})`}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-all cursor-pointer ${
          badgeConfig.bg
        } ${size === 'sm' || compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}
      >
        <Icon className={size === 'sm' || compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{badgeConfig.label}</span>
        {showDetailsOnClick && !onClick && <Info className="w-2.5 h-2.5 opacity-60 ml-0.5" />}
      </button>

      {isModalOpen && (
        <DataSourceModal
          sourceId={sourceId}
          fallbackName={badgeConfig.fullLabel}
          fallbackUrl={sourceUrl}
          fallbackType={dataType as DataSourceType}
          isSynthetic={isSyn}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
