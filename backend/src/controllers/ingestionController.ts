import { Request, Response } from 'express';
import { store } from '../services/store';
import { parseCsvBuffer } from '../services/csvParser';
import { mlClient } from '../services/mlClient';

// Flexible key resolver for case-insensitive and variation-tolerant CSV column matching
const getVal = (row: any, ...keys: string[]): string | undefined => {
  if (!row || typeof row !== 'object') return undefined;

  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
    const cleanTarget = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const rowKey of Object.keys(row)) {
      const cleanRowKey = rowKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanRowKey === cleanTarget) {
        if (row[rowKey] !== undefined && row[rowKey] !== null && String(row[rowKey]).trim() !== '') {
          return String(row[rowKey]).trim();
        }
      }
    }
  }
  return undefined;
};

export const uploadDrillingLogsCsv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
    }

    const rows = await parseCsvBuffer(req.file.buffer);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'CSV file is empty or formatted incorrectly.' });
    }

    const parsedBoreholes: any[] = [];
    const targetMineId = req.body.mineId || 'mine-balaghat-01';
    const mine: any = await store.getMineById(targetMineId);
    const mineName = mine ? mine.name : 'Balaghat Underground Mine';

    const sourceName = req.body.sourceName || 'Exploration Drilling Logs';
    const sourceUrl = req.body.sourceUrl || 'local://uploaded-file';
    const isSynthetic = req.body.isSynthetic !== undefined ? req.body.isSynthetic === 'true' : true;
    const dataType = req.body.dataType || (isSynthetic ? 'SYNTHETIC_DEMO' : 'OFFICIAL_MOIL');

    for (const [idx, row] of rows.entries()) {
      const bhId = getVal(row, 'boreholeId', 'borehole_id', 'borehole', 'id', 'bhId', 'bh_id', 'hole_id') || `BH-INGEST-${Date.now()}-${idx + 1}`;
      const lat = parseFloat(getVal(row, 'collarLatitude', 'latitude', 'lat', 'collar_lat', 'y') || '21.805');
      const lng = parseFloat(getVal(row, 'collarLongitude', 'longitude', 'lng', 'lon', 'long', 'collar_long', 'x') || '80.185');
      const depth = parseFloat(getVal(row, 'totalDepthMeters', 'total_depth', 'depth', 'totaldepth', 'depth_m') || '240');
      const intercept = parseFloat(getVal(row, 'seamInterceptDepthMeters', 'seam_intercept', 'intercept', 'seam_depth', 'intercept_m') || '160');
      const thickness = parseFloat(getVal(row, 'seamThicknessMeters', 'seam_thickness', 'thickness', 'thickness_m', 'seam_m') || '12.5');
      const mn = parseFloat(getVal(row, 'avgMnGradePct', 'mn_grade', 'mnGrade', 'mn_pct', 'mn', 'manganese', 'grade') || '44.5');
      const fe = parseFloat(getVal(row, 'avgFeGradePct', 'fe_grade', 'feGrade', 'fe_pct', 'fe', 'iron') || '6.0');
      const sio2 = parseFloat(getVal(row, 'avgSiO2GradePct', 'sio2_grade', 'sio2Grade', 'sio2_pct', 'sio2', 'silica') || '7.5');
      const recovery = parseFloat(getVal(row, 'coreRecoveryPct', 'core_recovery', 'recovery', 'recovery_pct', 'corerecovery') || '88.0');
      const rqd = parseFloat(getVal(row, 'rqdPct', 'rqd', 'rqd_pct', 'rock_quality') || '82.0');
      const elevation = parseFloat(getVal(row, 'elevationMeters', 'elevation', 'elev', 'altitude') || '320');
      const phosphorus = parseFloat(getVal(row, 'avgPGradePct', 'p_grade', 'p', 'phosphorus') || '0.15');
      const formation = getVal(row, 'rockFormation', 'formation', 'lithology', 'rock') || 'Mansar Formation Manganese Horizon';
      const drillingYear = parseInt(getVal(row, 'drillingYear', 'year', 'drilled_year') || '2026', 10);
      const rigType = getVal(row, 'drillRigType', 'rig_type', 'rig', 'drill_rig') || 'Diamond Core Drill';

      parsedBoreholes.push({
        boreholeId: bhId,
        mineId: targetMineId,
        mineName,
        collarLatitude: isNaN(lat) ? 21.805 : lat,
        collarLongitude: isNaN(lng) ? 80.185 : lng,
        elevationMeters: isNaN(elevation) ? 320 : elevation,
        totalDepthMeters: isNaN(depth) ? 240 : depth,
        seamInterceptDepthMeters: isNaN(intercept) ? 160 : intercept,
        seamThicknessMeters: isNaN(thickness) ? 12.5 : thickness,
        avgMnGradePct: isNaN(mn) ? 44.5 : mn,
        avgFeGradePct: isNaN(fe) ? 6.0 : fe,
        avgSiO2GradePct: isNaN(sio2) ? 7.5 : sio2,
        avgPGradePct: isNaN(phosphorus) ? 0.15 : phosphorus,
        coreRecoveryPct: isNaN(recovery) ? 88.0 : recovery,
        rqdPct: isNaN(rqd) ? 82.0 : rqd,
        rockFormation: formation,
        drillingYear: isNaN(drillingYear) ? 2026 : drillingYear,
        drillRigType: rigType,
        sourceId: getVal(row, 'sourceId') || (isSynthetic ? 'src-synthetic-boreholes' : 'src-moil-exploration'),
        sourceName: getVal(row, 'sourceName') || sourceName,
        sourceUrl: getVal(row, 'sourceUrl') || sourceUrl,
        dataType: getVal(row, 'dataType') || dataType,
        isSynthetic: getVal(row, 'isSynthetic') !== undefined ? String(getVal(row, 'isSynthetic')).toLowerCase() === 'true' : isSynthetic
      });
    }

    await store.addBoreholes(parsedBoreholes);

    return res.status(200).json({
      success: true,
      message: `Successfully parsed and ingested ${parsedBoreholes.length} drilling borehole logs for ${mineName}`,
      count: parsedBoreholes.length,
      sampleRecords: parsedBoreholes.slice(0, 5)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `CSV Ingestion Error: ${error.message}` });
  }
};

export const uploadProductionRecordsCsv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
    }

    const rows = await parseCsvBuffer(req.file.buffer);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'CSV file is empty or formatted incorrectly.' });
    }

    const parsedLogs: any[] = [];
    const targetMineId = req.body.mineId || 'mine-balaghat-01';
    const mine: any = await store.getMineById(targetMineId);
    const mineName = mine ? mine.name : 'Balaghat Underground Mine';

    const sourceName = req.body.sourceName || 'MOIL Production Disclosures';
    const sourceUrl = req.body.sourceUrl || 'https://www.moil.nic.in/annual-reports';
    const isSynthetic = req.body.isSynthetic !== undefined ? req.body.isSynthetic === 'true' : false;
    const dataType = req.body.dataType || (isSynthetic ? 'SYNTHETIC_DEMO' : 'OFFICIAL_MOIL');

    for (const row of rows) {
      const date = getVal(row, 'date', 'month', 'period', 'time') || '2026-03';
      const target = parseFloat(getVal(row, 'targetTonnes', 'target', 'target_tonnes', 'planned') || '45000');
      const actual = parseFloat(getVal(row, 'actualTonnes', 'actual', 'actual_tonnes', 'extracted') || '42000');
      const sales = parseFloat(getVal(row, 'salesTonnes', 'sales', 'dispatched_tonnes') || String(Math.round((isNaN(actual) ? 42000 : actual) * 0.88)));
      const variance = (isNaN(actual) ? 42000 : actual) - (isNaN(target) ? 45000 : target);
      const compliance = Math.round(((isNaN(actual) ? 42000 : actual) / Math.max(1, isNaN(target) ? 45000 : target)) * 1000) / 10;
      const uptime = parseFloat(getVal(row, 'equipmentUptimePct', 'uptime', 'uptime_pct', 'availability') || '80.0');
      const rain = parseFloat(getVal(row, 'rainfallMm', 'rainfall', 'rain_mm', 'precipitation') || '15.0');
      const mn = parseFloat(getVal(row, 'avgMnGradePct', 'grade', 'mn_grade', 'mn') || '45.0');

      parsedLogs.push({
        mineId: targetMineId,
        mineName,
        date,
        financialYear: getVal(row, 'financialYear', 'fy', 'year') || 'FY26',
        targetTonnes: isNaN(target) ? 45000 : target,
        actualTonnes: isNaN(actual) ? 42000 : actual,
        salesTonnes: isNaN(sales) ? 37000 : sales,
        varianceTonnes: variance,
        compliancePct: compliance,
        avgMnGradePct: isNaN(mn) ? 45.0 : mn,
        equipmentUptimePct: isNaN(uptime) ? 80.0 : uptime,
        rainfallMm: isNaN(rain) ? 15.0 : rain,
        blastingShiftsCount: parseInt(getVal(row, 'blastingShifts', 'blasting_shifts') || '22', 10),
        downtimeHours: {
          equipmentFailureHours: parseFloat(getVal(row, 'eqDowntime', 'equipment_downtime', 'failure_hours') || '24'),
          monsoonWeatherHours: parseFloat(getVal(row, 'weatherDowntime', 'weather_downtime', 'monsoon_hours') || '8'),
          blastingDelayHours: parseFloat(getVal(row, 'blastingDowntime', 'blasting_downtime') || '6'),
          logisticsHaulageHours: parseFloat(getVal(row, 'logisticsDowntime', 'haulage_downtime') || '10'),
          powerOutageHours: parseFloat(getVal(row, 'powerDowntime', 'grid_downtime') || '4')
        },
        sourceId: getVal(row, 'sourceId') || (isSynthetic ? 'src-synthetic-equipment' : 'src-moil-ar-2025'),
        sourceName: getVal(row, 'sourceName') || sourceName,
        sourceUrl: getVal(row, 'sourceUrl') || sourceUrl,
        dataType: getVal(row, 'dataType') || dataType,
        isSynthetic: getVal(row, 'isSynthetic') !== undefined ? String(getVal(row, 'isSynthetic')).toLowerCase() === 'true' : isSynthetic
      });
    }

    await store.addProductionLogs(parsedLogs);

    return res.status(200).json({
      success: true,
      message: `Successfully parsed and ingested ${parsedLogs.length} monthly production records for ${mineName}`,
      count: parsedLogs.length,
      sampleRecords: parsedLogs.slice(0, 5)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `Production Ingestion Error: ${error.message}` });
  }
};

export const triggerSatelliteSync = async (req: Request, res: Response) => {
  try {
    const { mineId, sensor } = req.body;
    const targetMineId = mineId || 'mine-balaghat-01';

    const mine: any = await store.getMineById(targetMineId);
    if (!mine) {
      return res.status(404).json({ success: false, message: 'Mine not found' });
    }

    const satPayload = {
      mine_id: targetMineId,
      latitude: mine.latitude,
      longitude: mine.longitude,
      satellite_sensor: sensor || 'Copernicus Sentinel-2 MSI / NASA MODIS Terra'
    };

    const satResult = await mlClient.processSatellitePass(satPayload);

    // Save telemetry to store
    await store.updateSatelliteTelemetry(targetMineId, {
      mineName: mine.name,
      sensor: satResult.sensor,
      ndvi: satResult.ndvi,
      soilMoisturePct: satResult.soil_moisture_pct,
      rainfallMm: satResult.precipitation_rate_mm,
      landSurfaceTempCelsius: satResult.land_surface_temp_c,
      cloudCoverPct: satResult.cloud_cover_pct,
      slopeStabilityStatus:
        satResult.soil_moisture_pct > 40 ? 'ALERT' : satResult.soil_moisture_pct > 30 ? 'ADVISORY' : 'SAFE',
      recommendedBlastingWindow: satResult.recommended_blasting_window,
      sourceId: 'src-copernicus-sentinel2',
      sourceName: 'ESA Copernicus Sentinel-2 MSI & NASA MODIS Terra',
      sourceUrl: 'https://browser.dataspace.copernicus.eu/',
      dataType: 'PUBLIC_SATELLITE',
      isSynthetic: false
    });

    // Update mine satellite stability score
    const newScore = Math.round(100 - (satResult.soil_moisture_pct * 0.4 + satResult.precipitation_rate_mm * 0.3));
    await store.updateMine(targetMineId, {
      satelliteStabilityScore: Math.max(45, Math.min(95, newScore))
    });

    return res.status(200).json({
      success: true,
      message: `Latest satellite orbit pass synchronized for ${mine.name}`,
      telemetry: satResult
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
