import type {
  User,
  Mine,
  MineZone,
  Borehole,
  ProductionLog,
  AnnualProductionRecord,
  Equipment,
  ShortfallRisk,
  Recommendation,
  DashboardSummary,
  DataSource,
  ExplorationBlock,
  Facility
} from '../types';

export const MOCK_USERS: User[] = [
  {
    _id: 'usr-admin-01',
    id: 'usr-admin-01',
    name: 'Vinayak Vaishay',
    email: 'vaishayvinayak@gmail.com',
    role: 'ADMIN',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Executive Directorate of Mining & Exploration',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-planner-01',
    id: 'usr-planner-01',
    name: 'Vipin Kulkarni',
    email: 'planner@balaghat.moil.gov.in',
    role: 'MINE_PLANNER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Balaghat Planning Division',
    mineAccess: ['mine-balaghat-01', 'mine-dongri-02', 'mine-kandri-03'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-viewer-01',
    id: 'usr-viewer-01',
    name: 'Ananya Deshmukh',
    email: 'auditor@steel.gov.in',
    role: 'VIEWER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Ministry of Steel (Govt. of India) - Oversight Cell',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-1788865377696',
    id: 'usr-1788865377696',
    name: 'Suresh Patil',
    email: 'suresh.patil@moil.gov.in',
    role: 'MINE_PLANNER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Gumgaon Mining Unit',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-1788881915793',
    id: 'usr-1788881915793',
    name: 'Ramesh Sharma',
    email: 'member.new1788881915639@moil.gov.in',
    role: 'MINE_PLANNER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Balaghat Core Drill Division',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-1788882609770',
    id: 'usr-1788882609770',
    name: 'Vineet Sharma',
    email: 'vvaishay9@gmail.com',
    role: 'MINE_PLANNER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Mine Planning & Geology',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-1788885308328',
    id: 'usr-1788885308328',
    name: 'Priyanshi Pant',
    email: 'priyanshipant1610@gmail.com',
    role: 'VIEWER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Ministry of Steel (Govt. of India)',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  },
  {
    _id: 'usr-1788887369750',
    id: 'usr-1788887369750',
    name: 'Naitak Chaurasia',
    email: 'naitikchaurasia3820@gmail.com',
    role: 'VIEWER',
    status: 'APPROVED',
    emailVerified: true,
    department: 'Mineral Oversight Cell',
    mineAccess: ['ALL'],
    isGoogleAuth: false
  }
];

export const MOCK_MINES: Mine[] = [
  {
    mineId: 'mine-balaghat-01',
    name: 'Balaghat Underground Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    leaseAreaHectares: 180.5,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 52000,
    currentMonthlyProductionTonnes: 47800,
    currentMonthlyCapacityTonnes: 52000,
    currentShortfallRiskLevel: 'HIGH',
    currentShortfallProbabilityPct: 68.5,
    equipmentUptimePct: 84.0,
    activeEquipmentCount: 12,
    depthMeters: 380,
    geologicalConfidencePct: 92.0,
    satelliteStabilityScore: 89.0,
    provedReservesMt: 12.8,
    probableReservesMt: 6.4,
    totalReservesMt: 19.2,
    avgMnGradePct: 46.5,
    coordinates: { lat: 21.8125, lng: 80.1812 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-dongri-02',
    name: 'Dongri Buzurg Opencast Mine',
    state: 'Maharashtra',
    district: 'Bhandara',
    leaseAreaHectares: 142.0,
    type: 'Opencast',
    status: 'Operational',
    targetMonthlyTonnes: 42000,
    currentMonthlyProductionTonnes: 40800,
    currentMonthlyCapacityTonnes: 42000,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 18.0,
    equipmentUptimePct: 88.5,
    activeEquipmentCount: 14,
    depthMeters: 95,
    geologicalConfidencePct: 94.0,
    satelliteStabilityScore: 76.0,
    provedReservesMt: 9.6,
    probableReservesMt: 4.8,
    totalReservesMt: 14.4,
    avgMnGradePct: 42.0,
    coordinates: { lat: 21.5312, lng: 79.6845 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-kandri-03',
    name: 'Kandri Manganese Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    leaseAreaHectares: 98.4,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 25000,
    currentMonthlyProductionTonnes: 21500,
    currentMonthlyCapacityTonnes: 25000,
    currentShortfallRiskLevel: 'CRITICAL',
    currentShortfallProbabilityPct: 76.0,
    equipmentUptimePct: 64.0,
    activeEquipmentCount: 8,
    depthMeters: 310,
    geologicalConfidencePct: 88.0,
    satelliteStabilityScore: 82.0,
    provedReservesMt: 5.4,
    probableReservesMt: 3.2,
    totalReservesMt: 8.6,
    avgMnGradePct: 44.8,
    coordinates: { lat: 21.4312, lng: 79.2812 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-mansar-04',
    name: 'Mansar Manganese Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    leaseAreaHectares: 112.0,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 20000,
    currentMonthlyProductionTonnes: 18200,
    currentMonthlyCapacityTonnes: 20000,
    currentShortfallRiskLevel: 'MODERATE',
    currentShortfallProbabilityPct: 42.0,
    equipmentUptimePct: 86.0,
    activeEquipmentCount: 7,
    depthMeters: 260,
    geologicalConfidencePct: 86.0,
    satelliteStabilityScore: 84.0,
    provedReservesMt: 4.2,
    probableReservesMt: 2.6,
    totalReservesMt: 6.8,
    avgMnGradePct: 41.5,
    coordinates: { lat: 21.4012, lng: 79.2712 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-gumgaon-05',
    name: 'Gumgaon Underground Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    leaseAreaHectares: 85.6,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 16000,
    currentMonthlyProductionTonnes: 15350,
    currentMonthlyCapacityTonnes: 16000,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 15.0,
    equipmentUptimePct: 89.0,
    activeEquipmentCount: 6,
    depthMeters: 290,
    geologicalConfidencePct: 90.0,
    satelliteStabilityScore: 88.0,
    provedReservesMt: 3.8,
    probableReservesMt: 2.1,
    totalReservesMt: 5.9,
    avgMnGradePct: 43.2,
    coordinates: { lat: 21.3612, lng: 79.0312 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-tirodi-06',
    name: 'Tirodi Opencast Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    leaseAreaHectares: 124.0,
    type: 'Opencast',
    status: 'Operational',
    targetMonthlyTonnes: 14000,
    currentMonthlyProductionTonnes: 12050,
    currentMonthlyCapacityTonnes: 14000,
    currentShortfallRiskLevel: 'HIGH',
    currentShortfallProbabilityPct: 62.0,
    equipmentUptimePct: 78.0,
    activeEquipmentCount: 8,
    depthMeters: 80,
    geologicalConfidencePct: 85.0,
    satelliteStabilityScore: 74.0,
    provedReservesMt: 3.1,
    probableReservesMt: 1.9,
    totalReservesMt: 5.0,
    avgMnGradePct: 40.5,
    coordinates: { lat: 21.6812, lng: 79.7112 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-chikla-07',
    name: 'Chikla Underground Mine',
    state: 'Maharashtra',
    district: 'Bhandara',
    leaseAreaHectares: 76.5,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 12000,
    currentMonthlyProductionTonnes: 11280,
    currentMonthlyCapacityTonnes: 12000,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 22.0,
    equipmentUptimePct: 87.0,
    activeEquipmentCount: 5,
    depthMeters: 240,
    geologicalConfidencePct: 89.0,
    satelliteStabilityScore: 87.0,
    provedReservesMt: 2.8,
    probableReservesMt: 1.6,
    totalReservesMt: 4.4,
    avgMnGradePct: 42.8,
    coordinates: { lat: 21.5612, lng: 79.7712 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-ukwa-08',
    name: 'Ukwa Underground Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    leaseAreaHectares: 92.0,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 11000,
    currentMonthlyProductionTonnes: 10550,
    currentMonthlyCapacityTonnes: 11000,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 14.0,
    equipmentUptimePct: 91.0,
    activeEquipmentCount: 5,
    depthMeters: 210,
    geologicalConfidencePct: 93.0,
    satelliteStabilityScore: 90.0,
    provedReservesMt: 2.6,
    probableReservesMt: 1.4,
    totalReservesMt: 4.0,
    avgMnGradePct: 45.0,
    coordinates: { lat: 21.9612, lng: 80.4612 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-beldongri-09',
    name: 'Beldongri Manganese Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    leaseAreaHectares: 45.0,
    type: 'Underground',
    status: 'Operational',
    targetMonthlyTonnes: 4500,
    currentMonthlyProductionTonnes: 4280,
    currentMonthlyCapacityTonnes: 4500,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 16.0,
    equipmentUptimePct: 88.0,
    activeEquipmentCount: 3,
    depthMeters: 170,
    geologicalConfidencePct: 84.0,
    satelliteStabilityScore: 86.0,
    provedReservesMt: 1.1,
    probableReservesMt: 0.7,
    totalReservesMt: 1.8,
    avgMnGradePct: 39.5,
    coordinates: { lat: 21.3412, lng: 79.3112 },
    lastUpdated: '2026-03-01'
  },
  {
    mineId: 'mine-sitapatore-10',
    name: 'Sitapatore / Sukli Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    leaseAreaHectares: 38.0,
    type: 'Opencast',
    status: 'Operational',
    targetMonthlyTonnes: 3500,
    currentMonthlyProductionTonnes: 3320,
    currentMonthlyCapacityTonnes: 3500,
    currentShortfallRiskLevel: 'LOW',
    currentShortfallProbabilityPct: 15.0,
    equipmentUptimePct: 89.5,
    activeEquipmentCount: 3,
    depthMeters: 65,
    geologicalConfidencePct: 86.0,
    satelliteStabilityScore: 80.0,
    provedReservesMt: 0.9,
    probableReservesMt: 0.5,
    totalReservesMt: 1.4,
    avgMnGradePct: 38.0,
    coordinates: { lat: 21.7312, lng: 79.8212 },
    lastUpdated: '2026-03-01'
  }
];

export const MOCK_FACILITIES: Facility[] = [
  {
    facilityId: 'fac-nagpur-hq',
    name: 'MOIL Bhawan Corporate Headquarters',
    type: 'Corporate HQ',
    location: 'Nagpur, Maharashtra',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    capacity: 'Executive Command Center'
  },
  {
    facilityId: 'fac-dongri-emd',
    name: 'Dongri Buzurg EMD & Chemical Plant',
    type: 'Electrolytic Manganese Dioxide Plant',
    location: 'Bhandara, Maharashtra',
    coordinates: { lat: 21.5345, lng: 79.6892 },
    capacity: '1,500 Tonnes/Year EMD'
  },
  {
    facilityId: 'fac-balaghat-beneficiation',
    name: 'Balaghat Heavy Media Separation Beneficiation Plant',
    type: 'Beneficiation Plant',
    location: 'Balaghat, Madhya Pradesh',
    coordinates: { lat: 21.8156, lng: 80.1845 },
    capacity: '500,000 Tonnes/Year'
  }
];

export const MOCK_EXPLORATION_BLOCKS: ExplorationBlock[] = [
  {
    blockId: 'blk-ukwa-ext-01',
    blockName: 'Ukwa East Deep Seam Extension Block',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    estimatedResourceMt: 8.5,
    explorationStage: 'G2 (General Exploration)',
    avgMnGradePct: 44.5,
    coordinates: { lat: 21.982, lng: 80.485 }
  },
  {
    blockId: 'blk-mansar-north-02',
    blockName: 'Mansar North Deeper Horizons Block',
    state: 'Maharashtra',
    district: 'Nagpur',
    estimatedResourceMt: 6.2,
    explorationStage: 'G3 (Prospecting)',
    avgMnGradePct: 41.0,
    coordinates: { lat: 21.415, lng: 79.288 }
  }
];

export const MOCK_MINE_ZONES: MineZone[] = [
  {
    zoneId: 'zone-bgt-seam1',
    mineId: 'mine-balaghat-01',
    zoneName: 'Seam 1 - Main North Footwall',
    provedReservesMt: 6.8,
    probableReservesMt: 3.2,
    avgMnGradePct: 48.2,
    avgFeGradePct: 6.4,
    avgSiO2GradePct: 8.5,
    avgPGradePct: 0.12,
    densityTonnesPerM3: 3.85,
    stripRatio: 0,
    geologicalConfidencePct: 95.0,
    extractionRiskLevel: 'MODERATE'
  },
  {
    zoneId: 'zone-dgb-bench4',
    mineId: 'mine-dongri-02',
    zoneName: 'Bench 4 Supergene Enrichment Horizon',
    provedReservesMt: 4.8,
    probableReservesMt: 2.4,
    avgMnGradePct: 43.5,
    avgFeGradePct: 7.8,
    avgSiO2GradePct: 11.2,
    avgPGradePct: 0.22,
    densityTonnesPerM3: 3.65,
    stripRatio: 4.2,
    geologicalConfidencePct: 92.0,
    extractionRiskLevel: 'LOW'
  }
];

export const MOCK_BOREHOLES: Borehole[] = [
  {
    boreholeId: 'BH-BGT-2025-01',
    mineId: 'mine-balaghat-01',
    mineName: 'Balaghat Underground Mine',
    collarLatitude: 21.8135,
    collarLongitude: 80.1822,
    elevationMeters: 312.5,
    totalDepthMeters: 285.0,
    seamInterceptDepthMeters: 195.4,
    seamThicknessMeters: 8.6,
    avgMnGradePct: 48.4,
    avgFeGradePct: 5.8,
    avgSiO2GradePct: 7.2,
    avgPGradePct: 0.09,
    coreRecoveryPct: 96.5,
    rqdPct: 88.0,
    rockFormation: 'Gondite / Braunite Complex',
    drillingYear: 2025,
    drillRigType: 'Diamond Core Drill Rig',
    sourceId: 'src-synthetic-boreholes',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  },
  {
    boreholeId: 'BH-DGB-2025-04',
    mineId: 'mine-dongri-02',
    mineName: 'Dongri Buzurg Opencast Mine',
    collarLatitude: 21.5325,
    collarLongitude: 79.6865,
    elevationMeters: 298.0,
    totalDepthMeters: 140.0,
    seamInterceptDepthMeters: 45.0,
    seamThicknessMeters: 14.2,
    avgMnGradePct: 43.2,
    avgFeGradePct: 7.1,
    avgSiO2GradePct: 9.8,
    avgPGradePct: 0.18,
    coreRecoveryPct: 94.0,
    rqdPct: 82.5,
    rockFormation: 'Supergene Oxide Horizon',
    drillingYear: 2025,
    drillRigType: 'Diamond Core Drill Rig',
    sourceId: 'src-synthetic-boreholes',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  },
  {
    boreholeId: 'BH-KND-2025-07',
    mineId: 'mine-kandri-03',
    mineName: 'Kandri Manganese Mine',
    collarLatitude: 21.4325,
    collarLongitude: 79.2825,
    elevationMeters: 305.0,
    totalDepthMeters: 220.0,
    seamInterceptDepthMeters: 130.5,
    seamThicknessMeters: 6.8,
    avgMnGradePct: 45.6,
    avgFeGradePct: 6.2,
    avgSiO2GradePct: 8.4,
    avgPGradePct: 0.14,
    coreRecoveryPct: 91.0,
    rqdPct: 79.0,
    rockFormation: 'Mansar Formation Quartzite Contact',
    drillingYear: 2025,
    drillRigType: 'Diamond Core Drill Rig',
    sourceId: 'src-synthetic-boreholes',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  }
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    code: 'HEMM-001',
    mineId: 'mine-balaghat-01',
    mineName: 'Balaghat Underground Mine',
    name: 'Main Vertical Shaft Winder #1',
    type: 'Shaft Hoist',
    equipmentModel: 'ABB 1200kW Double Drum Friction Hoist',
    capacity: '150 Tonnes/Hour',
    status: 'Operational',
    uptimePct: 94.5,
    mtbfHours: 480.0,
    lastMaintenanceDate: '2026-02-15',
    nextScheduledMaintenance: '2026-03-30',
    criticalAlert: null,
    sourceId: 'src-synthetic-equipment',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  },
  {
    code: 'HEMM-004',
    mineId: 'mine-dongri-02',
    mineName: 'Dongri Buzurg Opencast Mine',
    name: 'Hydraulic Shovel 6.5m3',
    type: 'Hydraulic Shovel',
    equipmentModel: 'Komatsu PC1250-8',
    capacity: '6.5 m3 Bucket',
    status: 'Operational',
    uptimePct: 91.2,
    mtbfHours: 360.0,
    lastMaintenanceDate: '2026-02-20',
    nextScheduledMaintenance: '2026-04-05',
    criticalAlert: null,
    sourceId: 'src-synthetic-equipment',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  },
  {
    code: 'HEMM-006',
    mineId: 'mine-kandri-03',
    mineName: 'Kandri Manganese Mine',
    name: 'Electro-Hydraulic Jumbo Drill',
    type: 'Drill Rig',
    equipmentModel: 'Sandvik DD422i Twin Boom',
    capacity: '65 mm Hole Diameter',
    status: 'Under Maintenance',
    uptimePct: 64.0,
    mtbfHours: 110.0,
    lastMaintenanceDate: '2026-02-28',
    nextScheduledMaintenance: '2026-03-10',
    criticalAlert: 'Hydraulic pressure drop detected in Boom #2 manifold',
    sourceId: 'src-synthetic-equipment',
    dataType: 'SYNTHETIC_DEMO',
    isSynthetic: true
  }
];

export const MOCK_ANNUAL_PRODUCTION: AnnualProductionRecord[] = [
  { financialYear: '2020-21', productionTonnes: 1143000, salesTonnes: 1108000, revenueInrCrores: 1177.0, avgRealizationPerTonne: 10622, verifiedPublicReportUrl: 'https://www.moil.nic.in/annual-reports' },
  { financialYear: '2021-22', productionTonnes: 1231000, salesTonnes: 1212000, revenueInrCrores: 1436.0, avgRealizationPerTonne: 11848, verifiedPublicReportUrl: 'https://www.moil.nic.in/annual-reports' },
  { financialYear: '2022-23', productionTonnes: 1302000, salesTonnes: 1178000, revenueInrCrores: 1344.0, avgRealizationPerTonne: 11409, verifiedPublicReportUrl: 'https://www.moil.nic.in/annual-reports' },
  { financialYear: '2023-24', productionTonnes: 1756000, salesTonnes: 1536000, revenueInrCrores: 1440.0, avgRealizationPerTonne: 9375, verifiedPublicReportUrl: 'https://www.moil.nic.in/annual-reports' },
  { financialYear: '2024-25', productionTonnes: 1820000, salesTonnes: 1650000, revenueInrCrores: 1520.0, avgRealizationPerTonne: 9212, verifiedPublicReportUrl: 'https://www.moil.nic.in/annual-reports' }
];

export const MOCK_SHORTFALL_RISKS: ShortfallRisk[] = [
  {
    _id: 'risk-001',
    mineId: 'mine-kandri-03',
    mineName: 'Kandri Manganese Mine',
    assessmentDate: '2026-03-01',
    riskLevel: 'CRITICAL',
    overallProbabilityPct: 76.0,
    predictedShortfallTonnes: 3500,
    revenueAtRiskInrCrores: 4.85,
    primaryRiskFactors: [
      { factorName: 'Underground Jumbo Drill Rig Breakdown (HEMM-006)', impactWeightPct: 48.0, category: 'EQUIPMENT' },
      { factorName: 'Level 4 Stope Dewatering Sump Pump Maintenance', impactWeightPct: 32.0, category: 'WEATHER' },
      { factorName: 'Haulage Incline Cable Wear', impactWeightPct: 20.0, category: 'LOGISTICS' }
    ],
    aiExplanation: 'Kandri Mine is operating at 64% capacity following a severe hydraulic pressure failure on Jumbo Drill HEMM-006 in Level 4 Stope. Combined with high soil moisture telemetry, production is forecasted to fall short by 3,500 tonnes over 30 days unless auxiliary loading units are deployed.',
    horizons: [
      { horizon_days: 30, predicted_production_tonnes: 21500, target_tonnes: 25000, shortfall_tonnes: 3500, probability_pct: 76.0, confidence_lower_tonnes: 19800, confidence_upper_tonnes: 22800 },
      { horizon_days: 60, predicted_production_tonnes: 44200, target_tonnes: 50000, shortfall_tonnes: 5800, probability_pct: 68.0, confidence_lower_tonnes: 41000, confidence_upper_tonnes: 46500 },
      { horizon_days: 90, predicted_production_tonnes: 68000, target_tonnes: 75000, shortfall_tonnes: 7000, probability_pct: 54.0, confidence_lower_tonnes: 63500, confidence_upper_tonnes: 71200 }
    ],
    sourceId: 'src-moil-ar-2025',
    dataType: 'OFFICIAL_MOIL',
    isSynthetic: false
  },
  {
    _id: 'risk-002',
    mineId: 'mine-balaghat-01',
    mineName: 'Balaghat Underground Mine',
    assessmentDate: '2026-03-01',
    riskLevel: 'HIGH',
    overallProbabilityPct: 68.5,
    predictedShortfallTonnes: 4200,
    revenueAtRiskInrCrores: 5.92,
    primaryRiskFactors: [
      { factorName: 'Deep Shaft Incline Hoist Preventive Overhaul (HEMM-003)', impactWeightPct: 42.0, category: 'EQUIPMENT' },
      { factorName: 'Monsoon Sump Dewatering Pre-Monsoon Maintenance Window', impactWeightPct: 35.0, category: 'WEATHER' },
      { factorName: 'Shaft 3 Rail Track Realignment', impactWeightPct: 23.0, category: 'LOGISTICS' }
    ],
    aiExplanation: 'Balaghat Mine deep vertical shaft operations will experience scheduled downtime for main winder cable lubrication and dewatering station overhauls ahead of the seasonal monsoon.',
    horizons: [
      { horizon_days: 30, predicted_production_tonnes: 47800, target_tonnes: 52000, shortfall_tonnes: 4200, probability_pct: 68.5, confidence_lower_tonnes: 45000, confidence_upper_tonnes: 49800 },
      { horizon_days: 60, predicted_production_tonnes: 98000, target_tonnes: 104000, shortfall_tonnes: 6000, probability_pct: 58.0, confidence_lower_tonnes: 92500, confidence_upper_tonnes: 101500 },
      { horizon_days: 90, predicted_production_tonnes: 148500, target_tonnes: 156000, shortfall_tonnes: 7500, probability_pct: 46.0, confidence_lower_tonnes: 141000, confidence_upper_tonnes: 153000 }
    ],
    sourceId: 'src-moil-ar-2025',
    dataType: 'OFFICIAL_MOIL',
    isSynthetic: false
  }
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    _id: 'rec-001',
    recommendationId: 'REC-BGT-2026-081',
    mineId: 'mine-balaghat-01',
    mineName: 'Balaghat Underground Mine',
    title: 'Advance Shift B Blasting Ahead of 48h Monsoon Rainfall Window',
    category: 'Blasting Optimization',
    urgency: 'CRITICAL',
    description: 'Satellite radar forecasts 165mm precipitation over Balaghat district in the next 72 hours. Pre-emptively advance deep-hole blasting in Seam 3 to dry-weather shifts to prevent bench waterlogging and misfires.',
    actionSteps: [
      'Shift explosive charging schedule from Shift B (Evening) to Shift A (Morning 06:00)',
      'Activate auxiliary dewatering pumps P-04 and P-07 along Pit 2 sump',
      'Verify moisture sealing on ANFO emulsion charges'
    ],
    expectedRiskReductionPct: 26.5,
    expectedTonnageGain: 3400,
    estimatedRoiInrLakhs: 42.5,
    status: 'PENDING',
    targetShift: 'Shift B -> Shift A',
    targetEquipment: 'Blasting Unit & P-04 Sump Pump',
    sourceId: 'src-copernicus-sentinel2',
    dataType: 'PUBLIC_SATELLITE',
    isSynthetic: false
  },
  {
    _id: 'rec-002',
    recommendationId: 'REC-DGB-2026-055',
    mineId: 'mine-dongri-02',
    mineName: 'Dongri Buzurg Opencast Mine',
    title: 'Reinforce Bench 4 Perimeter Drainage Berm Ahead of Monsoon Inflow',
    category: 'Infrastructure Hardening',
    urgency: 'MEDIUM',
    description: 'Satellite soil moisture index shows 34% saturation along the south high-wall. Reinforce perimeter drainage channels to direct runoff away from the primary haul ramp.',
    actionSteps: [
      'Deploy Komatsu Grader to regrade south ramp drainage gradient to 2%',
      'Clear silt traps at Sump 3 discharge culvert',
      'Inspect bench crest tension cracks daily'
    ],
    expectedRiskReductionPct: 18.0,
    expectedTonnageGain: 1200,
    estimatedRoiInrLakhs: 15.0,
    status: 'PENDING',
    targetShift: 'Day Maintenance Shift',
    targetEquipment: 'Grader G-02 & Sump 3',
    sourceId: 'src-copernicus-sentinel2',
    dataType: 'PUBLIC_SATELLITE',
    isSynthetic: false
  }
];

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    sourceId: 'src-moil-ar-2025',
    sourceName: 'MOIL Limited Annual Reports (FY23-FY26)',
    sourceUrl: 'https://www.moil.nic.in/annual-reports',
    datasetName: 'Annual Production & Mine Leases',
    description: 'Statutory audited annual operational figures and lease demarcations.',
    publicationDate: '2025-08-30',
    accessedDate: '2026-03-01',
    dataType: 'OFFICIAL_MOIL',
    isSynthetic: false,
    license: 'MOIL Limited PSU Disclosures',
    verificationStatus: 'VERIFIED_PUBLIC'
  },
  {
    sourceId: 'src-usgs-manganese-2024',
    sourceName: 'U.S. Geological Survey Mineral Commodity Summaries (2024/2025)',
    sourceUrl: 'https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-manganese.pdf',
    datasetName: 'World Manganese Ore Reserves & Global Production',
    description: 'International benchmark for country-by-country reserves and production.',
    publicationDate: '2025-01-31',
    accessedDate: '2026-03-01',
    dataType: 'PUBLIC_GOVERNMENT',
    isSynthetic: false,
    license: 'Public Domain (US Government Work)',
    verificationStatus: 'VERIFIED_PUBLIC'
  }
];

export const MOCK_GLOBAL_DATA = {
  countryReserves: [
    {
      countryCode: 'ZAF',
      countryName: 'South Africa',
      flag: '🇿🇦',
      latitude: -27.12,
      longitude: 22.95,
      reservesContainedMnMt: 640.0,
      grossOreReservesMt: 1850.0,
      shareOfWorldReservesPct: 33.7,
      annualMineProductionContainedMnMt: 7.2,
      annualGrossOreProductionMt: 21.5,
      shareOfWorldProductionPct: 36.0,
      avgOreGradeMnPct: 42.5,
      keyDeposits: 'Kalahari Manganese Field (Hotazel, Mamatwan, Wessels)',
      miningMethods: 'Opencast & Deep Underground',
      primaryProducers: 'Assmang, South32, Tshipi Borwa',
      strategicNotes: "Holds the world's largest known land-based manganese deposit."
    },
    {
      countryCode: 'AUS',
      countryName: 'Australia',
      flag: '🇦🇺',
      latitude: -13.97,
      longitude: 136.6,
      reservesContainedMnMt: 270.0,
      grossOreReservesMt: 620.0,
      shareOfWorldReservesPct: 14.2,
      annualMineProductionContainedMnMt: 3.3,
      annualGrossOreProductionMt: 7.8,
      shareOfWorldProductionPct: 16.5,
      avgOreGradeMnPct: 46.0,
      keyDeposits: 'Groote Eylandt, Woodie Woodie',
      miningMethods: 'Shallow Opencast Strip Mining',
      primaryProducers: 'South32 (GEMCO), Element 25',
      strategicNotes: 'World benchmark for premium high-grade lump ore (44-48% Mn).'
    },
    {
      countryCode: 'GAB',
      countryName: 'Gabon',
      flag: '🇬🇦',
      latitude: -1.57,
      longitude: 13.2,
      reservesContainedMnMt: 65.0,
      grossOreReservesMt: 160.0,
      shareOfWorldReservesPct: 3.4,
      annualMineProductionContainedMnMt: 4.6,
      annualGrossOreProductionMt: 10.5,
      shareOfWorldProductionPct: 23.0,
      avgOreGradeMnPct: 48.5,
      keyDeposits: 'Moanda Plateau Mine',
      miningMethods: 'Plateau Open-Pit Strip Mining',
      primaryProducers: 'Comilog (Eramet Group)',
      strategicNotes: 'Second largest global producer with highest run-of-mine ore grade (~48% Mn).'
    },
    {
      countryCode: 'IND',
      countryName: 'India (MOIL Core)',
      flag: '🇮🇳',
      latitude: 21.81,
      longitude: 80.18,
      reservesContainedMnMt: 45.0,
      grossOreReservesMt: 140.0,
      shareOfWorldReservesPct: 2.4,
      annualMineProductionContainedMnMt: 1.8,
      annualGrossOreProductionMt: 3.4,
      shareOfWorldProductionPct: 9.0,
      avgOreGradeMnPct: 43.5,
      keyDeposits: 'Balaghat, Dongri Buzurg, Kandri, Mansar, Gumgaon, Tirodi',
      miningMethods: 'Deep Underground Shafts & Opencast Benches',
      primaryProducers: 'MOIL Limited (Miniratna CPSE)',
      strategicNotes: 'Domestic leader supplying >45% of India manganese needs with rich high-grade reserves.'
    }
  ],
  tradeFlows: {
    majorExporters: [
      { country: 'South Africa', annualTonnesExportedMt: 18.5, primaryDestination: 'China, India, Japan' },
      { country: 'Gabon', annualTonnesExportedMt: 9.8, primaryDestination: 'China, Europe, India' },
      { country: 'Australia', annualTonnesExportedMt: 6.8, primaryDestination: 'China, South Korea, Japan' }
    ],
    majorImporters: [
      { country: 'China', annualTonnesImportedMt: 29.5, shareOfGlobalSeabornePct: 62.0 },
      { country: 'India', annualTonnesImportedMt: 5.2, shareOfGlobalSeabornePct: 11.0 },
      { country: 'Japan', annualTonnesImportedMt: 1.8, shareOfGlobalSeabornePct: 3.8 }
    ]
  },
  pricing: {
    benchmarkGrade44PctMnCifTianjinUsdDmtu: 4.85,
    grade37PctMnFobSouthAfricaUsdDmtu: 3.45,
    historicalPriceSeries: [
      { date: '2025-06', priceUsdDmtu: 4.2 },
      { date: '2025-09', priceUsdDmtu: 4.45 },
      { date: '2025-12', priceUsdDmtu: 4.6 },
      { date: '2026-03', priceUsdDmtu: 4.85 }
    ]
  },
  deepSeaNodules: {
    overview: 'Clarion-Clipperton Zone (CCZ) polymetallic nodule deposits containing an estimated 6,000 Mt of contained manganese.',
    isaExplorationContractsCount: 17,
    keyConsiderations: 'High capital intensity and ongoing environmental regulatory framework development under the International Seabed Authority.'
  },
  peers: [
    { companyName: 'MOIL Limited', country: 'India', annualProductionMt: 1.82, avgGradePct: 43.5, costPerTonneUsd: 48.0, ebitdaMarginPct: 34.5 },
    { companyName: 'Assmang (ARM/Assore)', country: 'South Africa', annualProductionMt: 4.2, avgGradePct: 42.0, costPerTonneUsd: 36.0, ebitdaMarginPct: 38.0 },
    { companyName: 'Comilog (Eramet)', country: 'Gabon', annualProductionMt: 7.5, avgGradePct: 48.5, costPerTonneUsd: 32.0, ebitdaMarginPct: 45.0 }
  ]
};

// Generate realistic mock production logs
export const generateMockProductionLogs = (): ProductionLog[] => {
  const months = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
  const logs: ProductionLog[] = [];

  MOCK_MINES.forEach((mine) => {
    months.forEach((m, idx) => {
      const isMonsoon = idx >= 2 && idx <= 5;
      const target = mine.targetMonthlyTonnes || 20000;
      const factor = isMonsoon ? 0.82 : 0.94 + Math.sin(idx) * 0.05;
      const actual = Math.round(target * factor);
      const sales = Math.round(actual * 0.92);
      logs.push({
        _id: `prod-${mine.mineId}-${m}`,
        mineId: mine.mineId,
        mineName: mine.name,
        date: `${m}-01`,
        financialYear: '2025-26',
        targetTonnes: target,
        actualTonnes: actual,
        salesTonnes: sales,
        varianceTonnes: actual - target,
        compliancePct: Number(((actual / target) * 100).toFixed(1)),
        avgMnGradePct: mine.avgMnGradePct,
        equipmentUptimePct: isMonsoon ? 76.5 : 88.0,
        rainfallMm: isMonsoon ? 180 : 15,
        blastingShiftsCount: isMonsoon ? 12 : 24,
        downtimeHours: {
          equipmentFailureHours: 14,
          monsoonWeatherHours: isMonsoon ? 48 : 2,
          blastingDelayHours: 6,
          logisticsHaulageHours: 8,
          powerOutageHours: 4
        },
        sourceId: 'src-moil-ar-2025',
        dataType: 'OFFICIAL_MOIL',
        isSynthetic: false
      });
    });
  });

  return logs;
};

export const MOCK_PRODUCTION_LOGS: ProductionLog[] = generateMockProductionLogs();

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalProvedReservesMt: 45.9,
  totalProbableReservesMt: 25.1,
  totalReservesMt: 71.0,
  ytdProductionTonnes: 1820000,
  ytdTargetTonnes: 1950000,
  ytdSalesTonnes: 1650000,
  overallCompliancePct: 93.3,
  operationalMinesCount: 10,
  criticalRiskMinesCount: 1,
  highRiskMinesCount: 2,
  totalEquipmentCount: 68,
  averageEquipmentUptimePct: 84.8,
  activeShortfallMitigationPlans: 4,
  estimatedTonnageRecovered: 11400,
  totalRevenueAtRiskInrCrores: 13.42,
  lastSyncTimestamp: new Date().toISOString()
};
