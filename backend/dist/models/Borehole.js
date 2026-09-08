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
exports.BoreholeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BoreholeSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.BoreholeModel = mongoose_1.default.models.Borehole || mongoose_1.default.model('Borehole', BoreholeSchema);
exports.default = exports.BoreholeModel;
