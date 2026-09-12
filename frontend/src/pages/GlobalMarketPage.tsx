import React, { useState, useEffect } from 'react';
import {
  Globe2,
  TrendingUp,
  BarChart3,
  Anchor,
  Compass,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  AlertCircle,
  Coins,
  Ship,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { DataSourceModal } from '../components/common/DataSourceModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import type { CountryReserve, GlobalMarketOverview } from '../types';

// Google Maps Platform API Key
export const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDM-T62CEAPrBXcGAQDr-K_9Jg6-rEoYOE';

export type GlobalBaseLayerType =
  | 'google-hybrid'
  | 'google-satellite'
  | 'google-terrain'
  | 'google-roadmap'
  | 'carto-dark';

export const globalBaseLayerConfigs: Record<
  GlobalBaseLayerType,
  { name: string; icon: string; url: string; attribution: string; maxZoom?: number }
> = {
  'google-hybrid': {
    name: 'Google Satellite Hybrid (HD)',
    icon: '🛰️',
    url: `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Maps Satellite &copy; Maxar Technologies',
    maxZoom: 20
  },
  'google-satellite': {
    name: 'Google Earth (Satellite)',
    icon: '🌍',
    url: `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Earth Imagery',
    maxZoom: 20
  },
  'google-terrain': {
    name: 'Google Topographic Terrain',
    icon: '⛰️',
    url: `https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Maps Topography',
    maxZoom: 20
  },
  'google-roadmap': {
    name: 'Google Maps Vector Roads',
    icon: '🗺️',
    url: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Maps',
    maxZoom: 20
  },
  'carto-dark': {
    name: 'CARTO Dark Matter',
    icon: '🌌',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    maxZoom: 19
  }
};

export const GlobalMarketPage: React.FC = () => {
  const [marketData, setMarketData] = useState<GlobalMarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'benchmarking' | 'trade' | 'deepsea'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryReserve | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<'contained' | 'gross' | 'life'>('contained');
  const [isChartExpanded, setIsChartExpanded] = useState<boolean>(false);
  const [baseLayer, setBaseLayer] = useState<GlobalBaseLayerType>('google-hybrid');

  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        const data = await api.getGlobalMarketOverview();
        setMarketData(data);
        if (data?.countryReserves?.length) {
          // Default to India or South Africa
          const defaultC = data.countryReserves.find((c: CountryReserve) => c.countryCode === 'IND') || data.countryReserves[0];
          setSelectedCountry(defaultC);
        }
      } catch (err) {
        console.error('Failed to load global market data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  if (loading || !marketData) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="chart" count={2} />
      </div>
    );
  }

  const countries = marketData.countryReserves || [];
  const filteredCountries = countries.filter((c) =>
    c.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.keyDeposits.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.primaryProducers.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart Data: Top 10 Reserve Countries with dynamic sorting by selected metric
  const reservesChartData = countries
    .filter((c) => c.countryCode !== 'ROW')
    .sort((a, b) => {
      if (chartMetric === 'gross') return b.grossOreReservesMt - a.grossOreReservesMt;
      if (chartMetric === 'life') {
        const lifeB = b.annualMineProductionContainedMnMt > 0 ? b.reservesContainedMnMt / b.annualMineProductionContainedMnMt : 0;
        const lifeA = a.annualMineProductionContainedMnMt > 0 ? a.reservesContainedMnMt / a.annualMineProductionContainedMnMt : 0;
        return lifeB - lifeA;
      }
      return b.reservesContainedMnMt - a.reservesContainedMnMt;
    })
    .map((c) => {
      const lifeYears = c.annualMineProductionContainedMnMt > 0 ? Number((c.reservesContainedMnMt / c.annualMineProductionContainedMnMt).toFixed(1)) : 0;
      return {
        name: `${c.flag} ${c.countryName.split(' ')[0]}`,
        fullName: c.countryName,
        countryCode: c.countryCode,
        flag: c.flag,
        reserves: c.reservesContainedMnMt,
        production: c.annualMineProductionContainedMnMt,
        grossReserves: c.grossOreReservesMt,
        grossProduction: Number((c.annualMineProductionContainedMnMt / (c.avgOreGradeMnPct / 100)).toFixed(1)),
        grade: c.avgOreGradeMnPct,
        lifeYears: lifeYears,
        raw: c
      };
    });

  // Exporters Pie Data
  const exporterColors = ['#7E69AB', '#2DD4BF', '#10B981', '#F59E0B', '#6B5B95'];
  const exportersData = marketData.globalTradeFlows?.topExporters?.map((e) => ({
    name: e.country,
    value: e.volumeMt,
    share: e.sharePct
  })) || [];

  // Importers Bar Data
  const importersData = marketData.globalTradeFlows?.topImporters?.map((i) => ({
    country: i.country,
    volume: i.volumeMt,
    share: i.sharePct,
    useCase: i.useCase
  })) || [];

  // Radar chart data for MOIL vs Peers
  const radarData = [
    { metric: 'Ore Grade (% Mn)', MOIL: 85, Kalahari_ZAF: 80, Moanda_GAB: 98, GEMCO_AUS: 92 },
    { metric: 'Reserve Life (Years)', MOIL: 70, Kalahari_ZAF: 95, Moanda_GAB: 45, GEMCO_AUS: 35 },
    { metric: 'Domestic Market Captivity', MOIL: 100, Kalahari_ZAF: 20, Moanda_GAB: 10, GEMCO_AUS: 15 },
    { metric: 'Value Addition (EMD/FeMn)', MOIL: 88, Kalahari_ZAF: 60, Moanda_GAB: 40, GEMCO_AUS: 50 },
    { metric: 'Cost Competitiveness', MOIL: 78, Kalahari_ZAF: 85, Moanda_GAB: 90, GEMCO_AUS: 88 }
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#12181A] via-[#161D22] to-[#12181A] border border-[#26333B] p-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-tech-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-tech-teal/10 text-tech-teal border border-tech-teal/30 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Worldwide Mineral Intelligence
              </span>
              <ProvenanceBadge
                sourceId="src-usgs-manganese-2024"
                dataType="PUBLIC_GOVERNMENT"
                isSynthetic={false}
                compact
                onClick={() => setSelectedSourceId('src-usgs-manganese-2024')}
              />
              <ProvenanceBadge
                sourceId="src-imni-global-market"
                dataType="PUBLIC_GOVERNMENT"
                isSynthetic={false}
                compact
                onClick={() => setSelectedSourceId('src-imni-global-market')}
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#E8E6E3] tracking-tight flex items-center gap-2">
              Global Manganese Ore Reserves & Market Intelligence
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Comprehensive international mineral inventory grounded in the <strong className="text-[#E8E6E3]">U.S. Geological Survey (USGS 2024/2025)</strong> and <strong className="text-[#E8E6E3]">International Manganese Institute (IMnI)</strong>, benchmarking MOIL Limited against global mining basins (South Africa, Australia, Gabon, China) and deep-sea abyssal nodule resources.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0F1214]/90 p-1.5 rounded-xl border border-[#26333B] shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'overview'
                ? 'bg-tech-teal text-[#0F1214] shadow-glow-teal font-extrabold'
                : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                }`}
            >
              <Globe2 className="w-3.5 h-3.5" /> World Reserves Map
            </button>
            <button
              onClick={() => setActiveTab('benchmarking')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'benchmarking'
                ? 'bg-tech-teal text-[#0F1214] shadow-glow-teal font-extrabold'
                : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                }`}
            >
              <Award className="w-3.5 h-3.5" /> MOIL vs Global Peers
            </button>
            <button
              onClick={() => setActiveTab('trade')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'trade'
                ? 'bg-tech-teal text-[#0F1214] shadow-glow-teal font-extrabold'
                : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                }`}
            >
              <Ship className="w-3.5 h-3.5" /> Seaborne Trade Flows
            </button>
            <button
              onClick={() => setActiveTab('deepsea')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'deepsea'
                ? 'bg-tech-teal text-[#0F1214] shadow-glow-teal font-extrabold'
                : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                }`}
            >
              <Compass className="w-3.5 h-3.5" /> Deep Ocean Nodules
            </button>
          </div>
        </div>
      </div>

      {/* Global Strategic KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-[#26333B] bg-[#161D22]/85 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total World Land Reserves</span>
            <ProvenanceBadge sourceId="src-usgs-manganese-2024" compact onClick={() => setSelectedSourceId('src-usgs-manganese-2024')} />
          </div>
          <div className="text-2xl font-black text-[#E8E6E3] flex items-baseline gap-1.5">
            1,900 <span className="text-xs font-bold text-manganese-400">Mt (Contained Mn)</span>
          </div>
          <p className="text-[11px] text-slate-400">~5.6 Billion Tonnes gross ore across all producing nations</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#26333B] bg-[#161D22]/85 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Annual World Mine Output</span>
            <ProvenanceBadge sourceId="src-usgs-manganese-2024" compact onClick={() => setSelectedSourceId('src-usgs-manganese-2024')} />
          </div>
          <div className="text-2xl font-black text-[#E8E6E3] flex items-baseline gap-1.5">
            20.0 <span className="text-xs font-bold text-tech-teal">Mt Mn / 58.4 Mt Ore</span>
          </div>
          <p className="text-[11px] text-slate-400">South Africa & Gabon produce 59% of global metal output</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#26333B] bg-[#161D22]/85 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Seaborne Traded Ore</span>
            <ProvenanceBadge sourceId="src-imni-global-market" compact onClick={() => setSelectedSourceId('src-imni-global-market')} />
          </div>
          <div className="text-2xl font-black text-[#E8E6E3] flex items-baseline gap-1.5">
            36.8 <span className="text-xs font-bold text-emerald-400">Mt / Year</span>
          </div>
          <p className="text-[11px] text-slate-400">China imports 64.2% (31.8 Mt) to feed steelmaking</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#26333B] bg-[#161D22]/85 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High-Grade CIF Benchmark</span>
            <ProvenanceBadge sourceId="src-imni-global-market" compact onClick={() => setSelectedSourceId('src-imni-global-market')} />
          </div>
          <div className="text-2xl font-black text-[#E8E6E3] flex items-baseline gap-1.5">
            $5.15 <span className="text-xs font-bold text-amber-400">/ dmtu ($226/t)</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +4.2% YoY (44% Mn CIF Tianjin)
          </p>
        </div>
      </div>

      {/* Tab 1: Global Reserves Map & Country Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Geospatial World Manganese Map */}
          <div className="glass-panel rounded-2xl border border-[#26333B] bg-[#161D22]/85 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#26333B] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1214]/80">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-[#E8E6E3] flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-tech-teal" />
                    Geospatial Distribution of Global Manganese Deposits
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Google Maps Platform Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Circle size indicates contained metal reserves (Mt Mn). Click any country marker to view geological details.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Base Layer Switcher */}
                <div className="flex items-center gap-1 bg-[#12181A] p-1 rounded-xl border border-[#26333B]">
                  {(Object.keys(globalBaseLayerConfigs) as GlobalBaseLayerType[]).map((layerKey) => {
                    const cfg = globalBaseLayerConfigs[layerKey];
                    const isActive = baseLayer === layerKey;
                    return (
                      <button
                        key={layerKey}
                        onClick={() => setBaseLayer(layerKey)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-tech-teal text-[#0F1214] font-bold shadow-sm'
                            : 'text-slate-400 hover:text-[#E8E6E3] hover:bg-[#161D22]'
                        }`}
                        title={cfg.name}
                      >
                        <span>{cfg.icon}</span>
                        <span className="hidden sm:inline text-[11px]">{cfg.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter country/deposit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#12181A] text-xs text-[#E8E6E3] pl-8 pr-3 py-1.5 rounded-lg border border-[#26333B] focus:outline-none focus:border-tech-teal"
                  />
                </div>
              </div>
            </div>

            <div className="h-[460px] w-full relative z-0">
              <MapContainer
                center={[15.0, 30.0]}
                zoom={2}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', backgroundColor: '#0F1214' }}
              >
                <TileLayer
                  key={baseLayer}
                  attribution={globalBaseLayerConfigs[baseLayer].attribution}
                  url={globalBaseLayerConfigs[baseLayer].url}
                  maxZoom={globalBaseLayerConfigs[baseLayer].maxZoom || 20}
                />
                {countries
                  .filter((c) => c.countryCode !== 'ROW')
                  .map((c) => {
                    const radius = Math.max(10, Math.sqrt(c.reservesContainedMnMt) * 1.8);
                    const isIndia = c.countryCode === 'IND';
                    return (
                      <CircleMarker
                        key={c.countryCode}
                        center={[c.latitude, c.longitude]}
                        radius={radius}
                        pathOptions={{
                          fillColor: isIndia ? '#2DD4BF' : c.reservesContainedMnMt > 200 ? '#7E69AB' : '#0D9488',
                          fillOpacity: 0.75,
                          color: isIndia ? '#5EEAD4' : '#9F8DC2',
                          weight: 2
                        }}
                        eventHandlers={{
                          click: () => setSelectedCountry(c)
                        }}
                      >
                        <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95}>
                          <div className="p-1 font-sans text-xs">
                            <p className="font-bold text-slate-900">
                              {c.flag} {c.countryName}
                            </p>
                            <p className="text-slate-700 font-mono">
                              Reserves: <strong>{c.reservesContainedMnMt} Mt Mn</strong> ({c.shareOfWorldReservesPct}%)
                            </p>
                            <p className="text-slate-700">Annual Output: {c.annualMineProductionContainedMnMt} Mt Mn</p>
                          </div>
                        </LeafletTooltip>
                        <Popup>
                          <div className="p-2 font-sans text-xs space-y-1.5 max-w-xs">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {c.flag} {c.countryName}
                            </h4>
                            <p className="text-slate-700">
                              <strong>Key Deposits:</strong> {c.keyDeposits}
                            </p>
                            <p className="text-slate-700">
                              <strong>Average Grade:</strong> {c.avgOreGradeMnPct}% Mn
                            </p>
                            <p className="text-slate-700">
                              <strong>Primary Producers:</strong> {c.primaryProducers}
                            </p>
                            <p className="text-[11px] text-slate-600 bg-slate-100 p-1.5 rounded">
                              {c.strategicNotes}
                            </p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
              </MapContainer>
            </div>
          </div>

          {/* Expanded Length: Reserves vs Production Comparison Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-[#E8E6E3] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-tech-teal" />
                  Top Manganese Nations: Contained Metal Reserves vs Annual Production
                </h4>
                <p className="text-xs text-slate-400">
                  {chartMetric === 'contained'
                    ? 'Contained manganese metal content in Million Metric Tonnes (USGS 2024/2025)'
                    : chartMetric === 'gross'
                      ? 'Gross Run-Of-Mine (ROM) In-Situ Ore Reserves vs Annual Gross Extraction (Mt)'
                      : 'Theoretical Mine Longevity Index: Contained Reserves divided by Annual Production (Years)'}
                </p>
              </div>

              {/* Metric & Size Switcher Controls */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <div className="flex items-center bg-[#0F1214]/90 p-1 rounded-xl border border-[#26333B] text-xs">
                  <button
                    onClick={() => setChartMetric('contained')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${chartMetric === 'contained'
                      ? 'bg-tech-teal text-[#0F1214] font-bold shadow-glow-teal'
                      : 'text-slate-400 hover:text-[#E8E6E3]'
                      }`}
                  >
                    Contained Metal (Mt Mn)
                  </button>
                  <button
                    onClick={() => setChartMetric('gross')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${chartMetric === 'gross'
                      ? 'bg-tech-teal text-[#0F1214] font-bold shadow-glow-teal'
                      : 'text-slate-400 hover:text-[#E8E6E3]'
                      }`}
                  >
                    Gross Ore (Mt Ore)
                  </button>
                  <button
                    onClick={() => setChartMetric('life')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${chartMetric === 'life'
                      ? 'bg-tech-teal text-[#0F1214] font-bold shadow-glow-teal'
                      : 'text-slate-400 hover:text-[#E8E6E3]'
                      }`}
                  >
                    Reserve Life (Years)
                  </button>
                </div>

                <button
                  onClick={() => setIsChartExpanded(!isChartExpanded)}
                  className="p-2 rounded-xl bg-[#0F1214]/90 hover:bg-[#1B2226] text-slate-300 hover:text-[#E8E6E3] border border-[#26333B] transition"
                  title={isChartExpanded ? 'Standard Height (480px)' : 'Expanded Height (620px)'}
                >
                  {isChartExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Chart Canvas (480px / 620px) */}
            <div className={`w-full transition-all duration-300 ${isChartExpanded ? 'h-[620px]' : 'h-[480px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reservesChartData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 35 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length > 0) {
                      const clickedData = e.activePayload[0].payload;
                      if (clickedData.raw) setSelectedCountry(clickedData.raw);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#26333B" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748B"
                    tick={{ fontSize: 12, fill: '#E8E6E3', fontWeight: 600 }}
                    interval={0}
                    dy={10}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    label={{
                      value:
                        chartMetric === 'contained'
                          ? 'Contained Metal (Million Tonnes Mn)'
                          : chartMetric === 'gross'
                            ? 'Gross Ore (Million Tonnes)'
                            : 'Longevity (Years at Current Output)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748B', fontSize: 11 }
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#161D22] border border-[#26333B] p-3 rounded-xl shadow-2xl space-y-1.5 text-xs font-sans">
                            <div className="flex items-center justify-between gap-4 border-b border-[#26333B] pb-1">
                              <span className="font-bold text-[#E8E6E3] text-sm">
                                {d.flag || '🌍'} {d.fullName || d.name}
                              </span>
                              <span className="text-[10px] font-mono text-manganese-400 bg-manganese-950 px-1.5 py-0.5 rounded border border-manganese-800">
                                {d.countryCode || 'N/A'}
                              </span>
                            </div>
                            <div className="space-y-1 pt-1 font-mono">
                              <p className="text-manganese-300 flex items-center justify-between gap-3">
                                <span>Contained Reserves:</span>
                                <strong>{d.reserves ?? 0} Mt Mn</strong>
                              </p>
                              <p className="text-tech-teal flex items-center justify-between gap-3">
                                <span>Annual Production:</span>
                                <strong>{d.production ?? 0} Mt Mn</strong>
                              </p>
                              <p className="text-amber-300 flex items-center justify-between gap-3">
                                <span>Gross Ore Reserves:</span>
                                <strong>{d.grossReserves ?? 0} Mt</strong>
                              </p>
                              <p className="text-emerald-300 flex items-center justify-between gap-3">
                                <span>Average Ore Grade:</span>
                                <strong>{d.grade ?? 0}% Mn</strong>
                              </p>
                              <p className="text-slate-300 flex items-center justify-between gap-3">
                                <span>Reserve Life:</span>
                                <strong>{d.lifeYears ?? 0} Years</strong>
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 pt-1 italic">Click bar to inspect full country profile</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />

                  {chartMetric === 'contained' && (
                    <>
                      <Bar
                        dataKey="reserves"
                        name="Contained Metal Reserves (Mt Mn)"
                        fill="#7E69AB"
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                      />
                      <Bar
                        dataKey="production"
                        name="Annual Mine Production (Mt Mn)"
                        fill="#2DD4BF"
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                      />
                    </>
                  )}

                  {chartMetric === 'gross' && (
                    <>
                      <Bar
                        dataKey="grossReserves"
                        name="Gross In-Situ Ore Reserves (Mt Ore)"
                        fill="#8B6F47"
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                      />
                      <Bar
                        dataKey="grossProduction"
                        name="Annual Gross Ore Extraction (Mt Ore)"
                        fill="#0D9488"
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                      />
                    </>
                  )}

                  {chartMetric === 'life' && (
                    <Bar
                      dataKey="lifeYears"
                      name="Reserve Longevity at Current Extraction (Years)"
                      fill="#10B981"
                      radius={[6, 6, 0, 0]}
                      cursor="pointer"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Selected Country Deep-Dive & Global Distribution Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selected Country Deep-Dive Card */}
            {selectedCountry ? (
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#26333B] bg-gradient-to-b from-[#161D22] to-[#12181A] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedCountry.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-[#E8E6E3] flex items-center gap-2">
                        {selectedCountry.countryName}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-manganese-900/50 text-manganese-300 border border-manganese-700">
                          {selectedCountry.countryCode}
                        </span>
                      </h3>
                      <p className="text-xs text-tech-teal font-medium">{selectedCountry.keyDeposits}</p>
                    </div>
                  </div>
                  <ProvenanceBadge sourceId="src-usgs-manganese-2024" compact onClick={() => setSelectedSourceId('src-usgs-manganese-2024')} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#0F1214]/70 p-3 rounded-xl border border-[#26333B] space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-400 font-sans block">Contained Reserves</span>
                    <span className="text-base font-bold text-[#E8E6E3]">{selectedCountry.reservesContainedMnMt} Mt Mn</span>
                    <span className="text-[10px] text-manganese-400 block">{selectedCountry.shareOfWorldReservesPct}% world share</span>
                  </div>

                  <div className="bg-[#0F1214]/70 p-3 rounded-xl border border-[#26333B] space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-400 font-sans block">Annual Output</span>
                    <span className="text-base font-bold text-[#E8E6E3]">{selectedCountry.annualMineProductionContainedMnMt} Mt Mn</span>
                    <span className="text-[10px] text-tech-teal block">{selectedCountry.shareOfWorldProductionPct}% world output</span>
                  </div>

                  <div className="bg-[#0F1214]/70 p-3 rounded-xl border border-[#26333B] space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-400 font-sans block">Average Ore Grade</span>
                    <span className="text-base font-bold text-emerald-400">{selectedCountry.avgOreGradeMnPct}% Mn</span>
                    <span className="text-[10px] text-slate-400 block">Run-of-mine assay</span>
                  </div>

                  <div className="bg-[#0F1214]/70 p-3 rounded-xl border border-[#26333B] space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-400 font-sans block">Gross In-Situ Ore</span>
                    <span className="text-base font-bold text-amber-400">{selectedCountry.grossOreReservesMt} Mt</span>
                    <span className="text-[10px] text-slate-400 block">Total ore reserve</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-[#0F1214]/40 p-3 rounded-xl border border-[#26333B]/80 space-y-1">
                    <p className="text-slate-300">
                      <strong className="text-slate-200">Mining & Processing Methods:</strong> {selectedCountry.miningMethods}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-slate-200">Operating Mining Houses:</strong> {selectedCountry.primaryProducers}
                    </p>
                  </div>
                  <div className="bg-[#0F1214]/40 p-3 rounded-xl border border-[#26333B]/80">
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-[#E8E6E3]">Geological & Strategic Context:</strong> {selectedCountry.strategicNotes}
                    </p>
                  </div>
                </div>

                {selectedCountry.countryCode === 'IND' && (
                  <div className="p-3 rounded-xl bg-tech-teal/10 border border-tech-teal/30 text-xs text-tech-teal flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-tech-teal shrink-0" />
                    <span>
                      MOIL Limited produces over <strong className="text-[#E8E6E3]">68% of India's domestic manganese ore</strong>, leading national mineral security.
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Quick Country Selector Grid */}
            <div className="glass-panel p-5 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Quick Select Producing Nation
              </span>
              <div className="grid grid-cols-2 gap-2">
                {countries
                  .filter((c) => c.countryCode !== 'ROW')
                  .slice(0, 8)
                  .map((c) => (
                    <button
                      key={c.countryCode}
                      onClick={() => setSelectedCountry(c)}
                      className={`p-2 rounded-xl text-left text-xs transition border flex items-center gap-2 ${selectedCountry?.countryCode === c.countryCode
                        ? 'bg-tech-teal/15 border-tech-teal text-[#E8E6E3] font-bold shadow-glow-teal'
                        : 'bg-[#0F1214]/60 border-[#26333B] text-slate-300 hover:bg-[#161D22]'
                        }`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <div className="truncate">
                        <p className="truncate font-semibold">{c.countryName.split(' ')[0]}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{c.reservesContainedMnMt} Mt Mn</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Full Country Reserves Table */}
          <div className="glass-panel rounded-2xl border border-[#26333B] bg-[#161D22]/85 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#26333B] bg-[#0F1214]/80 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#E8E6E3]">
                Comprehensive Global Manganese Mineral Inventory (USGS Summary)
              </h4>
              <span className="text-xs text-slate-400">Showing {filteredCountries.length} countries/regions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0F1214]/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#26333B]">
                  <tr>
                    <th className="px-4 py-3">Country / Region</th>
                    <th className="px-4 py-3">Reserves (Mt Mn)</th>
                    <th className="px-4 py-3">Gross Ore (Mt)</th>
                    <th className="px-4 py-3">World Share</th>
                    <th className="px-4 py-3">Annual Output (Mt Mn)</th>
                    <th className="px-4 py-3">Avg Grade</th>
                    <th className="px-4 py-3">Key Deposits</th>
                    <th className="px-4 py-3">Primary Mining Methods</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26333B]/60 font-mono">
                  {filteredCountries.map((c) => (
                    <tr
                      key={c.countryCode}
                      onClick={() => setSelectedCountry(c)}
                      className={`hover:bg-[#161D22] cursor-pointer transition ${selectedCountry?.countryCode === c.countryCode ? 'bg-tech-teal/10' : ''
                        }`}
                    >
                      <td className="px-4 py-3 font-sans font-semibold text-[#E8E6E3] flex items-center gap-2">
                        <span>{c.flag}</span> {c.countryName}
                      </td>
                      <td className="px-4 py-3 text-manganese-300 font-bold">{c.reservesContainedMnMt}</td>
                      <td className="px-4 py-3 text-slate-300">{c.grossOreReservesMt}</td>
                      <td className="px-4 py-3 text-amber-400 font-bold">{c.shareOfWorldReservesPct}%</td>
                      <td className="px-4 py-3 text-tech-teal font-bold">{c.annualMineProductionContainedMnMt}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{c.avgOreGradeMnPct}%</td>
                      <td className="px-4 py-3 font-sans text-slate-400 max-w-xs truncate">{c.keyDeposits}</td>
                      <td className="px-4 py-3 font-sans text-slate-400">{c.miningMethods}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MOIL vs Global Peers Benchmarking */}
      {activeTab === 'benchmarking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Peer Comparison Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#E8E6E3] flex items-center gap-2">
                      <Award className="w-5 h-5 text-tech-teal" />
                      MOIL Limited vs World Leading Manganese Producers
                    </h3>
                    <p className="text-xs text-slate-400">
                      Operational and structural comparison with global peers (South32, Comilog Eramet, Assmang).
                    </p>
                  </div>
                  <ProvenanceBadge sourceId="src-usgs-manganese-2024" compact onClick={() => setSelectedSourceId('src-usgs-manganese-2024')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketData.moilVsGlobalPeers?.map((peer, idx) => {
                    const isMoil = peer.company.includes('MOIL');
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition ${isMoil
                          ? 'bg-manganese-950/40 border-tech-teal/60 shadow-glow-teal'
                          : 'bg-[#0F1214]/80 border-[#26333B] hover:border-slate-700'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-[#E8E6E3] text-sm">{peer.company}</h4>
                          <span className="text-xs text-slate-300 font-sans font-medium">{peer.country}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="bg-[#12181A] p-2 rounded-lg border border-[#26333B]">
                            <span className="text-[10px] text-slate-400 block">Annual Output</span>
                            <span className="font-bold text-[#E8E6E3] font-mono">{peer.annualOutputMt} Mt</span>
                          </div>
                          <div className="bg-[#12181A] p-2 rounded-lg border border-[#26333B]">
                            <span className="text-[10px] text-slate-400 block">Reserve Life</span>
                            <span className="font-bold text-emerald-400 font-mono">~{peer.reserveLifeYears} Years</span>
                          </div>
                          <div className="bg-[#12181A] p-2 rounded-lg border border-[#26333B] col-span-2">
                            <span className="text-[10px] text-slate-400 block">Average Grade Profile</span>
                            <span className="font-bold text-manganese-300">{peer.avgOreGrade}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                          <strong className="text-slate-200">Extraction Method:</strong> {peer.miningMethod}
                        </p>
                        <p className="text-[11px] text-tech-teal bg-tech-teal/10 p-2 rounded-lg border border-tech-teal/30 leading-relaxed">
                          <strong className="text-[#E8E6E3]">Strategic Edge:</strong> {peer.strategicAdvantage}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Radar Benchmark Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#E8E6E3] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-tech-teal" />
                  Multi-Dimensional Competitiveness Index
                </h4>
                <p className="text-xs text-slate-400">Relative score across key mining and commercial pillars (Scale 0–100)</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#26333B" />
                    <PolarAngleAxis dataKey="metric" stroke="#64748B" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#26333B" tick={{ fontSize: 9 }} />
                    <Radar name="MOIL Limited (India)" dataKey="MOIL" stroke="#2DD4BF" fill="#2DD4BF" fillOpacity={0.35} />
                    <Radar name="Comilog (Gabon)" dataKey="Moanda_GAB" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                    <Radar name="GEMCO (Australia)" dataKey="GEMCO_AUS" stroke="#7E69AB" fill="#7E69AB" fillOpacity={0.15} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-xl bg-[#0F1214]/70 border border-[#26333B] text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-[#E8E6E3]">Key Takeaway for India:</p>
                <p className="text-slate-400">
                  While Gabon and Australia enjoy higher natural grades, <strong className="text-[#E8E6E3]">MOIL Limited holds unmatched captive domestic proximity</strong> with zero international ocean freight exposure and integrated EMD value addition.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Seaborne Trade Flows & Pricing */}
      {activeTab === 'trade' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Global Pricing Benchmarks */}
            <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#E8E6E3] flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    International & Domestic Price Benchmarks
                  </h4>
                  <p className="text-xs text-slate-400">Current market realization (CIF Tianjin vs MOIL E-Auction)</p>
                </div>
                <ProvenanceBadge sourceId="src-imni-global-market" compact onClick={() => setSelectedSourceId('src-imni-global-market')} />
              </div>

              <div className="space-y-3">
                {marketData.pricingBenchmarks?.benchmarks?.map((bm, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0F1214]/70 border border-[#26333B] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#E8E6E3] leading-tight">{bm.gradeName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-0.5 ${bm.yoyChangePct >= 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-[#DC5F4E] border border-red-800'
                          }`}
                      >
                        {bm.yoyChangePct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {bm.yoyChangePct}% YoY
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between font-mono">
                      {bm.priceUsdPerDmtu && (
                        <div className="text-sm font-bold text-tech-teal">
                          ${bm.priceUsdPerDmtu} <span className="text-[10px] text-slate-400">/ dmtu</span>
                        </div>
                      )}
                      {bm.priceInrPerTonne && (
                        <div className="text-sm font-bold text-emerald-400">
                          ₹{bm.priceInrPerTonne.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400">/ tonne</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-300">
                        ≈ ${bm.equivalentPriceUsdPerTonne} / tonne
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 block truncate">{bm.benchmarkSource}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Exporters Pie Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#E8E6E3] flex items-center gap-2">
                    <Ship className="w-4 h-4 text-tech-teal" />
                    Top Seaborne Ore Exporters
                  </h4>
                  <p className="text-xs text-slate-400">Total seaborne volume: 36.8 Mt gross ore/year</p>
                </div>
                <ProvenanceBadge sourceId="src-imni-global-market" compact onClick={() => setSelectedSourceId('src-imni-global-market')} />
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exportersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {exportersData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={exporterColors[index % exporterColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161D22',
                        borderColor: '#26333B',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#E8E6E3'
                      }}
                      formatter={(val: any, name: any) => [`${val} Mt (${exportersData.find(e => e.name === name)?.share}%)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {exportersData.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exporterColors[idx] }} />
                      {e.name}
                    </span>
                    <span className="font-mono font-bold text-[#E8E6E3]">{e.value} Mt ({e.share}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Importers Bar List */}
            <div className="glass-panel p-6 rounded-2xl border border-[#26333B] bg-[#161D22]/85 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#E8E6E3] flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-tech-teal" />
                    Major Global Ore Importers
                  </h4>
                  <p className="text-xs text-slate-400">Demand drivers across global steelmaking clusters</p>
                </div>
                <ProvenanceBadge sourceId="src-imni-global-market" compact onClick={() => setSelectedSourceId('src-imni-global-market')} />
              </div>

              <div className="space-y-3">
                {importersData.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0F1214]/70 border border-[#26333B] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E8E6E3]">{imp.country}</span>
                      <span className="text-xs font-mono font-bold text-tech-teal">{imp.volume} Mt ({imp.share}%)</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#12181A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-manganese-500 rounded-full"
                        style={{ width: `${Math.min(100, imp.share * 1.5)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">{imp.useCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Deep-Sea Ocean Nodules (Blue Economy) */}
      {activeTab === 'deepsea' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-tech-teal/30 bg-gradient-to-r from-[#12181A] via-[#161D22] to-[#12181A] space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-tech-teal/15 text-tech-teal border border-tech-teal/30 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Abyssal Marine Mining
                  </span>
                  <ProvenanceBadge sourceId="src-moes-isa-deepsea" compact onClick={() => setSelectedSourceId('src-moes-isa-deepsea')} />
                </div>
                <h3 className="text-xl font-bold text-[#E8E6E3]">
                  Deep-Sea Polymetallic Manganese Nodules (Blue Economy)
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Abyssal plains (depth 4,000–5,500m) hold massive potato-sized polymetallic nodules containing <strong className="text-[#E8E6E3]">24–30% Manganese</strong> alongside strategic battery metals (Nickel, Cobalt, Copper). India holds an exclusive 75,000 sq km exploration block in the Central Indian Ocean Basin (CIOB).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1214]/90 border border-tech-teal/40 text-center shrink-0 space-y-1">
                <span className="text-[10px] text-tech-teal uppercase font-semibold">India CIOB Claim</span>
                <div className="text-2xl font-black text-[#E8E6E3] font-mono">380 <span className="text-xs font-bold text-tech-teal">Mt Nodules</span></div>
                <span className="text-[10px] text-slate-400 block font-mono">≈ 91.2 Mt Pure Manganese Metal</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {marketData.deepSeaNodules?.deposits?.map((dep, idx) => {
              const isIndia = dep.regionName.includes('Central Indian Ocean');
              return (
                <div
                  key={idx}
                  className={`glass-panel p-6 rounded-2xl border transition space-y-4 flex flex-col justify-between bg-[#161D22]/85 ${isIndia
                    ? 'border-tech-teal/70 bg-gradient-to-b from-[#161D22] to-teal-950/20 shadow-glow-teal'
                    : 'border-[#26333B] hover:border-slate-700'
                    }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-tech-teal uppercase tracking-wider">
                        {dep.jurisdiction.split('/')[0]}
                      </span>
                      {isIndia && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-tech-teal border border-teal-700">
                          🇮🇳 Samudrayaan Mission
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#E8E6E3]">{dep.regionName}</h4>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-[#0F1214]/70 p-2 rounded-lg border border-[#26333B]">
                        <span className="text-[10px] text-slate-400 font-sans block">Exploration Area</span>
                        <span className="font-bold text-[#E8E6E3]">{dep.areaSqKm.toLocaleString()} sq km</span>
                      </div>
                      <div className="bg-[#0F1214]/70 p-2 rounded-lg border border-[#26333B]">
                        <span className="text-[10px] text-slate-400 font-sans block">Water Depth</span>
                        <span className="font-bold text-tech-teal">{dep.oceanDepthMeters} m</span>
                      </div>
                      <div className="bg-[#0F1214]/70 p-2 rounded-lg border border-[#26333B]">
                        <span className="text-[10px] text-slate-400 font-sans block">Total Nodule Ore</span>
                        <span className="font-bold text-amber-400">{dep.estimatedNoduleResourceMt.toLocaleString()} Mt</span>
                      </div>
                      <div className="bg-[#0F1214]/70 p-2 rounded-lg border border-[#26333B]">
                        <span className="text-[10px] text-slate-400 font-sans block">Contained Mn</span>
                        <span className="font-bold text-manganese-300">{dep.containedManganeseMt.toLocaleString()} Mt</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300">
                        <strong className="text-slate-200">Average Grade:</strong> <span className="text-emerald-400 font-bold">{dep.avgMnGradePct}% Manganese</span>
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-200">Secondary Critical Metals:</strong> {dep.secondaryMetals}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-200">Technological Program:</strong> {dep.developmentProgram}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0F1214]/70 border border-[#26333B] text-[11px] text-slate-400">
                    <strong className="text-slate-300">Status:</strong> {dep.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Source Provenance Modal */}
      {selectedSourceId && (
        <DataSourceModal sourceId={selectedSourceId} onClose={() => setSelectedSourceId(null)} />
      )}
    </div>
  );
};
