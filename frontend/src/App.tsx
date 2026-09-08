import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MineProvider } from './context/MineContext';
import { Sidebar } from './components/layout/Sidebar';
import type { TabType } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ProblemStatementModal } from './components/layout/ProblemStatementModal';
import { ExecutiveReportModal } from './components/layout/ExecutiveReportModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReserveMapPage } from './pages/ReserveMapPage';
import { ProductionAnalyticsPage } from './pages/ProductionAnalyticsPage';
import { ShortfallRiskPage } from './pages/ShortfallRiskPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { IngestionPage } from './pages/IngestionPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { GlobalMarketPage } from './pages/GlobalMarketPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ActivateAccountPage } from './pages/ActivateAccountPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'activate' | 'forgot-password' | 'reset-password'>('login');

  // Check URL parameters for activation / reset tokens
  useEffect(() => {
    const pathname = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (pathname.includes('/reset-password') || (token && (pathname.includes('reset') || params.get('type') === 'reset'))) {
      setAuthView('reset-password');
    } else if (pathname.includes('/activate') || token) {
      setAuthView('activate');
    } else if (pathname.includes('/forgot-password')) {
      setAuthView('forgot-password');
    }
  }, []);

  // Auto-collapse sidebar on smaller desktop / tablet displays (< 1280px)
  useEffect(() => {
    const handleInitialLayout = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setSidebarCollapsed(true);
      }
    };
    handleInitialLayout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-spin">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" />
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
          Initializing MOIL ReserveIQ Intelligence Engine...
        </p>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onGoToLogin={() => setAuthView('login')} />;
    }
    if (authView === 'activate') {
      return <ActivateAccountPage onGoToLogin={() => setAuthView('login')} />;
    }
    if (authView === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onGoToLogin={() => setAuthView('login')}
          onGoToReset={() => setAuthView('reset-password')}
        />
      );
    }
    if (authView === 'reset-password') {
      return <ResetPasswordPage onGoToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginPage
        onGoToRegister={() => setAuthView('register')}
        onGoToForgotPassword={() => setAuthView('forgot-password')}
      />
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenProblemStatement={() => setIsProblemModalOpen(true)}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'reserve-map':
        return <ReserveMapPage />;
      case 'production':
        return <ProductionAnalyticsPage />;
      case 'shortfall':
        return <ShortfallRiskPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'ingestion':
        return <IngestionPage onNavigate={(tab) => setActiveTab(tab as TabType)} />;
      case 'equipment':
        return <EquipmentPage />;
      case 'global-market':
        return <GlobalMarketPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'admin-portal':
        return user.role === 'ADMIN' ? (
          <AdminPortalPage />
        ) : (
          <DashboardPage setActiveTab={setActiveTab} />
        );
      default:
        return (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenProblemStatement={() => setIsProblemModalOpen(true)}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex">
      {/* Responsive Sidebar (Off-Canvas on Mobile, Collapsible Rail on Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenProblemStatement={() => setIsProblemModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col min-h-screen w-full min-w-0 max-w-full ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Sticky Navbar */}
        <Navbar
          activeTab={activeTab}
          onOpenReport={() => setIsReportModalOpen(true)}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 pb-12 overflow-x-hidden p-3 sm:p-6 lg:p-8 min-w-0 max-w-full">
          {renderActivePage()}
        </main>
      </div>

      {/* Onboarding Problem Statement Modal */}
      <ProblemStatementModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
      />

      {/* Executive Briefing Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MineProvider>
        <AppContent />
      </MineProvider>
    </AuthProvider>
  );
}

export default App;
