import mongoose, { Schema, Document } from 'mongoose';

export type DataSourceType =
  | 'OFFICIAL_MOIL'
  | 'PUBLIC_GOVERNMENT'
  | 'PUBLIC_SATELLITE'
  | 'PUBLIC_WEATHER'
  | 'SYNTHETIC_DEMO';

export type VerificationStatus =
  | 'VERIFIED_PUBLIC'
  | 'SYNTHETIC_DEMO'
  | 'PENDING_VERIFICATION';

export interface IDataSource extends Document {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  description: string;
  publicationDate: string;
  accessedDate: string;
  dataType: DataSourceType;
  isSynthetic: boolean;
  license: string;
  verificationStatus: VerificationStatus;
  citation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DataSourceSchema = new Schema<IDataSource>(
  {
    sourceId: { type: String, required: true, unique: true, index: true },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    datasetName: { type: String, required: true },
    description: { type: String, required: true },
    publicationDate: { type: String, required: true },
    accessedDate: { type: String, required: true },
    dataType: {
      type: String,
      enum: ['OFFICIAL_MOIL', 'PUBLIC_GOVERNMENT', 'PUBLIC_SATELLITE', 'PUBLIC_WEATHER', 'SYNTHETIC_DEMO'],
      required: true
    },
    isSynthetic: { type: Boolean, required: true, default: false },
    license: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED_PUBLIC', 'SYNTHETIC_DEMO', 'PENDING_VERIFICATION'],
      default: 'VERIFIED_PUBLIC'
    },
    citation: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IDataSource>('DataSource', DataSourceSchema);
