import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISatelliteTelemetry extends Document {
  mineId: string;
  mineName: string;
  timestamp: Date;
  sensor: string;
  ndvi: number;
  soilMoisturePct: number;
  rainfallMm: number;
  landSurfaceTempCelsius: number;
  cloudCoverPct: number;
  slopeStabilityStatus: 'SAFE' | 'ADVISORY' | 'ALERT';
  recommendedBlastingWindow: string;
  // Provenance fields
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  dataType: string;
  isSynthetic: boolean;
}

const SatelliteTelemetrySchema: Schema = new Schema(
  {
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    sensor: { type: String, default: 'Sentinel-2 MSI / NASA MODIS' },
    ndvi: { type: Number, required: true },
    soilMoisturePct: { type: Number, required: true },
    rainfallMm: { type: Number, required: true },
    landSurfaceTempCelsius: { type: Number, required: true },
    cloudCoverPct: { type: Number, default: 10.0 },
    slopeStabilityStatus: { type: String, enum: ['SAFE', 'ADVISORY', 'ALERT'], default: 'SAFE' },
    recommendedBlastingWindow: { type: String, default: 'Optimal standard blasting window' },
    // Provenance
    sourceId: { type: String, default: 'src-copernicus-sentinel2' },
    sourceName: { type: String, default: 'ESA Copernicus Sentinel-2 MSI & NASA MODIS' },
    sourceUrl: { type: String, default: 'https://browser.dataspace.copernicus.eu/' },
    dataType: { type: String, default: 'PUBLIC_SATELLITE' },
    isSynthetic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SatelliteTelemetryModel: Model<ISatelliteTelemetry> =
  (mongoose.models.SatelliteTelemetry as Model<ISatelliteTelemetry>) ||
  mongoose.model<ISatelliteTelemetry>('SatelliteTelemetry', SatelliteTelemetrySchema);
export default SatelliteTelemetryModel;
