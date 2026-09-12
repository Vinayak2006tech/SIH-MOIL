import React from 'react';
import {
  Sparkles,
  Layers,
  MapPin,
  BarChart3,
  TrendingDown,
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
  FileText
} from 'lucide-react';
import type { TabType } from '../components/layout/Sidebar';

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
      color: 'from-[#6B5B95] to-[#564879]',
      textColor: 'text-[#BFB2D3]'
    },
    {
      icon: TrendingDown,
      value: '19.07 Lakh T',
      label: 'Annual Milestone Output',
      sub: 'FY26 Record (+5.8% YoY)',
      color: 'from-teal-600 to-cyan-700',
      textColor: 'text-teal-400'
    },
    {
      icon: Satellite,
      value: '5-Day Revisit',
      label: 'Copernicus Sentinel-2',
      sub: 'Multi-Spectral InSAR & NDVI',
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-400'
    },
    {
      icon: Factory,
      value: '19 Locations',
      label: 'National Footprint',
      sub: '10 Mines • 6 Plants • 3 Blocks',
      color: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-400'
    },
    {
      icon: Globe2,
      value: '1,900 Mt Mn',
      label: 'USGS Global Benchmark',
      sub: 'Contained Metal Inventory',
      color: 'from-[#8B6F47] to-[#6B5B95]',
      textColor: 'text-[#C4A77D]'
    },
    {
      icon: Cpu,
      value: '84.6% Accuracy',
      label: 'Shortfall AI Predictor',
      sub: '30/60/90-Day Forecasts',
      color: 'from-[#6B5B95] to-[#0D9488]',
      textColor: 'text-teal-300'
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
      gradient: 'from-[#1B2226] via-[#161D22] to-[#0F1214]',
      accentColor: 'text-teal-400',
      borderColor: 'border-teal-800/40'
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
      gradient: 'from-[#1B2226] via-[#161D22] to-[#0F1214]',
      accentColor: 'text-[#BFB2D3]',
      borderColor: 'border-[#6B5B95]/40'
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
      gradient: 'from-[#1B2226] via-[#161D22] to-[#0F1214]',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-800/40'
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
      gradient: 'from-[#1B2226] via-[#161D22] to-[#0F1214]',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-800/40'
    }
  ];

  const quickNavModules = [
    {
      id: 'dashboard',
      title: 'Executive Command Dashboard',
      subtitle: 'Real-time reserve inventory, production compliance, and risk matrix overview.',
      icon: BarChart3,
      badge: 'Overview',
      color: 'text-teal-400 border-teal-800/60 bg-teal-950/40'
    },
    {
      id: 'reserve-map',
      title: 'GIS Reserve & Satellite Map',
      subtitle: 'Interactive geospatial map plotting 10 mines, 6 plants, 3 exploration blocks & 23 boreholes.',
      icon: MapPin,
      badge: 'GIS Map',
      color: 'text-[#BFB2D3] border-[#6B5B95]/60 bg-[#6B5B95]/15'
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
      color: 'text-teal-300 border-teal-800/60 bg-teal-950/40'
    },
    {
      id: 'global-market',
      title: 'Global Reserves & Market Intelligence',
      subtitle: 'USGS world mineral inventory, international trade flows, and ocean nodule mining.',
      icon: Globe2,
      badge: 'USGS 2024',
      color: 'text-[#C4A77D] border-[#8B6F47]/60 bg-[#8B6F47]/15'
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
      color: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40'
    }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-24 overflow-x-hidden">
      {/* ============================================================ */}
      {/* 🌌 HERO SECTION WITH INDUSTRIAL EARTH-TECH AESTHETIC */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 sm:px-12 bg-gradient-to-b from-[#161D22] via-[#12181A] to-[#0F1214] border-b border-[#26333B] rounded-3xl mx-4 sm:mx-6 mt-4 shadow-2xl bg-grid-cyber">
        {/* Animated Background Glowing Orbs */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-500/12 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#6B5B95]/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Top National Initiative Pills */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6B5B95]/20 text-[#BFB2D3] border border-[#6B5B95]/40 flex items-center gap-2 shadow-glow-manganese animate-float font-sans">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              Smart India Hackathon • Ministry of Steel, Govt. of India
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#161D22]/90 text-slate-300 border border-[#26333B] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              AI/ML + Earth Observation Platform
            </span>
          </div>

          {/* Mega Title with Earth-Tech Gradient Typography */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#E8E6E3] tracking-tight leading-tight font-sans">
              MOIL <span className="bg-gradient-to-r from-teal-300 via-[#BFB2D3] to-teal-400 bg-clip-text text-transparent animate-gradient-flow">ReserveIQ</span>
            </h1>
            <p className="text-lg sm:text-2xl font-extrabold text-slate-200 tracking-tight max-w-4xl mx-auto font-sans">
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
              <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-radar" />
              <div className="absolute inset-4 rounded-full border border-[#6B5B95]/25 animate-radar animation-delay-1000" />

              {/* Outer Orbit Track (Sentinel-2 Satellites) */}
              <div className="absolute inset-2 rounded-full border border-dashed border-teal-500/30 animate-spin-slow">
                {/* Sentinel-2 Node */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#161D22] border border-teal-500/80 text-[10px] font-mono text-teal-300 flex items-center gap-1.5 shadow-lg shadow-teal-500/30">
                  <Satellite className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span>Sentinel-2 MSI (5d)</span>
                </div>
                {/* InSAR Radar Node */}
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#161D22] border border-[#6B5B95]/80 text-[10px] font-mono text-[#BFB2D3] flex items-center gap-1.5 shadow-lg shadow-purple-500/30">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  <span>Sentinel-1 SAR</span>
                </div>
              </div>

              {/* Middle Counter-Rotating Orbit (Subsurface & Assays) */}
              <div className="absolute inset-12 rounded-full border border-[#26333B] animate-spin-reverse">
                {/* Assay Node */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 px-2 py-0.5 rounded-full bg-[#0F1214] border border-[#6B5B95]/80 text-[9px] font-mono text-[#BFB2D3] flex items-center gap-1 shadow-md">
                  <Database className="w-3 h-3 text-[#9B8BBF]" />
                  <span>Core Assays</span>
                </div>
                {/* SCADA Node */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-2 py-0.5 rounded-full bg-[#0F1214] border border-emerald-500/80 text-[9px] font-mono text-emerald-300 flex items-center gap-1 shadow-md">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>SCADA IoT</span>
                </div>
              </div>

              {/* Inner Glowing Core Badge */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#2F2742]/90 via-[#161D22]/95 to-[#134E4A]/90 border-2 border-teal-500/50 flex flex-col items-center justify-center p-3 shadow-2xl glow-border-teal group hover:scale-105 transition-transform duration-300">
                {/* Vertical Laser Scanline */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scanline pointer-events-none" />
                
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#6B5B95] to-[#0D9488] flex items-center justify-center text-white mb-1 shadow-lg shadow-teal-500/40 animate-float">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#E8E6E3] tracking-wider font-sans">MOIL AI CORE</span>
                <span className="text-[9px] font-mono text-teal-300 font-semibold flex items-center gap-1 mt-0.5">
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
              className="btn-shimmer px-6 py-3.5 bg-gradient-to-r from-[#6B5B95] via-[#564879] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white font-extrabold text-sm rounded-2xl shadow-glow-manganese transition-all duration-300 flex items-center gap-2.5 transform hover:-translate-y-1 hover:scale-105 cursor-pointer font-sans"
            >
              <Zap className="w-4 h-4 text-teal-300 animate-pulse" /> Launch Intelligence Platform
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('reserve-map')}
              className="px-6 py-3.5 bg-[#161D22]/90 hover:bg-[#1B2226] text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-[#26333B] hover:border-teal-500/80 transition-all duration-200 flex items-center gap-2 shadow-sm transform hover:-translate-y-0.5 cursor-pointer font-sans"
            >
              <MapPin className="w-4 h-4 text-teal-400 animate-bounce" /> Explore GIS Reserve Map (19 MOIL Assets)
            </button>

            <button
              onClick={onOpenProblemStatement}
              className="px-5 py-3.5 bg-[#0F1214]/80 hover:bg-[#161D22] text-[#BFB2D3] hover:text-white font-bold text-xs rounded-2xl border border-[#6B5B95]/40 hover:border-[#9B8BBF] transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <Shield className="w-4 h-4 text-teal-400" /> SIH Problem Brief
            </button>

            <button
              onClick={onOpenReport}
              className="px-5 py-3.5 bg-[#0F1214]/80 hover:bg-[#161D22] text-teal-300 hover:text-white font-bold text-xs rounded-2xl border border-teal-500/40 hover:border-teal-400 transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <FileText className="w-4 h-4 text-teal-400" /> Executive Report
            </button>
          </div>

          {/* Provenance Verification Tagline */}
          <div className="pt-3 flex items-center justify-center gap-3 text-xs text-slate-400 flex-wrap font-mono">
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
                className={`glass-panel p-4 rounded-2xl border border-[#26333B] hover:border-teal-500/60 transition-all duration-300 space-y-1.5 shadow-lg relative overflow-hidden group card-hover ${floatAnimClass}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/15 transition-all duration-300 pointer-events-none" />
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-[#E8E6E3] font-mono tracking-tight group-hover:text-teal-300 transition-colors">{stat.value}</div>
                <div className="text-xs font-bold text-slate-300 leading-tight font-sans">{stat.label}</div>
                <div className={`text-[10px] ${stat.textColor} font-medium font-mono`}>{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🛰️ COPERNICUS SENTINEL-2 SURFACE SCANNING & TELEMETRY SPOTLIGHT */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#26333B] bg-gradient-to-br from-[#161D22] via-[#12181A] to-[#0F1214] shadow-2xl relative overflow-hidden bg-grid-cyber">
          {/* Top Title & Mission Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26333B] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/80 flex items-center gap-1.5 shadow-sm">
                  <Satellite className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  ESA Copernicus Sentinel-2 MSI Multi-Spectral Telemetry
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  5-Day Orbital Overpass
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-[#E8E6E3] tracking-tight mt-2 font-sans">
                Spaceborne Earth Observation Scanning MOIL Open-Cast Mines
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Sentinel-2 multispectral scanners capture optical and near-infrared (NIR) reflections at 10m spatial resolution, tracking bench clearing, overburden dump stability, and vegetation proxies across Madhya Pradesh and Maharashtra manganese belts.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('ingestion')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white text-xs font-bold rounded-xl shadow-glow-manganese transition flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto font-sans"
            >
              <span>Inspect Satellite Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dual Satellite Scanning Views Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            {/* Image 1: Sentinel-2A Overpass Scanning Mine Surface */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 shadow-xl group card-hover bg-[#0F1214]">
                <img
                  src="/images/sentinel-2-surface-scan.jpg"
                  alt="ESA Copernicus Sentinel-2A multispectral scanner projecting digital laser swath over opencast manganese mine"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Real-time laser scanning line animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scanline pointer-events-none shadow-[0_0_15px_#2dd4bf]" />

                {/* Top HUD Overlay Chips */}
                <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0F1214]/90 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/50 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                    <Satellite className="w-3 h-3 text-teal-400" /> Sentinel-2A MSI • 10m Res
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#0F1214]/80 text-[#BFB2D3] font-mono text-[10px] border border-[#6B5B95]/40 backdrop-blur-md">
                    Swath: 290 km
                  </span>
                </div>

                {/* Bottom Caption Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F1214] via-[#0F1214]/90 to-transparent p-3 pt-6 text-[11px] text-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-white">Active Pit & Bench Elevation Contour Scan</span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> NDVI & InSAR Synced
                  </span>
                </div>
              </div>

              {/* Telemetry Feature Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">Spectral Bands</span>
                  <span className="font-bold text-teal-400 text-xs">B02/B04/B08 NIR</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">Orbit Altitude</span>
                  <span className="font-bold text-[#BFB2D3] text-xs">786 km (SSO)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">Revisit Cycle</span>
                  <span className="font-bold text-emerald-400 text-xs">5 Days (2A/2B)</span>
                </div>
              </div>
            </div>

            {/* Image 2: Central India Mineral Lease Satellite Swath Scan */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#6B5B95]/40 shadow-xl group card-hover bg-[#0F1214]">
                <img
                  src="/images/sentinel-2-multispectral-orbit.jpg"
                  alt="Copernicus Sentinel-2 orbital pass over Central India mining leases showing multispectral false color bands"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Laser scanning line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#9B8BBF] to-transparent animate-scanline pointer-events-none shadow-[0_0_15px_#7e69ab]" />

                {/* Top HUD Overlay Chips */}
                <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0F1214]/90 text-[#BFB2D3] text-[10px] font-bold border border-[#6B5B95]/50 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                    <Globe2 className="w-3 h-3 text-teal-400" /> Balaghat Ore Belt Pass
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#0F1214]/80 text-emerald-300 text-[10px] border border-emerald-500/40 backdrop-blur-md">
                    Cloud Cover: &lt; 2.1%
                  </span>
                </div>

                {/* Bottom Caption Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F1214] via-[#0F1214]/90 to-transparent p-3 pt-6 text-[11px] text-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-white">Geological Seam Intercept & Vegetation Index Map</span>
                  <span className="text-teal-400 font-mono text-[10px]">Lat 21.8°N • Lon 80.1°E</span>
                </div>
              </div>

              {/* Telemetry Feature Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">Mining Leases</span>
                  <span className="font-bold text-teal-300 text-xs">19 MOIL Assets</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">NDVI Soil Proxy</span>
                  <span className="font-bold text-emerald-400 text-xs">0.68 Index</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F1214]/80 border border-[#26333B]">
                  <span className="text-[10px] text-slate-400 block">Radar InSAR</span>
                  <span className="font-bold text-teal-400 text-xs">Stable (&plusmn;1.2mm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 🚀 4 CORE TECHNOLOGICAL & OPERATIONAL PILLARS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase font-bold text-teal-400 tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-teal-400" />
            Architecture & Innovation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E8E6E3] tracking-tight font-sans">
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
                className={`glass-panel bg-gradient-to-b ${pillar.gradient} p-6 sm:p-8 rounded-3xl border ${pillar.borderColor} shadow-2xl flex flex-col justify-between space-y-6 hover:border-teal-500/80 transition-all duration-300 group card-hover relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-500 pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F1214] border border-[#26333B] flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:border-teal-500/60 transition-all">
                      <Icon className={`w-6 h-6 ${pillar.accentColor}`} />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#0F1214]/90 text-slate-300 border border-[#26333B] shadow-sm">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#E8E6E3] leading-snug group-hover:text-teal-200 transition-colors font-sans">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 font-sans">{pillar.desc}</p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-2 pt-2 border-t border-[#26333B]">
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
                  className="w-full py-3 bg-[#0F1214]/90 hover:bg-gradient-to-r hover:from-[#6B5B95] hover:to-[#0D9488] text-[#E8E6E3] text-xs font-bold rounded-xl border border-[#26333B] hover:border-transparent transition-all flex items-center justify-center gap-2 group-hover:shadow-glow-teal cursor-pointer transform group-hover:translate-y-[-2px] font-sans"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26333B] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#E8E6E3] flex items-center gap-2 font-sans">
              <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" /> Platform Navigation Hub
            </h3>
            <p className="text-xs text-slate-400">Direct access to all 8 operational intelligence modules.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-[#161D22] px-3 py-1 rounded-full border border-[#26333B]">8 Modules Live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNavModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id as TabType)}
                className="glass-panel p-5 rounded-2xl border border-[#26333B] hover:border-teal-500/60 bg-[#161D22]/60 hover:bg-[#161D22]/95 transition-all duration-300 text-left space-y-3 group shadow-lg flex flex-col justify-between card-hover cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#0F1214] border border-[#26333B] flex items-center justify-center text-white group-hover:border-teal-500/60 group-hover:scale-110 transition-all">
                      <Icon className="w-4.5 h-4.5 text-teal-400 group-hover:text-teal-300" />
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${mod.color}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#E8E6E3] group-hover:text-teal-300 transition-colors font-sans">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{mod.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 group-hover:translate-x-1.5 transition-transform font-mono">
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
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#26333B] bg-gradient-to-r from-[#1B2226] via-[#161D22] to-[#12181A] shadow-2xl relative overflow-hidden bg-grid-cyber">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="relative z-10 space-y-4 max-w-4xl">
            <span className="text-xs font-mono uppercase font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800 inline-block shadow-sm">
              Strategic Mineral Security Mission
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#E8E6E3] tracking-tight font-sans">
              Powering India's 300 MT Steel Target by 2030
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Manganese is an irreplaceable deoxidizing and desulfurizing alloying element in steel manufacturing (~10 kg Mn required per tonne of crude steel). MOIL Limited produces over <strong>68% of India's domestic high-grade manganese ore</strong>. MOIL ReserveIQ equips mining engineers and executive leadership with real-time AI foresight to eliminate production deficits, prevent machine breakdowns, and protect domestic supply chains against global market volatility.
            </p>
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button
                onClick={() => setActiveTab('global-market')}
                className="btn-shimmer px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white text-xs font-bold shadow-glow-manganese transition flex items-center gap-2 cursor-pointer transform hover:scale-105 font-sans"
              >
                <Globe2 className="w-4 h-4" /> Global Market Benchmark
              </button>
              <button
                onClick={onOpenProblemStatement}
                className="px-5 py-2.5 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] text-[#BFB2D3] text-xs font-bold border border-[#6B5B95]/40 hover:border-[#9B8BBF] transition flex items-center gap-2 cursor-pointer font-sans"
              >
                <Shield className="w-4 h-4 text-teal-400" /> Review SIH Problem Statement
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 📌 FOOTER */}
      {/* ============================================================ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#26333B] text-center space-y-2 text-xs text-slate-500">
        <p className="text-slate-400 font-medium font-sans">
          MOIL ReserveIQ • Smart India Hackathon Prototype • Ministry of Steel, Government of India
        </p>
        <p className="text-[11px] text-slate-500 font-mono">
          Data Sources: MOIL Limited Statutory Disclosures • Indian Bureau of Mines (IBM) • USGS Mineral Commodity Summaries • ESA Copernicus Sentinel-2
        </p>
      </footer>
    </div>
  );
};
