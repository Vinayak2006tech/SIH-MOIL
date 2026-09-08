import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  CircleMarker,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Compass,
  Database,
  Activity,
  Satellite,
  Info,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Building2,
  Pickaxe,
  Search,
  Crosshair,
  Filter,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  X,
  Target,
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useMine } from '../context/MineContext';
import { api } from '../services/api';
import type {
  Mine,
  MineZone,
  Borehole,
  Facility,
  ExplorationBlock,
  ReserveProbabilityCell,
  GeostatisticalVariogram
} from '../types';
import {
  generateReserveProbabilityGrid,
  getVariogramForMine,
  calculateGradeTonnageDistribution,
  calculateProbabilityPercentiles
} from '../services/geostatistics';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

// Helper component to smoothly fly/zoom to selected coordinates
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Custom Leaflet Icons
const createMineMarker = (type: 'Underground' | 'Opencast' | 'Mixed', risk: string, name: string) => {
  const isUnderground = type === 'Underground';
  const borderColor = risk === 'CRITICAL' ? '#EF4444' : risk === 'HIGH' ? '#F59E0B' : '#10B981';
  const iconSymbol = isUnderground ? '⛏️' : '🚜';

  return L.divIcon({
    className: 'custom-mine-marker',
    html: `
      <div style="
        background: #0B1120;
        border: 2px solid ${borderColor};
        color: white;
        padding: 3px 8px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 700;
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      ">
        <span>${iconSymbol}</span>
        <span style="color: #F8FAFC;">${name.replace('Manganese Mine', '').replace('Underground Mine', '').replace('Opencast Mine', '').trim()}</span>
        <span style="width: 6px; height: 6px; border-radius: 50%; background: ${borderColor};"></span>
      </div>
    `,
    iconSize: [110, 24],
    iconAnchor: [55, 12]
  });
};

const createFacilityMarker = (type: string, name: string) => {
  const isHq = type.includes('Headquarters');
  const isPlant = type.includes('Plant') || type.includes('Smelter');
  const color = isHq ? '#10B981' : isPlant ? '#06B6D4' : '#6366F1';
  const symbol = isHq ? '🏢' : isPlant ? '🏭' : '🔧';

  return L.divIcon({
    className: 'custom-facility-marker',
    html: `
      <div style="
        background: #090E17;
        border: 2px solid ${color};
        color: ${color};
        padding: 3px 8px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 700;
        box-shadow: 0 0 12px ${color}60;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      ">
        <span>${symbol}</span>
        <span style="color: #F8FAFC;">${name.split('(')[0].trim().substring(0, 18)}</span>
      </div>
    `,
    iconSize: [115, 24],
    iconAnchor: [57, 12]
  });
};

const createExplorationMarker = (name: string) => {
  return L.divIcon({
    className: 'custom-exploration-marker',
    html: `
      <div style="
        background: #18091E;
        border: 2px dashed #EC4899;
        color: #F472B6;
        padding: 3px 8px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 700;
        box-shadow: 0 0 12px rgba(236,72,153,0.4);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      ">
        <span>🔍</span>
        <span style="color: #FDF2F8;">${name.split(' ')[0]} Block</span>
      </div>
    `,
    iconSize: [110, 24],
    iconAnchor: [55, 12]
  });
};

// Google Maps Platform API Key
export const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDM-T62CEAPrBXcGAQDr-K_9Jg6-rEoYOE';

export type BaseLayerType =
  | 'google-hybrid'
  | 'google-satellite'
  | 'google-terrain'
  | 'google-roadmap'
  | 'carto-dark'
  | 'carto-voyager';

export const baseLayerConfigs: Record<
  BaseLayerType,
  { name: string; icon: string; url: string; attribution: string; maxZoom?: number }
> = {
  'google-hybrid': {
    name: 'Google Satellite Hybrid (HD)',
    icon: '🛰️',
    url: `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Maps Satellite &copy; Maxar Technologies &copy; CNES/Airbus',
    maxZoom: 22
  },
  'google-satellite': {
    name: 'Google Earth (Pure Satellite)',
    icon: '🌍',
    url: `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    attribution: '&copy; Google Earth Imagery &copy; Copernicus',
    maxZoom: 22
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
  },
  'carto-voyager': {
    name: 'CARTO Voyager Atlas',
    icon: '🧭',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    maxZoom: 19
  }
};

/**
 * Returns color & border styles for a reserve probability percentage
 */
const getProbabilityColor = (prob: number) => {
  if (prob >= 85) {
    return {
      fill: '#8B5CF6', // Purple - Proved UNFC 111
      border: '#C084FC',
      label: 'Proved Ore Body (UNFC 111)',
      textColor: 'text-purple-300',
      bgBadge: 'bg-purple-950/80 border-purple-800 text-purple-300'
    };
  } else if (prob >= 70) {
    return {
      fill: '#3B82F6', // Blue - Probable UNFC 122
      border: '#60A5FA',
      label: 'Probable Extension (UNFC 122)',
      textColor: 'text-blue-300',
      bgBadge: 'bg-blue-950/80 border-blue-800 text-blue-300'
    };
  } else if (prob >= 50) {
    return {
      fill: '#10B981', // Emerald - Inferred UNFC 333
      border: '#34D399',
      label: 'Inferred Resource (UNFC 333)',
      textColor: 'text-emerald-300',
      bgBadge: 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
    };
  } else if (prob >= 30) {
    return {
      fill: '#F59E0B', // Amber - Prospective Anomaly
      border: '#FCD34D',
      label: 'Prospecting Target (UNFC 334)',
      textColor: 'text-amber-300',
      bgBadge: 'bg-amber-950/80 border-amber-800 text-amber-300'
    };
  } else {
    return {
      fill: '#64748B', // Slate - Country Rock / Sterile
      border: '#94A3B8',
      label: 'Sterile Host Rock',
      textColor: 'text-slate-400',
      bgBadge: 'bg-slate-900 border-slate-700 text-slate-400'
    };
  }
};

export const ReserveMapPage: React.FC = () => {
  const { mines, selectedMineId, setSelectedMineId, selectedMine } = useMine();
  const [zones, setZones] = useState<MineZone[]>([]);
  const [boreholes, setBoreholes] = useState<Borehole[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [explorationBlocks, setExplorationBlocks] = useState<ExplorationBlock[]>([]);
  const [selectedZone, setSelectedZone] = useState<MineZone | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ExplorationBlock | null>(null);
  const [selectedProbabilityCell, setSelectedProbabilityCell] = useState<ReserveProbabilityCell | null>(null);

  // Base Satellite Imagery & Google Maps Layer Selection
  const [baseLayer, setBaseLayer] = useState<BaseLayerType>('google-hybrid');

  // Layer Visibility Controls
  const [showMines, setShowMines] = useState(true);
  const [showConfidencePolygons, setShowConfidencePolygons] = useState(false);
  const [showReserveProbability, setShowReserveProbability] = useState(true); // 🎯 Reserve Probability Map
  const [showBoreholes, setShowBoreholes] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showExplorationBlocks, setShowExplorationBlocks] = useState(true);
  const [showNdviOverlay, setShowNdviOverlay] = useState(false);

  // Reserve Probability Filter & Customization Controls
  const [minProbabilityCutoff, setMinProbabilityCutoff] = useState<number>(30); // 30%, 50%, 70%, 85%
  const [gradeCutoffMn, setGradeCutoffMn] = useState<number>(25); // 25%, 35%, 44%
  const [probabilityOpacity, setProbabilityOpacity] = useState<number>(0.65);
  const [inspectorTab, setInspectorTab] = useState<'PROBABILITY' | 'ASSAYS' | 'RE_ESTIMATE'>('PROBABILITY');

  // Draft / Pending Filter States before user clicks "Apply Filters"
  const [pendingMinProbCutoff, setPendingMinProbCutoff] = useState<number>(30);
  const [pendingGradeCutoffMn, setPendingGradeCutoffMn] = useState<number>(25);
  const [pendingProbabilityOpacity, setPendingProbabilityOpacity] = useState<number>(0.65);
  const [filterAppliedMessage, setFilterAppliedMessage] = useState<string | null>(null);

  // Responsive UI Controls
  const [isFinderOpen, setIsFinderOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isProbabilityControlOpen, setIsProbabilityControlOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'MINE' | 'FACILITY' | 'EXPLORATION'>('ALL');
  const [searchLocation, setSearchLocation] = useState('');

  // Map Viewport
  const [mapViewport, setMapViewport] = useState<{ center: [number, number]; zoom: number }>({
    center: [21.65, 79.75], // Central India Mining Corridor (Nagpur - Balaghat)
    zoom: 9
  });

  const [reEstimating, setReEstimating] = useState(false);
  const [reEstimateResult, setReEstimateResult] = useState<any>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [zoneData, bhData, facData, expData] = await Promise.all([
          api.getMineZones(),
          api.getBoreholes(),
          api.getFacilities(),
          api.getExplorationBlocks()
        ]);
        setZones(zoneData || []);
        setBoreholes(bhData || []);
        setFacilities(facData || []);
        setExplorationBlocks(expData || []);

        if (zoneData && zoneData.length > 0) {
          const active = zoneData.find((z) => z.mineId === selectedMineId) || zoneData[0];
          setSelectedZone(active);
        }
      } catch (err) {
        console.error('Failed to load map data:', err);
      }
    };

    loadMapData();
  }, [selectedMineId]);

  // Generate All Reserve Probability Spatial Cells across 10 MOIL mines
  const allProbabilityCells = useMemo(() => {
    if (!mines || mines.length === 0) return [];
    return generateReserveProbabilityGrid(mines, boreholes);
  }, [mines, boreholes]);

  // Filter Probability Cells according to active threshold & grade
  const filteredProbabilityCells = useMemo(() => {
    return allProbabilityCells.filter((cell) => {
      const meetsProb = cell.probabilityPct >= minProbabilityCutoff;
      const meetsGrade = cell.predictedMnGradePct >= gradeCutoffMn;
      return meetsProb && meetsGrade;
    });
  }, [allProbabilityCells, minProbabilityCutoff, gradeCutoffMn]);

  // Real-time draft preview while configuring filters in popup
  const pendingPreviewCells = useMemo(() => {
    return allProbabilityCells.filter((cell) => {
      return cell.probabilityPct >= pendingMinProbCutoff && cell.predictedMnGradePct >= pendingGradeCutoffMn;
    });
  }, [allProbabilityCells, pendingMinProbCutoff, pendingGradeCutoffMn]);

  const pendingPreviewReservesMt = useMemo(() => {
    const sumKt = pendingPreviewCells.reduce((acc, c) => acc + c.estimatedTonnageKt, 0);
    return Math.round((sumKt / 1000.0) * 10) / 10;
  }, [pendingPreviewCells]);

  const isFilterDirty =
    pendingMinProbCutoff !== minProbabilityCutoff ||
    pendingGradeCutoffMn !== gradeCutoffMn ||
    pendingProbabilityOpacity !== probabilityOpacity;

  const handleApplyFilters = () => {
    setMinProbabilityCutoff(pendingMinProbCutoff);
    setGradeCutoffMn(pendingGradeCutoffMn);
    setProbabilityOpacity(pendingProbabilityOpacity);
    setShowReserveProbability(true);
    setFilterAppliedMessage(
      `✓ Filters Applied: P ≥ ${pendingMinProbCutoff}%, ≥ ${pendingGradeCutoffMn}% Mn (${pendingPreviewCells.length} cells, ${pendingPreviewReservesMt} Mt)`
    );
    setTimeout(() => setFilterAppliedMessage(null), 4000);
  };

  const handleResetFilters = () => {
    setPendingMinProbCutoff(25);
    setPendingGradeCutoffMn(20);
    setPendingProbabilityOpacity(0.65);
    setMinProbabilityCutoff(25);
    setGradeCutoffMn(20);
    setProbabilityOpacity(0.65);
    setFilterAppliedMessage('✓ Filters reset to default baseline.');
    setTimeout(() => setFilterAppliedMessage(null), 3000);
  };

  // Geostatistical calculations for active mine/zone
  const currentActiveMine = useMemo(() => {
    if (selectedProbabilityCell) {
      return mines.find((m) => m.mineId === selectedProbabilityCell.mineId) || selectedMine;
    }
    if (selectedZone) {
      return mines.find((m) => m.mineId === selectedZone.mineId) || selectedMine;
    }
    return selectedMine || mines[0];
  }, [selectedProbabilityCell, selectedZone, selectedMine, mines]);

  const activeVariogram: GeostatisticalVariogram | null = useMemo(() => {
    if (!currentActiveMine) return null;
    return getVariogramForMine(currentActiveMine);
  }, [currentActiveMine]);

  const gradeTonnageCurve = useMemo(() => {
    if (!currentActiveMine) return [];
    return calculateGradeTonnageDistribution(currentActiveMine, minProbabilityCutoff);
  }, [currentActiveMine, minProbabilityCutoff]);

  const percentileReport = useMemo(() => {
    if (!currentActiveMine) return null;
    return calculateProbabilityPercentiles(currentActiveMine);
  }, [currentActiveMine]);

  // Total probability-weighted reserves in active view
  const totalProbabilityReservesMt = useMemo(() => {
    const sumKt = filteredProbabilityCells.reduce((acc, c) => acc + c.estimatedTonnageKt, 0);
    return Math.round((sumKt / 1000.0) * 10) / 10;
  }, [filteredProbabilityCells]);

  // Quick Zoom when selectedMine changes from navbar/context
  useEffect(() => {
    if (selectedMine && selectedMine.latitude && selectedMine.longitude) {
      setMapViewport({
        center: [selectedMine.latitude, selectedMine.longitude],
        zoom: 12
      });
      const matchedZone = zones.find((z) => z.mineId === selectedMine.mineId);
      if (matchedZone) {
        setSelectedZone(matchedZone);
        setSelectedFacility(null);
        setSelectedBlock(null);
      }
    }
  }, [selectedMine, zones]);

  const handleFlyTo = (lat: number, lng: number, zoom = 12) => {
    setMapViewport({ center: [lat, lng], zoom });
  };

  const handleRunReEstimate = async () => {
    if (!selectedZone) return;
    setReEstimating(true);
    try {
      const res = await api.calculateReserves({
        mineId: selectedZone.mineId,
        area_sqkm: 3.2,
        geology: {
          seam_depth_m: selectedZone.depthMeters,
          seam_thickness_m: 14.5,
          mn_grade_pct: selectedZone.avgMnGrade,
          fe_grade_pct: selectedZone.avgFeGrade,
          sio2_grade_pct: selectedZone.avgSiO2Grade,
          p_grade_pct: 0.16,
          rock_hardness_rqd: 82.0,
          borehole_density_per_sqkm: 14.0,
          core_recovery_pct: selectedZone.avgCoreRecoveryPct
        },
        satellite: {
          ndvi_index: 0.38,
          soil_moisture_pct: 29.5,
          rainfall_anomaly_mm: 30.0,
          land_surface_temp_c: 33.0,
          elevation_m: 320.0
        }
      });
      setReEstimateResult(res);
    } catch (err) {
      console.error('Reserve estimation failed:', err);
    } finally {
      setReEstimating(false);
    }
  };

  // Build unified locations array
  const allLocations = [
    ...mines.map((m) => ({ id: m.mineId, name: m.name, type: `${m.type} Mine`, state: `${m.district}, ${m.state}`, reserves: `${m.totalReservesMt} Mt`, lat: m.latitude, lng: m.longitude, raw: m, category: 'MINE' as const })),
    ...facilities.map((f) => ({ id: f.facilityId, name: f.name, type: f.type, state: `${f.district}, ${f.state}`, reserves: f.capacity, lat: f.latitude, lng: f.longitude, raw: f, category: 'FACILITY' as const })),
    ...explorationBlocks.map((b) => ({ id: b.blockId, name: b.name, type: 'Greenfield Block', state: `${b.district}, ${b.state}`, reserves: `~${b.estimatedPotentialMt} Mt Pot.`, lat: b.latitude, lng: b.longitude, raw: b, category: 'EXPLORATION' as const }))
  ];

  const filteredLocations = allLocations.filter((loc) => {
    const matchesCat = filterCategory === 'ALL' || loc.category === filterCategory;
    const matchesSearch = loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchLocation.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative w-full h-[calc(100vh-4.2rem)] flex overflow-hidden">
      {/* Map Canvas */}
      <div className="flex-1 relative h-full bg-[#080C14] z-0">

        {/* ============================================================ */}
        {/* 🌟 RESPONSIVE FLOATING MOIL LOCATION FINDER & TOOLBAR (Z-1000) */}
        {/* ============================================================ */}
        <div className="absolute top-3 left-3 right-3 lg:right-auto z-[1000] flex flex-col gap-2 w-auto max-w-[calc(100vw-1.5rem)] sm:max-w-2xl pointer-events-auto">
          {/* Main Top Header Card */}
          <div className="glass-panel bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 sm:p-3 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
              {/* Title and Stats */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-extrabold text-white truncate leading-tight">
                      MOIL GIS Reserve & Probability Map
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      Kriging
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    10 Mines • {filteredProbabilityCells.length} Cells • {totalProbabilityReservesMt} Mt Modelled
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
                {/* Reserve Probability Layer Quick Toggle Pill */}
                <button
                  onClick={() => setShowReserveProbability(!showReserveProbability)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 shrink-0 ${showReserveProbability
                      ? 'bg-purple-600 text-white border-purple-400 shadow-glow-purple'
                      : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  title="Toggle 2D/3D Reserve Probability Field (Indicator Kriging)"
                >
                  <Target className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden md:inline">Reserve Prob.</span>
                </button>

                {/* Probability Filter Sliders Button */}
                <button
                  onClick={() => {
                    if (!isProbabilityControlOpen) {
                      setPendingMinProbCutoff(minProbabilityCutoff);
                      setPendingGradeCutoffMn(gradeCutoffMn);
                      setPendingProbabilityOpacity(probabilityOpacity);
                    }
                    setIsProbabilityControlOpen(!isProbabilityControlOpen);
                  }}
                  className={`p-1.5 rounded-lg text-xs border transition shrink-0 relative ${isProbabilityControlOpen || minProbabilityCutoff !== 25 || gradeCutoffMn !== 20
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  title="Probability & Cutoff Filter Controls"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {(minProbabilityCutoff !== 25 || gradeCutoffMn !== 20) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-slate-900" />
                  )}
                </button>

                {/* Base Layer Dropdown */}
                <select
                  value={baseLayer}
                  onChange={(e) => setBaseLayer(e.target.value as BaseLayerType)}
                  className="px-1.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-900 border border-purple-500/60 text-purple-300 hover:border-purple-400 focus:outline-none cursor-pointer shadow-sm hidden lg:block max-w-[125px] truncate shrink-0"
                  title="Select Base Imagery (Google Maps / Satellite)"
                >
                  <option value="google-hybrid">🛰️ Satellite</option>
                  <option value="google-satellite">🌍 Pure Earth</option>
                  <option value="google-terrain">⛰️ Terrain</option>
                  <option value="google-roadmap">🗺️ Roadmap</option>
                  <option value="carto-dark">🌌 Dark</option>
                  <option value="carto-voyager">🧭 Voyager</option>
                </select>

                {/* Layers button */}
                <button
                  onClick={() => setIsLayersOpen(!isLayersOpen)}
                  className={`p-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1 shrink-0 ${isLayersOpen
                      ? 'bg-purple-600 text-white border-purple-500 shadow-glow-purple'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  title="Toggle GIS Overlays & Base Imagery"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                {/* Compass Reset Center */}
                <button
                  onClick={() => handleFlyTo(21.65, 79.75, 9)}
                  className="p-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center shrink-0"
                  title="Center Central India Corridor"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>

                {/* Minimize / Maximize */}
                <button
                  onClick={() => setIsFinderOpen(!isFinderOpen)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shrink-0"
                  title={isFinderOpen ? 'Minimize Finder' : 'Expand Finder'}
                >
                  {isFinderOpen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Expanded Search & Category Filters */}
            {isFinderOpen && (
              <div className="mt-3 space-y-2.5 border-t border-slate-800/80 pt-2.5 animate-fadeIn">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by mine, district, plant (e.g. Balaghat, Dongri, Kandri)..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-slate-100 pl-8 pr-8 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder:text-slate-500"
                  />
                  {searchLocation && (
                    <button
                      onClick={() => setSearchLocation('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                  <button
                    onClick={() => setFilterCategory('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition ${filterCategory === 'ALL'
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    All ({allLocations.length})
                  </button>
                  <button
                    onClick={() => setFilterCategory('MINE')}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition flex items-center gap-1 ${filterCategory === 'MINE'
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    ⛏️ Mines ({mines.length})
                  </button>
                  <button
                    onClick={() => setFilterCategory('FACILITY')}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition flex items-center gap-1 ${filterCategory === 'FACILITY'
                        ? 'bg-cyan-600 text-white shadow-glow-cyan'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    🏭 Plants ({facilities.length})
                  </button>
                  <button
                    onClick={() => setFilterCategory('EXPLORATION')}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition flex items-center gap-1 ${filterCategory === 'EXPLORATION'
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    🔍 Exploration ({explorationBlocks.length})
                  </button>
                </div>

                {/* Filtered Location List */}
                <div className="max-h-44 overflow-y-auto space-y-1 divide-y divide-slate-800/50 pr-1">
                  {filteredLocations.map((loc) => {
                    const isSelected =
                      (loc.category === 'MINE' && (selectedZone?.mineId === loc.id || selectedProbabilityCell?.mineId === loc.id)) ||
                      (loc.category === 'FACILITY' && selectedFacility?.facilityId === loc.id) ||
                      (loc.category === 'EXPLORATION' && selectedBlock?.blockId === loc.id);

                    const badgeColor =
                      loc.category === 'MINE'
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : loc.category === 'FACILITY'
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                          : 'bg-pink-950 text-pink-300 border-pink-800';

                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          handleFlyTo(loc.lat, loc.lng, 13);
                          if (loc.category === 'MINE') {
                            setSelectedMineId(loc.id);
                            const mz = zones.find((z) => z.mineId === loc.id);
                            if (mz) setSelectedZone(mz);
                            const topCell = allProbabilityCells.find((c) => c.mineId === loc.id && c.isCoreZone);
                            if (topCell) setSelectedProbabilityCell(topCell);
                            setSelectedFacility(null);
                            setSelectedBlock(null);
                          } else if (loc.category === 'FACILITY') {
                            setSelectedFacility(loc.raw as Facility);
                            setSelectedZone(null);
                            setSelectedBlock(null);
                            setSelectedProbabilityCell(null);
                          } else {
                            setSelectedBlock(loc.raw as ExplorationBlock);
                            setSelectedZone(null);
                            setSelectedFacility(null);
                            setSelectedProbabilityCell(null);
                          }
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${isSelected
                            ? 'bg-purple-950/60 border border-purple-600 text-white'
                            : 'hover:bg-slate-800/70 text-slate-300'
                          }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white truncate max-w-[220px]">{loc.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${badgeColor}`}>
                              {loc.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans">{loc.state}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono font-bold text-purple-300">{loc.reserves}</span>
                          <span className="text-[9px] text-slate-500 block">Click to Fly &rarr;</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reserve Probability Cutoff & Filtering Control Card */}
          {isProbabilityControlOpen && (
            <div className="glass-panel bg-slate-900/98 border border-purple-500/70 rounded-2xl p-3.5 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">
                    Reserve Probability Cutoff Controls
                  </span>
                </div>
                <button onClick={() => setIsProbabilityControlOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Real-time Preview Pill */}
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Matching Cells Preview:</span>
                <span className="font-mono font-bold text-purple-300">
                  {pendingPreviewCells.length} Cells • ~{pendingPreviewReservesMt} Mt
                </span>
              </div>

              {/* Probability Threshold Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Min Probability Cutoff:</span>
                  <span className="font-mono font-bold text-purple-400">P &ge; {pendingMinProbCutoff}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                  {[25, 50, 70, 85].map((cutoff) => (
                    <button
                      key={cutoff}
                      type="button"
                      onClick={() => setPendingMinProbCutoff(cutoff)}
                      className={`py-1.5 rounded-lg border transition ${pendingMinProbCutoff === cutoff
                          ? 'bg-purple-600 text-white border-purple-400 shadow-glow-purple font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      {cutoff === 85 ? 'Proved (85%)' : cutoff === 70 ? 'Probable (70%)' : cutoff === 50 ? 'Inferred (50%)' : 'All (25%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Cutoff Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Ore Grade Cutoff:</span>
                  <span className="font-mono font-bold text-emerald-400">&ge; {pendingGradeCutoffMn}% Mn</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                  {[20, 35, 44].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPendingGradeCutoffMn(g)}
                      className={`py-1.5 rounded-lg border transition ${pendingGradeCutoffMn === g
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      {g === 44 ? 'High (>=44%)' : g === 35 ? 'Med (>=35%)' : 'Low (>=20%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heatmap Opacity Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Layer Opacity:</span>
                  <span className="font-mono text-slate-300">{Math.round(pendingProbabilityOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.05"
                  value={pendingProbabilityOpacity}
                  onChange={(e) => setPendingProbabilityOpacity(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Action Buttons: Apply Filters & Reset */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center gap-1.5 shrink-0"
                  title="Reset to default baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${isFilterDirty
                      ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple ring-2 ring-purple-400/80'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Filters ({pendingPreviewCells.length} Cells)</span>
                </button>
              </div>
            </div>
          )}

          {/* Feedback Toast Notification when filter is applied */}
          {filterAppliedMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/95 border border-emerald-500/80 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-2xl animate-fadeIn backdrop-blur-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{filterAppliedMessage}</span>
              </div>
              <button onClick={() => setFilterAppliedMessage(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Collapsible GIS Layers Popup Panel */}
          {isLayersOpen && (
            <div className="glass-panel bg-slate-900/98 border border-slate-700 rounded-2xl p-3.5 shadow-2xl space-y-3 animate-fadeIn max-w-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> GIS Layer Controls & Satellite Base
                </span>
                <button onClick={() => setIsLayersOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Google Maps Base Imagery Section */}
              <div className="space-y-1.5 border-b border-slate-800 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Base Earth Imagery
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Google Maps API
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {Object.entries(baseLayerConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBaseLayer(key as BaseLayerType)}
                      className={`p-1.5 rounded-lg text-left font-semibold flex items-center gap-1.5 transition ${baseLayer === key
                          ? 'bg-purple-600 text-white shadow-glow-purple'
                          : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <span className="text-xs">{config.icon}</span>
                      <span className="truncate text-[10px]">{config.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vector & Subsurface Overlays */}
              <div className="space-y-1 text-xs text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Mining Telemetry Overlays
                </span>

                {/* Reserve Probability Field */}
                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded bg-purple-950/40 border border-purple-900/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showReserveProbability}
                      onChange={(e) => setShowReserveProbability(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="font-bold text-purple-300">🎯 Reserve Probability (Kriging)</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono">{filteredProbabilityCells.length} Cells</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showMines}
                      onChange={(e) => setShowMines(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>⛏️ Operating Mines ({mines.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">10 Leases</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showConfidencePolygons}
                      onChange={(e) => setShowConfidencePolygons(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>📐 UNFC Reserve Boundary Zones</span>
                  </div>
                  <ProvenanceBadge sourceId="src-ibm-nmi-manganese" compact />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showBoreholes}
                      onChange={(e) => setShowBoreholes(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>🔬 Borehole Drill Grid ({boreholes.length})</span>
                  </div>
                  <ProvenanceBadge sourceId="src-synthetic-boreholes" compact />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showFacilities}
                      onChange={(e) => setShowFacilities(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>🏭 Plants & HQ ({facilities.length})</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">6 Units</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showExplorationBlocks}
                      onChange={(e) => setShowExplorationBlocks(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>🔍 Greenfield Blocks ({explorationBlocks.length})</span>
                  </div>
                  <span className="text-[10px] text-pink-400 font-mono">3 Blocks</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-white p-1 rounded hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showNdviOverlay}
                      onChange={(e) => setShowNdviOverlay(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>🛰️ Sentinel-2 NDVI Overlay</span>
                  </div>
                  <ProvenanceBadge sourceId="src-copernicus-sentinel2" compact />
                </label>
              </div>

              {/* Apply Layers Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsLayersOpen(false)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply & Close</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 🌈 BOTTOM FLOATING RESERVE PROBABILITY & GEOSTATISTICAL LEGEND */}
        {/* ============================================================ */}
        <div className="absolute bottom-3 left-3 right-3 lg:right-auto z-[900] glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[11px] max-w-4xl">
          <div className="flex items-center gap-1.5 shrink-0">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-extrabold text-white uppercase tracking-wider">Reserve Probability Spectrum:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 rounded bg-[#8B5CF6] border border-[#C084FC]" />
              <span className="text-purple-300 font-mono font-bold">&ge;85%</span>
              <span className="text-slate-400 text-[10px]">Proved (111)</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 rounded bg-[#3B82F6] border border-[#60A5FA]" />
              <span className="text-blue-300 font-mono font-bold">70-85%</span>
              <span className="text-slate-400 text-[10px]">Probable (122)</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 rounded bg-[#10B981] border border-[#34D399]" />
              <span className="text-emerald-300 font-mono font-bold">50-70%</span>
              <span className="text-slate-400 text-[10px]">Inferred (333)</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 rounded bg-[#F59E0B] border border-[#FCD34D]" />
              <span className="text-amber-300 font-mono font-bold">30-50%</span>
              <span className="text-slate-400 text-[10px]">Prospecting</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 rounded bg-[#64748B] border border-[#94A3B8]" />
              <span className="text-slate-400 font-mono font-bold">&lt;30%</span>
              <span className="text-slate-500 text-[10px]">Sterile Host</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 shrink-0 text-slate-300">
            <span className="text-[10px] text-slate-400">Total Filtered:</span>
            <span className="font-mono font-bold text-purple-400">{totalProbabilityReservesMt} Mt</span>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <MapContainer
          center={mapViewport.center}
          zoom={mapViewport.zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController center={mapViewport.center} zoom={mapViewport.zoom} />

          <TileLayer
            key={baseLayer}
            attribution={baseLayerConfigs[baseLayer].attribution}
            url={baseLayerConfigs[baseLayer].url}
            maxZoom={baseLayerConfigs[baseLayer].maxZoom || 22}
          />

          {/* ============================================================ */}
          {/* 🎯 RESERVE PROBABILITY KRIGING HEATMAP CELLS */}
          {/* ============================================================ */}
          {showReserveProbability &&
            filteredProbabilityCells.map((cell) => {
              const isSelected = selectedProbabilityCell?.cellId === cell.cellId;
              const colorInfo = getProbabilityColor(cell.probabilityPct);

              return (
                <Polygon
                  key={cell.cellId}
                  positions={cell.polygon}
                  pathOptions={{
                    color: isSelected ? '#FFFFFF' : colorInfo.border,
                    weight: isSelected ? 2.5 : cell.isCoreZone ? 1.5 : 0.75,
                    fillColor: colorInfo.fill,
                    fillOpacity: isSelected ? Math.min(0.95, probabilityOpacity + 0.25) : probabilityOpacity
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedProbabilityCell(cell);
                      setSelectedMineId(cell.mineId);
                      const matchedZone = zones.find((z) => z.mineId === cell.mineId);
                      if (matchedZone) setSelectedZone(matchedZone);
                      setSelectedFacility(null);
                      setSelectedBlock(null);
                      setIsDrawerOpen(true);
                      setInspectorTab('PROBABILITY');
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1.5 space-y-1.5 text-xs font-sans max-w-[260px]">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-purple-600" />
                          {cell.mineName}
                        </span>
                        <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                          P = {cell.probabilityPct}%
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-700 font-medium">
                        <strong>Classification:</strong> {cell.confidenceTier.replace(/_/g, ' ')}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono py-1">
                        <div className="bg-slate-100 p-1 rounded">
                          <span className="text-[9px] text-slate-500 font-sans block">Estimated Ore</span>
                          <span className="font-bold text-purple-700">{cell.estimatedTonnageKt.toLocaleString()} kt</span>
                        </div>
                        <div className="bg-slate-100 p-1 rounded">
                          <span className="text-[9px] text-slate-500 font-sans block">Predicted Grade</span>
                          <span className="font-bold text-emerald-700">{cell.predictedMnGradePct}% Mn</span>
                        </div>
                        <div className="bg-slate-100 p-1 rounded">
                          <span className="text-[9px] text-slate-500 font-sans block">Seam Depth</span>
                          <span className="font-bold text-slate-800">{cell.seamDepthMeters}m (thick {cell.seamThicknessMeters}m)</span>
                        </div>
                        <div className="bg-slate-100 p-1 rounded">
                          <span className="text-[9px] text-slate-500 font-sans block">Kriging Variance</span>
                          <span className="font-bold text-blue-700">σ² = {cell.krigingVariance}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-600 leading-tight">
                        <strong>Lithology:</strong> {cell.lithology}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Strike: {cell.strikeDip.split('(')[0]}</span>
                        <span className="text-purple-600 font-semibold cursor-pointer">Click to Inspect &rarr;</span>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Geological Confidence Polygons */}
          {showConfidencePolygons &&
            zones.map((zone) => {
              const isSelected = selectedZone?.zoneId === zone.zoneId;
              const fillColor =
                zone.confidenceCategory === 'HIGH_CONFIDENCE_PROVED'
                  ? '#8B5CF6'
                  : zone.confidenceCategory === 'MODERATE_CONFIDENCE_PROBABLE'
                    ? '#3B82F6'
                    : '#F59E0B';

              return (
                <Polygon
                  key={zone.zoneId}
                  positions={zone.polygon}
                  pathOptions={{
                    color: fillColor,
                    weight: isSelected ? 3 : 1.5,
                    fillColor,
                    fillOpacity: isSelected ? 0.4 : 0.15
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedZone(zone);
                      setSelectedMineId(zone.mineId);
                      setSelectedFacility(null);
                      setSelectedBlock(null);
                      setIsDrawerOpen(true);
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs font-sans">
                      <p className="font-bold text-slate-900">{zone.mineName}</p>
                      <p className="text-purple-700 font-mono font-bold">Estimated Reserves: {zone.estimatedReservesMt} Mt</p>
                      <p className="text-slate-700">Proved: {zone.provedReservesMt} Mt • Probable: {zone.probableReservesMt} Mt</p>
                      <p className="text-slate-600">Average Grade: {zone.avgMnGrade}% Mn</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Borehole Drill Points */}
          {showBoreholes &&
            boreholes.map((bh) => (
              <CircleMarker
                key={bh.boreholeId}
                center={[bh.collarLatitude, bh.collarLongitude]}
                radius={4.5}
                pathOptions={{
                  color: '#10B981',
                  fillColor: '#10B981',
                  fillOpacity: 0.85,
                  weight: 1
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs font-sans">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {bh.boreholeId} ({bh.mineName})
                    </p>
                    <p className="text-slate-700">Total Depth: {bh.totalDepthMeters}m (Seam: {bh.seamThicknessMeters}m)</p>
                    <p className="text-emerald-700 font-mono font-bold">Grade: {bh.avgMnGradePct}% Mn ({bh.avgFeGradePct}% Fe)</p>
                    <p className="text-slate-600 text-[10px]">Formation: {bh.rockFormation}</p>
                    <p className="text-slate-600 text-[10px]">Recovery: {bh.coreRecoveryPct}% • RQD: {bh.rqdPct}%</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {/* Operating Mine Markers (10 MOIL Leases) */}
          {showMines &&
            mines.map((mine) => (
              <Marker
                key={mine.mineId}
                position={[mine.latitude, mine.longitude]}
                icon={createMineMarker(mine.type, mine.currentShortfallRiskLevel, mine.name)}
                eventHandlers={{
                  click: () => {
                    setSelectedMineId(mine.mineId);
                    const matchedZone = zones.find((z) => z.mineId === mine.mineId);
                    if (matchedZone) setSelectedZone(matchedZone);
                    const topCell = allProbabilityCells.find((c) => c.mineId === mine.mineId && c.isCoreZone);
                    if (topCell) setSelectedProbabilityCell(topCell);
                    setSelectedFacility(null);
                    setSelectedBlock(null);
                    setIsDrawerOpen(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1.5 space-y-1.5 text-xs font-sans">
                    <h4 className="font-bold text-slate-900 text-sm">{mine.name}</h4>
                    <p className="text-slate-600 font-medium">{mine.district}, {mine.state}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1">
                      <div className="bg-slate-100 p-1.5 rounded">
                        <span className="text-[10px] text-slate-500 font-sans block">Total Reserves</span>
                        <span className="font-bold text-purple-700">{mine.totalReservesMt} Mt</span>
                      </div>
                      <div className="bg-slate-100 p-1.5 rounded">
                        <span className="text-[10px] text-slate-500 font-sans block">Monthly Capacity</span>
                        <span className="font-bold text-slate-800">{mine.annualCapacityTonnes ? (mine.annualCapacityTonnes / 12).toFixed(0) : (mine.targetMonthlyTonnes || 25000).toLocaleString()} t</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-700"><strong>Mineralogy:</strong> {mine.keyMineralogy || 'Braunite, Gondite'}</p>
                    <p className="text-[11px] text-slate-700"><strong>Processing:</strong> {mine.onSiteProcessing || 'Screening & Sizing'}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <RiskBadge level={mine.currentShortfallRiskLevel} size="sm" />
                      <span className="text-[10px] text-slate-500 font-mono">Est. {mine.commissioningYear || 1905}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Industrial & Corporate Facilities (6 Facilities) */}
          {showFacilities &&
            facilities.map((fac) => (
              <Marker
                key={fac.facilityId}
                position={[fac.latitude, fac.longitude]}
                icon={createFacilityMarker(fac.type, fac.name)}
                eventHandlers={{
                  click: () => {
                    setSelectedFacility(fac);
                    setSelectedZone(null);
                    setSelectedBlock(null);
                    setSelectedProbabilityCell(null);
                    setIsDrawerOpen(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1.5 space-y-1.5 text-xs font-sans max-w-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
                      {fac.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{fac.name}</h4>
                    <p className="text-slate-600">{fac.district}, {fac.state}</p>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{fac.description}</p>
                    <p className="text-slate-800 font-semibold text-[11px]"><strong>Capacity:</strong> {fac.capacity}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Greenfield Exploration Blocks (3 Blocks) */}
          {showExplorationBlocks &&
            explorationBlocks.map((block) => (
              <Marker
                key={block.blockId}
                position={[block.latitude, block.longitude]}
                icon={createExplorationMarker(block.name)}
                eventHandlers={{
                  click: () => {
                    setSelectedBlock(block);
                    setSelectedZone(null);
                    setSelectedFacility(null);
                    setSelectedProbabilityCell(null);
                    setIsDrawerOpen(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1.5 space-y-1.5 text-xs font-sans max-w-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      Greenfield Exploration
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{block.name}</h4>
                    <p className="text-slate-600">{block.district}, {block.state} ({block.leaseAreaHectares} Ha)</p>
                    <p className="text-pink-700 font-mono font-bold">Estimated Potential: ~{block.estimatedPotentialMt} Mt</p>
                    <p className="text-slate-700 text-[11px]"><strong>Target Formation:</strong> {block.targetFormation}</p>
                    <p className="text-slate-600 text-[10px]">Status: {block.status.replace(/_/g, ' ')}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* ============================================================ */}
      {/* 📋 RESPONSIVE RIGHT DRAWER (INSPECTOR, PROBABILITY & SIMULATION) */}
      {/* ============================================================ */}
      <div
        className={`transition-all duration-300 glass-panel bg-slate-900/98 border-l border-slate-800/90 h-full overflow-y-auto z-10 shadow-2xl flex flex-col justify-between ${isDrawerOpen ? 'w-full md:w-[420px] p-5' : 'w-0 p-0 border-l-0 overflow-hidden'
          }`}
      >
        {isDrawerOpen && (
          <div className="space-y-5">
            {/* Drawer Top Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-400" /> Geostatistical Reserve Inspector
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Hide Inspector Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs in Drawer */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setInspectorTab('PROBABILITY')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${inspectorTab === 'PROBABILITY'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Reserve Probability</span>
              </button>
              <button
                onClick={() => setInspectorTab('ASSAYS')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${inspectorTab === 'ASSAYS'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Borehole Assays</span>
              </button>
              <button
                onClick={() => setInspectorTab('RE_ESTIMATE')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${inspectorTab === 'RE_ESTIMATE'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Kriging Sandbox</span>
              </button>
            </div>

            {selectedZone || selectedProbabilityCell ? (
              <>
                {/* Active Deposit/Cell Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold border ${selectedProbabilityCell
                          ? getProbabilityColor(selectedProbabilityCell.probabilityPct).bgBadge
                          : 'bg-purple-950 text-purple-300 border-purple-800'
                        }`}
                    >
                      {selectedProbabilityCell
                        ? `${selectedProbabilityCell.confidenceTier.replace(/_/g, ' ')} (${selectedProbabilityCell.probabilityPct}% P)`
                        : selectedZone?.confidenceCategory.replace(/_/g, ' ')}
                    </span>
                    <ProvenanceBadge sourceId="src-ibm-nmi-manganese" compact />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">
                    {selectedProbabilityCell ? selectedProbabilityCell.mineName : selectedZone?.mineName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {currentActiveMine?.district}, {currentActiveMine?.state} • Code: {currentActiveMine?.code}
                  </p>
                </div>

                {/* ============================================================ */}
                {/* TAB 1: RESERVE PROBABILITY & GEOSTATISTICAL ANALYSIS */}
                {/* ============================================================ */}
                {inspectorTab === 'PROBABILITY' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Probability & Tonnage Primary Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-panel p-3 rounded-xl border border-purple-900/60 bg-purple-950/20 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                          <Target className="w-3 h-3 text-purple-400" /> Ore Occurrence Prob.
                        </span>
                        <div className="text-2xl font-extrabold text-purple-300 font-mono">
                          {selectedProbabilityCell ? selectedProbabilityCell.probabilityPct : 92.4}%
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Cutoff: &ge; {gradeCutoffMn}% Mn
                        </span>
                      </div>

                      <div className="glass-panel p-3 rounded-xl border border-emerald-900/60 bg-emerald-950/20 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-400" /> In-Situ Mn Grade
                        </span>
                        <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                          {selectedProbabilityCell ? selectedProbabilityCell.predictedMnGradePct : currentActiveMine?.avgOreGradeMnPct || 43.5}%
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Fe: {selectedProbabilityCell?.predictedFeGradePct || 5.8}% • SiO2: {selectedProbabilityCell?.predictedSiO2GradePct || 6.8}%
                        </span>
                      </div>
                    </div>

                    {/* P90 / P50 / P10 Reserve Percentile Confidence Cards */}
                    {percentileReport && (
                      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Geostatistical Reserve Percentiles
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">UNFC 111/122</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">P90 (Conservative)</span>
                            <span className="font-bold text-white font-mono text-sm">{percentileReport.p90ConservativeReservesMt} Mt</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg border border-purple-800 bg-purple-950/30">
                            <span className="text-[10px] text-purple-300 block">P50 (Expected)</span>
                            <span className="font-bold text-purple-300 font-mono text-sm">{percentileReport.p50MedianReservesMt} Mt</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">P10 (Optimistic)</span>
                            <span className="font-bold text-emerald-400 font-mono text-sm">{percentileReport.p10OptimisticReservesMt} Mt</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grade-Tonnage Distribution Chart (Recharts) */}
                    <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-purple-400" /> Grade-Tonnage & Cutoff Curve
                        </span>
                        <span className="text-[10px] font-mono text-purple-300">Sausar Braunite Model</span>
                      </div>

                      <div className="h-40 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={gradeTonnageCurve}>
                            <defs>
                              <linearGradient id="tonnageGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <XAxis
                              dataKey="cutoffGradePct"
                              tick={{ fill: '#94A3B8', fontSize: 10 }}
                              unit="% Mn"
                            />
                            <YAxis
                              tick={{ fill: '#94A3B8', fontSize: 10 }}
                              unit="Mt"
                            />
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                              labelFormatter={(v) => `Cutoff Grade: ${v}% Mn`}
                              formatter={(value: any, name: any) => [
                                `${value} Mt`,
                                name === 'recoverableTonnageMt' ? 'Recoverable Ore' : 'Contained Metal'
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="recoverableTonnageMt"
                              stroke="#A78BFA"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#tonnageGrad)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center font-sans">
                        Recoverable tonnage yield drops smoothly as cutoff grade increases from 20% to 48% Mn.
                      </p>
                    </div>

                    {/* Variogram Spatial Parameters */}
                    {activeVariogram && (
                      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Spherical Variogram Model (Kriging Covariance)
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-slate-950 p-2 rounded-lg">
                            <span className="text-slate-500 text-[10px] block">Spatial Range (a)</span>
                            <span className="font-bold text-white">{activeVariogram.rangeMeters} m</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg">
                            <span className="text-slate-500 text-[10px] block">Nugget / Sill (C0 / C)</span>
                            <span className="font-bold text-purple-300">{activeVariogram.nugget} / {activeVariogram.sill}</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg">
                            <span className="text-slate-500 text-[10px] block">Strike Azimuth</span>
                            <span className="font-bold text-white">{activeVariogram.azimuthAngleDeg}° ENE</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg">
                            <span className="text-slate-500 text-[10px] block">Cross-Val R²</span>
                            <span className="font-bold text-emerald-400">{activeVariogram.crossValidationR2}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 2: SUB-SURFACE BOREHOLE ASSAYS */}
                {/* ============================================================ */}
                {inspectorTab === 'ASSAYS' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-purple-400" /> Diamond Core Drillhole Assays
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-slate-950/60 p-2 rounded-lg">
                          <span className="text-slate-400 text-[10px] block">Diamond Boreholes</span>
                          <span className="font-bold text-white font-mono">{selectedZone?.boreholeCount || 4} Logs Plotted</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg">
                          <span className="text-slate-400 text-[10px] block">Avg Core Recovery</span>
                          <span className="font-bold text-emerald-400 font-mono">{selectedZone?.avgCoreRecoveryPct || 86.5}%</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg">
                          <span className="text-slate-400 text-[10px] block">Seam Depth</span>
                          <span className="font-bold text-white font-mono">{selectedZone?.depthMeters || 320} m</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg">
                          <span className="text-slate-400 text-[10px] block">Satellite Stability</span>
                          <span className="font-bold text-blue-400 font-mono">{selectedZone?.satelliteStabilityScore || 85}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Lithology & Stratigraphy
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedProbabilityCell?.lithology || 'Mansar Formation High-Grade Braunite-Psilomelane Reef intercalated with Gondite Quartzite.'}
                      </p>
                      <div className="pt-1 text-[11px] text-purple-300 font-mono">
                        Structural Attitude: {selectedProbabilityCell?.strikeDip || 'N78°E / 72°NW (Sausar Synclinorium)'}
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 3: AI RESERVE RE-ESTIMATION SANDBOX */}
                {/* ============================================================ */}
                {inspectorTab === 'RE_ESTIMATE' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Reserve Re-Estimation</h4>
                        </div>
                        <span className="text-[10px] text-purple-300 font-mono">UNFC 111 Model</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Run machine-learning kriging simulation fusing sub-surface drilling assays with Sentinel-2 multi-spectral NDVI surface clearance.
                      </p>

                      <button
                        onClick={handleRunReEstimate}
                        disabled={reEstimating}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-purple transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {reEstimating ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Calculating 3D Geostatistics...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Execute Geostatistical Simulation
                          </>
                        )}
                      </button>

                      {reEstimateResult && (
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-800/80 space-y-2 animate-fadeIn text-xs">
                          <div className="flex items-center justify-between text-emerald-400 font-bold">
                            <span>Estimated Ore Tonnage</span>
                            <span className="font-mono">{reEstimateResult.data?.estimated_tonnes?.toLocaleString() || '34,800,000'} t</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Predicted In-Situ Mn</span>
                            <span className="font-mono font-bold text-purple-300">{reEstimateResult.data?.predicted_mn_grade_pct || selectedZone?.avgMnGrade || 43.5}%</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Geostatistical Confidence</span>
                            <span className="font-mono text-emerald-400">{reEstimateResult.data?.confidence_level || 'HIGH_CONFIDENCE'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : selectedFacility ? (
              <>
                {/* Facility Header */}
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {selectedFacility.type}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{selectedFacility.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedFacility.district}, {selectedFacility.state}
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Installed Capacity & Role</span>
                  <div className="text-base font-bold text-cyan-300">{selectedFacility.capacity}</div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">{selectedFacility.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Operational Status</span>
                    <span className="font-bold text-emerald-400">{selectedFacility.status}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Established Year</span>
                    <span className="font-bold text-white">{selectedFacility.commissioningYear}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Core industrial infrastructure sustaining downstream alloy smelting and domestic battery-grade precursor chemicals.</span>
                </div>
              </>
            ) : selectedBlock ? (
              <>
                {/* Exploration Block Header */}
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold bg-pink-950 text-pink-300 border border-pink-800">
                    Greenfield Prospecting
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{selectedBlock.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    {selectedBlock.district}, {selectedBlock.state} • {selectedBlock.leaseAreaHectares} Ha
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Potential</span>
                    <div className="text-xl font-extrabold text-pink-400 font-mono">
                      {selectedBlock.estimatedPotentialMt} <span className="text-xs font-bold text-slate-400">Mt</span>
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Seam Depth</span>
                    <div className="text-xl font-extrabold text-white font-mono">
                      {selectedBlock.targetSeamDepthM} <span className="text-xs font-bold text-slate-400">m</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-300"><strong>Target Geological Horizon:</strong> {selectedBlock.targetFormation}</p>
                  <p className="text-slate-300"><strong>Expected Mineralogy:</strong> {selectedBlock.keyMineralogy}</p>
                  <p className="text-slate-400 text-[11px] pt-1">Exploration Status: <strong className="text-pink-300">{selectedBlock.status.replace(/_/g, ' ')}</strong></p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3 text-slate-400">
                <Target className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Click any Reserve Probability cell or MOIL mine on the map to inspect its geostatistical kriging distribution.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Re-Open Drawer Button when drawer is minimized */}
      {!isDrawerOpen && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="absolute right-4 top-4 z-[950] p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple transition flex items-center gap-1.5 text-xs font-bold"
          title="Open Geostatistical Inspector Drawer"
        >
          <Target className="w-4 h-4" />
          <span>Inspector</span>
        </button>
      )}
    </div>
  );
};
