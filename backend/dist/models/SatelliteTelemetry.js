"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SatelliteTelemetryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SatelliteTelemetrySchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.SatelliteTelemetryModel = mongoose_1.default.models.SatelliteTelemetry ||
    mongoose_1.default.model('SatelliteTelemetry', SatelliteTelemetrySchema);
exports.default = exports.SatelliteTelemetryModel;
