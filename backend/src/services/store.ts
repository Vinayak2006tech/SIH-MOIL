import fs from 'fs';
import path from 'path';
import { getInitialSeedData, SeedDataStore } from '../seed/seedData';
import { isMongoConnected } from '../config/db';
import { UserModel } from '../models/User';
import { MineModel } from '../models/Mine';
import { BoreholeModel } from '../models/Borehole';
import { ProductionLogModel } from '../models/ProductionLog';
import { EquipmentModel } from '../models/Equipment';
import { ShortfallRiskModel } from '../models/ShortfallRisk';
import { RecommendationModel } from '../models/Recommendation';
import { SatelliteTelemetryModel } from '../models/SatelliteTelemetry';
import DataSourceModel from '../models/DataSource';

class InMemoryStore {
  public data: SeedDataStore;
  private usersFilePath: string;

  constructor() {
    this.data = getInitialSeedData();
    this.usersFilePath = path.resolve(__dirname, '../../../data/users.json');
    this.loadPersistedUsers();
    this.savePersistedUsers();
    console.log(`[Store] Operational store initialized with ${this.data.users.length} authenticated personnel, ${this.data.mines.length} MOIL mines, and ${this.data.equipment.length} equipment assets.`);
  }

  get isMemoryMode(): boolean {
    return !isMongoConnected;
  }

  private loadPersistedUsers() {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const fileUsers = JSON.parse(fs.readFileSync(this.usersFilePath, 'utf-8'));
        if (Array.isArray(fileUsers)) {
          fileUsers.forEach((fu: any) => {
            const idx = this.data.users.findIndex((u) => u.email.toLowerCase() === fu.email.toLowerCase());
            if (idx !== -1) {
              this.data.users[idx] = fu;
            } else {
              this.data.users.push(fu);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[Store] Could not load persisted users.json:', e);
    }
  }

  public savePersistedUsers() {
    try {
      const dir = path.dirname(this.usersFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.usersFilePath, JSON.stringify(this.data.users, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[Store] Could not save users to users.json:', e);
    }
  }

  public async syncUsersToMongoDB() {
    if (!isMongoConnected) return;
    try {
      for (const u of this.data.users) {
        await UserModel.findOneAndUpdate(
          { email: u.email.toLowerCase() },
          {
            name: u.name,
            email: u.email.toLowerCase(),
            passwordHash: u.passwordHash,
            role: u.role,
            department: u.department,
            status: u.status || 'APPROVED',
            mineAccess: u.mineAccess || ['ALL'],
            isGoogleAuth: u.isGoogleAuth || false,
            googlePicture: u.googlePicture,
            picture: u.picture,
            emailVerified: u.emailVerified !== undefined ? u.emailVerified : true,
            activationToken: u.activationToken,
            activationTokenExpiry: u.activationTokenExpiry,
            resetPasswordToken: u.resetPasswordToken,
            resetPasswordExpiry: u.resetPasswordExpiry,
            approvedAt: u.approvedAt,
            approvedBy: u.approvedBy,
            rejectedAt: u.rejectedAt,
            rejectionReason: u.rejectionReason,
            suspendedAt: u.suspendedAt,
            suspensionReason: u.suspensionReason,
            lastLogin: u.lastLogin
          },
          { upsert: true, new: true }
        );
      }
      console.log(`[Database] Synchronized ${this.data.users.length} user accounts to MongoDB.`);
    } catch (err: any) {
      console.warn('[Database] User synchronization to MongoDB encountered an error:', err.message);
    }
  }

  // Data Sources & Provenance
  getDataSources() {
    return this.data.dataSources;
  }

  async getAllDataSources() {
    if (isMongoConnected) {
      return await DataSourceModel.find().sort({ isSynthetic: 1, sourceName: 1 }).lean();
    }
    return this.data.dataSources;
  }

  getAnnualProductionSummary() {
    return this.data.annualProductionSummary;
  }

  // Global Manganese Market & Reserves (USGS & IMnI)
  getGlobalMarketData() {
    return this.data.globalMarketData || {};
  }

  getGlobalReserves() {
    return this.data.globalMarketData?.countryReserves || [];
  }

  getGlobalTradeFlows() {
    return this.data.globalMarketData?.globalTradeFlows || {};
  }

  getGlobalPricingBenchmarks() {
    return this.data.globalMarketData?.pricingBenchmarks || {};
  }

  getDeepSeaNodules() {
    return this.data.globalMarketData?.deepSeaNodules || {};
  }

  getMoilVsGlobalPeers() {
    return this.data.globalMarketData?.moilVsGlobalPeers || [];
  }

  // MOIL Corporate Facilities & Greenfield Exploration
  getFacilities() {
    return this.data.facilities || [];
  }

  getExplorationBlocks() {
    return this.data.explorationBlocks || [];
  }

  // Users
  async findUserByEmail(email: string) {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) return null;

    if (isMongoConnected) {
      try {
        const dbUser = await UserModel.findOne({ email: cleanEmail });
        if (dbUser) return dbUser;

        if (cleanEmail === 'admin@moil.gov.in' || cleanEmail === 'admin@moil.in' || cleanEmail === 'admin') {
          const adminUser = await UserModel.findOne({ role: 'ADMIN' });
          if (adminUser) return adminUser;
        } else if (cleanEmail === 'planner@moil.gov.in' || cleanEmail === 'planner@moil.in' || cleanEmail === 'planner') {
          const plannerUser = await UserModel.findOne({ role: 'MINE_PLANNER' });
          if (plannerUser) return plannerUser;
        } else if (cleanEmail === 'auditor@moil.gov.in' || cleanEmail === 'auditor@steel.gov.in' || cleanEmail === 'auditor') {
          const auditorUser = await UserModel.findOne({ role: 'VIEWER' });
          if (auditorUser) return auditorUser;
        }
      } catch (err) {
        console.warn('[Database] MongoDB query error:', err);
      }
    }

    const found = this.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) return found;

    if (cleanEmail === 'admin@moil.gov.in' || cleanEmail === 'admin@moil.in' || cleanEmail === 'admin') {
      return this.data.users.find((u) => u.role === 'ADMIN') || null;
    }
    if (cleanEmail === 'planner@moil.gov.in' || cleanEmail === 'planner@moil.in' || cleanEmail === 'planner') {
      return this.data.users.find((u) => u.role === 'MINE_PLANNER') || null;
    }
    if (cleanEmail === 'auditor@moil.gov.in' || cleanEmail === 'auditor@steel.gov.in' || cleanEmail === 'auditor') {
      return this.data.users.find((u) => u.role === 'VIEWER') || null;
    }

    return null;
  }

  async findUserById(id: string) {
    if (isMongoConnected) {
      try {
        const dbUser = await UserModel.findById(id);
        if (dbUser) return dbUser;
      } catch (err) {
        // May fail if id is not a valid Mongo ObjectId, ignore and fallback
      }
    }
    return this.data.users.find((u) => u._id === id || u.id === id) || null;
  }

  async findUserByActivationToken(token: string) {
    if (isMongoConnected) {
      try {
        const dbUser = await UserModel.findOne({
          activationToken: token,
          activationTokenExpiry: { $gt: new Date() }
        });
        if (dbUser) return dbUser;
      } catch (err) {
        console.warn('[Database] MongoDB findUserByActivationToken error:', err);
      }
    }
    const now = new Date();
    return this.data.users.find((u) => {
      if (u.activationToken === token) {
        if (!u.activationTokenExpiry) return true;
        const expiry = new Date(u.activationTokenExpiry);
        return expiry > now;
      }
      return false;
    }) || null;
  }

  async findUserByResetToken(token: string) {
    if (isMongoConnected) {
      try {
        const dbUser = await UserModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpiry: { $gt: new Date() }
        });
        if (dbUser) return dbUser;
      } catch (err) {
        console.warn('[Database] MongoDB findUserByResetToken error:', err);
      }
    }
    const now = new Date();
    return this.data.users.find((u) => {
      if (u.resetPasswordToken === token) {
        if (!u.resetPasswordExpiry) return true;
        const expiry = new Date(u.resetPasswordExpiry);
        return expiry > now;
      }
      return false;
    }) || null;
  }

  async createUser(user: any) {
    const cleanEmail = String(user.email).toLowerCase().trim();
    let mongoUser: any = null;
    if (isMongoConnected) {
      try {
        mongoUser = await UserModel.create({
          ...user,
          email: cleanEmail
        });
      } catch (err) {
        console.warn('[Database] MongoDB createUser error, persisting locally:', err);
      }
    }
    const newUser = {
      ...user,
      email: cleanEmail,
      _id: mongoUser ? (mongoUser._id ? mongoUser._id.toString() : mongoUser.id) : `usr-${Date.now()}`
    };
    this.data.users.push(newUser);
    this.savePersistedUsers();
    return newUser;
  }

  async updateUser(id: string, updates: any) {
    let updatedUser: any = null;
    if (isMongoConnected) {
      try {
        updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });
      } catch (err) {
        console.warn('[Database] MongoDB updateUser error:', err);
      }
    }

    const idx = this.data.users.findIndex((u) => u._id === id || u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = {
        ...this.data.users[idx],
        ...updates,
        updatedAt: new Date()
      };
      this.savePersistedUsers();
      return this.data.users[idx];
    }

    if (updatedUser) {
      const plain = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
      this.data.users.push(plain);
      this.savePersistedUsers();
      return plain;
    }

    return null;
  }

  async deleteUser(id: string) {
    let deletedMongo = false;
    if (isMongoConnected) {
      try {
        await UserModel.findByIdAndDelete(id);
        deletedMongo = true;
      } catch (err) {
        console.warn('[Database] MongoDB deleteUser error:', err);
      }
    }

    const idx = this.data.users.findIndex((u) => u._id === id || u.id === id);
    if (idx !== -1) {
      const removed = this.data.users.splice(idx, 1)[0];
      this.savePersistedUsers();
      return removed;
    }

    return deletedMongo;
  }

  async getAllUsers(filter?: { status?: string; role?: string; search?: string }) {
    let usersList: any[] = [];
    if (isMongoConnected) {
      try {
        const query: any = {};
        if (filter?.status && filter.status !== 'ALL') {
          query.status = filter.status;
        }
        if (filter?.role && filter.role !== 'ALL') {
          query.role = filter.role;
        }
        if (filter?.search) {
          const regex = new RegExp(filter.search, 'i');
          query.$or = [{ name: regex }, { email: regex }, { department: regex }];
        }
        usersList = await UserModel.find(query).sort({ createdAt: -1 }).lean();
        return usersList;
      } catch (err) {
        console.warn('[Database] MongoDB getAllUsers error, falling back to in-memory:', err);
      }
    }

    // In-memory fallback
    usersList = [...this.data.users];
    if (filter?.status && filter.status !== 'ALL') {
      usersList = usersList.filter((u) => (u.status || 'APPROVED') === filter.status);
    }
    if (filter?.role && filter.role !== 'ALL') {
      usersList = usersList.filter((u) => u.role === filter.role);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      usersList = usersList.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }
    return usersList;
  }

  async getUserStats() {
    let users: any[] = [];
    if (isMongoConnected) {
      try {
        users = await UserModel.find().lean();
      } catch (err) {
        users = this.data.users;
      }
    } else {
      users = this.data.users;
    }

    const totalUsers = users.length;
    let pendingUsers = 0;
    let approvedUsers = 0;
    let rejectedUsers = 0;
    let suspendedUsers = 0;

    users.forEach((u) => {
      const st = u.status || 'APPROVED';
      if (st === 'PENDING') pendingUsers++;
      else if (st === 'APPROVED') approvedUsers++;
      else if (st === 'REJECTED') rejectedUsers++;
      else if (st === 'SUSPENDED') suspendedUsers++;
    });

    return {
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      suspendedUsers
    };
  }

  // Mines
  async getAllMines() {
    if (isMongoConnected) {
      return await MineModel.find().lean();
    }
    return this.data.mines;
  }

  async getMineById(mineId: string) {
    if (isMongoConnected) {
      return await MineModel.findOne({ mineId }).lean();
    }
    return this.data.mines.find((m) => m.mineId === mineId) || null;
  }

  async updateMine(mineId: string, updates: any) {
    if (isMongoConnected) {
      return await MineModel.findOneAndUpdate({ mineId }, updates, { new: true }).lean();
    }
    const idx = this.data.mines.findIndex((m) => m.mineId === mineId);
    if (idx !== -1) {
      this.data.mines[idx] = { ...this.data.mines[idx], ...updates, updatedAt: new Date() };
      return this.data.mines[idx];
    }
    return null;
  }

  // Boreholes / Drilling Logs
  async getBoreholes(mineId?: string) {
    if (isMongoConnected) {
      const filter = mineId ? { mineId } : {};
      return await BoreholeModel.find(filter).lean();
    }
    if (mineId) {
      return this.data.boreholes.filter((b) => b.mineId === mineId);
    }
    return this.data.boreholes;
  }

  async addBoreholes(newBoreholes: any[]) {
    if (isMongoConnected) {
      return await BoreholeModel.insertMany(newBoreholes);
    }
    newBoreholes.forEach((bh) => {
      this.data.boreholes.unshift({
        _id: bh._id || `bh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...bh,
        createdAt: new Date()
      });
    });
    return newBoreholes;
  }

  // Production Logs
  async getProductionLogs(mineId?: string, limit: number = 24) {
    if (isMongoConnected) {
      const filter = mineId ? { mineId } : {};
      return await ProductionLogModel.find(filter).sort({ date: 1 }).limit(limit).lean();
    }
    let logs = [...this.data.productionLogs];
    if (mineId) {
      logs = logs.filter((p) => p.mineId === mineId);
    }
    logs.sort((a, b) => a.date.localeCompare(b.date));
    return logs.slice(-limit);
  }

  async addProductionLogs(logs: any[]) {
    if (isMongoConnected) {
      return await ProductionLogModel.insertMany(logs);
    }
    logs.forEach((log) => {
      this.data.productionLogs.push({
        _id: log._id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...log,
        createdAt: new Date()
      });
    });
    return logs;
  }

  // Equipment Fleet
  async getEquipment(mineId?: string) {
    if (isMongoConnected) {
      const filter = mineId ? { mineId } : {};
      return await EquipmentModel.find(filter).lean();
    }
    if (mineId) {
      return this.data.equipment.filter((e) => e.mineId === mineId);
    }
    return this.data.equipment;
  }

  async addEquipment(item: any) {
    if (isMongoConnected) {
      return await EquipmentModel.create(item);
    }
    const newItem = {
      _id: `eq-${Date.now()}`,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.equipment.unshift(newItem);
    return newItem;
  }

  async updateEquipment(code: string, updates: any) {
    if (isMongoConnected) {
      return await EquipmentModel.findOneAndUpdate({ code }, updates, { new: true }).lean();
    }
    const idx = this.data.equipment.findIndex((e) => e.code === code);
    if (idx !== -1) {
      this.data.equipment[idx] = { ...this.data.equipment[idx], ...updates, updatedAt: new Date() };
      return this.data.equipment[idx];
    }
    return null;
  }

  async deleteEquipment(code: string) {
    if (isMongoConnected) {
      return await EquipmentModel.findOneAndDelete({ code });
    }
    const idx = this.data.equipment.findIndex((e) => e.code === code);
    if (idx !== -1) {
      return this.data.equipment.splice(idx, 1)[0];
    }
    return null;
  }

  // Shortfall Risk
  async getShortfallRisks(mineId?: string) {
    if (isMongoConnected) {
      const filter = mineId ? { mineId } : {};
      return await ShortfallRiskModel.find(filter).lean();
    }
    if (mineId) {
      return this.data.shortfallRisks.filter((r) => r.mineId === mineId);
    }
    return this.data.shortfallRisks;
  }

  async updateShortfallRisk(mineId: string, riskData: any) {
    if (isMongoConnected) {
      return await ShortfallRiskModel.findOneAndUpdate({ mineId }, riskData, { upsert: true, new: true }).lean();
    }
    const idx = this.data.shortfallRisks.findIndex((r) => r.mineId === mineId);
    if (idx !== -1) {
      this.data.shortfallRisks[idx] = { ...this.data.shortfallRisks[idx], ...riskData, updatedAt: new Date() };
      return this.data.shortfallRisks[idx];
    }
    const newRisk = { _id: `risk-${Date.now()}`, mineId, ...riskData };
    this.data.shortfallRisks.push(newRisk);
    return newRisk;
  }

  // Recommendations
  async getRecommendations(mineId?: string, status?: string) {
    if (isMongoConnected) {
      const filter: any = {};
      if (mineId) filter.mineId = mineId;
      if (status) filter.status = status;
      return await RecommendationModel.find(filter).sort({ createdAt: -1 }).lean();
    }
    let list = [...this.data.recommendations];
    if (mineId) {
      list = list.filter((r) => r.mineId === mineId);
    }
    if (status) {
      list = list.filter((r) => r.status === status);
    }
    return list;
  }

  async updateRecommendationStatus(
    id: string,
    status: string,
    actionTakenBy: string,
    outcomeNote?: string
  ) {
    if (isMongoConnected) {
      return await RecommendationModel.findOneAndUpdate(
        { $or: [{ recommendationId: id }, { _id: id }] },
        {
          status,
          actionTakenBy,
          actionTimestamp: new Date(),
          outcomeNote: outcomeNote || `Status changed to ${status} by ${actionTakenBy}`
        },
        { new: true }
      ).lean();
    }
    const idx = this.data.recommendations.findIndex(
      (r) => r.recommendationId === id || r._id === id
    );
    if (idx !== -1) {
      this.data.recommendations[idx] = {
        ...this.data.recommendations[idx],
        status,
        actionTakenBy,
        actionTimestamp: new Date(),
        outcomeNote: outcomeNote || `Status changed to ${status} by ${actionTakenBy}`,
        updatedAt: new Date()
      };
      return this.data.recommendations[idx];
    }
    return null;
  }

  // Satellite Telemetry
  async getSatelliteTelemetry(mineId?: string) {
    if (isMongoConnected) {
      const filter = mineId ? { mineId } : {};
      return await SatelliteTelemetryModel.find(filter).sort({ timestamp: -1 }).lean();
    }
    if (mineId) {
      return this.data.satelliteTelemetry.filter((s) => s.mineId === mineId);
    }
    return this.data.satelliteTelemetry;
  }

  async updateSatelliteTelemetry(mineId: string, telemetry: any) {
    if (isMongoConnected) {
      return await SatelliteTelemetryModel.findOneAndUpdate({ mineId }, telemetry, { upsert: true, new: true }).lean();
    }
    const idx = this.data.satelliteTelemetry.findIndex((s) => s.mineId === mineId);
    if (idx !== -1) {
      this.data.satelliteTelemetry[idx] = { ...this.data.satelliteTelemetry[idx], ...telemetry, timestamp: new Date() };
      return this.data.satelliteTelemetry[idx];
    }
    const newTel = { _id: `sat-${Date.now()}`, mineId, ...telemetry, timestamp: new Date() };
    this.data.satelliteTelemetry.push(newTel);
    return newTel;
  }
}

export const store = new InMemoryStore();
export const memoryStore = store;
export default store;
