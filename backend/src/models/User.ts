import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'ADMIN' | 'MINE_PLANNER' | 'VIEWER' | 'USER';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  mineAccess: string[];
  activationToken?: string;
  activationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  emailVerified: boolean;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  suspendedAt?: Date;
  suspensionReason?: string;
  lastLogin?: Date;
  isGoogleAuth?: boolean;
  googlePicture?: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'MINE_PLANNER', 'VIEWER', 'USER'],
      default: 'MINE_PLANNER'
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
      index: true
    },
    department: { type: String, default: 'Mine Planning & Geology' },
    mineAccess: { type: [String], default: ['ALL'] },
    activationToken: { type: String, select: true },
    activationTokenExpiry: { type: Date, select: true },
    resetPasswordToken: { type: String, select: true },
    resetPasswordExpiry: { type: Date, select: true },
    emailVerified: { type: Boolean, default: false },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    suspendedAt: { type: Date },
    suspensionReason: { type: String },
    lastLogin: { type: Date },
    isGoogleAuth: { type: Boolean, default: false },
    googlePicture: { type: String },
    picture: { type: String }
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
