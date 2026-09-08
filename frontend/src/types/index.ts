export type UserRole = 'ADMIN' | 'MINE_PLANNER' | 'VIEWER';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type DataSourceType =
  | 'OFFICIAL_MOIL'
  | 'PUBLIC_GOVERNMENT'
  | 'PUBLIC_SATELLITE'
  | 'PUBLIC_WEATHER'
  | 'SYNTHETIC_DEMO';

export type VerificationStatus =
  | 'VERIFIED_PUBLIC'
  | 'SYNTHETIC_DEMO'
  | 'PENDING_VERIFICATION';

export interface DataSource {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  description: string;
  publicationDate: string;
  accessedDate: string;
  dataType: DataSourceType;
  isSynthetic: boolean;
  license: string;
  verificationStatus: VerificationStatus;
  citation?: string;
}

export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  department?: string;
  mineAccess?: string[];
  isGoogleAuth?: boolean;
  googlePicture?: string;
  picture?: string;
  emailVerified?: boolean;
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  suspendedUsers: number;
}

export interface Mine {
  _id?: string;
  mineId: string;
  name: string;
  code: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  type: 'Underground' | 'Opencast' | 'Mixed';
  depthMeters?: number;
  leaseAreaHectares?: number;
  leaseAreaSqKm?: number;
  totalReservesMt: number;
  provedReservesMt: number;
  probableReservesMt: number;
  inferredResourcesMt?: number;
  possibleReservesMt?: number;
  avgOreGradeMnPct?: number;
  avgMnGradePct?: number;
  avgFeGradePct?: number;
  avgSiO2GradePct?: number;
  annualCapacityTonnes?: number;
  targetMonthlyTonnes: number;
  currentMonthlyProductionTonnes: number;
  currentShortfallRiskLevel: RiskLevel;
  currentShortfallProbabilityPct: number;
  equipmentUptimePct: number;
  activeEquipmentCount: number;
  operationalStatus: string;
  geologicalConfidencePct: number;
  satelliteStabilityScore: number;
  keyMineralogy?: string;
  onSiteProcessing?: string;
  commissioningYear?: number;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface Facility {
  facilityId: string;
  code: string;
  name: string;
  type: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
  capacity: string;
  commissioningYear: number;
  status: string;
}

export interface ExplorationBlock {
  blockId: string;
  code: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  leaseAreaHectares: number;
  targetFormation: string;
  estimatedPotentialMt: number;
  status: string;
  targetSeamDepthM: number;
  keyMineralogy: string;
}

export interface MineZone {
  zoneId: string;
  mineId: string;
  mineName: string;
  code: string;
  state?: string;
  district?: string;
  center: [number, number];
  polygon: [number, number][];
  confidenceCategory: 'HIGH_CONFIDENCE_PROVED' | 'MODERATE_CONFIDENCE_PROBABLE' | 'INFERRED_SURVEY';
  estimatedReservesMt: number;
  provedReservesMt: number;
  probableReservesMt: number;
  inferredResourcesMt?: number;
  avgMnGrade: number;
  avgFeGrade: number;
  avgSiO2Grade: number;
  depthMeters: number;
  leaseAreaHectares?: number;
  boreholeCount: number;
  avgCoreRecoveryPct: number;
  satelliteStabilityScore: number;
  dataSources?: string[];
  isSyntheticBoreholes?: boolean;
  sourceMetadata?: {
    sourceId: string;
    sourceName: string;
    dataType: DataSourceType;
    isSynthetic: boolean;
  };
}

export type ReserveConfidenceTier =
  | 'PROVED_111'
  | 'PROBABLE_122'
  | 'INFERRED_333'
  | 'PROSPECTIVE'
  | 'STERILE';

export interface ReserveProbabilityCell {
  cellId: string;
  mineId: string;
  mineName: string;
  code: string;
  center: [number, number];
  polygon: [number, number][];
  probabilityPct: number;
  confidenceTier: ReserveConfidenceTier;
  predictedMnGradePct: number;
  predictedFeGradePct: number;
  predictedSiO2GradePct: number;
  predictedPGradePct: number;
  seamDepthMeters: number;
  seamThicknessMeters: number;
  estimatedTonnageKt: number;
  krigingVariance: number;
  lithology: string;
  strikeDip: string;
  isCoreZone: boolean;
  unfcClassification: string;
}

export interface GeostatisticalVariogram {
  mineId: string;
  mineName: string;
  modelType: 'Spherical' | 'Exponential' | 'Gaussian';
  nugget: number;
  sill: number;
  rangeMeters: number;
  azimuthAngleDeg: number;
  anisotropyRatio: number;
  crossValidationR2: number;
  samplePairCount: number;
  meanGradeMnPct: number;
  gradeVariance: number;
}

export interface Borehole {
  _id?: string;
  boreholeId: string;
  mineId: string;
  mineName: string;
  collarLatitude: number;
  collarLongitude: number;
  elevationMeters: number;
  totalDepthMeters: number;
  seamInterceptDepthMeters: number;
  seamThicknessMeters: number;
  avgMnGradePct: number;
  avgFeGradePct: number;
  avgSiO2GradePct: number;
  avgPGradePct: number;
  coreRecoveryPct: number;
  rqdPct: number;
  rockFormation: string;
  drillingYear: number;
  drillRigType: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface DowntimeBreakdown {
  equipmentFailureHours: number;
  monsoonWeatherHours: number;
  blastingDelayHours: number;
  logisticsHaulageHours: number;
  powerOutageHours: number;
}

export interface ProductionLog {
  _id?: string;
  mineId: string;
  mineName: string;
  date: string;
  financialYear?: string;
  targetTonnes: number;
  actualTonnes: number;
  salesTonnes?: number;
  varianceTonnes: number;
  compliancePct: number;
  avgMnGradePct: number;
  equipmentUptimePct: number;
  rainfallMm: number;
  blastingShiftsCount: number;
  downtimeHours: DowntimeBreakdown;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface AnnualProductionRecord {
  fiscalYear: string;
  productionTonnes: number;
  salesTonnes: number;
  grossRevenueInrCrores?: number;
  netProfitInrCrores?: number;
  growthRatePct?: number;
  notes?: string;
}

export interface SatelliteTelemetry {
  _id?: string;
  mineId: string;
  mineName: string;
  timestamp: string | Date;
  sensor: string;
  ndvi: number;
  soilMoisturePct: number;
  rainfallMm: number;
  landSurfaceTempCelsius: number;
  cloudCoverPct: number;
  slopeStabilityStatus: 'SAFE' | 'ADVISORY' | 'ALERT';
  recommendedBlastingWindow: string;
  sourceId?: string;
  sourceName?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface Equipment {
  _id?: string;
  code: string;
  mineId: string;
  mineName: string;
  name: string;
  type: string;
  equipmentModel: string;
  capacity: string;
  status: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'BREAKDOWN' | 'STANDBY';
  uptimePct: number;
  mtbfHours: number;
  lastMaintenanceDate: string;
  nextScheduledMaintenance: string;
  criticalAlert?: string | null;
  sourceId?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface RiskFactorItem {
  factorName: string;
  impactWeightPct: number;
  category: 'EQUIPMENT' | 'WEATHER' | 'LOGISTICS' | 'GEOLOGY';
}

export interface ForecastHorizonItem {
  horizon_days: number;
  predicted_production_tonnes: number;
  target_tonnes?: number;
  predicted_shortfall_tonnes?: number;
  shortfall_tonnes?: number;
  confidence_lower_tonnes: number;
  confidence_upper_tonnes: number;
  shortfall_probability_pct: number;
  probability_pct?: number;
  risk_level: RiskLevel;
}

export interface FeatureImportanceItem {
  feature: string;
  impact_pct: number;
  direction: 'increase_risk' | 'decrease_risk';
  description?: string;
}

export interface ShortfallRisk {
  _id?: string;
  mineId: string;
  mineName: string;
  assessmentDate: string;
  riskLevel: RiskLevel;
  overallProbabilityPct: number;
  predictedShortfallTonnes: number;
  revenueAtRiskInrCrores: number;
  primaryRiskFactors: RiskFactorItem[];
  aiExplanation: string;
  horizons: ForecastHorizonItem[];
  featureImportance?: FeatureImportanceItem[];
  sourceId?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface Recommendation {
  _id?: string;
  recommendationId: string;
  mineId: string;
  mineName: string;
  title: string;
  category: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  actionSteps: string[];
  expectedRiskReductionPct: number;
  expectedTonnageGain: number;
  estimatedRoiInrLakhs: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SNOOZED';
  targetShift: string;
  targetEquipment: string;
  actionTakenBy?: string;
  actionTimestamp?: string;
  outcomeNote?: string;
  realizedTonnageGain?: number;
  sourceId?: string;
  dataType?: DataSourceType;
  isSynthetic?: boolean;
}

export interface ActiveAlertItem {
  id: string;
  mineId: string;
  mineName: string;
  riskLevel: RiskLevel;
  probabilityPct: number;
  message: string;
  timestamp: string | Date;
  sourceName?: string;
}

export interface DashboardSummary {
  totalNationalReservesAndResourcesMt?: number;
  provedProbableReservesMt?: number;
  remainingResourcesMt?: number;
  totalEstimatedReservesMt: number;
  totalMonthlyTargetTonnes: number;
  totalCurrentMonthlyProductionTonnes: number;
  productionFulfillmentPct: number;
  avgEquipmentUptimePct: number;
  activeMinesCount: number;
  overallRiskStatus: RiskLevel | string;
  criticalMinesCount: number;
  highRiskMinesCount: number;
  pendingRecommendationsCount: number;
  totalEquipmentCount: number;
  operationalEquipmentCount: number;
  latestAnnualRecordTonnes?: number;
  latestAnnualSalesTonnes?: number;
  annualSummary?: AnnualProductionRecord[];
  activeAlerts: ActiveAlertItem[];
  sourceMetadata?: {
    sourceId: string;
    sourceName: string;
    sourceUrl: string;
    dataType: DataSourceType;
    isSynthetic: boolean;
  };
}

// Global Manganese Market & Reserves Types (USGS & IMnI)
export interface CountryReserve {
  countryCode: string;
  countryName: string;
  flag: string;
  latitude: number;
  longitude: number;
  reservesContainedMnMt: number;
  grossOreReservesMt: number;
  shareOfWorldReservesPct: number;
  annualMineProductionContainedMnMt: number;
  annualGrossOreProductionMt: number;
  shareOfWorldProductionPct: number;
  avgOreGradeMnPct: number;
  keyDeposits: string;
  miningMethods: string;
  primaryProducers: string;
  strategicNotes: string;
}

export interface TradeEntity {
  country: string;
  volumeMt: number;
  sharePct: number;
  mainPorts?: string;
  useCase?: string;
}

export interface GlobalTradeFlows {
  annualTotalSeaborneTradeMt: number;
  topExporters: TradeEntity[];
  topImporters: TradeEntity[];
}

export interface PricingBenchmark {
  gradeName: string;
  priceUsdPerDmtu?: number;
  equivalentPriceUsdPerTonne: number;
  priceInrPerTonne?: number;
  yoyChangePct: number;
  benchmarkSource: string;
}

export interface DeepSeaDeposit {
  regionName: string;
  jurisdiction: string;
  areaSqKm: number;
  oceanDepthMeters: string;
  estimatedNoduleResourceMt: number;
  containedManganeseMt: number;
  avgMnGradePct: number;
  secondaryMetals: string;
  developmentProgram: string;
  status: string;
}

export interface MoilVsGlobalPeer {
  company: string;
  country: string;
  annualOutputMt: number;
  avgOreGrade: string;
  miningMethod: string;
  reserveLifeYears: number;
  strategicAdvantage: string;
}

export interface GlobalMarketOverview {
  sourceMetadata: {
    sourceId: string;
    sourceName: string;
    sourceUrl: string;
    publicationDate: string;
    accessedDate: string;
    dataType: DataSourceType;
    isSynthetic: boolean;
    totalWorldReservesContainedMnMt: number;
    totalWorldGrossOreReservesEstimatedMt: number;
    annualWorldProductionContainedMnMt: number;
    annualWorldProductionGrossOreMt: number;
  };
  countryReserves: CountryReserve[];
  globalTradeFlows: GlobalTradeFlows;
  pricingBenchmarks: {
    currencyUnit: string;
    lastUpdated: string;
    benchmarks: PricingBenchmark[];
  };
  deepSeaNodules: {
    overview: string;
    deposits: DeepSeaDeposit[];
  };
  moilVsGlobalPeers: MoilVsGlobalPeer[];
}
