import mongoose, { Schema, Document, Model } from 'mongoose';

export type EquipmentStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'BREAKDOWN' | 'STANDBY';
export type EquipmentType =
  | 'Excavator'
  | 'Dumper Truck'
  | 'Drill Rig'
  | 'Underground LHD Loader'
  | 'Winding Hoist'
  | 'Crushing & Screening Unit'
  | 'Dewatering Pump Station';

export interface IEquipment extends Document {
  code: string;
  name: string;
  mineId: string;
  mineName: string;
  type: EquipmentType;
  equipmentModel: string;
  capacity: string;
  status: EquipmentStatus;
  uptimePct: number;
  operatingHoursTotal: number;
  mtbfHours: number;
  mttrHours: number;
  lastMaintenanceDate: string;
  nextScheduledMaintenance: string;
  healthScorePct: number;
  fuelEfficiencyLtrHr: number;
  criticalAlert: string;
}

const EquipmentSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export const EquipmentModel: Model<IEquipment> =
  (mongoose.models.Equipment as Model<IEquipment>) || mongoose.model<IEquipment>('Equipment', EquipmentSchema);
