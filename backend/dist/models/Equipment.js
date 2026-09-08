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
exports.EquipmentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EquipmentSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mineId: { type: String, required: true, index: true },
    mineName: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: [
            'Excavator',
            'Dumper Truck',
            'Drill Rig',
            'Underground LHD Loader',
            'Winding Hoist',
            'Crushing & Screening Unit',
            'Dewatering Pump Station'
        ]
    },
    equipmentModel: { type: String, required: true },
    capacity: { type: String, required: true },
    status: {
        type: String,
        enum: ['OPERATIONAL', 'UNDER_MAINTENANCE', 'BREAKDOWN', 'STANDBY'],
        default: 'OPERATIONAL'
    },
    uptimePct: { type: Number, default: 85.0 },
    operatingHoursTotal: { type: Number, default: 4500 },
    mtbfHours: { type: Number, default: 140 },
    mttrHours: { type: Number, default: 4.5 },
    lastMaintenanceDate: { type: String, required: true },
    nextScheduledMaintenance: { type: String, required: true },
    healthScorePct: { type: Number, default: 88.0 },
    fuelEfficiencyLtrHr: { type: Number, default: 28.5 },
    criticalAlert: { type: String, default: '' }
}, { timestamps: true });
exports.EquipmentModel = mongoose_1.default.models.Equipment || mongoose_1.default.model('Equipment', EquipmentSchema);
