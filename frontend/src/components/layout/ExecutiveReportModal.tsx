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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-black">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
              <FileText className="w-5 h-5 text-teal-800" />
            </div>
            <div>
              <h3 className="text-base font-black text-black font-sans">Executive Reserve & Risk Briefing</h3>
              <p className="text-xs text-black font-medium">Official Assessment for <span className="text-black font-bold">MOIL</span> Board & Ministry of Steel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black text-xs font-bold rounded-lg border border-slate-300 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-black" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-black text-sm bg-white print:p-0 print:bg-white print:text-black">
          {loading ? (
            <div className="py-20 text-center text-black font-mono font-bold">Generating executive report telemetry...</div>
          ) : report ? (
            <>
              {/* Header Box */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-black text-black tracking-tight uppercase font-sans">
                      {report.reportTitle}
                    </h1>
                    <p className="text-xs text-teal-800 font-mono mt-1 font-bold">
                      {report.issuedBy} • {report.targetMinistry}
                    </p>
                  </div>
                  <div className="text-right text-xs text-black font-mono font-bold">
                    <p>Date: {new Date(report.generationTimestamp).toLocaleDateString()}</p>
                    <p>Doc ID: <span className="text-black font-bold">MOIL</span>-IQ-2026-EX-09</p>
                  </div>
                </div>
              </div>

              {/* High-Level Executive Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
                  <span className="text-xs text-black font-bold block mb-1 font-mono">Total Ore Reserves</span>
                  <span className="text-2xl font-black text-black">
                    {report.executiveSummary.totalReservesMillionTonnes} <span className="text-xs font-normal text-black">Mt</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-1 font-mono font-bold">
                    Proved: {report.executiveSummary.provedReservesMillionTonnes} Mt
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
                  <span className="text-xs text-black font-bold block mb-1 font-mono">Monthly Extraction</span>
                  <span className="text-2xl font-black text-black">
                    {report.executiveSummary.monthlyActualTonnes.toLocaleString()} <span className="text-xs font-normal text-black">t</span>
                  </span>
                  <span className="text-[10px] text-black block mt-1 font-mono font-bold">
                    Target: {report.executiveSummary.monthlyTargetTonnes.toLocaleString()} t
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
                  <span className="text-xs text-black font-bold block mb-1 font-mono">Revenue At Risk (30d)</span>
                  <span className="text-2xl font-black text-red-700">
                    ₹{report.executiveSummary.totalRevenueAtRiskCrores} <span className="text-xs font-normal text-black">Cr</span>
                  </span>
                  <span className="text-[10px] text-red-700 block mt-1 font-mono font-bold">Shortfall Deficit</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
                  <span className="text-xs text-black font-bold block mb-1 font-mono">Fleet Health Index</span>
                  <span className="text-2xl font-black text-emerald-700">
                    {report.executiveSummary.averageFleetHealthScore}%
                  </span>
                  <span className="text-[10px] text-black block mt-1 font-mono font-bold">All Active Mines</span>
                </div>
              </div>

              {/* Mine Breakdown Table */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3 font-mono">
                  Mine-Wise Operational Breakdown
                </h4>
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left bg-white">
                    <thead className="bg-slate-50 text-black border-b border-slate-200 font-bold font-mono">
                      <tr>
                        <th className="p-3 text-black">Mine Complex</th>
                        <th className="p-3 text-black">Type</th>
                        <th className="p-3 text-black">Reserves (Mt)</th>
                        <th className="p-3 text-black">Mn Grade</th>
                        <th className="p-3 text-black">Monthly Output</th>
                        <th className="p-3 text-black">Shortfall Risk</th>
                        <th className="p-3 text-black">Risk Exposure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {report.mineBreakdown.map((m: any) => (
                        <tr key={m.mineId} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-black">
                            {m.name}
                            <span className="block text-[10px] text-black font-normal">{m.district}, {m.state}</span>
                          </td>
                          <td className="p-3 text-black font-medium">{m.type}</td>
                          <td className="p-3 text-black font-mono font-bold">{m.reservesMt} Mt</td>
                          <td className="p-3 text-black font-mono font-bold">{m.avgMnGradePct}% Mn</td>
                          <td className="p-3 font-mono text-black font-bold">
                            {m.currentMonthlyTonnes.toLocaleString()} / {m.monthlyTargetTonnes.toLocaleString()} t
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${m.shortfallRiskLevel === 'CRITICAL'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : m.shortfallRiskLevel === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}
                            >
                              {m.shortfallRiskLevel} ({m.shortfallProbabilityPct}%)
                            </span>
                          </td>
                          <td className="p-3 text-red-700 font-mono font-bold">₹{m.revenueRiskCrores} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Priority Action Directives */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3 font-mono">
                  Immediate AI Prescriptive Directives
                </h4>
                <div className="space-y-2.5">
                  {report.urgentActionItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-300 flex items-start justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300 font-mono">
                            {item.category}
                          </span>
                          <span className="font-bold text-black text-xs font-sans">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-black font-medium">Target Mine: {item.mineName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-700 font-mono">
                          +{item.expectedTonnageGain} t
                        </span>
                        <span className="block text-[10px] text-black font-mono font-bold">ROI: ₹{item.estimatedRoiInrLakhs} L</span>
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
