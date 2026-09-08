"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoilVsGlobalPeers = exports.getDeepSeaNodules = exports.getGlobalPricing = exports.getGlobalTradeFlows = exports.getGlobalReserves = exports.getGlobalMarketOverview = void 0;
const store_1 = require("../services/store");
const getGlobalMarketOverview = async (req, res) => {
    try {
        const marketData = store_1.store.getGlobalMarketData();
        return res.status(200).json({
            success: true,
            data: marketData
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGlobalMarketOverview = getGlobalMarketOverview;
const getGlobalReserves = async (req, res) => {
    try {
        const countryReserves = store_1.store.getGlobalReserves();
        const marketData = store_1.store.getGlobalMarketData();
        return res.status(200).json({
            success: true,
            count: countryReserves.length,
            sourceMetadata: marketData.sourceMetadata,
            countryReserves
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGlobalReserves = getGlobalReserves;
const getGlobalTradeFlows = async (req, res) => {
    try {
        const tradeFlows = store_1.store.getGlobalTradeFlows();
        return res.status(200).json({
            success: true,
            tradeFlows,
            sourceMetadata: {
                sourceId: 'src-imni-global-market',
                sourceName: 'International Manganese Institute (IMnI) & World Steel Association',
                sourceUrl: 'https://www.manganese.org/market-research',
                dataType: 'PUBLIC_GOVERNMENT',
                isSynthetic: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGlobalTradeFlows = getGlobalTradeFlows;
const getGlobalPricing = async (req, res) => {
    try {
        const pricing = store_1.store.getGlobalPricingBenchmarks();
        return res.status(200).json({
            success: true,
            pricing,
            sourceMetadata: {
                sourceId: 'src-imni-global-market',
                sourceName: 'Fastmarkets & Platts Manganese Seaborne Index',
                dataType: 'PUBLIC_GOVERNMENT',
                isSynthetic: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGlobalPricing = getGlobalPricing;
const getDeepSeaNodules = async (req, res) => {
    try {
        const deepSea = store_1.store.getDeepSeaNodules();
        return res.status(200).json({
            success: true,
            deepSeaNodules: deepSea,
            sourceMetadata: {
                sourceId: 'src-moes-isa-deepsea',
                sourceName: 'International Seabed Authority (ISA) & Ministry of Earth Sciences (MoES)',
                sourceUrl: 'https://www.isa.org.jm/exploration-contracts/polymetallic-nodules/',
                dataType: 'PUBLIC_GOVERNMENT',
                isSynthetic: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDeepSeaNodules = getDeepSeaNodules;
const getMoilVsGlobalPeers = async (req, res) => {
    try {
        const peers = store_1.store.getMoilVsGlobalPeers();
        return res.status(200).json({
            success: true,
            peers,
            sourceMetadata: {
                sourceId: 'src-usgs-manganese-2024',
                sourceName: 'USGS Mineral Commodity Summaries & Corporate Annual Reports',
                dataType: 'PUBLIC_GOVERNMENT',
                isSynthetic: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMoilVsGlobalPeers = getMoilVsGlobalPeers;
