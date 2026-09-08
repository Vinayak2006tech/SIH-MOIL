import mongoose, { Schema, Document, Model } from 'mongoose';

export type RecommendationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SNOOZED';
export type RecommendationCategory =
  | 'Blasting Optimization'
  | 'Fleet Redeployment'
  | 'Maintenance Scheduling'
  | 'Weather Mitigation'
  | 'Grade Blending';

export interface IRecommendation extends Document {
  recommendationId: string;
  mineId: string;
  mineName: string;
  title: string;
  category: RecommendationCategory;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  actionSteps: string[];
  expectedRiskReductionPct: number;
  expectedTonnageGain: number;
  estimatedRoiInrLakhs: number;
  status: RecommendationStatus;
  targetEquipment?: string;
  targetShift?: string;
  actionTakenBy?: string;
  actionTimestamp?: Date;
  outcomeNote?: string;
  realizedTonnageGain?: number;
  realizedRiskReductionPct?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    recommendationId: { type: String, required: true, unique: true },
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Blasting Optimization',
        'Fleet Redeployment',
        'Maintenance Scheduling',
        'Weather Mitigation',
        'Grade Blending'
      ]
    },
    urgency: {
      type: String,
      required: true,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    },
    description: { type: String, required: true },
    actionSteps: { type: [String], default: [] },
    expectedRiskReductionPct: { type: Number, required: true },
    expectedTonnageGain: { type: Number, required: true },
    estimatedRoiInrLakhs: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'SNOOZED'],
      default: 'PENDING'
    },
    targetEquipment: { type: String },
    targetShift: { type: String },
    actionTakenBy: { type: String },
    actionTimestamp: { type: Date },
    outcomeNote: { type: String },
    realizedTonnageGain: { type: Number },
    realizedRiskReductionPct: { type: Number }
  },
  { timestamps: true }
);

export const RecommendationModel: Model<IRecommendation> =
  (mongoose.models.Recommendation as Model<IRecommendation>) ||
  mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
