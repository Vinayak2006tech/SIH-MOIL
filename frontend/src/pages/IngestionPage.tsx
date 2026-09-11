import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Satellite,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Database,
  ArrowRight,
  ShieldCheck,
  FileText,
  Trash2,
  Table,
  Eye,
  Sparkles,
  MapPin,
  Layers
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { api } from '../services/api';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

interface IngestionPageProps {
  onNavigate?: (tab: 'reserve-map' | 'production' | 'dashboard' | 'shortfall' | 'landing') => void;
}

interface CsvPreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export const IngestionPage: React.FC<IngestionPageProps> = ({ onNavigate }) => {
  const { mines, selectedMineId } = useMine();
  const [activeTab, setActiveTab] = useState<'drilling' | 'production' | 'satellite'>('drilling');

  // File Upload & Drag & Drop State
  const [file, setFile] = useState<File | null>(null);
  const [targetMineId, setTargetMineId] = useState<string>(selectedMineId === 'ALL' ? 'mine-balaghat-01' : selectedMineId);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreviewData | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [totalBoreholeCount, setTotalBoreholeCount] = useState<number | null>(null);

  // Satellite Pass State
  const [syncingSatellite, setSyncingSatellite] = useState(false);
  const [satelliteResult, setSatelliteResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update target mine when global mine changes
  useEffect(() => {
    if (selectedMineId && selectedMineId !== 'ALL') {
      setTargetMineId(selectedMineId);
    }
  }, [selectedMineId]);

  // Load existing repository stats
  const fetchRepositoryStats = async () => {
    try {
      const boreholes = await api.getBoreholes();
      if (boreholes) {
        setTotalBoreholeCount(boreholes.length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRepositoryStats();
  }, []);

  // Parse CSV text for instant client-side preview
  const parseCsvText = (text: string): CsvPreviewData => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return { headers: [], rows: [], totalRows: 0 };

    // Simple split respecting basic CSV
    const splitLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = splitLine(lines[0]).map((h) => h.replace(/^\ufeff/, '').replace(/^"|"$/g, ''));
    const rows = lines.slice(1, 6).map((line) => splitLine(line).map((c) => c.replace(/^"|"$/g, '')));

    return {
      headers,
      rows,
      totalRows: lines.length - 1
    };
  };

  const processSelectedFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploadResult(null);
    setUploadError(null);

    try {
      const text = await selectedFile.text();
      const preview = parseCsvText(text);
      setCsvPreview(preview);
    } catch (err) {
      console.warn('Failed to parse preview:', err);
      setCsvPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if leaving the parent container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.name.toLowerCase().endsWith('.csv') ||
        droppedFile.type.includes('csv') ||
        droppedFile.type.includes('text')
      ) {
        processSelectedFile(droppedFile);
      } else {
        setUploadError('Please drop a valid .csv dataset file.');
      }
    }
  };

  const handleClearFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFile(null);
    setCsvPreview(null);
    setUploadResult(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadDrilling = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mineId', targetMineId);
      const res = await api.uploadDrillingCsv(formData);
      setUploadResult(res);
      setFile(null);
      setCsvPreview(null);
      fetchRepositoryStats();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload drilling assay CSV.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadProduction = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mineId', targetMineId);
      const res = await api.uploadProductionCsv(formData);
      setUploadResult(res);
      setFile(null);
      setCsvPreview(null);
      fetchRepositoryStats();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload monthly production CSV.');
    } finally {
      setUploading(false);
    }
  };

  const loadSampleFile = async (sampleType: 'drilling' | 'production', autoIngest: boolean = false) => {
    try {
      const url =
        sampleType === 'drilling'
          ? '/sample-data/drilling_logs_balaghat_deep.csv'
          : '/sample-data/production_records_2025_2026.csv';
      const filename =
        sampleType === 'drilling' ? 'drilling_logs_balaghat_deep.csv' : 'production_records_2025_2026.csv';
      const response = await fetch(url);
      const blob = await response.blob();
      const sampleFile = new File([blob], filename, { type: 'text/csv' });
      await processSelectedFile(sampleFile);

      if (autoIngest) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', sampleFile);
        formData.append('mineId', targetMineId);
        const res =
          sampleType === 'drilling'
            ? await api.uploadDrillingCsv(formData)
            : await api.uploadProductionCsv(formData);
        setUploadResult(res);
        setFile(null);
        setCsvPreview(null);
        fetchRepositoryStats();
      }
    } catch (err: any) {
      console.error('Failed to load sample CSV:', err);
      setUploadError(`Failed to load ${sampleType} sample CSV file.`);
    } finally {
      if (autoIngest) setUploading(false);
    }
  };

  const handleTriggerSatelliteSync = async () => {
    setSyncingSatellite(true);
    try {
      const res = await api.triggerSatelliteSync(targetMineId);
      setSatelliteResult(res);
    } catch (err: any) {
      console.error('Satellite sync failed:', err);
    } finally {
      setSyncingSatellite(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-purple-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" /> Data Ingestion Hub & Multimodal Telemetry
            </span>
            {totalBoreholeCount !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-950 text-purple-300 border border-purple-800">
                {totalBoreholeCount} Active Boreholes
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Multimodal Data Ingestion & Earth Observation Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Drag and drop exploration drilling core assays, monthly extraction logs, and synchronize real-time telemetry from Copernicus Sentinel-2 MSI multispectral passes.
          </p>
        </div>

        {/* Quick Navigate Actions */}
        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('reserve-map')}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-semibold rounded-xl border border-purple-800/60 transition flex items-center gap-1.5 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400" /> View GIS 3D Borehole Map
            </button>
          </div>
        )}
      </div>

      {/* Ingestion Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => {
            setActiveTab('drilling');
            handleClearFile();
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'drilling'
            ? 'bg-purple-600 text-white shadow-glow-purple'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
        >
          <Database className="w-4 h-4" /> Diamond Drilling Logs (CSV)
        </button>

        <button
          onClick={() => {
            setActiveTab('production');
            handleClearFile();
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'production'
            ? 'bg-purple-600 text-white shadow-glow-purple'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Production Records (CSV)
        </button>

        <button
          onClick={() => {
            setActiveTab('satellite');
            handleClearFile();
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'satellite'
            ? 'bg-purple-600 text-white shadow-glow-purple'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
        >
          <Satellite className="w-4 h-4" /> Satellite Pass Synchronizer (Sentinel-2 / MODIS)
        </button>
      </div>

      {/* Tab 1 & 2: CSV Upload Interface */}
      {(activeTab === 'drilling' || activeTab === 'production') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Drag & Drop Upload Zone */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-purple-400" />
                {activeTab === 'drilling'
                  ? 'Drilling Assay Borehole Ingestion'
                  : 'Monthly Extraction Records Ingestion'}
              </h3>
              <ProvenanceBadge
                sourceId={activeTab === 'drilling' ? 'src-synthetic-boreholes' : 'src-moil-ar-2025'}
                dataType={activeTab === 'drilling' ? 'SYNTHETIC_DEMO' : 'OFFICIAL_MOIL'}
                isSynthetic={activeTab === 'drilling'}
              />
            </div>

            {/* Target Mine Dropdown */}
            <div className="flex items-center gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold shrink-0">Target Mine Context:</span>
              <select
                value={targetMineId}
                onChange={(e) => setTargetMineId(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-lg focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {mines.map((m) => (
                  <option key={m.mineId} value={m.mineId}>
                    {m.name} ({m.code}) — {m.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Drag & Drop Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative p-8 border-2 border-dashed rounded-2xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3 ${isDragging
                ? 'border-purple-400 bg-purple-950/40 shadow-glow-purple scale-[1.01]'
                : file
                  ? 'border-emerald-500/70 bg-emerald-950/10'
                  : 'border-slate-700 hover:border-purple-500/80 bg-slate-950/50 hover:bg-slate-950/80'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Glowing Icon */}
              <div
                className={`p-4 rounded-2xl transition-transform ${isDragging
                  ? 'bg-purple-600 text-white scale-110 shadow-glow-purple animate-bounce'
                  : file
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}
              >
                {file ? <FileSpreadsheet className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {isDragging
                    ? 'Drop CSV dataset now to analyze'
                    : file
                      ? file.name
                      : 'Drag and drop your CSV dataset here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace`
                    : 'Supports .csv files with standard MOIL assay / production schema (Up to 25MB)'}
                </p>
              </div>

              {!file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition shadow-sm"
                >
                  Browse CSV File
                </button>
              )}
            </div>

            {/* Client-Side CSV Preview Panel */}
            {csvPreview && file && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Dataset Structure Preview</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 text-purple-300 border border-slate-700">
                      {csvPreview.totalRows} Total Records
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 text-slate-400 border border-slate-700">
                      {csvPreview.headers.length} Columns
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove File
                  </button>
                </div>

                {/* Detected Column Header Chips */}
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {csvPreview.headers.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Table Preview */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        {csvPreview.headers.slice(0, 7).map((h, i) => (
                          <th key={i} className="px-3 py-2 font-bold whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                      {csvPreview.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          {row.slice(0, 7).map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap text-slate-300 font-mono">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ingestion Action Buttons */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
              <span className="text-xs text-slate-500 font-mono">
                {file ? `${file.name} ready for ingestion` : 'Select or drag CSV to begin parsing'}
              </span>

              <div className="flex items-center gap-2">
                {file && (
                  <button
                    type="button"
                    onClick={handleClearFile}
                    disabled={uploading}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={activeTab === 'drilling' ? handleUploadDrilling : handleUploadProduction}
                  disabled={!file || uploading}
                  className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-purple transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Ingesting & Validating Dataset...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Parse & Ingest Records
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success Message Banner with Navigation */}
            {uploadResult && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{uploadResult.message}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700">
                    {uploadResult.count} Records Ingested
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">
                  Data points loaded into active operational store. Geological confidence, UNFC reserve categories, and shortfall models updated.
                </p>

                {onNavigate && activeTab === 'drilling' && (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('reserve-map')}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" /> View Ingested Boreholes on GIS Map
                    </button>
                  </div>
                )}
                {onNavigate && activeTab === 'production' && (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('production')}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> View Production Analytics
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Right 1 Col: Schema Guidelines & Sample Templates */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Required CSV Schema Fields
            </h3>

            {activeTab === 'drilling' ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Borehole CSV must contain the following core assay columns:
                </p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-purple-300 space-y-1">
                  <p>boreholeId (string)</p>
                  <p>collarLatitude, collarLongitude (float)</p>
                  <p>totalDepthMeters (float)</p>
                  <p>seamThicknessMeters (float)</p>
                  <p>avgMnGradePct (% Mn assay)</p>
                  <p>avgFeGradePct (% Fe assay)</p>
                  <p>avgSiO2GradePct (% Silica)</p>
                  <p>coreRecoveryPct (0-100%)</p>
                  <p>rqdPct (Rock Hardness)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Monthly Production CSV must include operational variance columns:
                </p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-purple-300 space-y-1">
                  <p>date (YYYY-MM)</p>
                  <p>targetTonnes (float)</p>
                  <p>actualTonnes (float)</p>
                  <p>avgMnGradePct (float)</p>
                  <p>equipmentUptimePct (float)</p>
                  <p>rainfallMm (float)</p>
                  <p>eqDowntime (hours)</p>
                  <p>weatherDowntime (hours)</p>
                </div>
              </div>
            )}

            {/* 1-Click Demonstration Datasets */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-300 block">
                Sample Datasets with Instant Load & Ingest:
              </span>
              <div className="space-y-2">
                {/* Drilling Sample */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-purple-400" /> Balaghat Deep Core Assays (14 BH)
                    </span>
                    <a
                      href="/sample-data/drilling_logs_balaghat_deep.csv"
                      download
                      title="Download raw CSV"
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('drilling');
                        loadSampleFile('drilling', false);
                      }}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg border border-slate-700 transition text-center"
                    >
                      Load into Uploader
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('drilling');
                        loadSampleFile('drilling', true);
                      }}
                      className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg shadow-glow-purple transition"
                    >
                      ⚡ Ingest Now
                    </button>
                  </div>
                </div>

                {/* Production Sample */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> MOIL Production Logs (24 Months)
                    </span>
                    <a
                      href="/sample-data/production_records_2025_2026.csv"
                      download
                      title="Download raw CSV"
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('production');
                        loadSampleFile('production', false);
                      }}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg border border-slate-700 transition text-center"
                    >
                      Load into Uploader
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('production');
                        loadSampleFile('production', true);
                      }}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition"
                    >
                      ⚡ Ingest Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Satellite Telemetry Ingestion Simulator */}
      {activeTab === 'satellite' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-purple-400 animate-pulse" /> Copernicus Sentinel-2 & NASA MODIS Orbit Synchronizer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fetch latest multispectral Earth Observation proxies (NDVI, soil moisture saturation %, thermal LST)
                </p>
              </div>

              {/* Target Mine Dropdown */}
              <select
                value={targetMineId}
                onChange={(e) => setTargetMineId(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-lg focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {mines.map((m) => (
                  <option key={m.mineId} value={m.mineId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sentinel-2 Surface Scanning Visualizer */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/50 shadow-2xl bg-slate-950 group">
              <img
                src="/images/sentinel-2-surface-scan.jpg"
                alt="ESA Copernicus Sentinel-2 multispectral scanner projecting active telemetry grid onto open-cast manganese mine"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Dynamic Laser Scanning Line Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline pointer-events-none shadow-[0_0_20px_#22d3ee]" />

              {/* Top HUD Telemetry Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/90 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/60 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Sentinel-2A MSI • 10m Spatial Res
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 text-purple-300 font-mono text-[10px] border border-purple-500/40 backdrop-blur-md">
                    Swath: 290 km • SSO Orbit
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/90 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/60 backdrop-blur-md flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Telemetry Synced
                </span>
              </div>

              {/* Bottom Interactive Scanner Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 pt-8 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-white font-bold text-xs block">Active Surface Overpass • {mines.find(m => m.mineId === targetMineId)?.name || 'Balaghat Mine'}</span>
                  <span className="text-[11px] text-slate-400">Multispectral bands B04 (Red), B08 (NIR), and SWIR active</span>
                </div>

                <button
                  onClick={handleTriggerSatelliteSync}
                  disabled={syncingSatellite}
                  className="btn-shimmer px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-purple transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingSatellite ? 'animate-spin' : ''}`} />
                  {syncingSatellite ? 'Acquiring Orbit Pass...' : 'Trigger Live Sentinel-2 Sync'}
                </button>
              </div>
            </div>

            {/* Satellite Result Output Card */}
            {satelliteResult && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{satelliteResult.message}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Sensor: {satelliteResult.telemetry.sensor}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 card-hover">
                    <span className="text-[10px] text-slate-400 block font-mono">NDVI Index</span>
                    <span className="text-lg font-bold text-purple-400 font-mono">{satelliteResult.telemetry.ndvi}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 card-hover">
                    <span className="text-[10px] text-slate-400 block font-mono">Soil Moisture</span>
                    <span className="text-lg font-bold text-blue-400 font-mono">{satelliteResult.telemetry.soil_moisture_pct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 card-hover">
                    <span className="text-[10px] text-slate-400 block font-mono">Precipitation</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">{satelliteResult.telemetry.precipitation_rate_mm} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 card-hover">
                    <span className="text-[10px] text-slate-400 block font-mono">Surface Temp</span>
                    <span className="text-lg font-bold text-slate-200 font-mono">{satelliteResult.telemetry.land_surface_temp_c} °C</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300">
                    <span className="font-bold text-white">Pit Slope Stability Advisory: </span>
                    <span className="text-amber-400 font-semibold">{satelliteResult.telemetry.geotechnical_pit_stability_risk}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-300">Recommended Blast Window: </span>
                    {satelliteResult.telemetry.recommended_blasting_window}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Satellite Proxy Mapping Explanation & Orbit Pass Image */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-400" />
              Earth Observation Telemetry
            </h3>

            {/* Orbit Pass Image */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-md">
              <img
                src="/images/sentinel-2-multispectral-orbit.jpg"
                alt="Copernicus Sentinel-2 orbital multi-spectral pass over mining terrain"
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-2.5 flex items-end">
                <span className="text-[10px] font-mono font-bold text-purple-300">Central India Mining Corridor Pass</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Real mining operations are vulnerable to surface waterlogging, slope slides, and access road mud-slip.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">NDVI Vegetation Index (B04/B08)</span>
                <p className="text-[11px] text-slate-400">
                  Monitors vegetative loss at quarry bounds, indicating active ground clearing and overburden spread.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">Soil Moisture Saturation %</span>
                <p className="text-[11px] text-slate-400">
                  Radar soil proxy alerts mine planners to saturated bench slopes before deep-hole charging.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Land Surface Temp (LST)</span>
                <p className="text-[11px] text-slate-400">
                  Identifies thermal anomalies around tailing sumps and underground ventilation air shafts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
