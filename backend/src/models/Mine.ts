import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMine extends Document {
  mineId: string;
  name: string;
  code: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  type: 'Underground' | 'Opencast' | 'Mixed';
  depthMeters: number;
  leaseAreaHectares: number;
  totalReservesMt: number;
  provedReservesMt: number;
  probableReservesMt: number;
  inferredResourcesMt: number;
  avgOreGradeMnPct: number;
  avgFeGradePct: number;
  avgSiO2GradePct: number;
  annualCapacityTonnes: number;
  targetMonthlyTonnes: number;
  currentMonthlyProductionTonnes: number;
  currentShortfallRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  currentShortfallProbabilityPct: number;
  equipmentUptimePct: number;
  activeEquipmentCount: number;
  operationalStatus: 'ACTIVE' | 'OPERATIONAL' | 'MAINTENANCE_RESTRICTED' | 'MONSOON_STANDBY';
  geologicalConfidencePct: number;
  satelliteStabilityScore: number;
  keyMineralogy?: string;
  onSiteProcessing?: string;
  commissioningYear?: number;
  // Provenance fields
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  dataType: string;
  isSynthetic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MineSchema: Schema = new Schema(
  {
    mineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    type: { type: String, enum: ['Underground', 'Opencast', 'Mixed'], default: 'Underground' },
    depthMeters: { type: Number, default: 280 },
    leaseAreaHectares: { type: Number, required: true },
    totalReservesMt: { type: Number, required: true },
    provedReservesMt: { type: Number, required: true },
    probableReservesMt: { type: Number, required: true },
    inferredResourcesMt: { type: Number, default: 2.0 },
    avgOreGradeMnPct: { type: Number, required: true },
    avgFeGradePct: { type: Number, default: 6.5 },
    avgSiO2GradePct: { type: Number, default: 8.5 },
    annualCapacityTonnes: { type: Number, required: true },
    targetMonthlyTonnes: { type: Number, required: true },
    currentMonthlyProductionTonnes: { type: Number, default: 0 },
    currentShortfallRiskLevel: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
      default: 'LOW'
    },
    currentShortfallProbabilityPct: { type: Number, default: 25.0 },
    equipmentUptimePct: { type: Number, default: 82.0 },
    activeEquipmentCount: { type: Number, default: 18 },
    operationalStatus: {
      type: String,
      default: 'OPERATIONAL'
    },
    geologicalConfidencePct: { type: Number, default: 85.0 },
    satelliteStabilityScore: { type: Number, default: 80.0 },
    keyMineralogy: { type: String },
    onSiteProcessing: { type: String },
    commissioningYear: { type: Number },
    // Provenance
    sourceId: { type: String, default: 'src-moil-ar-2025' },
    sourceName: { type: String, default: 'MOIL Limited Annual Reports & IBM NMI' },
    sourceUrl: { type: String, default: 'https://www.moil.nic.in/mining-operations' },
    dataType: { type: String, default: 'OFFICIAL_MOIL' },
    isSynthetic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const MineModel: Model<IMine> =
  (mongoose.models.Mine as Model<IMine>) || mongoose.model<IMine>('Mine', MineSchema);
export default MineModel;
