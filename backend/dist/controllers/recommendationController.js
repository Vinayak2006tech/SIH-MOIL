"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbackLoopHistory = exports.updateRecommendationStatus = exports.getRecommendations = void 0;
const store_1 = require("../services/store");
const getRecommendations = async (req, res) => {
    try {
        const { mineId, status } = req.query;
        const recommendations = await store_1.store.getRecommendations(mineId, status);
        return res.status(200).json({
            success: true,
            count: recommendations.length,
            recommendations
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getRecommendations = getRecommendations;
const updateRecommendationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, outcomeNote, realizedTonnageGain } = req.body;
        if (!['PENDING', 'ACCEPTED', 'REJECTED', 'SNOOZED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status provided.' });
        }
        const userName = req.user ? `${req.user.name} (${req.user.role})` : 'Mine Planner Operator';
        const updated = await store_1.store.updateRecommendationStatus(id, status, userName, outcomeNote);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Recommendation not found.' });
        }
        // If accepted and realized gain provided, record realized outcome
        if (status === 'ACCEPTED' && realizedTonnageGain) {
            updated.realizedTonnageGain = realizedTonnageGain;
            updated.realizedRiskReductionPct = updated.expectedRiskReductionPct;
        }
        return res.status(200).json({
            success: true,
            message: `Recommendation status successfully updated to ${status}`,
            recommendation: updated
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateRecommendationStatus = updateRecommendationStatus;
const getFeedbackLoopHistory = async (req, res) => {
    try {
        const allRecs = await store_1.store.getRecommendations();
        const actionedRecs = allRecs.filter((r) => r.status === 'ACCEPTED' || r.status === 'REJECTED');
        const totalActions = actionedRecs.length || 1;
        const acceptedCount = actionedRecs.filter((r) => r.status === 'ACCEPTED').length;
        const totalRealizedTonnage = actionedRecs.reduce((acc, r) => acc + (r.realizedTonnageGain || r.expectedTonnageGain || 0), 0);
        const avgRiskMitigatedPct = Math.round(actionedRecs.reduce((acc, r) => acc + (r.realizedRiskReductionPct || r.expectedRiskReductionPct || 0), 0) / totalActions);
        return res.status(200).json({
            success: true,
            metrics: {
                totalEvaluated: totalActions,
                acceptanceRatePct: Math.round((acceptedCount / totalActions) * 100),
                totalRealizedTonnageGain: totalRealizedTonnage,
                avgRiskMitigatedPct,
                roiRealizedInrLakhs: Math.round(totalRealizedTonnage * 0.0125)
            },
            feedbackLog: actionedRecs
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getFeedbackLoopHistory = getFeedbackLoopHistory;
