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
      {summary && (((summary.criticalMinesCount ?? 0) > 0) || ((summary.highRiskMinesCount ?? 0) > 0)) && (
        <div className="p-4 rounded-2xl bg-white border border-red-300 shadow-sm flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <ShieldAlert className="w-5 h-5 animate-pulse text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black flex items-center gap-2 font-sans">
                Production Shortfall Advisory Active
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 uppercase font-mono font-bold">
                  {summary.criticalMinesCount} Critical • {summary.highRiskMinesCount} High Risk
                </span>
              </h4>
              <p className="text-xs text-black font-medium mt-0.5">
                Machine breakdown at Kandri Mine and monsoon waterlogging at Balaghat Pit 2 pose high shortfall risk over the next 30 days.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-black text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" /> View AI Mitigations
          </button>
        </div>
      )}

      {/* Authentic MOIL Disclosures & National Inventory Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-black">
              National Mineral Inventory (IBM & MOIL):{' '}
              <strong className="text-black font-mono font-black text-sm">121.97 Mt</strong> Total Reserves & Resources
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

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-xs font-bold text-black">
              Global Reserves (USGS 2024):{' '}
              <strong className="text-black font-mono font-black text-sm">1,900 Mt</strong> Contained Mn (World Output: 20.0 Mt Mn/yr)
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
              className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-black text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-sm cursor-pointer"
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-black flex items-center gap-2 font-sans">
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
            <p className="text-xs text-black font-medium mt-0.5">
              Actual extraction vs Target plan with model-derived probabilistic forecast interval
            </p>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg font-mono shadow-sm">
            <span className="text-[10px] uppercase font-bold text-black px-2 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-700" /> Forecast Horizon:
            </span>
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setHorizonDays(days)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${horizonDays === days
                  ? 'bg-teal-700 text-black shadow-sm font-extrabold'
                  : 'text-black hover:bg-slate-100'
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#000000" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#000000"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k t`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CBD5E1',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#000000',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(val: any, name: any) => [
                  val !== undefined ? `${val.toLocaleString()} Tonnes` : 'N/A',
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#000000' }} />

              {/* Shaded Target Area */}
              <Area
                type="monotone"
                dataKey="target"
                name="Target Monthly Quota"
                fill="rgba(13, 148, 136, 0.08)"
                stroke="#0D9488"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />

              {/* Actual Production Bar */}
              <Bar dataKey="actual" name="Actual Extraction Output" fill="#0D9488" radius={[4, 4, 0, 0]} maxBarSize={38} />

              {/* Forecast Point & Confidence */}
              <Line
                type="monotone"
                dataKey="predicted"
                name="AI Predicted Production"
                stroke="#DC2626"
                strokeWidth={3}
                dot={{ r: 6, fill: '#DC2626' }}
              />
              <Line
                type="monotone"
                dataKey="confidenceLower"
                name="Lower Confidence Band"
                stroke="#D97706"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confidenceUpper"
                name="Upper Confidence Band"
                stroke="#059669"
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
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-wider font-mono">
                MOIL Mine Leases • Live Risk Matrix
              </h3>
              <p className="text-xs text-black font-medium">Status across Central India manganese belt</p>
            </div>
            <button
              onClick={() => setActiveTab('reserve-map')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer font-mono"
            >
              View on GIS Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-black uppercase font-mono border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Mine Site</th>
                  <th className="p-3">Reserves</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Uptime</th>
                  <th className="p-3">Shortfall Risk</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {mines.map((mine) => (
                  <tr
                    key={mine.mineId}
                    className={`hover:bg-slate-50 transition ${selectedMineId === mine.mineId ? 'bg-teal-50/60' : ''
                      }`}
                  >
                    <td className="p-3 font-bold text-black">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <div>
                          {mine.name}
                          <span className="block text-[10px] text-black font-normal">
                            {mine.district}, {mine.state} ({mine.type})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-teal-700 font-mono font-bold">{mine.totalReservesMt} Mt</td>
                    <td className="p-3 text-emerald-700 font-mono font-bold">{mine.avgMnGradePct}% Mn</td>
                    <td className="p-3 text-black font-mono font-bold">{mine.equipmentUptimePct}%</td>
                    <td className="p-3">
                      <RiskBadge level={mine.currentShortfallRiskLevel} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMineId(mine.mineId);
                          setActiveTab('shortfall');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-black border border-slate-300 rounded text-[11px] font-bold shadow-sm transition cursor-pointer"
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
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Real-Time Alerts
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-50 border border-slate-200 text-black font-bold rounded-full">
                Telemetry
              </span>
            </div>

            <div className="space-y-3">
              {summary?.activeAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-teal-500 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-black font-sans">{alert.mineName}</span>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-black font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Mitigations CTA */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-black text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <Sparkles className="w-4 h-4 text-black" /> Open Prescriptive Engine ({summary?.pendingRecommendationsCount || 3} Actions)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
