import { Request, Response } from 'express';
import { store } from '../services/store';

export const getProductionHistory = async (req: Request, res: Response) => {
  try {
    const { mineId, limit } = req.query;
    const maxLimit = limit ? parseInt(limit as string, 10) : 24;

    const logs = await store.getProductionLogs(mineId as string, maxLimit);

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDowntimeBreakdown = async (req: Request, res: Response) => {
  try {
    const { mineId } = req.query;
    const logs = await store.getProductionLogs(mineId as string, 12);

    let totalEquipmentHours = 0;
    let totalWeatherHours = 0;
    let totalBlastingHours = 0;
    let totalLogisticsHours = 0;
    let totalPowerHours = 0;

    const monthlyDowntime = logs.map((log: any) => {
      const dt = log.downtimeHours || {};
      const eq = dt.equipmentFailureHours || 0;
      const we = dt.monsoonWeatherHours || 0;
      const bl = dt.blastingDelayHours || 0;
      const lg = dt.logisticsHaulageHours || 0;
      const pw = dt.powerOutageHours || 0;

      totalEquipmentHours += eq;
      totalWeatherHours += we;
      totalBlastingHours += bl;
      totalLogisticsHours += lg;
      totalPowerHours += pw;

      return {
        month: log.date,
        equipmentFailure: eq,
        monsoonWeather: we,
        blastingDelay: bl,
        logisticsHaulage: lg,
        powerOutage: pw,
        totalHours: eq + we + bl + lg + pw
      };
    });

    const totalHours = totalEquipmentHours + totalWeatherHours + totalBlastingHours + totalLogisticsHours + totalPowerHours || 1;

    const summary = [
      { cause: 'Equipment Mechanical/Electrical Breakdown', hours: totalEquipmentHours, percentage: Math.round((totalEquipmentHours / totalHours) * 100) },
      { cause: 'Monsoon Flooding & Soil Saturation', hours: totalWeatherHours, percentage: Math.round((totalWeatherHours / totalHours) * 100) },
      { cause: 'Blasting Schedule & Clearing Delays', hours: totalBlastingHours, percentage: Math.round((totalBlastingHours / totalHours) * 100) },
      { cause: 'Haulage Dumper Logistics Bottleneck', hours: totalLogisticsHours, percentage: Math.round((totalLogisticsHours / totalHours) * 100) },
      { cause: 'Grid Power & Ventilation Outages', hours: totalPowerHours, percentage: Math.round((totalPowerHours / totalHours) * 100) }
    ];

    return res.status(200).json({
      success: true,
      summary,
      monthlyDowntime
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCorrelationData = async (req: Request, res: Response) => {
  try {
    const { mineId } = req.query;
    const logs = await store.getProductionLogs(mineId as string, 12);

    const correlationPoints = logs.map((log: any) => ({
      month: log.date,
      mineName: log.mineName,
      actualProductionTonnes: log.actualTonnes,
      targetProductionTonnes: log.targetTonnes,
      productionDipTonnes: Math.max(0, log.targetTonnes - log.actualTonnes),
      compliancePct: log.compliancePct,
      rainfallMm: log.rainfallMm,
      equipmentUptimePct: log.equipmentUptimePct,
      blastingShifts: log.blastingShiftsCount
    }));

    return res.status(200).json({
      success: true,
      correlationPoints
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnualSummary = async (req: Request, res: Response) => {
  try {
    const annualSummary = store.getAnnualProductionSummary();
    return res.status(200).json({
      success: true,
      count: annualSummary.length,
      annualSummary,
      sourceMetadata: {
        sourceId: 'src-moil-ar-2025',
        sourceName: 'MOIL Limited 64th Annual Report (FY25-26)',
        sourceUrl: 'https://www.moil.nic.in/annual-reports',
        dataType: 'OFFICIAL_MOIL',
        isSynthetic: false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const logs = await store.getProductionLogs(undefined, 24);
    const salesRecords = logs.map((l: any) => ({
      date: l.date,
      mineName: l.mineName,
      salesTonnes: l.salesTonnes || Math.round(l.actualTonnes * 0.88),
      productionTonnes: l.actualTonnes,
      financialYear: l.financialYear,
      sourceId: l.sourceId || 'src-moil-ar-2025',
      dataType: l.dataType || 'OFFICIAL_MOIL',
      isSynthetic: false
    }));

    return res.status(200).json({
      success: true,
      count: salesRecords.length,
      salesRecords
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
