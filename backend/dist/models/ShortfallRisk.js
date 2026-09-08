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
exports.ShortfallRiskModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ShortfallRiskSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.ShortfallRiskModel = mongoose_1.default.models.ShortfallRisk ||
    mongoose_1.default.model('ShortfallRisk', ShortfallRiskSchema);
