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
exports.ProductionLogModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductionLogSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.ProductionLogModel = mongoose_1.default.models.ProductionLog ||
    mongoose_1.default.model('ProductionLog', ProductionLogSchema);
exports.default = exports.ProductionLogModel;
