import React from 'react';
import {
  Sparkles,
  Layers,
  MapPin,
  BarChart3,
  TrendingDown,
  UploadCloud,
  Truck,
  Globe2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Activity,
  Satellite,
  Compass,
  Zap,
  Building2,
  Factory,
  Database,
  Cpu,
  Eye,
  FileText,
  Sliders,
  Flame,
  Award
} from 'lucide-react';
import type { TabType } from '../components/layout/Sidebar';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

interface LandingPageProps {
  setActiveTab: (tab: TabType) => void;
  onOpenProblemStatement: () => void;
  onOpenReport: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  onOpenProblemStatement,
  onOpenReport
}) => {
  const systemHighlights = [
    {
      icon: Database,
      value: '121.97 Mt',
      label: 'MOIL Total Reserves',
      sub: 'UNFC 111 Proved & Probable',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400'
    },
    {
      icon: TrendingDown,
      value: '19.07 Lakh T',
      label: 'Annual Milestone Output',
      sub: 'FY26 Record (+5.8% YoY)',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-400'
    },
    {
      icon: Satellite,
      value: '5-Day Revisit',
      label: 'Copernicus Sentinel-2',
      sub: 'Multi-Spectral InSAR & NDVI',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400'
    },
    {
      icon: Factory,
      value: '19 Locations',
      label: 'National Footprint',
      sub: '10 Mines • 6 Plants • 3 Blocks',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400'
    },
    {
      icon: Globe2,
      value: '1,900 Mt Mn',
      label: 'USGS Global Benchmark',
      sub: 'Contained Metal Inventory',
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-400'
    },
    {
      icon: Cpu,
      value: '84.6% Accuracy',
      label: 'Shortfall AI Predictor',
      sub: '30/60/90-Day Forecasts',
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-400'
    }
  ];

  const pillars = [
    {
      id: 'space-tech',
      icon: Satellite,
      badge: 'Space Technology',
      title: 'Earth Observation & Remote Sensing Telemetry',
      desc: 'Harnessing European Space Agency (ESA) Copernicus Sentinel-2 multi-spectral optical and Sentinel-1 SAR radar imagery to continuously monitor surface vegetation clearance (NDVI), soil moisture saturation index, land surface temperature, and monsoonal rainfall anomalies across all MOIL leases in Madhya Pradesh and Maharashtra.',
      features: [
        'Automated 5-day orbital pass synchronizer and telemetry ingest',
        'NDVI surface proxy for opencast stripping & environmental compliance',
        'Precipitation radar correlation with underground sump water ingress',
        'Sub-surface displacement and high-wall bench stability tracking'
      ],
      tab: 'ingestion' as TabType,
      btnText: 'Inspect Satellite Ingest',
      gradient: 'from-purple-900/40 via-slate-900 to-slate-950',
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-800/50'
    },
    {
      id: 'geostatistics',
      icon: MapPin,
      badge: 'Geostatistics & GIS',
      title: 'UNFC/JORC 3D Volumetric Reserve Re-Estimation',
      desc: 'Fusing 23 authentic diamond drill core assay logs (% Mn, % Fe, % SiO2, % P, RQD %, core recovery %) with geospatial polygon boundaries. Performs ordinary kriging and multi-variable geostatistical volumetric estimation across Balaghat, Dongri Buzurg, Kandri, Mansar, Gumgaon, Tirodi, Chikla, and Ukwa ore bodies.',
      features: [
        'Interactive 2D/3D GIS Reserve Map with 19 MOIL operational assets',
        'UNFC Category 111 Proved and 121/122 Probable confidence polygons',
        'Real-time collar borehole assay inspection and seam intercept logging',
        'AI Geostatistical simulation sandbox for instant ore body recalculation'
      ],
      tab: 'reserve-map' as TabType,
      btnText: 'Launch GIS Reserve Map',
      gradient: 'from-blue-900/40 via-slate-900 to-slate-950',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-800/50'
    },
    {
      id: 'shortfall-ai',
      icon: TrendingDown,
      badge: 'Machine Learning',
      title: 'Predictive Shortfall AI & Risk Attribution',
      desc: 'Ensemble machine-learning algorithms trained on 24-month historical extraction logs, SCADA heavy machinery telemetry (HEMM uptime, MTBF), and localized weather anomalies. Generates 30, 60, and 90-day time-series shortfall forecasts with confidence bands and SHAP feature importance explainability.',
      features: [
        'Proactive early-warning alerts for monthly production shortfall risks',
        'Multi-factor bottleneck attribution: Equipment vs Weather vs Logistics',
        'Live interactive What-If scenario sandbox (Uptime & Rainfall simulator)',
        'Quantified Revenue-at-Risk calculations in INR Crores'
      ],
      tab: 'shortfall' as TabType,
      btnText: 'Run Shortfall AI Simulator',
      gradient: 'from-amber-900/40 via-slate-900 to-slate-950',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-800/50'
    },
    {
      id: 'prescriptive-engine',
      icon: Sparkles,
      badge: 'Prescriptive Decision AI',
      title: 'Closed-Loop Action Recommendations Engine',
      desc: 'Transforms AI predictive shortfall alerts into actionable engineering and operational directives for mine managers, shift supervisors, and executive planners. Features an auditable human-in-the-loop feedback loop that logs accepted, rejected, and executed actions with quantified recovery tonnage and ROI in INR Lakhs.',
      features: [
        'Prioritized engineering interventions (Blasting, Spares, Dewatering)',
        'Direct equipment targeting (Jumbo drills, hoists, ropeways, excavators)',
        'ROI and tonnage recovery estimates for every prescriptive directive',
        'Closed-loop feedback tracking with real-time operational acceptance metrics'
      ],
      tab: 'recommendations' as TabType,
      btnText: 'View Prescriptive Directives',
      gradient: 'from-emerald-900/40 via-slate-900 to-slate-950',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-800/50'
    }
  ];

  const quickNavModules = [
    {
      id: 'dashboard',
      title: 'Executive Command Dashboard',
      subtitle: 'Real-time reserve inventory, production compliance, and risk matrix overview.',
      icon: BarChart3,
      badge: 'Overview',
      color: 'text-purple-400 border-purple-800/60 bg-purple-950/40'
    },
    {
      id: 'reserve-map',
      title: 'GIS Reserve & Satellite Map',
      subtitle: 'Interactive geospatial map plotting 10 mines, 6 plants, 3 exploration blocks & 23 boreholes.',
      icon: MapPin,
      badge: 'GIS Map',
      color: 'text-blue-400 border-blue-800/60 bg-blue-950/40'
    },
    {
      id: 'production',
      title: 'Production Analytics & Correlation',
      subtitle: 'FY23–FY26 historical trajectory, downtime cause breakdown, and weather impact.',
      icon: Activity,
      badge: 'Analytics',
      color: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40'
    },
    {
      id: 'shortfall',
      title: 'Shortfall & Risk AI Engine',
      subtitle: '30/60/90-day time-series shortfall forecasts and interactive What-If simulator.',
      icon: TrendingDown,
      badge: 'ML Engine',
      color: 'text-amber-400 border-amber-800/60 bg-amber-950/40'
    },
    {
      id: 'recommendations',
      title: 'Recommendations Engine',
      subtitle: 'AI-generated corrective mining interventions with closed-loop outcome tracking.',
      icon: Sparkles,
      badge: 'Prescriptive',
      color: 'text-indigo-400 border-indigo-800/60 bg-indigo-950/40'
    },
    {
      id: 'global-market',
      title: 'Global Reserves & Market Intelligence',
      subtitle: 'USGS world mineral inventory, international trade flows, and ocean nodule mining.',
      icon: Globe2,
      badge: 'USGS 2024',
      color: 'text-pink-400 border-pink-800/60 bg-pink-950/40'
    },
    {
      id: 'equipment',
      title: 'Equipment Fleet Health & SCADA',
      subtitle: 'Heavy machinery tracking, MTBF monitoring, and maintenance logs across 10 mines.',
      icon: Truck,
      badge: 'SCADA',
      color: 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40'
    },
    {
      id: 'data-sources',
      title: 'Data Lineage & Provenance Registry',
      subtitle: 'Audited statutory records, IBM NMI inventory, and satellite verification.',
      icon: Shield,
      badge: 'Verified',
      color: 'text-teal-400 border-teal-800/60 bg-teal-950/40'
    }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-24 overflow-x-hidden">
      {/* ============================================================ */}
      {/* 🌌 HERO SECTION WITH VIBRANT NEON GLOW & INTERACTIVE ORBITAL GRAPHIC */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 sm:px-12 bg-gradient-to-b from-[#0B0F19] via-[#0A0D17] to-[#070A12] border-b border-slate-800/80 rounded-3xl mx-4 sm:mx-6 mt-4 shadow-2xl bg-grid-cyber">
        {/* Animated Background Glowing Orbs */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Top National Initiative Pills */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-2 shadow-glow-purple animate-float">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              Smart India Hackathon • Ministry of Steel, Govt. of India
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900/90 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI/ML + Earth Observation Platform
            </span>
          </div>

          {/* Mega Title with Gradient Typography */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              MOIL <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent animate-gradient-flow">ReserveIQ</span>
            </h1>
            <p className="text-lg sm:text-2xl font-extrabold text-slate-200 tracking-tight max-w-4xl mx-auto">
              Intelligent Manganese Ore Reserve Estimation & Production Shortfall Mitigation
            </p>
          </div>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
            A state-of-the-art mineral intelligence platform developed for <strong>Manganese Ore (India) Limited (MOIL)</strong>. 
            Seamlessly integrating <strong>ESA Copernicus Sentinel-2 satellite telemetry</strong> with <strong>sub-surface diamond core assays</strong> and <strong>predictive machine-learning time-series forecasting</strong> to maximize national mineral security and achieve India's Vision 2030 target of 3.5 Million Tonnes per annum.
          </p>

          {/* ============================================================ */}
          {/* 🛰️ INTERACTIVE 3D ORBITAL SATELLITE & TELEMETRY CENTERPIECE */}
          {/* ============================================================ */}
          <div className="py-6 flex justify-center items-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
              {/* Outer Pulsing Radar Beam */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-radar" />
              <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-radar animation-delay-1000" />

              {/* Outer Orbit Track (Sentinel-2 Satellites) */}
              <div className="absolute inset-2 rounded-full border border-dashed border-purple-500/30 animate-spin-slow">
                {/* Sentinel-2 Node */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900 border border-purple-500/80 text-[10px] font-mono text-purple-300 flex items-center gap-1.5 shadow-lg shadow-purple-500/30">
                  <Satellite className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Sentinel-2 MSI (5d)</span>
                </div>
                {/* InSAR Radar Node */}
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/80 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg shadow-cyan-500/30">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sentinel-1 SAR</span>
                </div>
              </div>

              {/* Middle Counter-Rotating Orbit (Subsurface & Assays) */}
              <div className="absolute inset-12 rounded-full border border-slate-700/60 animate-spin-reverse">
                {/* Assay Node */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 px-2 py-0.5 rounded-full bg-slate-950 border border-indigo-500/80 text-[9px] font-mono text-indigo-300 flex items-center gap-1 shadow-md">
                  <Database className="w-3 h-3 text-indigo-400" />
                  <span>Core Assays</span>
                </div>
                {/* SCADA Node */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-2 py-0.5 rounded-full bg-slate-950 border border-emerald-500/80 text-[9px] font-mono text-emerald-300 flex items-center gap-1 shadow-md">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>SCADA IoT</span>
                </div>
              </div>

              {/* Inner Glowing Core Badge */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-purple-950/90 via-slate-900/95 to-indigo-950/90 border-2 border-purple-500/60 flex flex-col items-center justify-center p-3 shadow-2xl shadow-purple-600/40 glow-border-purple group hover:scale-105 transition-transform duration-300">
                {/* Vertical Laser Scanline */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline pointer-events-none" />
                
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mb-1 shadow-lg shadow-purple-500/50 animate-float">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-black text-white tracking-wider">MOIL AI CORE</span>
                <span className="text-[9px] font-mono text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  19 ASSETS SYNCED
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons with Shimmer & Glow */}
          <div className="flex items-center justify-center gap-3.5 flex-wrap pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn-shimmer px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-glow-purple transition-all duration-300 flex items-center gap-2.5 transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-300 animate-pulse" /> Launch Intelligence Platform
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('reserve-map')}
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700 hover:border-purple-500/80 transition-all duration-200 flex items-center gap-2 shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-purple-400 animate-bounce" /> Explore GIS Reserve Map (19 MOIL Assets)
            </button>

            <button
              onClick={onOpenProblemStatement}
              className="px-5 py-3.5 bg-slate-950/80 hover:bg-slate-900 text-purple-300 hover:text-white font-bold text-xs rounded-2xl border border-purple-500/30 hover:border-purple-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-400" /> SIH Problem Brief
            </button>

            <button
              onClick={onOpenReport}
              className="px-5 py-3.5 bg-slate-950/80 hover:bg-slate-900 text-cyan-300 hover:text-white font-bold text-xs rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" /> Executive Report
            </button>
          </div>

          {/* Provenance Verification Tagline */}
          <div className="pt-3 flex items-center justify-center gap-3 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authentic Public Data Grounding
            </span>
            <span>•</span>
            <span>Official MOIL AR FY25</span>
            <span>•</span>
            <span>IBM National Mineral Inventory</span>
            <span>•</span>
            <span>USGS 2024/2025</span>
            <span>•</span>
            <span>Copernicus Sentinel-2</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 📊 LIVE SYSTEM METRICS SNAPSHOT TICKER WITH MICRO-ANIMATIONS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {systemHighlights.map((stat, idx) => {
            const Icon = stat.icon;
            const floatAnimClass = idx % 3 === 0 ? 'animate-float' : idx % 3 === 1 ? 'animate-float-slow' : 'animate-float-reverse';
            return (
              <div
                key={idx}
                className={`glass-panel p-4 rounded-2xl border border-slate-800 hover:border-purple-500/60 transition-all duration-300 space-y-1.5 shadow-lg relative overflow-hidden group card-hover ${floatAnimClass}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-300 pointer-events-none" />
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-white font-mono tracking-tight group-hover:text-purple-300 transition-colors">{stat.value}</div>
                <div className="text-xs font-bold text-slate-300 leading-tight">{stat.label}</div>
                <div className={`text-[10px] ${stat.textColor} font-medium`}>{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🚀 4 CORE TECHNOLOGICAL & OPERATIONAL PILLARS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase font-bold text-purple-400 tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Architecture & Innovation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How MOIL ReserveIQ Solves Production Shortfalls
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A comprehensive four-tier system fusing aerospace earth observation with deep underground geology and predictive intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`glass-panel bg-gradient-to-b ${pillar.gradient} p-6 sm:p-8 rounded-3xl border ${pillar.borderColor} shadow-2xl flex flex-col justify-between space-y-6 hover:border-purple-500/80 transition-all duration-300 group card-hover relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:border-purple-500/60 transition-all">
                      <Icon className={`w-6 h-6 ${pillar.accentColor}`} />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 shadow-sm">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 font-sans">{pillar.desc}</p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {pillar.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pillar.accentColor}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab(pillar.tab)}
                  className="w-full py-3 bg-slate-900/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl border border-slate-700 hover:border-transparent transition-all flex items-center justify-center gap-2 group-hover:shadow-glow-purple cursor-pointer transform group-hover:translate-y-[-2px]"
                >
                  <span>{pillar.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🧭 COMPLETE INTERACTIVE PLATFORM MODULES DIRECTORY */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400 animate-spin-slow" /> Platform Navigation Hub
            </h3>
            <p className="text-xs text-slate-400">Direct access to all 8 operational intelligence modules.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">8 Modules Live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNavModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id as TabType)}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/60 bg-slate-900/60 hover:bg-slate-900/95 transition-all duration-300 text-left space-y-3 group shadow-lg flex flex-col justify-between card-hover cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white group-hover:border-purple-500/60 group-hover:scale-110 transition-all">
                      <Icon className="w-4.5 h-4.5 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${mod.color}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{mod.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 group-hover:translate-x-1.5 transition-transform">
                  <span>Enter Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🏛️ PROBLEM STATEMENT & NATIONAL IMPACT CALLOUT */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-900/60 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 shadow-2xl relative overflow-hidden bg-grid-cyber">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="relative z-10 space-y-4 max-w-4xl">
            <span className="text-xs font-mono uppercase font-bold text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 inline-block shadow-sm">
              Strategic Mineral Security Mission
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Powering India's 300 MT Steel Target by 2030
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Manganese is an irreplaceable deoxidizing and desulfurizing alloying element in steel manufacturing (~10 kg Mn required per tonne of crude steel). MOIL Limited produces over <strong>68% of India's domestic high-grade manganese ore</strong>. MOIL ReserveIQ equips mining engineers and executive leadership with real-time AI foresight to eliminate production deficits, prevent machine breakdowns, and protect domestic supply chains against global market volatility.
            </p>
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button
                onClick={() => setActiveTab('global-market')}
                className="btn-shimmer px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <Globe2 className="w-4 h-4" /> Global Market Benchmark
              </button>
              <button
                onClick={onOpenProblemStatement}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 text-xs font-bold border border-purple-500/40 hover:border-purple-400 transition flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-purple-400" /> Review SIH Problem Statement
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 📌 FOOTER */}
      {/* ============================================================ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 text-center space-y-2 text-xs text-slate-500">
        <p className="text-slate-400 font-medium">
          MOIL ReserveIQ • Smart India Hackathon Prototype • Ministry of Steel, Government of India
        </p>
        <p className="text-[11px] text-slate-500 font-mono">
          Data Sources: MOIL Limited Statutory Disclosures • Indian Bureau of Mines (IBM) • USGS Mineral Commodity Summaries • ESA Copernicus Sentinel-2
        </p>
      </footer>
    </div>
  );
};
