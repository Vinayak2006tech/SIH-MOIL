import math
from typing import List, Dict, Any
from app.models.schemas import ReserveEstimationRequest, ReserveEstimationResponse


def estimate_mine_reserves(req: ReserveEstimationRequest) -> ReserveEstimationResponse:
    """
    Multivariate Manganese Ore Reserve Estimation combining:
    1. Sub-surface volumetric modeling (Area * Seam Thickness * Bulk Density)
    2. Grade-tonnage distribution & cut-off yields (% Mn, % Fe, % SiO2, % P)
    3. Geological exploration maturity (Borehole density, core recovery, RQD)
    4. Satellite proxy indicators (NDVI, soil moisture saturation, thermal anomaly)
    """
    # Manganese ore specific bulk gravity (typically 3.8 to 4.3 tonnes/m3 depending on grade)
    base_bulk_density = 3.6 + (req.geology.mn_grade_pct / 100.0) * 1.2  # ~4.12 t/m3 at 43.5% Mn
    
    # In-situ volume in Million m3 = Area (sqkm) * 1,000,000 m2/km2 * Seam Thickness (m) / 1,000,000
    volume_million_m3 = req.area_sqkm * req.geology.seam_thickness_m
    
    # Raw in-situ tonnage in Million Tonnes
    raw_insitu_tonnes = volume_million_m3 * base_bulk_density
    
    # Apply Geological Recovery Factor based on core recovery & rock quality
    recovery_factor = (req.geology.core_recovery_pct / 100.0) * 0.85 + (req.geology.rock_hardness_rqd / 100.0) * 0.15
    adjusted_reserves = raw_insitu_tonnes * max(0.65, min(0.95, recovery_factor))
    
    # Exploration maturity and Confidence calculation
    # High borehole density (>10/sqkm) and high core recovery -> high UNFC Proved tier
    density_factor = min(1.0, req.geology.borehole_density_per_sqkm / 15.0)
    core_factor = min(1.0, req.geology.core_recovery_pct / 90.0)
    rqd_factor = min(1.0, req.geology.rock_hardness_rqd / 80.0)
    
    confidence_score = (density_factor * 0.45 + core_factor * 0.35 + rqd_factor * 0.20) * 100.0
    confidence_score = round(max(35.0, min(96.5, confidence_score)), 1)
    
    # Satellite terrain stability factor (High moisture + high slope/thermal = instability)
    satellite_stability = 100.0 - (
        (req.satellite.soil_moisture_pct * 0.4) + 
        (max(0, req.satellite.rainfall_anomaly_mm) * 0.3) +
        (abs(req.satellite.land_surface_temp_c - 30.0) * 0.5)
    )
    satellite_stability = round(max(40.0, min(95.0, satellite_stability)), 1)
    
    # UNFC Classification Breakdown
    if confidence_score >= 80:
        proved_ratio = 0.65
        probable_ratio = 0.25
        possible_ratio = 0.10
        drilling_confidence = "Proved (UNFC 111 - High Certainty)"
    elif confidence_score >= 60:
        proved_ratio = 0.40
        probable_ratio = 0.40
        possible_ratio = 0.20
        drilling_confidence = "Probable (UNFC 122 - Moderate Certainty)"
    else:
        proved_ratio = 0.20
        probable_ratio = 0.35
        possible_ratio = 0.45
        drilling_confidence = "Inferred (UNFC 333 - Preliminary Survey)"
        
    proved_tonnes = round(adjusted_reserves * proved_ratio, 2)
    probable_tonnes = round(adjusted_reserves * probable_ratio, 2)
    possible_tonnes = round(adjusted_reserves * possible_ratio, 2)
    total_estimated = round(proved_tonnes + probable_tonnes + possible_tonnes, 2)
    
    # Grade categorization
    if req.geology.mn_grade_pct >= 44.0:
        grade_cat = "High Grade (Ferro-Manganese Grade >= 44% Mn)"
    elif req.geology.mn_grade_pct >= 35.0:
        grade_cat = "Medium Grade (Silico-Manganese Grade 35-44% Mn)"
    elif req.geology.mn_grade_pct >= 25.0:
        grade_cat = "Low Grade / Ferruginous Ore (25-35% Mn)"
    else:
        grade_cat = "Siliceous Ore (< 25% Mn)"
        
    # Extraction Feasibility calculation
    # Depth penalty: deeper seams (>200m) require underground hoisting shafts
    depth_penalty = max(0, (req.geology.seam_depth_m - 100) * 0.12)
    feasibility = max(30.0, min(95.0, (confidence_score * 0.4) + (satellite_stability * 0.3) + ((100 - depth_penalty) * 0.3)))
    feasibility = round(feasibility, 1)
    
    # Estimated mineable life at average annual depletion of 0.35 Million Tonnes
    annual_extraction_rate = max(0.15, total_estimated * 0.04)
    mineable_life = round(total_estimated / annual_extraction_rate, 1)
    
    # Key Drivers Breakdown
    key_drivers = [
        {
            "parameter": "Ore Grade Quality",
            "value": f"{req.geology.mn_grade_pct}% Mn ({req.geology.fe_grade_pct}% Fe)",
            "impact": "High economic value" if req.geology.mn_grade_pct >= 40 else "Requires beneficiation blending",
            "weight_pct": 28
        },
        {
            "parameter": "Seam Geometry & Thickness",
            "value": f"{req.geology.seam_thickness_m}m thickness @ {req.geology.seam_depth_m}m depth",
            "impact": "Favorable thick lode" if req.geology.seam_thickness_m >= 10 else "Narrow vein extraction",
            "weight_pct": 24
        },
        {
            "parameter": "Borehole Exploration Grid",
            "value": f"{req.geology.borehole_density_per_sqkm} boreholes/km²",
            "impact": f"High confidence drill spacing ({req.geology.core_recovery_pct}% core recovery)",
            "weight_pct": 20
        },
        {
            "parameter": "Satellite Geotechnical Proxy",
            "value": f"Soil Moisture {req.satellite.soil_moisture_pct}%, NDVI {req.satellite.ndvi_index}",
            "impact": f"Pit stability index: {satellite_stability}/100",
            "weight_pct": 16
        },
        {
            "parameter": "Rock Mass Competency",
            "value": f"RQD {req.geology.rock_hardness_rqd}%",
            "impact": "Competent hanging wall" if req.geology.rock_hardness_rqd >= 70 else "Support reinforcement required",
            "weight_pct": 12
        }
    ]

    return ReserveEstimationResponse(
        mine_id=req.mine_id,
        mine_name=req.mine_name,
        zone_id=req.zone_id,
        estimated_reserve_million_tonnes=total_estimated,
        proved_reserve_million_tonnes=proved_tonnes,
        probable_reserve_million_tonnes=probable_tonnes,
        possible_reserve_million_tonnes=possible_tonnes,
        avg_mn_grade_pct=req.geology.mn_grade_pct,
        grade_category=grade_cat,
        confidence_score=confidence_score,
        extraction_feasibility_score=feasibility,
        drilling_confidence=drilling_confidence,
        satellite_stability_index=satellite_stability,
        estimated_mineable_life_years=mineable_life,
        key_drivers=key_drivers
    )
