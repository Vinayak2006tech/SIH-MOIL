import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  BarChart3,
  Calendar,
  CloudRain,
  Wrench,
  TrendingDown,
  Layers,
  Filter,
  CheckCircle2,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { api } from '../services/api';
import type { ProductionLog, AnnualProductionRecord } from '../types';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

const DOWNTIME_COLORS = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#64748B'];
const GRADE_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

export const ProductionAnalyticsPage: React.FC = () => {
  const { mines, selectedMineId, setSelectedMineId, selectedMine } = useMine();
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [annualSummary, setAnnualSummary] = useState<AnnualProductionRecord[]>([]);
  const [downtimeSummary, setDowntimeSummary] = useState<any[]>([]);
  const [monthlyDowntime, setMonthlyDowntime] = useState<any[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([]);
  const [correlationPoints, setCorrelationPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [prodLogs, annualData, dtData, gradeData, corrData] = await Promise.all([
          api.getProductionHistory(selectedMineId === 'ALL' ? undefined : selectedMineId, 12),
          api.getAnnualProductionSummary(),
          api.getDowntimeBreakdown(selectedMineId === 'ALL' ? undefined : selectedMineId),
          api.getOreGradeDistribution(selectedMineId === 'ALL' ? undefined : selectedMineId),
          api.getCorrelationData(selectedMineId === 'ALL' ? undefined : selectedMineId)
        ]);

        setLogs(prodLogs || []);
        setAnnualSummary(annualData || []);
        setDowntimeSummary(dtData?.summary || []);
        setMonthlyDowntime(dtData?.monthlyDowntime || []);
        setGradeDistribution(gradeData?.distribution || []);
        setCorrelationPoints(corrData || []);
      } catch (err) {
        console.error('Failed to load production analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedMineId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton rows={2} height="h-28" />
        <LoadingSkeleton rows={2} height="h-72" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Top Banner: Authentic MOIL Historical Trajectory */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase font-bold text-purple-400">
                Official MOIL Limited Disclosures
              </span>
              <ProvenanceBadge
                sourceId="src-moil-ar-2025"
                dataType="OFFICIAL_MOIL"
                sourceName="MOIL Limited 64th Annual Report & PIB"
              />
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Historical Production & Sales Trajectory (FY23 – FY26)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Official statutory audited performance: MOIL achieved a historical milestone of <strong>19.07 Lakh tonnes</strong> in FY 2025–26 (5.8% YoY growth), on track toward its Vision 2030 target of 3.5 Million Tonnes per annum.
            </p>
          </div>
        </div>

        {/* Annual Trajectory Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {annualSummary.map((yr) => (
            <div key={yr.fiscalYear} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-purple-400">{yr.fiscalYear}</span>
                {yr.growthRatePct && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    +{yr.growthRatePct}% YoY
                  </span>
                )}
              </div>
              <div className="text-xl font-extrabold text-white">
                {(yr.productionTonnes / 100000).toFixed(2)} <span className="text-xs font-normal text-slate-400">Lakh Tonnes</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Sales:</span>
                <span className="text-slate-200 font-semibold">{(yr.salesTonnes / 100000).toFixed(2)} L t</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Extraction vs Quota Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Monthly Extraction vs Target Quota (Past 12 Months)
              </h3>
              <ProvenanceBadge sourceId="src-moil-ar-2025" dataType="OFFICIAL_MOIL" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing monthly extraction milestones against planned dispatch commitments
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={logs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit=" t" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#F8FAFC'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="actualTonnes" name="Actual Extraction (Tonnes)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="targetTonnes" name="Planned Target Quota (Tonnes)" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar dataKey="salesTonnes" name="Realized Domestic Sales (Tonnes)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Row: Downtime Causes & Rainfall Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" /> Operational Downtime Cause Breakdown
              </h3>
              <ProvenanceBadge sourceId="src-synthetic-equipment" dataType="SYNTHETIC_DEMO" isSynthetic={true} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hourly idle cause categorization across mechanical, weather, and logistical bottlenecks
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={downtimeSummary}
                  dataKey="hours"
                  nameKey="cause"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {downtimeSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DOWNTIME_COLORS[index % DOWNTIME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainfall vs Production Dip Correlation */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" /> Rainfall vs Production Variance Correlation
              </h3>
              <ProvenanceBadge sourceId="src-imd-weather" dataType="PUBLIC_WEATHER" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Impact of monsoon precipitation (mm) on open bench extraction and haulage slippage
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationPoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#8B5CF6" fontSize={11} tickLine={false} unit=" t" />
                <YAxis yAxisId="right" orientation="right" stroke="#06B6D4" fontSize={11} tickLine={false} unit="mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="actualProductionTonnes" name="Production (t)" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="rainfallMm" name="Precipitation (mm)" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
