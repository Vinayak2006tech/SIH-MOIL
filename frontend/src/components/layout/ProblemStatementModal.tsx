import React from 'react';
import { X, Layers, Activity, Satellite, ShieldCheck, Sparkles } from 'lucide-react';

interface ProblemStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProblemStatementModal: React.FC<ProblemStatementModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel bg-slate-900/95 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                MOIL ReserveIQ <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">Smart India Hackathon</span>
              </h2>
              <p className="text-xs text-slate-400">
                Ministry of Steel / MOIL Limited Problem Statement Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" /> The Operational Challenge
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              <strong>MOIL Limited</strong> (India's largest manganese ore producer, meeting over 50% of domestic demand) currently estimates reserves and plans monthly extraction using manual surveys, paper drilling logs, and isolated blast records. This creates severe mismatch between expected and actual output, leading to unplanned production shortfalls, equipment bottlenecks, and contract penalties.
            </p>
          </div>

          {/* Multimodal 4-Pillar Integration */}
          <div>
            <h4 className="font-semibold text-white mb-3">Multimodal AI/ML Architecture</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
                  <Layers className="w-4 h-4" /> 1. Sub-Surface Geology
                </div>
                <p className="text-[11px] text-slate-400">
                  Diamond core drilling logs, RQD hardness, seam depth & thickness, ore grade assays (% Mn, % Fe, % SiO2, % P) mapped to UNFC/JORC reserve categories.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <Activity className="w-4 h-4" /> 2. Operational & Equipment IoT
                </div>
                <p className="text-[11px] text-slate-400">
                  Haul fleet telemetry, excavator-to-dumper matching ratios, MTBF, blasting shift cycles, and live mechanical downtime root-cause tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
                  <Satellite className="w-4 h-4" /> 3. Earth Observation Proxies
                </div>
                <p className="text-[11px] text-slate-400">
                  NASA MODIS & Copernicus Sentinel-2 MSI data: NDVI vegetation disturbance, surface soil moisture saturation %, and land surface thermal anomalies.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" /> 4. Prescriptive Action AI
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated mitigation engine generating actionable interventions (blasting shifts, equipment transfers, ore grade blending) with closed-loop outcome tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40">
            <h4 className="font-semibold text-purple-300 mb-2">Key Demonstration Highlights</h4>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
              <li><strong>Interactive GIS Reserve Map:</strong> Geospatial drilldown into 10 operating MOIL mines (Balaghat, Dongri Buzurg, Kandri, Mansar, Gumgaon, Tirodi, Chikla, Ukwa, Beldongri, Sitapatore), 6 processing plants, 3 greenfield exploration blocks, and 23 collar borehole logs with NDVI overlays.</li>
              <li><strong>Explainable Shortfall AI:</strong> 30/60/90-day probabilistic forecasting with SHAP-like feature importance breakdowns.</li>
              <li><strong>Dynamic What-If Simulator:</strong> Adjust equipment uptime and weather scenarios in real time to simulate risk mitigation.</li>
              <li><strong>Closed-Loop Feedback:</strong> Accept or reject recommendations and monitor historical realized tonnage gains.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">MOIL ReserveIQ v1.0 • Enterprise Mine Planning System</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-glow-purple transition"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
