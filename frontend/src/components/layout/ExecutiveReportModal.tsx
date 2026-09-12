import React, { useState, useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { useMine } from '../../context/MineContext';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  const { selectedMineId } = useMine();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const data = await api.getExecutiveReport(selectedMineId === 'ALL' ? undefined : selectedMineId);
          setReport(data);
        } catch (err) {
          console.error('Failed to load report:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [isOpen, selectedMineId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel bg-[#161D22]/98 border border-[#26333B] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#26333B] flex items-center justify-between bg-[#0F1214]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/25 text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#E8E6E3] font-sans">Executive Reserve & Risk Briefing</h3>
              <p className="text-xs text-slate-400">Official Assessment for MOIL Board & Ministry of Steel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2226] hover:bg-[#222D33] text-slate-200 text-xs font-semibold rounded-lg border border-[#26333B] transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#E8E6E3] hover:bg-[#1B2226] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 text-sm print:p-0 print:bg-white print:text-black">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-mono">Generating executive report telemetry...</div>
          ) : report ? (
            <>
              {/* Header Box */}
              <div className="border-b border-[#26333B] pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#E8E6E3] tracking-tight uppercase font-sans">
                      {report.reportTitle}
                    </h1>
                    <p className="text-xs text-teal-400 font-mono mt-1">
                      {report.issuedBy} • {report.targetMinistry}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <p>Date: {new Date(report.generationTimestamp).toLocaleDateString()}</p>
                    <p>Doc ID: MOIL-IQ-2026-EX-09</p>
                  </div>
                </div>
              </div>

              {/* High-Level Executive Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-xs text-slate-400 block mb-1 font-mono">Total Ore Reserves</span>
                  <span className="text-2xl font-bold text-[#E8E6E3]">
                    {report.executiveSummary.totalReservesMillionTonnes} <span className="text-xs font-normal text-slate-400">Mt</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                    Proved: {report.executiveSummary.provedReservesMillionTonnes} Mt
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-xs text-slate-400 block mb-1 font-mono">Monthly Extraction</span>
                  <span className="text-2xl font-bold text-[#E8E6E3]">
                    {report.executiveSummary.monthlyActualTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">t</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    Target: {report.executiveSummary.monthlyTargetTonnes.toLocaleString()} t
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-xs text-slate-400 block mb-1 font-mono">Revenue At Risk (30d)</span>
                  <span className="text-2xl font-bold text-[#DC5F4E]">
                    ₹{report.executiveSummary.totalRevenueAtRiskCrores} <span className="text-xs font-normal text-slate-400">Cr</span>
                  </span>
                  <span className="text-[10px] text-[#DC5F4E]/80 block mt-1 font-mono">Shortfall Deficit</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-xs text-slate-400 block mb-1 font-mono">Fleet Health Index</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {report.executiveSummary.averageFleetHealthScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">All Active Mines</span>
                </div>
              </div>

              {/* Mine Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                  Mine-Wise Operational Breakdown
                </h4>
                <div className="border border-[#26333B] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0F1214] text-slate-400 border-b border-[#26333B] font-semibold font-mono">
                      <tr>
                        <th className="p-3">Mine Complex</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Reserves (Mt)</th>
                        <th className="p-3">Mn Grade</th>
                        <th className="p-3">Monthly Output</th>
                        <th className="p-3">Shortfall Risk</th>
                        <th className="p-3">Risk Exposure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#26333B]/60">
                      {report.mineBreakdown.map((m: any) => (
                        <tr key={m.mineId} className="hover:bg-[#1B2226]/50">
                          <td className="p-3 font-semibold text-[#E8E6E3]">
                            {m.name}
                            <span className="block text-[10px] text-slate-400 font-normal">{m.district}, {m.state}</span>
                          </td>
                          <td className="p-3 text-slate-300">{m.type}</td>
                          <td className="p-3 text-slate-200 font-mono">{m.reservesMt} Mt</td>
                          <td className="p-3 text-slate-200 font-mono">{m.avgMnGradePct}% Mn</td>
                          <td className="p-3 font-mono text-slate-200">
                            {m.currentMonthlyTonnes.toLocaleString()} / {m.monthlyTargetTonnes.toLocaleString()} t
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${m.shortfallRiskLevel === 'CRITICAL'
                                ? 'bg-red-950 text-[#DC5F4E]'
                                : m.shortfallRiskLevel === 'HIGH'
                                  ? 'bg-amber-950 text-amber-400'
                                  : 'bg-emerald-950 text-emerald-400'
                                }`}
                            >
                              {m.shortfallRiskLevel} ({m.shortfallProbabilityPct}%)
                            </span>
                          </td>
                          <td className="p-3 text-[#DC5F4E] font-mono">₹{m.revenueRiskCrores} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Priority Action Directives */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                  Immediate AI Prescriptive Directives
                </h4>
                <div className="space-y-2.5">
                  {report.urgentActionItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B] flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                            {item.category}
                          </span>
                          <span className="font-semibold text-[#E8E6E3] text-xs font-sans">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Target Mine: {item.mineName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          +{item.expectedTonnageGain} t
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">ROI: ₹{item.estimatedRoiInrLakhs} L</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
