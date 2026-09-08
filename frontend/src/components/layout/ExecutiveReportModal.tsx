import React, { useState, useEffect } from 'react';
import { X, Printer, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
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
      <div className="relative w-full max-w-4xl glass-panel bg-slate-900/98 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Executive Reserve & Risk Briefing</h3>
              <p className="text-xs text-slate-400">Official Assessment for MOIL Board & Ministry of Steel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 text-sm print:p-0 print:bg-white print:text-black">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Generating executive report telemetry...</div>
          ) : report ? (
            <>
              {/* Header Box */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-extrabold text-white tracking-tight uppercase">
                      {report.reportTitle}
                    </h1>
                    <p className="text-xs text-purple-400 font-mono mt-1">
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
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Total Ore Reserves</span>
                  <span className="text-2xl font-bold text-white">
                    {report.executiveSummary.totalReservesMillionTonnes} <span className="text-xs font-normal text-slate-400">Mt</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    Proved: {report.executiveSummary.provedReservesMillionTonnes} Mt
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Monthly Extraction</span>
                  <span className="text-2xl font-bold text-white">
                    {report.executiveSummary.monthlyActualTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">t</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Target: {report.executiveSummary.monthlyTargetTonnes.toLocaleString()} t
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Revenue At Risk (30d)</span>
                  <span className="text-2xl font-bold text-red-400">
                    ₹{report.executiveSummary.totalRevenueAtRiskCrores} <span className="text-xs font-normal text-slate-400">Cr</span>
                  </span>
                  <span className="text-[10px] text-red-400/80 block mt-1">Shortfall Deficit</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Fleet Health Index</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {report.executiveSummary.averageFleetHealthScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">All Active Mines</span>
                </div>
              </div>

              {/* Mine Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Mine-Wise Operational Breakdown
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
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
                    <tbody className="divide-y divide-slate-800/60">
                      {report.mineBreakdown.map((m: any) => (
                        <tr key={m.mineId} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-white">
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
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.shortfallRiskLevel === 'CRITICAL'
                                  ? 'bg-red-950 text-red-400'
                                  : m.shortfallRiskLevel === 'HIGH'
                                  ? 'bg-amber-950 text-amber-400'
                                  : 'bg-emerald-950 text-emerald-400'
                              }`}
                            >
                              {m.shortfallRiskLevel} ({m.shortfallProbabilityPct}%)
                            </span>
                          </td>
                          <td className="p-3 text-red-400 font-mono">₹{m.revenueRiskCrores} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Priority Action Directives */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Immediate AI Prescriptive Directives
                </h4>
                <div className="space-y-2.5">
                  {report.urgentActionItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            {item.category}
                          </span>
                          <span className="font-semibold text-white text-xs">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Target Mine: {item.mineName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          +{item.expectedTonnageGain} t
                        </span>
                        <span className="block text-[10px] text-slate-400">ROI: ₹{item.estimatedRoiInrLakhs} L</span>
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
