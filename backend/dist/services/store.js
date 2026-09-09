"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = exports.store = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seedData_1 = require("../seed/seedData");
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Mine_1 = require("../models/Mine");
const Borehole_1 = require("../models/Borehole");
const ProductionLog_1 = require("../models/ProductionLog");
const Equipment_1 = require("../models/Equipment");
const ShortfallRisk_1 = require("../models/ShortfallRisk");
const Recommendation_1 = require("../models/Recommendation");
const SatelliteTelemetry_1 = require("../models/SatelliteTelemetry");
const DataSource_1 = __importDefault(require("../models/DataSource"));
class InMemoryStore {
    data;
    usersFilePath;
    constructor() {
        this.data = (0, seedData_1.getInitialSeedData)();
        this.usersFilePath = path_1.default.resolve(__dirname, '../../../data/users.json');
        this.loadPersistedUsers();
        this.savePersistedUsers();
        console.log(`[Store] Operational store initialized with ${this.data.users.length} authenticated personnel, ${this.data.mines.length} MOIL mines, and ${this.data.equipment.length} equipment assets.`);
    }
    get isMemoryMode() {
        return !db_1.isMongoConnected;
    }
    loadPersistedUsers() {
        try {
            if (fs_1.default.existsSync(this.usersFilePath)) {
                const fileUsers = JSON.parse(fs_1.default.readFileSync(this.usersFilePath, 'utf-8'));
                if (Array.isArray(fileUsers)) {
                    fileUsers.forEach((fu) => {
                        const idx = this.data.users.findIndex((u) => u.email.toLowerCase() === fu.email.toLowerCase());
                        if (idx !== -1) {
                            this.data.users[idx] = fu;
                        }
                        else {
                            this.data.users.push(fu);
                        }
                    });
                }
            }
        }
        catch (e) {
            console.warn('[Store] Could not load persisted users.json:', e);
        }
    }
    savePersistedUsers() {
        try {
            const dir = path_1.default.dirname(this.usersFilePath);
            if (!fs_1.default.existsSync(dir))
                fs_1.default.mkdirSync(dir, { recursive: true });
            fs_1.default.writeFileSync(this.usersFilePath, JSON.stringify(this.data.users, null, 2), 'utf-8');
        }
        catch (e) {
            console.warn('[Store] Could not save users to users.json:', e);
        }
    }
    async syncUsersToMongoDB() {
        if (!db_1.isMongoConnected)
            return;
        try {
            for (const u of this.data.users) {
                await User_1.UserModel.findOneAndUpdate({ email: u.email.toLowerCase() }, {
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
                }, { upsert: true, new: true });
            }
            console.log(`[Database] Synchronized ${this.data.users.length} user accounts to MongoDB.`);
        }
        catch (err) {
            console.warn('[Database] User synchronization to MongoDB encountered an error:', err.message);
        }
    }
    // Data Sources & Provenance
    getDataSources() {
        return this.data.dataSources;
    }
    async getAllDataSources() {
        if (db_1.isMongoConnected) {
            return await DataSource_1.default.find().sort({ isSynthetic: 1, sourceName: 1 }).lean();
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
    async findUserByEmail(email) {
        const cleanEmail = (email || '').toLowerCase().trim();
        if (!cleanEmail)
            return null;
        if (db_1.isMongoConnected) {
            try {
                const dbUser = await User_1.UserModel.findOne({ email: cleanEmail }).maxTimeMS(2500).lean();
                if (dbUser)
                    return dbUser;
            }
            catch (err) {
                // Fallback to in-memory store
            }
        }
        const found = this.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (found)
            return found;
        return null;
    }
    async findUserById(id) {
        if (!id)
            return null;
        if (db_1.isMongoConnected) {
            try {
                let dbUser = null;
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    dbUser = await User_1.UserModel.findById(id).maxTimeMS(2500).lean();
                }
                if (!dbUser) {
                    dbUser = await User_1.UserModel.findOne({ email: id.toLowerCase() }).maxTimeMS(2500).lean();
                }
                if (dbUser)
                    return dbUser;
            }
            catch (err) {
                // Fallback
            }
        }
        return this.data.users.find((u) => u._id === id || u.id === id || u.email?.toLowerCase() === id?.toLowerCase()) || null;
    }
    async findUserByActivationToken(token) {
        if (db_1.isMongoConnected && token) {
            try {
                const dbUser = await User_1.UserModel.findOne({
                    activationToken: token,
                    activationTokenExpiry: { $gt: new Date() }
                }).maxTimeMS(2500).lean();
                if (dbUser)
                    return dbUser;
            }
            catch (err) {
                console.warn('[Database] MongoDB findUserByActivationToken error:', err);
            }
        }
        const now = new Date();
        return this.data.users.find((u) => {
            if (u.activationToken === token) {
                if (!u.activationTokenExpiry)
                    return true;
                const expiry = new Date(u.activationTokenExpiry);
                return expiry > now;
            }
            return false;
        }) || null;
    }
    async findUserByResetToken(token) {
        if (db_1.isMongoConnected && token) {
            try {
                const dbUser = await User_1.UserModel.findOne({
                    resetPasswordToken: token,
                    resetPasswordExpiry: { $gt: new Date() }
                }).maxTimeMS(2500).lean();
                if (dbUser)
                    return dbUser;
            }
            catch (err) {
                console.warn('[Database] MongoDB findUserByResetToken error:', err);
            }
        }
        const now = new Date();
        return this.data.users.find((u) => {
            if (u.resetPasswordToken === token) {
                if (!u.resetPasswordExpiry)
                    return true;
                const expiry = new Date(u.resetPasswordExpiry);
                return expiry > now;
            }
            return false;
        }) || null;
    }
    async createUser(user) {
        const cleanEmail = String(user.email).toLowerCase().trim();
        let mongoUser = null;
        if (db_1.isMongoConnected) {
            try {
                mongoUser = await User_1.UserModel.create({
                    ...user,
                    email: cleanEmail
                });
            }
            catch (err) {
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
    async updateUser(id, updates) {
        let updatedUser = null;
        if (db_1.isMongoConnected && id) {
            try {
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    updatedUser = await User_1.UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
                }
                else {
                    updatedUser = await User_1.UserModel.findOneAndUpdate({ email: id.toLowerCase() }, updates, { new: true }).lean();
                }
            }
            catch (err) {
                console.warn('[Database] MongoDB updateUser error:', err);
            }
        }
        const idx = this.data.users.findIndex((u) => u._id === id || u.id === id || u.email?.toLowerCase() === id?.toLowerCase());
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
            this.data.users.push(updatedUser);
            this.savePersistedUsers();
            return updatedUser;
        }
        return null;
    }
    async deleteUser(id) {
        let deletedMongo = false;
        if (db_1.isMongoConnected) {
            try {
                await User_1.UserModel.findByIdAndDelete(id);
                deletedMongo = true;
            }
            catch (err) {
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
    async getAllUsers(filter) {
        let usersList = [];
        if (db_1.isMongoConnected) {
            try {
                const query = {};
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
                usersList = await User_1.UserModel.find(query).sort({ createdAt: -1 }).lean();
                return usersList;
            }
            catch (err) {
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
            usersList = usersList.filter((u) => (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.department && u.department.toLowerCase().includes(q)));
        }
        return usersList;
    }
    async getUserStats() {
        let users = [];
        if (db_1.isMongoConnected) {
            try {
                users = await User_1.UserModel.find().lean();
            }
            catch (err) {
                users = this.data.users;
            }
        }
        else {
            users = this.data.users;
        }
        const totalUsers = users.length;
        let pendingUsers = 0;
        let approvedUsers = 0;
        let rejectedUsers = 0;
        let suspendedUsers = 0;
        users.forEach((u) => {
            const st = u.status || 'APPROVED';
            if (st === 'PENDING')
                pendingUsers++;
            else if (st === 'APPROVED')
                approvedUsers++;
            else if (st === 'REJECTED')
                rejectedUsers++;
            else if (st === 'SUSPENDED')
                suspendedUsers++;
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
        if (db_1.isMongoConnected) {
            return await Mine_1.MineModel.find().lean();
        }
        return this.data.mines;
    }
    async getMineById(mineId) {
        if (db_1.isMongoConnected) {
            return await Mine_1.MineModel.findOne({ mineId }).lean();
        }
        return this.data.mines.find((m) => m.mineId === mineId) || null;
    }
    async updateMine(mineId, updates) {
        if (db_1.isMongoConnected) {
            return await Mine_1.MineModel.findOneAndUpdate({ mineId }, updates, { new: true }).lean();
        }
        const idx = this.data.mines.findIndex((m) => m.mineId === mineId);
        if (idx !== -1) {
            this.data.mines[idx] = { ...this.data.mines[idx], ...updates, updatedAt: new Date() };
            return this.data.mines[idx];
        }
        return null;
    }
    // Boreholes / Drilling Logs
    async getBoreholes(mineId) {
        if (db_1.isMongoConnected) {
            const filter = mineId ? { mineId } : {};
            return await Borehole_1.BoreholeModel.find(filter).lean();
        }
        if (mineId) {
            return this.data.boreholes.filter((b) => b.mineId === mineId);
        }
        return this.data.boreholes;
    }
    async addBoreholes(newBoreholes) {
        if (db_1.isMongoConnected) {
            return await Borehole_1.BoreholeModel.insertMany(newBoreholes);
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
    async getProductionLogs(mineId, limit = 24) {
        if (db_1.isMongoConnected) {
            const filter = mineId ? { mineId } : {};
            return await ProductionLog_1.ProductionLogModel.find(filter).sort({ date: 1 }).limit(limit).lean();
        }
        let logs = [...this.data.productionLogs];
        if (mineId) {
            logs = logs.filter((p) => p.mineId === mineId);
        }
        logs.sort((a, b) => a.date.localeCompare(b.date));
        return logs.slice(-limit);
    }
    async addProductionLogs(logs) {
        if (db_1.isMongoConnected) {
            return await ProductionLog_1.ProductionLogModel.insertMany(logs);
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
    async getEquipment(mineId) {
        if (db_1.isMongoConnected) {
            const filter = mineId ? { mineId } : {};
            return await Equipment_1.EquipmentModel.find(filter).lean();
        }
        if (mineId) {
            return this.data.equipment.filter((e) => e.mineId === mineId);
        }
        return this.data.equipment;
    }
    async addEquipment(item) {
        if (db_1.isMongoConnected) {
            return await Equipment_1.EquipmentModel.create(item);
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
    async updateEquipment(code, updates) {
        if (db_1.isMongoConnected) {
            return await Equipment_1.EquipmentModel.findOneAndUpdate({ code }, updates, { new: true }).lean();
        }
        const idx = this.data.equipment.findIndex((e) => e.code === code);
        if (idx !== -1) {
            this.data.equipment[idx] = { ...this.data.equipment[idx], ...updates, updatedAt: new Date() };
            return this.data.equipment[idx];
        }
        return null;
    }
    async deleteEquipment(code) {
        if (db_1.isMongoConnected) {
            return await Equipment_1.EquipmentModel.findOneAndDelete({ code });
        }
        const idx = this.data.equipment.findIndex((e) => e.code === code);
        if (idx !== -1) {
            return this.data.equipment.splice(idx, 1)[0];
        }
        return null;
    }
    // Shortfall Risk
    async getShortfallRisks(mineId) {
        if (db_1.isMongoConnected) {
            const filter = mineId ? { mineId } : {};
            return await ShortfallRisk_1.ShortfallRiskModel.find(filter).lean();
        }
        if (mineId) {
            return this.data.shortfallRisks.filter((r) => r.mineId === mineId);
        }
        return this.data.shortfallRisks;
    }
    async updateShortfallRisk(mineId, riskData) {
        if (db_1.isMongoConnected) {
            return await ShortfallRisk_1.ShortfallRiskModel.findOneAndUpdate({ mineId }, riskData, { upsert: true, new: true }).lean();
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
    async getRecommendations(mineId, status) {
        if (db_1.isMongoConnected) {
            const filter = {};
            if (mineId)
                filter.mineId = mineId;
            if (status)
                filter.status = status;
            return await Recommendation_1.RecommendationModel.find(filter).sort({ createdAt: -1 }).lean();
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
    async updateRecommendationStatus(id, status, actionTakenBy, outcomeNote) {
        if (db_1.isMongoConnected) {
            return await Recommendation_1.RecommendationModel.findOneAndUpdate({ $or: [{ recommendationId: id }, { _id: id }] }, {
                status,
                actionTakenBy,
                actionTimestamp: new Date(),
                outcomeNote: outcomeNote || `Status changed to ${status} by ${actionTakenBy}`
            }, { new: true }).lean();
        }
        const idx = this.data.recommendations.findIndex((r) => r.recommendationId === id || r._id === id);
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
    async getSatelliteTelemetry(mineId) {
        if (db_1.isMongoConnected) {
            const filter = mineId ? { mineId } : {};
            return await SatelliteTelemetry_1.SatelliteTelemetryModel.find(filter).sort({ timestamp: -1 }).lean();
        }
        if (mineId) {
            return this.data.satelliteTelemetry.filter((s) => s.mineId === mineId);
        }
        return this.data.satelliteTelemetry;
    }
    async updateSatelliteTelemetry(mineId, telemetry) {
        if (db_1.isMongoConnected) {
            return await SatelliteTelemetry_1.SatelliteTelemetryModel.findOneAndUpdate({ mineId }, telemetry, { upsert: true, new: true }).lean();
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
exports.store = new InMemoryStore();
exports.memoryStore = exports.store;
exports.default = exports.store;
