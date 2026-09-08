"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateShortfallRisk = exports.getShortfallRisks = void 0;
const store_1 = require("../services/store");
const mlClient_1 = require("../services/mlClient");
const getShortfallRisks = async (req, res) => {
    try {
        const { mineId } = req.query;
        const risks = await store_1.store.getShortfallRisks(mineId);
        return res.status(200).json({
            success: true,
            count: risks.length,
            risks
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getShortfallRisks = getShortfallRisks;
const simulateShortfallRisk = async (req, res) => {
    try {
        const { mineId, target_monthly_tonnes, equipment_uptime_pct, forecast_rainfall_mm, mean_time_between_failures_hrs, active_excavators, active_dumpers, grade_dilution_risk_pct } = req.body;
        const mine = await store_1.store.getMineById(mineId || 'mine-balaghat-01');
        const mineName = mine ? mine.name : 'MOIL Mining Complex';
        const recentLogs = await store_1.store.getProductionLogs(mine ? mine.mineId : undefined, 6);
        const histProd = recentLogs.map((l) => ({
            month: l.date,
            target_tonnes: l.targetTonnes,
            actual_tonnes: l.actualTonnes,
            equipment_uptime_pct: l.equipmentUptimePct,
            rainfall_mm: l.rainfallMm,
            blasting_cycles: l.blastingShiftsCount,
            unplanned_downtime_hours: (l.downtimeHours?.equipmentFailureHours || 30)
        }));
        const payload = {
            mine_id: mine ? mine.mineId : 'mine-balaghat-01',
            mine_name: mineName,
            target_monthly_tonnes: target_monthly_tonnes || (mine ? mine.targetMonthlyTonnes : 45000),
            current_equipment_uptime_pct: equipment_uptime_pct !== undefined ? equipment_uptime_pct : (mine ? mine.equipmentUptimePct : 75),
            mean_time_between_failures_hrs: mean_time_between_failures_hrs || 115.0,
            forecast_rainfall_next_30d_mm: forecast_rainfall_mm !== undefined ? forecast_rainfall_mm : 140.0,
            historical_production: histProd,
            active_excavator_count: active_excavators || 6,
            active_dumper_count: active_dumpers || 14,
            planned_blasting_shifts: 22,
            grade_dilution_risk_pct: grade_dilution_risk_pct || 8.0
        };
        const simulationResult = await mlClient_1.mlClient.predictShortfall(payload);
        const recResult = await mlClient_1.mlClient.getRecommendations(payload);
        return res.status(200).json({
            success: true,
            simulation: simulationResult,
            prescriptiveActions: recResult
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.simulateShortfallRisk = simulateShortfallRisk;
