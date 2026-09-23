import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  TrendingDown,
  Sparkles,
  UploadCloud,
  Truck,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Globe2,
  X,
  UserCheck,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMine } from '../../context/MineContext';
import { ThemeToggle } from '../common/ThemeToggle';

export type TabType =
  | 'landing'
  | 'dashboard'
  | 'reserve-map'
  | 'production'
  | 'shortfall'
  | 'recommendations'
  | 'ingestion'
  | 'equipment'
  | 'global-market'
  | 'data-sources'
  | 'admin-portal';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenProblemStatement?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { user } = useAuth();
  const { selectedMine } = useMine();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Close mobile drawer when resizing up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen, setMobileOpen]);

  const navItems = [
    { id: 'landing', label: 'HOME', icon: Home, badge: 'Overview' },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'reserve-map', label: 'GIS Reserve Map', icon: MapPin },
    { id: 'production', label: 'Production Analytics', icon: BarChart3 },
    { id: 'shortfall', label: 'Shortfall & Risk AI', icon: TrendingDown, badge: 'AI' },
    { id: 'recommendations', label: 'Recommendations Engine', icon: Sparkles, badge: 'Prescriptive' },
    { id: 'ingestion', label: 'Data Ingestion & Satellite', icon: UploadCloud },
    { id: 'equipment', label: 'Equipment Fleet Registry', icon: Truck },
    { id: 'global-market', label: 'Global Reserves & Market', icon: Globe2, badge: 'USGS' },
    { id: 'data-sources', label: 'Data Provenance & Sources', icon: Shield, badge: 'Verified' },
    ...(user?.role === 'ADMIN'
      ? [{ id: 'admin-portal', label: 'Admin & Approval Portal', icon: UserCheck, badge: 'Admin' }]
      : [])
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 📱 MOBILE / TABLET BACKDROP OVERLAY (< 1024px) */}
      {/* ============================================================ */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* ============================================================ */}
      {/* 🖥️ RESPONSIVE SIDEBAR CONTAINER */}
      {/* ============================================================ */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white border-r border-slate-200 shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out ${
          // Mobile state: off-canvas drawer
          mobileOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0'
          } ${
          // Desktop state: collapsed vs expanded
          collapsed ? 'lg:w-20' : 'lg:w-64'
          }`}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-white">
            {/* Expanded Header */}
            {(!collapsed || mobileOpen) && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div className="truncate">
                  <h1 className="text-sm font-black text-black tracking-wide flex items-center gap-1 font-sans">
                    <span className="text-black font-black">MOIL</span> <span className="text-teal-700 font-black">ReserveIQ</span>
                  </h1>
                  <p className="text-[9px] text-black font-bold uppercase tracking-widest font-mono truncate">
                    Ministry of Steel • Govt. of India
                  </p>
                </div>
              </div>
            )}

            {/* Collapsed Rail Header (Desktop) */}
            {collapsed && !mobileOpen && (
              <div className="w-9 h-9 mx-auto rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Layers className="w-5 h-5" />
              </div>
            )}

            {/* Close button for Mobile / Collapse toggle for Desktop */}
            <div className="flex items-center">
              {/* Mobile Close Button */}
              {mobileOpen && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-black hover:text-black hover:bg-slate-100 lg:hidden transition"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Desktop Collapse Toggle Button */}
              {!mobileOpen && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden lg:flex p-1.5 rounded-lg text-black hover:text-black hover:bg-slate-100 transition cursor-pointer"
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Active Target Mine Banner */}
          {(!collapsed || mobileOpen) && selectedMine && (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[9px] uppercase font-bold tracking-wider text-teal-800 font-mono">Target Mine Context</p>
                <p className="text-xs font-bold text-black truncate">{selectedMine.name}</p>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5" role="navigation" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isCollapsed = collapsed && !mobileOpen;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredTab(item.id)}
                  onMouseLeave={() => isCollapsed && setHoveredTab(null)}
                >
                  <button
                    onClick={() => handleNavClick(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isCollapsed ? 'justify-center px-0' : ''
                      } ${isActive
                        ? 'bg-teal-50 text-teal-900 border border-teal-400 shadow-sm'
                        : 'text-black hover:text-black hover:bg-slate-100 border border-transparent'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-teal-700' : 'text-black'
                        }`}
                    />

                    {(!collapsed || mobileOpen) && (
                      <span className="flex-1 text-left truncate flex items-center justify-between">
                        <span className="truncate text-black font-bold">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1.5 ${item.badge === 'AI'
                              ? 'bg-teal-100 text-teal-900 border border-teal-300'
                              : item.badge === 'Prescriptive'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : item.badge === 'USGS'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </span>
                    )}
                  </button>

                  {/* Desktop Hover Floating Tooltip on Collapsed Rail */}
                  {isCollapsed && hoveredTab === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-300 text-black text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-2 pointer-events-none animate-fadeIn">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-teal-100 text-teal-900 border border-teal-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Lower Bottom Section: Theme Mode (Icon Only) */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-center">
          <ThemeToggle
            variant="icon"
            className="w-10 h-10 rounded-xl"
          />
        </div>
      </aside>
    </>
  );
};
