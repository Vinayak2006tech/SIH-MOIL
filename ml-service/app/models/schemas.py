from typing import List, Dict, Optional, Any
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field


class GeologicalFeatures(BaseModel):
    seam_depth_m: float = Field(..., description="Average seam depth in meters", example=180.5)
    seam_thickness_m: float = Field(..., description="Estimated seam thickness in meters", example=14.2)
    mn_grade_pct: float = Field(..., description="Manganese content percentage", example=43.5)
    fe_grade_pct: float = Field(..., description="Iron content percentage", example=6.8)
    sio2_grade_pct: float = Field(..., description="Silica content percentage", example=9.2)
    p_grade_pct: float = Field(..., description="Phosphorus content percentage", example=0.18)
    rock_hardness_rqd: float = Field(..., description="Rock Quality Designation percentage", example=78.0)
    borehole_density_per_sqkm: float = Field(..., description="Drilling boreholes per km2", example=12.5)
    core_recovery_pct: float = Field(..., description="Core sample recovery percentage", example=88.5)


class SatelliteFeatures(BaseModel):
    ndvi_index: float = Field(..., description="Normalized Difference Vegetation Index (-1 to 1)", example=0.38)
    soil_moisture_pct: float = Field(..., description="Surface soil moisture proxy percentage", example=32.4)
    rainfall_anomaly_mm: float = Field(..., description="Rainfall deviation from 10yr monthly baseline", example=45.0)
    land_surface_temp_c: float = Field(..., description="MODIS/Sentinel thermal proxy in Celsius", example=34.2)
    elevation_m: float = Field(..., description="Digital Elevation Model surface height", example=315.0)


class ReserveEstimationRequest(BaseModel):
    mine_id: str = Field(..., example="mine-balaghat-01")
    mine_name: str = Field(..., example="Balaghat Underground Mine")
    zone_id: Optional[str] = Field(None, example="zone-north-seam-4")
    area_sqkm: float = Field(..., description="Zone surface area in square km", example=2.4)
    geology: GeologicalFeatures
    satellite: SatelliteFeatures


class ReserveEstimationResponse(BaseModel):
    mine_id: str
    mine_name: str
    zone_id: Optional[str]
    estimated_reserve_million_tonnes: float
    proved_reserve_million_tonnes: float
    probable_reserve_million_tonnes: float
    possible_reserve_million_tonnes: float
    avg_mn_grade_pct: float
    grade_category: str  # High Grade (>44%), Medium Grade (35-44%), Low/Siliceous (<35%)
    confidence_score: float  # 0 to 100
    extraction_feasibility_score: float  # 0 to 100
    drilling_confidence: str  # High, Moderate, Inferred
    satellite_stability_index: float  # 0 to 100 (slope & moisture stability)
    estimated_mineable_life_years: float
    key_drivers: List[Dict[str, Any]]


class ProductionHistoryPoint(BaseModel):
    month: str
    target_tonnes: float
    actual_tonnes: float
    equipment_uptime_pct: float
    rainfall_mm: float
    blasting_cycles: int
    unplanned_downtime_hours: float


class ShortfallPredictionRequest(BaseModel):
    mine_id: str = Field(..., example="mine-balaghat-01")
    mine_name: str = Field(..., example="Balaghat Underground Mine")
    target_monthly_tonnes: float = Field(..., example=42000.0)
    current_equipment_uptime_pct: float = Field(..., example=74.5)
    mean_time_between_failures_hrs: float = Field(..., example=112.0)
    forecast_rainfall_next_30d_mm: float = Field(..., example=185.0)
    historical_production: List[ProductionHistoryPoint]
    active_excavator_count: int = Field(default=6, example=6)
    active_dumper_count: int = Field(default=14, example=14)
    planned_blasting_shifts: int = Field(default=22, example=22)
    grade_dilution_risk_pct: float = Field(default=8.5, example=8.5)


class FeatureImportanceItem(BaseModel):
    feature: str
    impact_pct: float
    direction: str  # "increase_risk" or "decrease_risk"
    description: str


class ForecastHorizon(BaseModel):
    horizon_days: int  # 30, 60, 90
    predicted_production_tonnes: float
    predicted_shortfall_tonnes: float
    confidence_lower_tonnes: float
    confidence_upper_tonnes: float
    shortfall_probability_pct: float
    risk_level: str  # Critical, High, Moderate, Low


class ShortfallPredictionResponse(BaseModel):
    mine_id: str
    mine_name: str
    overall_risk_level: str
    risk_score_pct: float
    forecast_horizons: List[ForecastHorizon]
    primary_bottleneck: str
    feature_importance: List[FeatureImportanceItem]
    plain_language_explanation: str
    estimated_revenue_risk_inr_crores: float


class RecommendationItem(BaseModel):
    id: str
    mine_id: str
    mine_name: str
    title: str
    category: str  # "Blasting Optimization", "Fleet Redeployment", "Maintenance Scheduling", "Weather Mitigation", "Grade Blending"
    urgency: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    description: str
    action_steps: List[str]
    expected_risk_reduction_pct: float
    expected_tonnage_gain: float
    estimated_roi_inr_lakhs: float
    status: str = "PENDING"  # PENDING, ACCEPTED, REJECTED, SNOOZED
    target_equipment: Optional[str] = None
    target_shift: Optional[str] = None


class RecommendationResponse(BaseModel):
    mine_id: str
    mine_name: str
    total_recommendations: int
    recommendations: List[RecommendationItem]
    simulated_mitigated_risk_pct: float


class SatellitePassRequest(BaseModel):
    mine_id: str
    latitude: float
    longitude: float
    satellite_sensor: str = "Sentinel-2/MODIS"


class SatellitePassResponse(BaseModel):
    mine_id: str
    sensor: str
    acquisition_timestamp: str
    ndvi: float
    soil_moisture_pct: float
    precipitation_rate_mm: float
    land_surface_temp_c: float
    cloud_cover_pct: float
    geotechnical_pit_stability_risk: str  # Safe, Advisory, Alert
    recommended_blasting_window: str
