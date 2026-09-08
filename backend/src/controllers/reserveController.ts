import { Request, Response } from 'express';
import { store } from '../services/store';
import { mlClient } from '../services/mlClient';

export const calculateReserveEstimate = async (req: Request, res: Response) => {
  try {
    const { mineId, area_sqkm, geology, satellite } = req.body;

    const mine: any = await store.getMineById(mineId);
    const mineName = mine ? mine.name : 'MOIL Mining Lease';

    const defaultGeology = {
      seam_depth_m: mine ? mine.depthMeters : 220.0,
      seam_thickness_m: 12.5,
      mn_grade_pct: mine ? mine.avgMnGradePct : 44.0,
      fe_grade_pct: mine ? mine.avgFeGradePct : 6.2,
      sio2_grade_pct: mine ? mine.avgSiO2GradePct : 7.8,
      p_grade_pct: 0.16,
      rock_hardness_rqd: 80.0,
      borehole_density_per_sqkm: 12.0,
      core_recovery_pct: 88.0
    };

    const defaultSatellite = {
      ndvi_index: 0.35,
      soil_moisture_pct: 30.0,
      rainfall_anomaly_mm: 20.0,
      land_surface_temp_c: 32.5,
      elevation_m: 310.0
    };

    const payload = {
      mine_id: mineId,
      mine_name: mineName,
      zone_id: req.body.zone_id || `zone-${mineId}-main`,
      area_sqkm: area_sqkm || (mine ? mine.leaseAreaSqKm : 2.5),
      geology: { ...defaultGeology, ...(geology || {}) },
      satellite: { ...defaultSatellite, ...(satellite || {}) }
    };

    const mlResponse = await mlClient.estimateReserves(payload);

    return res.status(200).json({
      success: true,
      data: mlResponse
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBoreholes = async (req: Request, res: Response) => {
  try {
    const { mineId } = req.query;
    const boreholes = await store.getBoreholes(mineId as string);

    return res.status(200).json({
      success: true,
      count: boreholes.length,
      boreholes
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOreGradeDistribution = async (req: Request, res: Response) => {
  try {
    const { mineId } = req.query;
    const boreholes = await store.getBoreholes(mineId as string);

    let highGradeCount = 0; // >= 44% Mn
    let mediumGradeCount = 0; // 35 - 43.9%
    let lowGradeCount = 0; // 25 - 34.9%
    let siliceousCount = 0; // < 25%

    boreholes.forEach((bh: any) => {
      const mn = bh.avgMnGradePct || 40;
      if (mn >= 44) highGradeCount++;
      else if (mn >= 35) mediumGradeCount++;
      else if (mn >= 25) lowGradeCount++;
      else siliceousCount++;
    });

    const total = boreholes.length || 1;
    const distribution = [
      { grade: 'High Grade Ferro-Mn (>=44% Mn)', count: highGradeCount, percentage: Math.round((highGradeCount / total) * 100) },
      { grade: 'Medium Grade Silico-Mn (35-44% Mn)', count: mediumGradeCount, percentage: Math.round((mediumGradeCount / total) * 100) },
      { grade: 'Low Grade / Ferruginous (25-35% Mn)', count: lowGradeCount, percentage: Math.round((lowGradeCount / total) * 100) },
      { grade: 'Siliceous / Low Grade (<25% Mn)', count: siliceousCount, percentage: Math.round((siliceousCount / total) * 100) }
    ];

    return res.status(200).json({
      success: true,
      totalBoreholes: total,
      distribution
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
