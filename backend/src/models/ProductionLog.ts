import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDowntimeBreakdown {
  equipmentFailureHours: number;
  monsoonWeatherHours: number;
  blastingDelayHours: number;
  logisticsHaulageHours: number;
  powerOutageHours: number;
}

export interface IProductionLog extends Document {
  mineId: string;
  mineName: string;
  date: string;
  financialYear?: string;
  targetTonnes: number;
  actualTonnes: number;
  salesTonnes?: number;
  varianceTonnes: number;
  compliancePct: number;
  avgMnGradePct: number;
  equipmentUptimePct: number;
  rainfallMm: number;
  blastingShiftsCount: number;
  downtimeHours: IDowntimeBreakdown;
  // Provenance fields
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  dataType: string;
  isSynthetic: boolean;
  createdAt: Date;
}

const ProductionLogSchema: Schema = new Schema(
  {
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    date: { type: String, required: true, index: true },
    financialYear: { type: String },
    targetTonnes: { type: Number, required: true },
    actualTonnes: { type: Number, required: true },
    salesTonnes: { type: Number },
    varianceTonnes: { type: Number, required: true },
    compliancePct: { type: Number, required: true },
    avgMnGradePct: { type: Number, required: true },
    equipmentUptimePct: { type: Number, required: true },
    rainfallMm: { type: Number, default: 0 },
    blastingShiftsCount: { type: Number, default: 20 },
    downtimeHours: {
      equipmentFailureHours: { type: Number, default: 0 },
      monsoonWeatherHours: { type: Number, default: 0 },
      blastingDelayHours: { type: Number, default: 0 },
      logisticsHaulageHours: { type: Number, default: 0 },
      powerOutageHours: { type: Number, default: 0 }
    },
    // Provenance
    sourceId: { type: String, default: 'src-moil-ar-2025' },
    sourceName: { type: String, default: 'MOIL Limited Annual Reports' },
    sourceUrl: { type: String, default: 'https://www.moil.nic.in/annual-reports' },
    dataType: { type: String, default: 'OFFICIAL_MOIL' },
    isSynthetic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ProductionLogModel: Model<IProductionLog> =
  (mongoose.models.ProductionLog as Model<IProductionLog>) ||
  mongoose.model<IProductionLog>('ProductionLog', ProductionLogSchema);
export default ProductionLogModel;
