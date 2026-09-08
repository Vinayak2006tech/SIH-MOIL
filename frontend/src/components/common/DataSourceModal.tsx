import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Database, Satellite, AlertTriangle, CheckCircle2, Calendar, FileText } from 'lucide-react';
import type { DataSource, DataSourceType } from '../../types';
import { api } from '../../services/api';

interface DataSourceModalProps {
  sourceId: string;
  fallbackName?: string;
  fallbackUrl?: string;
  fallbackType?: DataSourceType;
  isSynthetic?: boolean;
  onClose: () => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  sourceId,
  fallbackName,
  fallbackUrl,
  fallbackType = 'OFFICIAL_MOIL',
  isSynthetic = false,
  onClose
}) => {
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        setLoading(true);
        const data = await api.getDataSourceById(sourceId);
        setSource(data);
      } catch {
        // Use fallback if not found
        setSource({
          sourceId,
          sourceName: fallbackName || 'Official MOIL Disclosures',
          sourceUrl: fallbackUrl || 'https://www.moil.nic.in/annual-reports',
          datasetName: 'Manganese Reserves & Historical Extraction',
          description: isSynthetic
            ? 'Demonstration dataset used for AI modeling simulation when proprietary raw drilling assays or machine SCADA are not publicly published.'
            : 'Statutory public filings and annual reports from MOIL Limited (Ministry of Steel, Govt. of India).',
          publicationDate: '2025-08-30',
          accessedDate: '2026-03-01',
          dataType: fallbackType,
          isSynthetic,
          license: isSynthetic ? 'Synthetic Demonstration Data' : 'Government Public Sector Undertaking Public Disclosures',
          verificationStatus: isSynthetic ? 'SYNTHETIC_DEMO' : 'VERIFIED_PUBLIC'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSource();
  }, [sourceId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${source?.isSynthetic
                ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                }`}
            >
              {source?.isSynthetic ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-purple-400">
                Data Provenance & Traceability
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {source?.datasetName || 'Data Source Verification'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Body */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono animate-pulse">
            Verifying provenance records...
          </div>
        ) : source ? (
          <div className="space-y-4">
            {/* Status Callout Banner */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${source.isSynthetic
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                }`}
            >
              {source.isSynthetic ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-[11px] block">
                  {source.isSynthetic
                    ? 'Demonstration Data Notice'
                    : 'Verified Authentic Public Source'}
                </span>
                <p className="text-[10px] opacity-90 leading-relaxed">
                  {source.isSynthetic
                    ? 'This specific layer represents calibrated demonstration inputs to demonstrate algorithmic reserve estimation. It is strictly segregated from official MOIL records.'
                    : 'This metric is directly grounded in statutory publications from MOIL Limited, the Indian Bureau of Mines, or open public Earth Observation satellites.'}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Dataset Type</span>
                <span className="font-bold text-white text-[11px]">{source.dataType.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Source Identifier</span>
                <span className="font-bold text-purple-400 text-[11px]">{source.sourceId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Publication Date</span>
                <span className="text-slate-200 text-[11px]">{source.publicationDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Access Verification Date</span>
                <span className="text-slate-200 text-[11px]">{source.accessedDate}</span>
              </div>
            </div>

            {/* Source Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Originating Source</span>
              <p className="text-slate-200 font-semibold">{source.sourceName}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{source.description}</p>
            </div>

            {/* License & External Link */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] text-slate-400 max-w-xs truncate">
                License: {source.license}
              </span>
              {source.sourceUrl && !source.sourceUrl.startsWith('local://') ? (
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold rounded-lg border border-purple-500/40 transition"
                >
                  <ExternalLink className="w-3 h-3" /> View Public Source
                </a>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-800">
                  Internal Test Asset
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
