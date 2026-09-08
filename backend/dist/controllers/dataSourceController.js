"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSourceById = exports.getDataSources = void 0;
const DataSource_1 = __importDefault(require("../models/DataSource"));
const store_1 = require("../services/store");
const getDataSources = async (req, res) => {
    try {
        const { dataType, isSynthetic } = req.query;
        if (store_1.memoryStore.isMemoryMode) {
            let sources = store_1.memoryStore.getDataSources();
            if (dataType) {
                sources = sources.filter((s) => s.dataType === dataType);
            }
            if (isSynthetic !== undefined) {
                const synBool = isSynthetic === 'true';
                sources = sources.filter((s) => s.isSynthetic === synBool);
            }
            res.status(200).json({
                success: true,
                count: sources.length,
                dataSources: sources
            });
            return;
        }
        const filter = {};
        if (dataType)
            filter.dataType = dataType;
        if (isSynthetic !== undefined)
            filter.isSynthetic = isSynthetic === 'true';
        const sources = await DataSource_1.default.find(filter).sort({ isSynthetic: 1, sourceName: 1 });
        res.status(200).json({
            success: true,
            count: sources.length,
            dataSources: sources
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDataSources = getDataSources;
const getDataSourceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (store_1.memoryStore.isMemoryMode) {
            const source = store_1.memoryStore.getDataSources().find((s) => s.sourceId === id);
            if (!source) {
                res.status(404).json({ success: false, message: `Data source ${id} not found` });
                return;
            }
            res.status(200).json({ success: true, dataSource: source });
            return;
        }
        const source = await DataSource_1.default.findOne({ sourceId: id });
        if (!source) {
            res.status(404).json({ success: false, message: `Data source ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, dataSource: source });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDataSourceById = getDataSourceById;
