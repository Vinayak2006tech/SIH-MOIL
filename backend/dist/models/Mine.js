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
exports.MineModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MineSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.MineModel = mongoose_1.default.models.Mine || mongoose_1.default.model('Mine', MineSchema);
exports.default = exports.MineModel;
