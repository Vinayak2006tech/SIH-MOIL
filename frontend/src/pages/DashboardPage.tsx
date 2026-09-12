import React, { useState, useEffect } from 'react';
import {
  Database,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Sparkles,
  ShieldAlert,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';
import { useMine } from '../context/MineContext';
import type { DashboardSummary, ProductionLog, ShortfallRisk } from '../types';
import type { TabType } from '../components/layout/Sidebar';

interface DashboardPageProps {
  setActiveTab: (tab: TabType) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { mines, selectedMineId, setSelectedMineId, selectedMine } = useMine();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [productionHistory, setProductionHistory] = useState<ProductionLog[]>([]);
  const [shortfallRisks, setShortfallRisks] = useState<ShortfallRisk[]>([]);
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [sumData, prodData, riskData] = await Promise.all([
          api.getDashboardSummary(),
          api.getProductionHistory(selectedMineId === 'ALL' ? undefined : selectedMineId, 12),
          api.getShortfallRisks(selectedMineId === 'ALL' ? undefined : selectedMineId)
        ]);
        setSummary(sumData);
        setProductionHistory(prodData || []);
        setShortfallRisks(riskData || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedMineId]);

  if (loading && !summary) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton rows={4} height="h-28" />
        <LoadingSkeleton rows={2} height="h-80" />
      </div>
    );
  }

  // Process data for Chart (incorporating forecast horizon points)
  const chartData = productionHistory.map((p) => ({
    month: p.date,
    actual: p.actualTonnes,
    target: p.targetTonnes,
    rainfall: p.rainfallMm,
    uptime: p.equipmentUptimePct
  }));

  // Append Forecast point based on selected horizon
  if (chartData.length > 0) {
    const lastTarget = chartData[chartData.length - 1].target;
    const activeRisk = shortfallRisks[0];
    const horizonObj = activeRisk?.horizons?.find((h) => h.horizon_days === horizonDays);
    const predVal = horizonObj ? horizonObj.predicted_production_tonnes : Math.round(lastTarget * 0.88);
    const lowerVal = horizonObj ? horizonObj.confidence_lower_tonnes : Math.round(predVal * 0.92);
    const upperVal = horizonObj ? horizonObj.confidence_upper_tonnes : Math.round(predVal * 1.06);

    chartData.push({
      month: `${horizonDays}d AI Forecast`,
      actual: undefined as any,
      target: lastTarget,
      predicted: predVal,
      confidenceLower: lowerVal,
      confidenceUpper: upperVal,
      rainfall: 35,
      uptime: 78
    } as any);
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Top Banner Alert if Critical Risk */}
      {summary && (summary.criticalMinesCount > 0 || summary.highRiskMinesCount > 0) && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-[#161D22] to-amber-950/80 border border-[#DC5F4E]/60 shadow-glow-red flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-[#DC5F4E]">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#E8E6E3] flex items-center gap-2 font-sans">
                Production Shortfall Advisory Active
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-[#DC5F4E] border border-red-800 uppercase font-mono font-bold">
                  {summary.criticalMinesCount} Critical • {summary.highRiskMinesCount} High Risk
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                Machine breakdown at Kandri Mine and monsoon waterlogging at Balaghat Pit 2 pose high shortfall risk over the next 30 days.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 bg-gradient-to-r from-red-700 to-[#DC5F4E] hover:from-red-600 hover:to-red-500 text-white text-xs font-bold rounded-lg shadow-glow-red transition flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3.5 h-3.5" /> View AI Mitigations
          </button>
        </div>
      )}

      {/* Authentic MOIL Disclosures & National Inventory Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#161D22]/85 border border-[#26333B] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              National Mineral Inventory (IBM & MOIL):{' '}
              <strong className="text-teal-300 font-mono">121.97 Mt</strong> Total Reserves & Resources
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ProvenanceBadge
              sourceId="src-ibm-nmi-manganese"
              dataType="PUBLIC_GOVERNMENT"
              sourceName="IBM & MOIL Disclosures"
              isSynthetic={false}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#161D22] via-[#2F2742]/30 to-[#161D22] border border-[#26333B] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              Global Reserves (USGS 2024):{' '}
              <strong className="text-amber-300 font-mono">1,900 Mt</strong> Contained Mn (World Output: 20.0 Mt Mn/yr)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ProvenanceBadge
              sourceId="src-usgs-manganese-2024"
              dataType="PUBLIC_GOVERNMENT"
              sourceName="USGS Minerals"
              isSynthetic={false}
            />
            <button
              onClick={() => setActiveTab('global-market')}
              className="px-2.5 py-1 bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-glow-manganese cursor-pointer"
            >
              Explore World Map &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Estimated Reserves"
          value={selectedMine ? selectedMine.totalReservesMt : summary?.totalEstimatedReservesMt || 0}
          unit="Million Tonnes"
          subtitle={selectedMine ? `Proved: ${selectedMine.provedReservesMt} Mt` : 'Across 8 Central India Leases'}
          icon={Database}
          accentColor="manganese"
          trend={{ value: '+4.2%', isPositive: true, label: 'vs FY25 Survey' }}
          onClick={() => setActiveTab('reserve-map')}
        />

        <KpiCard
          title="Current Monthly Output"
          value={
            selectedMine
              ? selectedMine.currentMonthlyProductionTonnes.toLocaleString()
              : (summary?.totalCurrentMonthlyProductionTonnes || 0).toLocaleString()
          }
          unit="Tonnes"
          subtitle={`Target: ${(selectedMine ? selectedMine.targetMonthlyTonnes : summary?.totalMonthlyTargetTonnes || 0).toLocaleString()} t`}
          icon={TrendingUp}
          accentColor="teal"
          progress={summary?.productionFulfillmentPct || 88}
          trend={{
            value: `${summary?.productionFulfillmentPct || 88}%`,
            isPositive: (summary?.productionFulfillmentPct || 88) >= 90,
            label: 'Plan Fulfillment'
          }}
          onClick={() => setActiveTab('production')}
        />

        <KpiCard
          title="Active Shortfall Risk"
          value={selectedMine ? selectedMine.currentShortfallRiskLevel : summary?.overallRiskStatus || 'MODERATE'}
          subtitle={selectedMine ? `Probability: ${selectedMine.currentShortfallProbabilityPct}%` : `${summary?.criticalMinesCount} Critical Mines`}
          icon={AlertTriangle}
          accentColor={summary?.overallRiskStatus === 'CRITICAL' ? 'red' : 'amber'}
          onClick={() => setActiveTab('shortfall')}
        />

        <KpiCard
          title="Fleet Equipment Uptime"
          value={selectedMine ? `${selectedMine.equipmentUptimePct}%` : `${summary?.avgEquipmentUptimePct || 82}%`}
          subtitle={`${summary?.operationalEquipmentCount || 18} / ${summary?.totalEquipmentCount || 22} Active Machines`}
          icon={Cpu}
          accentColor="emerald"
          progress={selectedMine ? selectedMine.equipmentUptimePct : summary?.avgEquipmentUptimePct || 82}
          trend={{ value: '85% Target', isPositive: (summary?.avgEquipmentUptimePct || 82) >= 85, label: 'Benchmark' }}
          onClick={() => setActiveTab('equipment')}
        />
      </div>

      {/* Main Chart Section: Production Trend & Multi-Horizon AI Forecast */}
      <div className="glass-panel rounded-2xl p-6 border border-[#26333B]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#E8E6E3] flex items-center gap-2 font-sans">
                Monthly Manganese Ore Output & AI Risk Forecast
              </h3>
              <ProvenanceBadge
                sourceId="src-moil-ar-2025"
                dataType="OFFICIAL_MOIL"
                sourceName="MOIL Limited Operational Review"
              />
              <ProvenanceBadge
                sourceId="src-imd-weather"
                dataType="PUBLIC_WEATHER"
                sourceName="IMD Rainfall Correlation"
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Actual extraction vs Target plan with model-derived probabilistic forecast interval
            </p>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0F1214] border border-[#26333B] rounded-lg font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" /> Forecast Horizon:
            </span>
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setHorizonDays(days)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${horizonDays === days
                  ? 'bg-gradient-to-r from-[#6B5B95] to-[#0D9488] text-white shadow-glow-teal'
                  : 'text-slate-400 hover:text-white hover:bg-[#161D22]'
                  }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26333B" vertical={false} />
              <XAxis dataKey="month" stroke="#8A99A8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#8A99A8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k t`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161D22',
                  borderColor: '#26333B',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#E8E6E3'
                }}
                formatter={(val: any, name: any) => [
                  val !== undefined ? `${val.toLocaleString()} Tonnes` : 'N/A',
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Shaded Target Area */}
              <Area
                type="monotone"
                dataKey="target"
                name="Target Monthly Quota"
                fill="rgba(45, 212, 191, 0.08)"
                stroke="#2DD4BF"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />

              {/* Actual Production Bar - Manganese Violet */}
              <Bar dataKey="actual" name="Actual Extraction Output" fill="#7E69AB" radius={[4, 4, 0, 0]} maxBarSize={38} />

              {/* Forecast Point & Confidence - Earth-Tech Red/Amber/Emerald */}
              <Line
                type="monotone"
                dataKey="predicted"
                name="AI Predicted Production"
                stroke="#DC5F4E"
                strokeWidth={3}
                dot={{ r: 6, fill: '#DC5F4E' }}
              />
              <Line
                type="monotone"
                dataKey="confidenceLower"
                name="Lower Confidence Band"
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confidenceUpper"
                name="Upper Confidence Band"
                stroke="#10B981"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Mine Risk Matrix & AI Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mine-Wise Risk & Production Matrix */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-[#26333B]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#E8E6E3] uppercase tracking-wider font-mono">
                MOIL Mine Leases • Live Risk Matrix
              </h3>
              <p className="text-xs text-slate-400">Status across Central India manganese belt</p>
            </div>
            <button
              onClick={() => setActiveTab('reserve-map')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer font-mono"
            >
              View on GIS Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0F1214] text-slate-400 uppercase font-mono border-b border-[#26333B]">
                <tr>
                  <th className="p-3">Mine Site</th>
                  <th className="p-3">Reserves</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Uptime</th>
                  <th className="p-3">Shortfall Risk</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26333B]/60 font-medium">
                {mines.map((mine) => (
                  <tr
                    key={mine.mineId}
                    className={`hover:bg-[#1B2226]/50 transition ${selectedMineId === mine.mineId ? 'bg-teal-950/20' : ''
                      }`}
                  >
                    <td className="p-3 font-semibold text-[#E8E6E3]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <div>
                          {mine.name}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {mine.district}, {mine.state} ({mine.type})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-200 font-mono">{mine.totalReservesMt} Mt</td>
                    <td className="p-3 text-slate-200 font-mono">{mine.avgMnGradePct}% Mn</td>
                    <td className="p-3 text-slate-200 font-mono">{mine.equipmentUptimePct}%</td>
                    <td className="p-3">
                      <RiskBadge level={mine.currentShortfallRiskLevel} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMineId(mine.mineId);
                          setActiveTab('shortfall');
                        }}
                        className="px-2.5 py-1 bg-[#161D22] hover:bg-gradient-to-r hover:from-[#6B5B95] hover:to-[#0D9488] text-slate-300 hover:text-white border border-[#26333B] rounded text-[11px] font-bold transition cursor-pointer"
                      >
                        Inspect AI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Alert Feed & Quick Actions */}
        <div className="glass-panel rounded-2xl p-6 border border-[#26333B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#E8E6E3] uppercase tracking-wider flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Real-Time Alerts
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0F1214] border border-[#26333B] text-slate-300 rounded-full">
                Telemetry
              </span>
            </div>

            <div className="space-y-3">
              {summary?.activeAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B] hover:border-teal-500/40 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#E8E6E3] font-sans">{alert.mineName}</span>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Mitigations CTA */}
          <div className="mt-6 pt-4 border-t border-[#26333B]">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white text-xs font-bold rounded-xl shadow-glow-manganese transition flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <Sparkles className="w-4 h-4" /> Open Prescriptive Engine ({summary?.pendingRecommendationsCount || 3} Actions)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
