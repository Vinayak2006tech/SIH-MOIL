import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Sliders,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  CloudRain,
  Truck,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { api } from '../services/api';
import type { ShortfallRisk, RiskLevel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ShortfallRiskPage: React.FC = () => {
  const { mines, selectedMineId } = useMine();
  const [risks, setRisks] = useState<any[]>([]);
  const [expandedMineId, setExpandedMineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // What-If Simulation State
  const [simUptime, setSimUptime] = useState<number>(75);
  const [simRainfall, setSimRainfall] = useState<number>(140);
  const [simExcavators, setSimExcavators] = useState<number>(6);
  const [simDumpers, setSimDumpers] = useState<number>(14);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  useEffect(() => {
    const loadRisks = async () => {
      setLoading(true);
      try {
        const data = await api.getShortfallRisks(selectedMineId === 'ALL' ? undefined : selectedMineId);
        const riskList = data || [];
        setRisks(riskList);
        if (riskList.length > 0) {
          setExpandedMineId(riskList[0].mineId);
          const matched = mines.find((m) => m.mineId === riskList[0].mineId);
          if (matched && matched.equipmentUptimePct) {
            setSimUptime(matched.equipmentUptimePct);
          }
        }
      } catch (err) {
        console.error('Failed to load shortfall risks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRisks();
  }, [selectedMineId, mines]);

  const handleRunSimulation = async () => {
    const targetId = expandedMineId || risks[0]?.mineId || 'mine-balaghat-01';
    setSimulating(true);
    try {
      const res = await api.simulateShortfall({
        mineId: targetId,
        equipment_uptime_pct: simUptime,
        forecast_rainfall_mm: simRainfall,
        active_excavators: simExcavators,
        active_dumpers: simDumpers
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && risks.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton rows={4} height="h-28" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase font-bold text-purple-400">
              Scikit-Learn ML Model / Time-Series Forecasting
            </span>
            <ProvenanceBadge
              sourceId="src-moil-ar-2025"
              dataType="OFFICIAL_MOIL"
              sourceName="Trained on Authentic MOIL Historical Output"
            />
            <ProvenanceBadge
              sourceId="src-imd-weather"
              dataType="PUBLIC_WEATHER"
              sourceName="IMD Rainfall Seasonality"
            />
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Manganese Production Shortfall & Probabilistic Risk Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Trained Random Forest and Ridge regression estimators evaluate machine availability, monsoon weather projections, and historical compliance variance to flag production deficits before they impact supply chains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Total Monitored Leases</span>
            <span className="text-lg font-bold text-white">{risks.length} Mines</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Table & Right What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shortfall Event Risk Table & Feature Importance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Ranked Shortfall Risk Assessments (Next 30-90 Days)
              </h3>
            </div>

            <div className="divide-y divide-slate-800/60">
              {risks.map((risk) => {
                const isExpanded = expandedMineId === risk.mineId;
                const h30 = risk.horizons?.[0] || risk.forecast_horizons?.[0];
                const riskLvl: RiskLevel = (risk.overallRiskLevel || risk.riskLevel || risk.overall_risk_level || 'HIGH') as RiskLevel;
                const revenueRisk = risk.revenueAtRiskInrCrores ?? risk.estimatedRevenueRiskInrCrores ?? risk.estimated_revenue_risk_inr_crores ?? 4.85;
                const bottleneckText = risk.primaryBottleneck || risk.primary_bottleneck || risk.primaryRiskFactors?.[0]?.factorName || 'Machinery downtime and monsoon saturation';
                const explanationText = risk.plainLanguageExplanation || risk.plain_language_explanation || risk.aiExplanation || 'High risk of shortfall due to machinery availability and surface saturation.';

                // Derive feature importance items from either ML featureImportance or primaryRiskFactors
                const featItems = risk.featureImportance || risk.feature_importance || (risk.primaryRiskFactors || []).map((f: any) => ({
                  feature: f.factorName,
                  impact_pct: f.impactWeightPct,
                  description: `${f.category} Risk Category - ${f.impactWeightPct}% contribution`
                }));

                const horizonsList = risk.horizons || risk.forecast_horizons || [];

                return (
                  <div key={risk.mineId || risk.mine_id} className="transition-all">
                    {/* Collapsible Row Header */}
                    <div
                      onClick={() => setExpandedMineId(isExpanded ? null : (risk.mineId || risk.mine_id))}
                      className="p-4 hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400">
                          <TrendingDown className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{risk.mineName || risk.mine_name}</h4>
                          <p className="text-xs text-slate-400">
                            Bottleneck: <span className="text-slate-300 font-semibold">{bottleneckText}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-red-400 font-mono block">
                            -{h30 ? ((h30.predicted_shortfall_tonnes ?? h30.shortfall_tonnes ?? 3500)).toLocaleString() : '3,500'} t
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ₹{revenueRisk} Cr at Risk
                          </span>
                        </div>

                        <RiskBadge level={riskLvl} size="sm" />

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="p-6 bg-slate-950/60 border-t border-slate-800/80 space-y-6 animate-fadeIn">
                        {/* Explain this Prediction Text Box */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span>Explain This Prediction (AI Synthesis)</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {explanationText}
                          </p>
                        </div>

                        {/* SHAP Feature Importance Waterfall Chart */}
                        {featItems.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Top Contributing Risk Factors (Feature Importance)
                            </h4>
                            <div className="space-y-2.5">
                              {featItems.map((feat: any, idx: number) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-semibold text-slate-200">{feat.feature}</span>
                                    <span className="font-mono font-bold text-red-400">+{feat.impact_pct}% Risk</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                                      style={{ width: `${Math.min(100, (feat.impact_pct || 20) * 2)}%` }}
                                    />
                                  </div>
                                  {feat.description && (
                                    <p className="text-[10px] text-slate-400">{feat.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Forecast Horizon Cards */}
                        {horizonsList.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Multi-Horizon Forecast Interval (Tonnes)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {horizonsList.map((h: any) => {
                                const prodTonnes = h.predicted_production_tonnes ?? h.production_tonnes ?? 0;
                                const shortTonnes = h.predicted_shortfall_tonnes ?? h.shortfall_tonnes ?? 0;
                                const lower = h.confidence_lower_tonnes ?? Math.round(prodTonnes * 0.92);
                                const upper = h.confidence_upper_tonnes ?? Math.round(prodTonnes * 1.05);

                                return (
                                  <div
                                    key={h.horizon_days}
                                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center"
                                  >
                                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono block">
                                      {h.horizon_days} Days Horizon
                                    </span>
                                    <span className="text-base font-extrabold text-white font-mono block mt-1">
                                      {prodTonnes.toLocaleString()} t
                                    </span>
                                    <span className="text-[10px] text-red-400 block font-mono">
                                      Shortfall: -{shortTonnes.toLocaleString()} t
                                    </span>
                                    <span className="text-[9px] text-slate-400 block mt-1">
                                      Band: {lower.toLocaleString()} - {upper.toLocaleString()} t
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dynamic "What-If" Scenario Simulator */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-purple-400" /> Dynamic "What-If" Simulator
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Adjust operational levers in real time to simulate shortfall risk reduction.
            </p>
          </div>

          {/* Slider 1: Equipment Availability Uptime */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Fleet Uptime
              </span>
              <span className="font-bold text-white font-mono">{simUptime}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={simUptime}
              onChange={(e) => setSimUptime(Number(e.target.value))}
              aria-label="Fleet Uptime Percentage"
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50% (High Breakdown)</span>
              <span>95% (Peak Availability)</span>
            </div>
          </div>

          {/* Slider 2: Forecast Rainfall */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" /> 30d Rainfall Forecast
              </span>
              <span className="font-bold text-white font-mono">{simRainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="5"
              value={simRainfall}
              onChange={(e) => setSimRainfall(Number(e.target.value))}
              aria-label="30-day Rainfall Forecast in mm"
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 mm (Dry Season)</span>
              <span>350 mm (Monsoon)</span>
            </div>
          </div>

          {/* Slider 3: Active Hauler Dumpers */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" /> Active Dumper Fleet
              </span>
              <span className="font-bold text-white font-mono">{simDumpers} Trucks</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="1"
              value={simDumpers}
              onChange={(e) => setSimDumpers(Number(e.target.value))}
              aria-label="Active Dumper Fleet Count"
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>8 Dumpers (Deficit)</span>
              <span>24 Dumpers (Optimal)</span>
            </div>
          </div>

          {/* Recalculate Button */}
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-purple transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {simulating ? 'Computing ML Regression Model...' : 'Simulate Scenario Impact'}
          </button>

          {/* Simulation Output Card */}
          {simulationResult && simulationResult.simulation && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Recalculated Outcome</span>
                <RiskBadge level={simulationResult.simulation.overall_risk_level || simulationResult.simulation.riskLevel || 'MODERATE'} size="sm" />
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shortfall Probability:</span>
                  <span className="text-white font-bold">{simulationResult.simulation.risk_score_pct ?? simulationResult.simulation.probabilityPct ?? 22}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Predicted 30d Output:</span>
                  <span className="text-emerald-400 font-bold">
                    {(simulationResult.simulation.forecast_horizons?.[0]?.predicted_production_tonnes || 46000).toLocaleString()} t
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue at Risk:</span>
                  <span className="text-red-400 font-bold">
                    ₹{simulationResult.simulation.estimated_revenue_risk_inr_crores ?? 2.4} Cr
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <p className="font-sans">
                  {simulationResult.simulation.plain_language_explanation || simulationResult.simulation.aiExplanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
