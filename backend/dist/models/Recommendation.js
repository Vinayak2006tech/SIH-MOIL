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
exports.RecommendationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RecommendationSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.RecommendationModel = mongoose_1.default.models.Recommendation ||
    mongoose_1.default.model('Recommendation', RecommendationSchema);
