import React, { useState } from 'react';
import {
  Search,
  Bell,
  FileText,
  Satellite,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Menu,
  LogOut,
  User as UserIcon
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
  const { mines, selectedMineId, setSelectedMineId, selectedMine } = useMine();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<TabType, { title: string; subtitle: string }> = {
    landing: {
      title: 'MOIL ReserveIQ',
      subtitle: 'Space Technology & Geostatistical AI for Manganese Reserve Estimation & Production Shortfall Mitigation'
    },
    dashboard: {
      title: 'Executive Mining Command Dashboard',
      subtitle: 'Real-time reserve inventory, production variance, and live risk matrix'
    },
    'reserve-map': {
      title: 'GIS Reserve & Satellite Multi-Layer Map',
      subtitle: 'Sub-surface geological boreholes, UNFC confidence polygons, and NDVI proxies'
    },
    production: {
      title: 'Production Analytics & Downtime Correlation',
      subtitle: 'Target compliance, mechanical breakdown hours, and monsoon rainfall impact'
    },
    shortfall: {
      title: 'AI Shortfall Prediction & Risk Assessment',
      subtitle: '30/60/90-day time-series forecasts and SHAP feature importance attribution'
    },
    recommendations: {
      title: 'Prescriptive Action Recommendations Engine',
      subtitle: 'AI-generated corrective mining interventions with closed-loop outcome tracking'
    },
    ingestion: {
      title: 'Data Ingestion & Satellite Synchronizer',
      subtitle: 'Diamond drilling assays, monthly extraction logs, and Sentinel-2 pass ingestion'
    },
    equipment: {
      title: 'Equipment Fleet Health & Maintenance Registry',
      subtitle: 'Shovels, haulers, drill rigs, underground loaders, and MTBF monitoring'
    },
    'global-market': {
      title: 'Global Supply & Market Disruption Intelligence',
      subtitle: 'USGS global reserves, South Africa/Gabon supply shocks, and pricing dynamics'
    },
    'data-sources': {
      title: 'Multimodal Data Sources & Telemetry Provenance',
      subtitle: 'Complete data lineage, sensor specifications, and audit logs'
    },
    'admin-portal': {
      title: 'Personnel Clearance & Admin Portal',
      subtitle: 'Review registration requests, approve personnel access, and manage security clearance'
    }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle + Title Info */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
            {currentTabInfo.title}
          </h2>
          <p className="text-xs text-slate-400 hidden md:block">{currentTabInfo.subtitle}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Global Mine Selector */}
        <div className="relative hidden sm:block">
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            aria-label="Filter by Mine Site"
            className="appearance-none pl-3 pr-8 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-lg focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
          >
            <option value="ALL">All MOIL Mine Leases ({mines.length})</option>
            {mines.map((m) => (
              <option key={m.mineId} value={m.mineId}>
                {m.name} ({m.code})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Satellite Sync Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-300 whitespace-nowrap shrink-0">
          <Satellite className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-slate-400 font-mono">Sentinel-2:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced</span>
          </span>
        </div>

        {/* Executive Report Button */}
        <button
          onClick={onOpenReport}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-glow-purple transition cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Report</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 relative transition cursor-pointer"
            title="AI Risk Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel bg-slate-900/98 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live AI Risk Alerts</span>
                <span className="text-[10px] text-purple-400 font-mono">2 Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60">
                  <p className="font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Balaghat Underground
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Heavy monsoon rainfall window predicted in 48h. Blasting reschedule advised.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-900/60">
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
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:flex items-center gap-2">
              {user.googlePicture || user.picture ? (
                <img
                  src={user.googlePicture || user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                  {user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'MO'}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">{user.name}</p>
                <p className="text-[10px] text-purple-300 font-mono leading-none">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out to Welcome Portal"
              className="py-1.5 px-2.5 bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-800/80 text-slate-400 hover:text-red-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline text-[11px]">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
