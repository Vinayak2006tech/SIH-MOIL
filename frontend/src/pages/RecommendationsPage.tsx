import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  Truck,
  CloudRain,
  Layers,
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Recommendation } from '../types';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const RecommendationsPage: React.FC = () => {
  const { selectedMineId } = useMine();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [feedbackMetrics, setFeedbackMetrics] = useState<any>(null);
  const [feedbackLog, setFeedbackLog] = useState<Recommendation[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadRecommendationsData = async () => {
    setLoading(true);
    try {
      const [recs, fbData] = await Promise.all([
        api.getRecommendations(selectedMineId === 'ALL' ? undefined : selectedMineId),
        api.getFeedbackLoopHistory()
      ]);
      setRecommendations(recs || []);
      setFeedbackMetrics(fbData?.metrics || null);
      setFeedbackLog(fbData?.feedbackLog || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendationsData();
  }, [selectedMineId]);

  const handleAction = async (recId: string, status: 'ACCEPTED' | 'REJECTED' | 'SNOOZED') => {
    setActionInProgress(recId);
    try {
      const outcomeNote =
        status === 'ACCEPTED'
          ? `Executed by ${user?.name || 'Mine Planner'}. Directive issued to shift supervisor.`
          : status === 'REJECTED'
            ? `Declined by ${user?.name || 'Mine Planner'}. Operational constraints identified.`
            : `Snoozed for 24h by ${user?.name || 'Mine Planner'}.`;

      await api.updateRecommendationStatus(recId, status, outcomeNote);
      await loadRecommendationsData();
    } catch (err) {
      console.error('Action update failed:', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredRecs = recommendations.filter((r) => {
    const matchesCat = filterCategory === 'ALL' || r.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesCat && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Blasting Optimization':
        return Zap;
      case 'Fleet Redeployment':
        return Truck;
      case 'Maintenance Scheduling':
        return Wrench;
      case 'Weather Mitigation':
        return CloudRain;
      default:
        return Layers;
    }
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton rows={4} height="h-32" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-manganese-400">
            Prescriptive Optimization & Decision Support
          </span>
          <h2 className="text-xl font-bold text-[#E8E6E3] mt-1">
            AI Corrective Action Recommendations & Feedback Loop
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            ReserveIQ combines shortfall risk vectors with operational fleet data to propose high-impact corrective actions. Closing the loop by applying recommendations continuously trains the underlying models.
          </p>
        </div>

        {/* Feedback Summary Stats */}
        {feedbackMetrics && (
          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0F1214]/80 border border-[#26333B] text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Acceptance Rate</span>
              <span className="text-lg font-bold text-tech-teal font-mono">
                {feedbackMetrics.acceptanceRatePct}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0F1214]/80 border border-[#26333B] text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Realized Tonnage Gain</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                +{feedbackMetrics.totalRealizedTonnageGain?.toLocaleString()} t
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26333B] pb-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#12181A] p-1 rounded-lg border border-[#26333B]">
          {['PENDING', 'ACCEPTED', 'REJECTED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${filterStatus === st
                ? 'bg-tech-teal text-[#0F1214] shadow-glow-teal font-extrabold'
                : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#12181A] border border-[#26333B] text-xs font-semibold text-[#E8E6E3] rounded-lg focus:outline-none focus:border-tech-teal cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Blasting Optimization">Blasting Optimization</option>
            <option value="Fleet Redeployment">Fleet Redeployment</option>
            <option value="Maintenance Scheduling">Maintenance Scheduling</option>
            <option value="Weather Mitigation">Weather Mitigation</option>
            <option value="Grade Blending">Grade Blending</option>
          </select>
        </div>
      </div>

      {/* Active Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => {
          const Icon = getCategoryIcon(rec.category);
          const isPending = rec.status === 'PENDING';
          const isAccepted = rec.status === 'ACCEPTED';
          const isRejected = rec.status === 'REJECTED';

          return (
            <div
              key={rec.recommendationId || rec._id}
              className={`glass-panel rounded-2xl p-6 border transition-all duration-300 bg-[#161D22]/85 ${isPending
                ? 'border-[#26333B] hover:border-tech-teal/50 hover:shadow-glow-teal'
                : isAccepted
                  ? 'border-emerald-800/60 bg-emerald-950/20'
                  : 'border-[#26333B]/60 opacity-70'
                }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-manganese-500/10 border border-manganese-500/20 text-manganese-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono uppercase bg-manganese-950 text-manganese-300 border border-manganese-800">
                      {rec.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold ml-2">{rec.mineName}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${rec.urgency === 'CRITICAL'
                    ? 'bg-red-950 text-[#DC5F4E] border border-red-800 animate-pulse'
                    : rec.urgency === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-tech-teal/10 text-tech-teal border border-tech-teal/30'
                    }`}
                >
                  {rec.urgency} Urgency
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-[#E8E6E3] mb-2">{rec.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rec.description}</p>

              {/* Action Steps Checklist */}
              {rec.actionSteps && rec.actionSteps.length > 0 && (
                <div className="p-3 rounded-xl bg-[#0F1214]/70 border border-[#26333B] mb-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Execution Directives
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {rec.actionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tech-teal shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simulated Impact Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#0F1214]/60 border border-[#26333B] mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Risk Reduction</span>
                  <span className="text-xs font-bold text-emerald-400">-{rec.expectedRiskReductionPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Tonnage Gain</span>
                  <span className="text-xs font-bold text-tech-teal">+{rec.expectedTonnageGain} t</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Est. ROI Impact</span>
                  <span className="text-xs font-bold text-[#E8E6E3]">₹{rec.estimatedRoiInrLakhs} L</span>
                </div>
              </div>

              {/* Action Buttons or Status Outcome */}
              {isPending ? (
                <div className="flex items-center gap-2 pt-2 border-t border-[#26333B]">
                  <button
                    onClick={() => handleAction(rec.recommendationId || rec._id!, 'ACCEPTED')}
                    disabled={actionInProgress === (rec.recommendationId || rec._id)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0F1214] text-xs font-bold rounded-lg shadow-glow-teal transition flex items-center justify-center gap-1.5 font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F1214]" /> Accept & Apply Directive
                  </button>
                  <button
                    onClick={() => handleAction(rec.recommendationId || rec._id!, 'SNOOZED')}
                    disabled={actionInProgress === (rec.recommendationId || rec._id)}
                    className="py-2 px-3 bg-[#12181A] hover:bg-[#1B2226] border border-[#26333B] text-slate-300 text-xs font-bold rounded-lg transition"
                    title="Snooze 24h"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAction(rec.recommendationId || rec._id!, 'REJECTED')}
                    disabled={actionInProgress === (rec.recommendationId || rec._id)}
                    className="py-2 px-3 bg-red-950/60 hover:bg-red-900 border border-red-800 text-[#DC5F4E] text-xs font-bold rounded-lg transition"
                    title="Reject"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-[#0F1214]/80 border border-[#26333B] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-bold font-mono text-[11px] ${isAccepted ? 'text-emerald-400' : 'text-[#DC5F4E]'
                        }`}
                    >
                      Status: {rec.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rec.actionTimestamp ? new Date(rec.actionTimestamp).toLocaleDateString() : 'Logged'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rec.outcomeNote || `Action logged by ${rec.actionTakenBy}`}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Historical Outcome Feedback Loop Log Table */}
      <div className="glass-panel rounded-2xl p-6 border border-[#26333B] bg-[#161D22]/85">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#E8E6E3] uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-tech-teal" /> Recommendation Outcome Feedback Loop Log
            </h3>
            <p className="text-xs text-slate-400">
              Validating whether applied AI actions achieved projected tonnage gains in actual production logs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0F1214]/80 text-slate-400 uppercase font-mono border-b border-[#26333B]">
              <tr>
                <th className="p-3">Recommendation Directive</th>
                <th className="p-3">Mine</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Actioned By</th>
                <th className="p-3">Projected vs Realized Gain</th>
                <th className="p-3">Outcome Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26333B]/60 font-medium">
              {feedbackLog.map((log) => (
                <tr key={log.recommendationId || log._id} className="hover:bg-[#161D22]">
                  <td className="p-3 font-semibold text-[#E8E6E3] max-w-xs truncate">
                    {log.title}
                  </td>
                  <td className="p-3 text-slate-300">{log.mineName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${log.status === 'ACCEPTED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-[#DC5F4E] border border-red-800'
                        }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{log.actionTakenBy || 'Mine Planner'}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">
                    +{log.realizedTonnageGain || log.expectedTonnageGain} t (Est: +{log.expectedTonnageGain} t)
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] max-w-sm truncate">
                    {log.outcomeNote || 'Completed on active shift'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
