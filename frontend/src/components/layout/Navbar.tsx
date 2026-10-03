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
import { ThemeToggle } from '../common/ThemeToggle';
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

  const renderWithTealReserveIQ = (text: string) => {
    if (!text || !text.includes('ReserveIQ')) return text;
    const parts = text.split('ReserveIQ');
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-teal-700 dark:text-teal-400 font-black">
                ReserveIQ
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 dark:bg-[#111417]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-2.5 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 transition-colors min-w-0 max-w-full overflow-hidden">
      {/* Left: Mobile Drawer Trigger + Progressive Responsive Title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 overflow-hidden">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden transition shrink-0 cursor-pointer shadow-xs"
            aria-label="Toggle Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 dark:text-slate-100" />
          </button>
        )}

        <div className="min-w-0 flex-1 overflow-hidden">
          <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight block truncate font-sans">
            {/* Mobile (< 640px): concise short title */}
            <span className="block sm:hidden truncate">{renderWithTealReserveIQ(currentTabInfo.shortTitle)}</span>
            {/* Tablet & Small Laptop (640px - 1279px): medium title */}
            <span className="hidden sm:block xl:hidden truncate">{renderWithTealReserveIQ(currentTabInfo.mediumTitle)}</span>
            {/* Desktop (>= 1280px): full executive title */}
            <span className="hidden xl:block truncate">{renderWithTealReserveIQ(currentTabInfo.title)}</span>
          </h2>
          {/* Subtitle only appears on 2xl+ wide monitors to preserve room on laptops */}
          <p className="hidden 2xl:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-lg mt-0.5">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls - Responsive Adaptive Footprint */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        {/* Responsive Mine Selector */}
        <div className="relative shrink-0">
          <div className="flex items-center">
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              aria-label="Filter by Mine Site"
              className="appearance-none pl-6 sm:pl-7 pr-6 sm:pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-[10px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-teal-600 cursor-pointer shadow-xs transition max-w-[100px] xs:max-w-[130px] sm:max-w-[170px] md:max-w-[200px] truncate font-mono"
              title="Filter by Mine Site"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                All Mines ({mines.length})
              </option>
              {mines.map((m) => (
                <option key={m.mineId} value={m.mineId} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
            <MapPin className="w-3 h-3 text-slate-700 dark:text-slate-300 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-700 dark:text-slate-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Satellite Sync Pill - Full pill on 2xl+, mini icon on lg/xl, hidden on mobile/tablet */}
        <div
          className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] whitespace-nowrap shadow-xs shrink-0"
          title="ESA Copernicus Sentinel-2 MSI Multi-Spectral Telemetry Synced"
        >
          <Satellite className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">Sentinel-2:</span>
          <span className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span>Synced</span>
          </span>
        </div>

        {/* Compact Satellite Indicator for Laptop Screens (lg to xl) */}
        <div
          className="hidden lg:flex 2xl:hidden items-center gap-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] shadow-xs shrink-0"
          title="Copernicus Sentinel-2 Orbit Pass Synced"
        >
          <Satellite className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shrink-0" />
        </div>

        {/* Executive Report Button */}
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-[11px] sm:text-xs font-bold rounded-lg shadow-xs transition cursor-pointer shrink-0"
          title="Generate Executive Briefing Report"
        >
          <FileText className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="hidden sm:inline lg:hidden text-white">Report</span>
          <span className="hidden lg:inline text-white">Executive Report</span>
        </button>

        {/* Theme Toggle (Light / Dark Mode) */}
        <ThemeToggle variant="icon" />

        {/* Notification Bell with Outside Click Dismiss */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-1.5 sm:p-2 rounded-lg border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative shadow-xs ${
              showNotifications
                ? 'bg-slate-100 dark:bg-slate-800 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
            }`}
            title="AI Risk Alerts"
            aria-label="AI Risk Alerts"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute top-14 sm:top-full right-2 sm:right-0 mt-1 sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Live AI Risk Alerts</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 font-bold">
                    2 Active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer"
                  title="Close Alerts"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 shadow-xs">
                  <p className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" /> Balaghat Underground
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-medium">
                    Heavy monsoon rainfall window predicted in 48h. Blasting reschedule advised.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-xs">
                  <p className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" /> Kandri Mine
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-medium">
                    Jumbo drill DR-KND-01 breakdown causing 18% haulage queue delay.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Button */}
        {user && (
          <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {user.googlePicture || user.picture ? (
                <img
                  src={user.googlePicture || user.picture}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                  title={`${user.name} (${user.role})`}
                />
              ) : (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs shadow-xs shrink-0"
                  title={`${user.name} (${user.role})`}
                >
                  {user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'MO'}
                </div>
              )}
              {/* User text labels only visible on xl+ (1280px+) to avoid crowding laptops & tablets */}
              <div className="hidden xl:block text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[90px] 2xl:max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold leading-none truncate max-w-[90px] 2xl:max-w-[120px]">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out to Welcome Portal"
              className="py-1.5 px-2 sm:px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <span className="hidden xl:inline text-[11px] text-slate-800 dark:text-slate-200">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

