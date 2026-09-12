import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  FileText,
  Satellite,
  AlertTriangle,
  ChevronDown,
  Menu,
  LogOut,
  MapPin,
  X
} from 'lucide-react';
import { useMine } from '../../context/MineContext';
import { useAuth } from '../../context/AuthContext';
import type { TabType } from './Sidebar';

interface NavbarProps {
  activeTab: TabType;
  onOpenReport: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onOpenReport, onToggleMobileMenu }) => {
  const { mines, selectedMineId, setSelectedMineId } = useMine();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const tabTitles: Record<
    TabType,
    { shortTitle: string; mediumTitle: string; title: string; subtitle: string }
  > = {
    landing: {
      shortTitle: 'Home',
      mediumTitle: 'MOIL ReserveIQ',
      title: 'MOIL ReserveIQ • Enterprise Portal',
      subtitle: 'Space Technology & Geostatistical AI for Manganese Reserve Estimation & Production Shortfall Mitigation'
    },
    dashboard: {
      shortTitle: 'Dashboard',
      mediumTitle: 'Mining Dashboard',
      title: 'Executive Mining Command Dashboard',
      subtitle: 'Real-time reserve inventory, production variance, and live risk matrix'
    },
    'reserve-map': {
      shortTitle: 'Reserve Map',
      mediumTitle: 'GIS Reserve & Satellite Map',
      title: 'GIS Reserve & Satellite Multi-Layer Map',
      subtitle: 'Sub-surface geological boreholes, UNFC confidence polygons, and NDVI proxies'
    },
    production: {
      shortTitle: 'Production',
      mediumTitle: 'Production Analytics',
      title: 'Production Analytics & Downtime Correlation',
      subtitle: 'Target compliance, mechanical breakdown hours, and monsoon rainfall impact'
    },
    shortfall: {
      shortTitle: 'Shortfall AI',
      mediumTitle: 'AI Shortfall Prediction',
      title: 'AI Shortfall Prediction & Risk Assessment',
      subtitle: '30/60/90-day time-series forecasts and SHAP feature importance attribution'
    },
    recommendations: {
      shortTitle: 'Prescriptions',
      mediumTitle: 'Action Recommendations',
      title: 'Prescriptive Action Recommendations Engine',
      subtitle: 'AI-generated corrective mining interventions with closed-loop outcome tracking'
    },
    ingestion: {
      shortTitle: 'Data Ingestion',
      mediumTitle: 'Ingestion & Satellite',
      title: 'Data Ingestion & Satellite Synchronizer',
      subtitle: 'Diamond drilling assays, monthly extraction logs, and Sentinel-2 pass ingestion'
    },
    equipment: {
      shortTitle: 'Equipment',
      mediumTitle: 'Equipment Registry',
      title: 'Equipment Fleet Health & Maintenance Registry',
      subtitle: 'Shovels, haulers, drill rigs, underground loaders, and MTBF monitoring'
    },
    'global-market': {
      shortTitle: 'Global Market',
      mediumTitle: 'Global Reserves & Market',
      title: 'Global Supply & Market Disruption Intelligence',
      subtitle: 'USGS global reserves, South Africa/Gabon supply shocks, and pricing dynamics'
    },
    'data-sources': {
      shortTitle: 'Data Sources',
      mediumTitle: 'Provenance & Sources',
      title: 'Multimodal Data Sources & Telemetry Provenance',
      subtitle: 'Complete data lineage, sensor specifications, and audit logs'
    },
    'admin-portal': {
      shortTitle: 'Admin Portal',
      mediumTitle: 'Personnel Clearance',
      title: 'Personnel Clearance & Admin Portal',
      subtitle: 'Review registration requests, approve personnel access, and manage security clearance'
    }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#0F1214]/95 backdrop-blur-md border-b border-[#26333B] px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 transition-all">
      {/* Left: Mobile Menu Toggle + Adaptive Responsive Title Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-[#161D22] border border-[#26333B] text-slate-400 hover:text-[#E8E6E3] hover:bg-[#1B2226] lg:hidden transition shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xs sm:text-sm md:text-base font-bold text-[#E8E6E3] tracking-tight leading-tight min-w-0 font-sans">
            <span className="inline sm:hidden truncate block">{currentTabInfo.shortTitle}</span>
            <span className="hidden sm:inline lg:hidden truncate">{currentTabInfo.mediumTitle}</span>
            <span className="hidden lg:inline truncate">{currentTabInfo.title}</span>
          </h2>
          <p className="text-[11px] text-slate-400 hidden md:block truncate max-w-[220px] lg:max-w-md xl:max-w-xl">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls - Adaptive & Responsive */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Responsive Mine Selector */}
        <div className="relative">
          <div className="flex items-center">
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              aria-label="Filter by Mine Site"
              className="appearance-none pl-7 sm:pl-8 pr-7 sm:pr-8 py-1.5 bg-[#161D22]/90 hover:bg-[#1B2226] border border-[#26333B] text-[11px] sm:text-xs font-semibold text-[#E8E6E3] rounded-lg focus:outline-none focus:border-teal-400 cursor-pointer shadow-sm transition max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-[220px] truncate font-mono"
              title="Filter by Mine Site"
            >
              <option value="ALL">All Mines ({mines.length})</option>
              {mines.map((m) => (
                <option key={m.mineId} value={m.mineId}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-teal-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Satellite Sync Pill - Desktop & Tablet */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#161D22]/80 border border-[#26333B] rounded-lg text-[11px] text-slate-300 whitespace-nowrap"
          title="ESA Copernicus Sentinel-2 MSI Multi-Spectral Telemetry Synced"
        >
          <Satellite className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="text-slate-400 font-mono">Sentinel-2:</span>
          <span className="text-teal-300 font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>Synced</span>
          </span>
        </div>

        {/* Compact Satellite Indicator for Medium/Large Screens */}
        <div
          className="hidden md:flex xl:hidden items-center gap-1 px-2 py-1.5 bg-[#161D22]/80 border border-[#26333B] rounded-lg text-[11px]"
          title="Copernicus Sentinel-2 Orbit Pass Synced"
        >
          <Satellite className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
        </div>

        {/* Executive Report Button - Industrial Earth-Tech gradient */}
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-[#6B5B95] via-[#564879] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-[#E8E6E3] text-xs font-bold rounded-lg shadow-glow-manganese transition cursor-pointer shrink-0"
          title="Generate Executive Briefing Report"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Executive Report</span>
        </button>

        {/* Notification Bell with Outside Click Dismiss */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-1.5 sm:p-2 rounded-lg border text-slate-400 hover:text-[#E8E6E3] transition cursor-pointer relative ${
              showNotifications
                ? 'bg-[#1B2226] border-teal-500/80 text-[#E8E6E3]'
                : 'bg-[#161D22] border-[#26333B] hover:bg-[#1B2226]'
            }`}
            title="AI Risk Alerts"
            aria-label="AI Risk Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute top-14 sm:top-full right-2 sm:right-0 mt-1 sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm glass-panel bg-[#161D22]/98 border border-[#26333B] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3 border-b border-[#26333B] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E8E6E3] uppercase tracking-wider">Live AI Risk Alerts</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                    2 Active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-[#E8E6E3] p-1 rounded-lg hover:bg-[#1B2226] transition cursor-pointer"
                  title="Close Alerts"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/60">
                  <p className="font-bold text-[#DC5F4E] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Balaghat Underground
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Heavy monsoon rainfall window predicted in 48h. Blasting reschedule advised.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/60">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Kandri Mine
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Jumbo drill DR-KND-01 breakdown causing 18% haulage queue delay.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Button */}
        {user && (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-[#26333B] shrink-0">
            <div className="flex items-center gap-2">
              {user.googlePicture || user.picture ? (
                <img
                  src={user.googlePicture || user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-teal-500/50 shrink-0"
                  title={`${user.name} (${user.role})`}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6B5B95] to-[#0D9488] text-[#E8E6E3] font-bold flex items-center justify-center text-[10px] shadow-sm shrink-0"
                  title={`${user.name} (${user.role})`}
                >
                  {user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'MO'}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#E8E6E3] leading-tight truncate max-w-[110px] xl:max-w-[140px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-teal-400 font-mono leading-none">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out to Welcome Portal"
              className="py-1.5 px-2 sm:px-2.5 bg-[#161D22] hover:bg-red-950/40 border border-[#26333B] hover:border-red-800/80 text-slate-400 hover:text-red-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-[#DC5F4E] shrink-0" />
              <span className="hidden md:inline text-[11px]">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
