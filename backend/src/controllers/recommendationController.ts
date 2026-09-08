import { Request, Response } from 'express';
import { store } from '../services/store';
import { AuthRequest } from '../middleware/auth';

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { mineId, status } = req.query;
    const recommendations = await store.getRecommendations(
      mineId as string,
      status as string
    );

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRecommendationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, outcomeNote, realizedTonnageGain } = req.body;

    if (!['PENDING', 'ACCEPTED', 'REJECTED', 'SNOOZED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const userName = req.user ? `${req.user.name} (${req.user.role})` : 'Mine Planner Operator';
    const updated = await store.updateRecommendationStatus(id, status, userName, outcomeNote);

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedbackLoopHistory = async (req: Request, res: Response) => {
  try {
    const allRecs = await store.getRecommendations();
    const actionedRecs = allRecs.filter((r) => r.status === 'ACCEPTED' || r.status === 'REJECTED');

    const totalActions = actionedRecs.length || 1;
    const acceptedCount = actionedRecs.filter((r) => r.status === 'ACCEPTED').length;
    const totalRealizedTonnage = actionedRecs.reduce((acc, r) => acc + (r.realizedTonnageGain || r.expectedTonnageGain || 0), 0);
    const avgRiskMitigatedPct = Math.round(
      actionedRecs.reduce((acc, r) => acc + (r.realizedRiskReductionPct || r.expectedRiskReductionPct || 0), 0) / totalActions
    );

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
