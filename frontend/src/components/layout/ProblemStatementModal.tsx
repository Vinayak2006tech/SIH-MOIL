import React from 'react';
import { X, Layers, Activity, Satellite, ShieldCheck, Sparkles } from 'lucide-react';

interface ProblemStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProblemStatementModal: React.FC<ProblemStatementModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-black">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black flex items-center gap-2 font-sans">
                <span className="text-black font-extrabold">MOIL</span> <span className="text-teal-700 font-extrabold">ReserveIQ</span>
              </h2>
              <p className="text-xs text-black font-medium">
                Ministry of Steel / MOIL Limited Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-black hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-black">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
            <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2 font-sans">
              <Layers className="w-4 h-4 text-teal-700" /> The Operational Challenge
            </h4>
            <p className="text-xs leading-relaxed text-black">
              <strong className="text-black">MOIL Limited</strong> (India's largest manganese ore producer, meeting over 50% of domestic demand) currently estimates reserves and plans monthly extraction using manual surveys, paper drilling logs, and isolated blast records. This creates severe mismatch between expected and actual output, leading to unplanned production shortfalls, equipment bottlenecks, and contract penalties.
            </p>
          </div>

          {/* Multimodal 4-Pillar Integration */}
          <div>
            <h4 className="font-bold text-black mb-3 font-sans">Multimodal AI/ML Architecture</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-xs mb-1 font-sans">
                  <Layers className="w-4 h-4 text-purple-700" /> 1. Sub-Surface Geology
                </div>
                <p className="text-[11px] text-black">
                  Diamond core drilling logs, RQD hardness, seam depth & thickness, ore grade assays (% Mn, % Fe, % SiO2, % P) mapped to UNFC/JORC reserve categories.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1 font-sans">
                  <Activity className="w-4 h-4 text-emerald-700" /> 2. Operational & Equipment IoT
                </div>
                <p className="text-[11px] text-black">
                  Haul fleet telemetry, excavator-to-dumper matching ratios, MTBF, blasting shift cycles, and live mechanical downtime root-cause tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1 font-sans">
                  <Satellite className="w-4 h-4 text-amber-700" /> 3. Earth Observation Proxies
                </div>
                <p className="text-[11px] text-black">
                  NASA MODIS & Copernicus Sentinel-2 MSI data: NDVI vegetation disturbance, surface soil moisture saturation %, and land surface thermal anomalies.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1 font-sans">
                  <ShieldCheck className="w-4 h-4 text-teal-700" /> 4. Prescriptive Action AI
                </div>
                <p className="text-[11px] text-black">
                  Automated mitigation engine generating actionable interventions (blasting shifts, equipment transfers, ore grade blending) with closed-loop outcome tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="p-4 rounded-xl bg-white border border-purple-300 shadow-sm">
            <h4 className="font-bold text-purple-900 mb-2 font-sans">Key Demonstration Highlights</h4>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-black">
              <li><strong className="text-black">Interactive GIS Reserve Map:</strong> Geospatial drilldown into 10 operating MOIL mines (Balaghat, Dongri Buzurg, Kandri, Mansar, Gumgaon, Tirodi, Chikla, Ukwa, Beldongri, Sitapatore), 6 processing plants, 3 greenfield exploration blocks, and 23 collar borehole logs with NDVI overlays.</li>
              <li><strong className="text-black">Explainable Shortfall AI:</strong> 30/60/90-day probabilistic forecasting with SHAP-like feature importance breakdowns.</li>
              <li><strong className="text-black">Dynamic What-If Simulator:</strong> Adjust equipment uptime and weather scenarios in real time to simulate risk mitigation.</li>
              <li><strong className="text-black">Closed-Loop Feedback:</strong> Accept or reject recommendations and monitor historical realized tonnage gains.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-black font-mono font-bold"><span className="text-black font-bold">MOIL</span> ReserveIQ v1.0 • Enterprise Mine Planning System</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#6B5B95] to-[#0D9488] hover:from-[#7E69AB] hover:to-[#2DD4BF] text-white text-xs font-bold rounded-lg shadow-glow-manganese transition cursor-pointer"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
