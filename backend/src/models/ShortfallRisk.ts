import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeatureImportance {
  feature: string;
  impact_pct: number;
  direction: string;
  description: string;
}

export interface IHorizonRisk {
  horizon_days: number;
  predicted_production_tonnes: number;
  predicted_shortfall_tonnes: number;
  confidence_lower_tonnes: number;
  confidence_upper_tonnes: number;
  shortfall_probability_pct: number;
  risk_level: string;
}

export interface IShortfallRisk extends Document {
  mineId: string;
  mineName: string;
  assessmentDate: Date;
  overallRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  riskScorePct: number;
  primaryBottleneck: string;
  featureImportance: IFeatureImportance[];
  horizons: IHorizonRisk[];
  plainLanguageExplanation: string;
  estimatedRevenueRiskInrCrores: number;
  simulatedMitigatedRiskPct: number;
  targetMonthlyTonnes: number;
}

const ShortfallRiskSchema: Schema = new Schema(
  {
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    assessmentDate: { type: Date, default: Date.now },
    overallRiskLevel: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
      required: true
    },
    riskScorePct: { type: Number, required: true },
    primaryBottleneck: { type: String, required: true },
    featureImportance: [
      {
        feature: String,
        impact_pct: Number,
        direction: String,
        description: String
      }
    ],
    horizons: [
      {
        horizon_days: Number,
        predicted_production_tonnes: Number,
        predicted_shortfall_tonnes: Number,
        confidence_lower_tonnes: Number,
        confidence_upper_tonnes: Number,
        shortfall_probability_pct: Number,
        risk_level: String
      }
    ],
    plainLanguageExplanation: { type: String, required: true },
    estimatedRevenueRiskInrCrores: { type: Number, required: true },
    simulatedMitigatedRiskPct: { type: Number, default: 0 },
    targetMonthlyTonnes: { type: Number, required: true }
  },
  { timestamps: true }
);

export const ShortfallRiskModel: Model<IShortfallRisk> =
  (mongoose.models.ShortfallRisk as Model<IShortfallRisk>) ||
  mongoose.model<IShortfallRisk>('ShortfallRisk', ShortfallRiskSchema);
