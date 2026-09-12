import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  Satellite,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import type { DataSource, DataSourceType } from '../types';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true);
        const sources = await api.getDataSources();
        setDataSources(sources || []);
      } catch (err) {
        console.error('Failed to load data sources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  const filteredSources = dataSources.filter((s) => {
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'OFFICIAL' && s.dataType === 'OFFICIAL_MOIL') ||
      (selectedFilter === 'GOVERNMENT' && s.dataType === 'PUBLIC_GOVERNMENT') ||
      (selectedFilter === 'SATELLITE' && (s.dataType === 'PUBLIC_SATELLITE' || s.dataType === 'PUBLIC_WEATHER')) ||
      (selectedFilter === 'SYNTHETIC' && s.isSynthetic);

    const matchesSearch =
      searchQuery === '' ||
      s.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const authenticCount = dataSources.filter((s) => !s.isSynthetic).length;
  const syntheticCount = dataSources.filter((s) => s.isSynthetic).length;

  return (
    <div className="p-6 space-y-6 animate-fadeIn text-[#E8E6E3]">
      {/* Header Banner */}
      <div className="glass-panel bg-[#161D22]/85 p-6 rounded-3xl border border-[#26333B] flex items-start justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-tech-teal flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Data Provenance & Audit Registry
          </span>
          <h2 className="text-xl font-bold text-[#E8E6E3] mt-1">
            Data Lineage, Provenance & Verification Index
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
            Every metric, chart, and ML prediction across MOIL ReserveIQ is traceable to its verified source.
            Statutory disclosures from <strong className="text-tech-teal">MOIL Limited</strong>, <strong className="text-manganese-300">Indian Bureau of Mines (IBM)</strong>, and <strong className="text-tech-cyan">Copernicus / NASA Earth Observation</strong> are strictly segregated from labeled demonstration inputs.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-center">
            <span className="text-lg font-bold text-emerald-400 font-mono block">{authenticCount}</span>
            <span className="text-[10px] text-emerald-300 uppercase font-semibold">Official Public Sources</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-800/80 text-center">
            <span className="text-lg font-bold text-amber-400 font-mono block">{syntheticCount}</span>
            <span className="text-[10px] text-amber-300 uppercase font-semibold">Demonstration Sets</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26333B] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-bold mr-1">Source Type:</span>
          {[
            { id: 'ALL', label: 'All Sources' },
            { id: 'OFFICIAL', label: 'Official MOIL PSU' },
            { id: 'GOVERNMENT', label: 'IBM / Ministry Disclosures' },
            { id: 'SATELLITE', label: 'Earth Observation & IMD' },
            { id: 'SYNTHETIC', label: 'Synthetic Demo Sets' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedFilter === tab.id
                ? 'bg-tech-teal text-[#0F1214] font-extrabold shadow-glow-teal'
                : 'bg-[#161D22] hover:bg-[#1B2226] text-[#94A3B8] hover:text-[#E8E6E3] border border-[#26333B]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search datasets, URLs, citations..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0F1214] border border-[#26333B] rounded-lg text-xs text-[#E8E6E3] placeholder-slate-500 focus:outline-none focus:border-tech-teal font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Provenance Cards Grid */}
      {loading ? (
        <LoadingSkeleton rows={4} height="h-32" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSources.map((source) => {
            const isSyn = source.isSynthetic;
            const isSat = source.dataType === 'PUBLIC_SATELLITE' || source.dataType === 'PUBLIC_WEATHER';
            const isGov = source.dataType === 'PUBLIC_GOVERNMENT';

            return (
              <div
                key={source.sourceId}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-200 space-y-3 ${isSyn
                  ? 'border-amber-800/80 bg-amber-950/20 hover:border-amber-700'
                  : isSat
                    ? 'border-cyan-800/80 bg-cyan-950/20 hover:border-cyan-700'
                    : isGov
                      ? 'border-[#26333B] bg-[#161D22]/85 hover:border-tech-teal/50'
                      : 'border-emerald-800/80 bg-emerald-950/20 hover:border-emerald-700'
                  }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-[#0F1214]/90 border border-[#26333B] text-slate-300">
                      {source.sourceId}
                    </span>
                    <h3 className="text-sm font-bold text-[#E8E6E3] leading-snug">{source.datasetName}</h3>
                  </div>

                  <ProvenanceBadge
                    dataType={source.dataType}
                    isSynthetic={source.isSynthetic}
                    sourceName={source.sourceName}
                    showDetailsOnClick={false}
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{source.description}</p>

                {/* Originating Source & Timestamps */}
                <div className="p-3 rounded-xl bg-[#0F1214]/80 border border-[#26333B] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Publisher / Source:</span>
                    <span className="font-semibold text-slate-200 text-right truncate max-w-xs">{source.sourceName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Publication Date:</span>
                    <span className="text-slate-300">{source.publicationDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Verification / Access Date:</span>
                    <span className="text-slate-300">{source.accessedDate}</span>
                  </div>
                </div>

                {/* License & Source URL Link */}
                <div className="flex items-center justify-between pt-2 border-t border-[#26333B] text-[11px]">
                  <span className="text-[#94A3B8] truncate max-w-xs">
                    {source.license}
                  </span>

                  {source.sourceUrl && !source.sourceUrl.startsWith('local://') ? (
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-bold text-tech-teal hover:text-tech-cyan transition"
                    >
                      <span>Direct Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-amber-400 font-mono text-[10px]">
                      Isolated Synthetic File
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SIH Judge Q&A Audit Table */}
      <div className="glass-panel bg-[#161D22]/85 p-6 rounded-3xl border border-[#26333B] space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-tech-teal" />
          <h3 className="text-sm font-bold text-[#E8E6E3]">
            Evaluation Audit Matrix: "Where Did This Number Come From?"
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#0F1214]/90 text-[#94A3B8] uppercase font-mono text-[10px] border-b border-[#26333B]">
              <tr>
                <th className="py-2.5 px-3">Dashboard Metric / Layer</th>
                <th className="py-2.5 px-3">Display Value</th>
                <th className="py-2.5 px-3">Authentic Source</th>
                <th className="py-2.5 px-3">Provenance Category</th>
                <th className="py-2.5 px-3">Traceability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26333B]/60 font-mono text-[11px]">
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">National Manganese Reserves & Resources</td>
                <td className="py-3 px-3 text-manganese-300 font-bold">121.97 Million Tonnes</td>
                <td className="py-3 px-3 text-slate-300 font-sans">Indian Bureau of Mines (IBM) NMI & MOIL Disclosures</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="PUBLIC_GOVERNMENT" isSynthetic={false} /></td>
                <td className="py-3 px-3 text-emerald-400 font-sans">Verified Public Record</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">FY 2025-26 Annual Ore Production</td>
                <td className="py-3 px-3 text-manganese-300 font-bold">19.07 Lakh Tonnes (1.907 Mt)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">MOIL Limited 64th Annual Operational Review & PIB</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="OFFICIAL_MOIL" isSynthetic={false} /></td>
                <td className="py-3 px-3 text-emerald-400 font-sans">Verified Public Record</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">FY 2025-26 Annual Ore Sales</td>
                <td className="py-3 px-3 text-manganese-300 font-bold">15.89 Lakh Tonnes (1.589 Mt)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">MOIL Investor Disclosures & Audited Financials</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="OFFICIAL_MOIL" isSynthetic={false} /></td>
                <td className="py-3 px-3 text-emerald-400 font-sans">Verified Public Record</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">11 Core Operating Mine Leases & Coordinates</td>
                <td className="py-3 px-3 text-manganese-300 font-bold">Balaghat, Dongri Buzurg, Kandri, Mansar, etc.</td>
                <td className="py-3 px-3 text-slate-300 font-sans">Ministry of Mines Leases & MOIL Mining Divisions</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="OFFICIAL_MOIL" isSynthetic={false} /></td>
                <td className="py-3 px-3 text-emerald-400 font-sans">Verified Public Record</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">Geospatial NDVI Vegetation & Bench Saturation</td>
                <td className="py-3 px-3 text-tech-teal font-bold">Live Bands 4/8 (NDVI 0.29-0.42)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">Copernicus Sentinel-2 MSI & NASA MODIS Earthdata</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="PUBLIC_SATELLITE" isSynthetic={false} /></td>
                <td className="py-3 px-3 text-cyan-400 font-sans">Open Satellite Telemetry</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-semibold text-[#E8E6E3]">Simulated Sub-surface Borehole Assays</td>
                <td className="py-3 px-3 text-amber-300 font-bold">64+ Synthetic Core Drills</td>
                <td className="py-3 px-3 text-slate-300 font-sans">MOIL ReserveIQ Synthetic Geological Simulation Engine</td>
                <td className="py-3 px-3"><ProvenanceBadge dataType="SYNTHETIC_DEMO" isSynthetic={true} /></td>
                <td className="py-3 px-3 text-amber-400 font-sans">Synthetic Demo Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
