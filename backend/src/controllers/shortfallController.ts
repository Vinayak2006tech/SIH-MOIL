import { Request, Response } from 'express';
import { store } from '../services/store';
import { mlClient } from '../services/mlClient';

export const getShortfallRisks = async (req: Request, res: Response) => {
  try {
    const { mineId } = req.query;
    const risks = await store.getShortfallRisks(mineId as string);

    return res.status(200).json({
      success: true,
      count: risks.length,
      risks
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const simulateShortfallRisk = async (req: Request, res: Response) => {
  try {
    const {
      mineId,
      target_monthly_tonnes,
      equipment_uptime_pct,
      forecast_rainfall_mm,
      mean_time_between_failures_hrs,
      active_excavators,
      active_dumpers,
      grade_dilution_risk_pct
    } = req.body;

    const mine: any = await store.getMineById(mineId || 'mine-balaghat-01');
    const mineName = mine ? mine.name : 'MOIL Mining Complex';

    const recentLogs = await store.getProductionLogs(mine ? mine.mineId : undefined, 6);
    const histProd = recentLogs.map((l: any) => ({
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

    const simulationResult = await mlClient.predictShortfall(payload);
    const recResult = await mlClient.getRecommendations(payload);

    return res.status(200).json({
      success: true,
      simulation: simulationResult,
      prescriptiveActions: recResult
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
