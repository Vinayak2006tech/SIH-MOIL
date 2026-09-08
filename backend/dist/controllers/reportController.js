"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExecutiveReport = void 0;
const store_1 = require("../services/store");
const generateExecutiveReport = async (req, res) => {
    try {
        const { mineId } = req.query;
        const mines = await store_1.store.getAllMines();
        const targetMines = mineId ? mines.filter((m) => m.mineId === mineId) : mines;
        const equipment = await store_1.store.getEquipment();
        const recommendations = await store_1.store.getRecommendations(undefined, 'PENDING');
        const shortfallRisks = await store_1.store.getShortfallRisks();
        const report = {
            reportTitle: 'MOIL ReserveIQ - Executive Reserve & Production Risk Assessment',
            issuedBy: 'MOIL Exploration & Mine Planning Directorate',
            targetMinistry: 'Ministry of Steel, Government of India',
            generationTimestamp: new Date().toISOString(),
            executiveSummary: {
                totalTrackedMines: targetMines.length,
                totalReservesMillionTonnes: Math.round(targetMines.reduce((acc, m) => acc + (m.totalReservesMt || 0), 0) * 10) / 10,
                provedReservesMillionTonnes: Math.round(targetMines.reduce((acc, m) => acc + (m.provedReservesMt || 0), 0) * 10) / 10,
                monthlyTargetTonnes: targetMines.reduce((acc, m) => acc + (m.targetMonthlyTonnes || 0), 0),
                monthlyActualTonnes: targetMines.reduce((acc, m) => acc + (m.currentMonthlyProductionTonnes || 0), 0),
                totalRevenueAtRiskCrores: Math.round(shortfallRisks.reduce((acc, r) => acc + (r.estimatedRevenueRiskInrCrores || 0), 0) * 100) / 100,
                averageFleetHealthScore: Math.round(equipment.reduce((acc, e) => acc + (e.healthScorePct || 85), 0) / (equipment.length || 1))
            },
            mineBreakdown: targetMines.map((m) => {
                const risk = shortfallRisks.find((r) => r.mineId === m.mineId) || {};
                return {
                    mineId: m.mineId,
                    name: m.name,
                    code: m.code,
                    state: m.state,
                    district: m.district,
                    type: m.type,
                    reservesMt: m.totalReservesMt,
                    provedMt: m.provedReservesMt,
                    avgMnGradePct: m.avgMnGradePct,
                    monthlyTargetTonnes: m.targetMonthlyTonnes,
                    currentMonthlyTonnes: m.currentMonthlyProductionTonnes,
                    shortfallRiskLevel: m.currentShortfallRiskLevel,
                    shortfallProbabilityPct: m.currentShortfallProbabilityPct,
                    revenueRiskCrores: risk.estimatedRevenueRiskInrCrores || 0,
                    primaryBottleneck: risk.primaryBottleneck || 'Normal Operations',
                    satelliteStabilityScore: m.satelliteStabilityScore
                };
            }),
            urgentActionItems: recommendations.slice(0, 5).map((r) => ({
                id: r.recommendationId,
                mineName: r.mineName,
                title: r.title,
                category: r.category,
                urgency: r.urgency,
                expectedTonnageGain: r.expectedTonnageGain,
                estimatedRoiInrLakhs: r.estimatedRoiInrLakhs
            }))
        };
        return res.status(200).json({
            success: true,
            report
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.generateExecutiveReport = generateExecutiveReport;
