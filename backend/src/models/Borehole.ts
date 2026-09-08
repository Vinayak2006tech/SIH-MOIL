import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBorehole extends Document {
  boreholeId: string;
  mineId: string;
  mineName: string;
  collarLatitude: number;
  collarLongitude: number;
  elevationMeters: number;
  totalDepthMeters: number;
  seamInterceptDepthMeters: number;
  seamThicknessMeters: number;
  avgMnGradePct: number;
  avgFeGradePct: number;
  avgSiO2GradePct: number;
  avgPGradePct: number;
  coreRecoveryPct: number;
  rqdPct: number;
  rockFormation: string;
  drillingYear: number;
  drillRigType: string;
  // Provenance fields
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  dataType: string;
  isSynthetic: boolean;
  createdAt: Date;
}

const BoreholeSchema: Schema = new Schema(
  {
    boreholeId: { type: String, required: true, unique: true },
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    collarLatitude: { type: Number, required: true },
    collarLongitude: { type: Number, required: true },
    elevationMeters: { type: Number, required: true },
    totalDepthMeters: { type: Number, required: true },
    seamInterceptDepthMeters: { type: Number, required: true },
    seamThicknessMeters: { type: Number, required: true },
    avgMnGradePct: { type: Number, required: true },
    avgFeGradePct: { type: Number, default: 6.0 },
    avgSiO2GradePct: { type: Number, default: 8.0 },
    avgPGradePct: { type: Number, default: 0.15 },
    coreRecoveryPct: { type: Number, required: true },
    rqdPct: { type: Number, required: true },
    rockFormation: { type: String, default: 'Mansar Formation / Sausar Group' },
    drillingYear: { type: Number, default: 2025 },
    drillRigType: { type: String, default: 'Diamond Core Drill Rig' },
    // Provenance
    sourceId: { type: String, default: 'src-synthetic-boreholes' },
    sourceName: { type: String, default: 'MOIL ReserveIQ Synthetic Geological Simulation Engine' },
    sourceUrl: { type: String, default: 'local://data/synthetic/demonstration_boreholes.csv' },
    dataType: { type: String, default: 'SYNTHETIC_DEMO' },
    isSynthetic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BoreholeModel: Model<IBorehole> =
  (mongoose.models.Borehole as Model<IBorehole>) || mongoose.model<IBorehole>('Borehole', BoreholeSchema);
export default BoreholeModel;
