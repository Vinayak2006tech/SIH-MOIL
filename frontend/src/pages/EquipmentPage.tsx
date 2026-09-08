import React, { useState, useEffect } from 'react';
import {
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Activity,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api.1';
import type { Equipment } from '../types';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const EquipmentPage: React.FC = () => {
  const { mines, selectedMineId } = useMine();
  const { user } = useAuth();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State for adding/editing machine
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<any>({
    code: '',
    name: '',
    mineId: 'mine-balaghat-01',
    type: 'Excavator',
    equipmentModel: '',
    capacity: '',
    status: 'OPERATIONAL',
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextScheduledMaintenance: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const res = await api.getEquipmentList({
        mineId: selectedMineId === 'ALL' ? undefined : selectedMineId
      });
      setEquipmentList(res.equipment || []);
      setStats(res.stats || null);
    } catch (err) {
      console.error('Failed to load equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, [selectedMineId]);

  const handleSaveEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.createEquipment(formData);
      } else {
        await api.updateEquipment(formData.code, formData);
      }
      setIsModalOpen(false);
      await loadEquipment();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (code: string) => {
    if (confirm(`Decommission and remove equipment ${code} from active registry?`)) {
      try {
        await api.deleteEquipment(code);
        await loadEquipment();
      } catch (err: any) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const filteredEquipment = equipmentList.filter((e) => {
    const matchesType = filterType === 'ALL' || e.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesType && matchesStatus;
  });

  if (loading && equipmentList.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton rows={4} height="h-24" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase font-bold text-purple-400">
              Fleet Asset Reliability & Predictive Maintenance
            </span>
            <ProvenanceBadge
              sourceId="src-synthetic-equipment"
              dataType="SYNTHETIC_DEMO"
              isSynthetic={true}
              sourceName="Calibrated HEMM SCADA Telemetry Engine"
            />
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Mining Equipment & Machinery Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live telemetry, Mean Time Between Failures (MTBF), operational uptime percentages, and scheduled preventive overhaul windows for MOIL heavy earth-moving machinery (HEMM).
          </p>
        </div>

        {user?.role !== 'VIEWER' && (
          <button
            onClick={() => {
              setModalMode('create');
              setFormData({
                code: `HEMM-${Date.now().toString().slice(-4)}`,
                name: '',
                mineId: selectedMineId === 'ALL' ? 'mine-balaghat-01' : selectedMineId,
                type: 'Excavator',
                equipmentModel: '',
                capacity: '',
                status: 'OPERATIONAL',
                lastMaintenanceDate: new Date().toISOString().split('T')[0],
                nextScheduledMaintenance: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-purple transition"
          >
            <Plus className="w-4 h-4" /> Register New Machinery
          </button>
        )}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Total Fleet Size</span>
            <span className="text-2xl font-bold text-white font-mono">{stats.totalFleet} Units</span>
            <span className="text-[11px] text-slate-400 block mt-1">Registered Across Mines</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Operational</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{stats.operationalCount} Active</span>
            <span className="text-[11px] text-emerald-400/80 block mt-1">Ready on Extraction Bench</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Under Maintenance</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">{stats.underMaintenanceCount} Overhauls</span>
            <span className="text-[11px] text-amber-400/80 block mt-1">Preventive Service</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Breakdown Stoppages</span>
            <span className="text-2xl font-bold text-red-400 font-mono">{stats.breakdownCount} Critical</span>
            <span className="text-[11px] text-red-400/80 block mt-1">Requires Immediate Spares</span>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-lg focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="BREAKDOWN">Breakdown</option>
            <option value="STANDBY">Standby</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Equipment Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-lg focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Equipment Types</option>
            <option value="Excavator">Excavator / Shovel</option>
            <option value="Dumper Truck">Dumper Truck</option>
            <option value="Drill Rig">Drill Rig</option>
            <option value="Underground LHD Loader">Underground LHD Loader</option>
            <option value="Dewatering Pump Station">Dewatering Pump Station</option>
          </select>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => {
          const isBreakdown = eq.status === 'BREAKDOWN';
          const isMaintenance = eq.status === 'UNDER_MAINTENANCE';

          return (
            <div
              key={eq.code}
              className={`glass-panel rounded-2xl p-5 border transition-all duration-200 ${isBreakdown
                ? 'border-red-800/80 bg-red-950/20 shadow-glow-red'
                : isMaintenance
                  ? 'border-amber-800/80 bg-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700'
                }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase bg-slate-950 text-slate-300 border border-slate-800">
                    {eq.code}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{eq.name}</h3>
                  <p className="text-[11px] text-slate-400">{eq.mineName}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${isBreakdown
                    ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                    : isMaintenance
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                >
                  {eq.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Model / Capacity</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {eq.equipmentModel} ({eq.capacity})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Uptime Availability</span>
                  <span className="font-bold text-purple-400 font-mono">{eq.uptimePct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">MTBF Reliability</span>
                  <span className="font-semibold text-slate-200 font-mono">{eq.mtbfHours} Hours</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Next Overhaul</span>
                  <span className="font-semibold text-slate-200 font-mono">{eq.nextScheduledMaintenance}</span>
                </div>
              </div>

              {/* Critical Alert Banner if breakdown */}
              {eq.criticalAlert && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-[11px]">{eq.criticalAlert}</span>
                </div>
              )}

              {/* Actions Footer */}
              {user?.role !== 'VIEWER' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setModalMode('edit');
                      setFormData(eq);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg text-xs transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDelete(eq.code)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Decommission
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Register / Edit Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {modalMode === 'create' ? 'Register New HEMM Machinery' : `Edit Equipment ${formData.code}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Equipment Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    disabled={modalMode === 'edit'}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Equipment Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Komatsu PC600-8"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Mine Site</label>
                  <select
                    value={formData.mineId}
                    onChange={(e) => setFormData({ ...formData, mineId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    {mines.map((m) => (
                      <option key={m.mineId} value={m.mineId}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Machinery Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Excavator">Excavator / Shovel</option>
                    <option value="Dumper Truck">Dumper Truck</option>
                    <option value="Drill Rig">Drill Rig</option>
                    <option value="Underground LHD Loader">Underground LHD Loader</option>
                    <option value="Dewatering Pump Station">Dewatering Pump Station</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Model Spec</label>
                  <input
                    type="text"
                    value={formData.equipmentModel}
                    onChange={(e) => setFormData({ ...formData, equipmentModel: e.target.value })}
                    placeholder="e.g. Komatsu PC600"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Capacity / Bucket</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="e.g. 3.5 m³ Bucket"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                    <option value="BREAKDOWN">BREAKDOWN</option>
                    <option value="STANDBY">STANDBY</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Next Maintenance Date</label>
                  <input
                    type="date"
                    value={formData.nextScheduledMaintenance}
                    onChange={(e) => setFormData({ ...formData, nextScheduledMaintenance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-glow-purple"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
