# pyrefly: ignore [missing-import]
import numpy as np
from typing import List
from app.models.schemas import (
    ShortfallPredictionRequest,
    ShortfallPredictionResponse,
    ForecastHorizon,
    FeatureImportanceItem
)


def predict_production_shortfall(req: ShortfallPredictionRequest) -> ShortfallPredictionResponse:
    """
    Time-series & operational risk forecasting engine for manganese production shortfalls.
    Combines machine health (uptime, MTBF), weather anomalies (monsoon rainfall index),
    haul fleet capacity, and historical variance trends.
    """
    target = req.target_monthly_tonnes
    uptime = req.current_equipment_uptime_pct
    rainfall = req.forecast_rainfall_next_30d_mm
    mtbf = req.mean_time_between_failures_hrs
    
    # Calculate historical compliance and variance
    if req.historical_production and len(req.historical_production) > 0:
        actuals = [p.actual_tonnes for p in req.historical_production]
        targets = [p.target_tonnes for p in req.historical_production]
        ratios = [a / max(1.0, t) for a, t in zip(actuals, targets)]
        hist_compliance_mean = float(np.mean(ratios))
        hist_std = float(np.std(ratios)) if len(ratios) > 1 else 0.08
    else:
        hist_compliance_mean = 0.92
        hist_std = 0.08
        
    # --- Feature Risk Drivers ---
    # 1. Equipment Uptime Deficit: baseline is 85% uptime
    uptime_deficit = max(0.0, 85.0 - uptime)
    equipment_risk_weight = (uptime_deficit / 85.0) * 1.6  # scaled impact
    
    # 2. MTBF Risk: healthy MTBF is > 160 hrs
    mtbf_risk_weight = max(0.0, (160.0 - mtbf) / 160.0) * 0.8
    
    # 3. Monsoon / Rainfall Impact: > 120mm/month creates pit waterlogging & haul road slippage
    if rainfall > 120.0:
        rain_risk_weight = min(0.35, ((rainfall - 120.0) / 200.0) * 0.45)
    else:
        rain_risk_weight = 0.02
        
    # 4. Haul Fleet Constraint (excavator-to-dumper ratio ideally 1:3)
    ideal_dumper_count = req.active_excavator_count * 3
    if req.active_dumper_count < ideal_dumper_count:
        fleet_shortage_weight = ((ideal_dumper_count - req.active_dumper_count) / ideal_dumper_count) * 0.15
    else:
        fleet_shortage_weight = 0.0
        
    # 5. Grade Dilution / Seam Hardness factor
    grade_risk_weight = (req.grade_dilution_risk_pct / 100.0) * 0.12
    
    # Total Composite Risk Index (0.0 to 1.0)
    total_risk_factor = (
        equipment_risk_weight * 0.35 +
        mtbf_risk_weight * 0.15 +
        rain_risk_weight * 0.25 +
        fleet_shortage_weight * 0.15 +
        grade_risk_weight * 0.10 +
        (max(0, 1.0 - hist_compliance_mean) * 0.20)
    )
    
    # Bound risk factor
    risk_score_pct = round(min(98.0, max(5.0, total_risk_factor * 100.0)), 1)
    
    # Categorize overall risk level
    if risk_score_pct >= 65.0:
        overall_risk_level = "CRITICAL"
        primary_bottleneck = "Severe equipment downtime and monsoon precipitation risk"
    elif risk_score_pct >= 40.0:
        overall_risk_level = "HIGH"
        primary_bottleneck = "Sub-optimal machine availability & haulage bottleneck"
    elif risk_score_pct >= 20.0:
        overall_risk_level = "MODERATE"
        primary_bottleneck = "Minor scheduling variance and weather fluctuation"
    else:
        overall_risk_level = "LOW"
        primary_bottleneck = "Normal operational parameters within target tolerance"

    # Multi-Horizon Forecasts (30, 60, 90 Days)
    horizons: List[ForecastHorizon] = []
    horizon_configs = [
        {"days": 30, "multiplier": 1.0, "decay": 1.0, "uncertainty": 0.06},
        {"days": 60, "multiplier": 2.0, "decay": 0.95, "uncertainty": 0.11},
        {"days": 90, "multiplier": 3.0, "decay": 0.90, "uncertainty": 0.16}
    ]
    
    for hc in horizon_configs:
        days = hc["days"]
        h_target = target * hc["multiplier"]
        
        # Expected realization factor
        h_realization = max(0.60, min(1.02, 1.0 - (total_risk_factor * hc["decay"])))
        pred_prod = round(h_target * h_realization, 0)
        pred_shortfall = round(max(0.0, h_target - pred_prod), 0)
        
        # Confidence bands
        unc = hc["uncertainty"] + (hist_std * 0.5)
        conf_lower = round(max(0.0, pred_prod * (1.0 - unc)), 0)
        conf_upper = round(min(h_target * 1.08, pred_prod * (1.0 + unc)), 0)
        
        # Horizon probability
        h_prob = round(min(99.0, max(5.0, (pred_shortfall / max(1.0, h_target)) * 140.0 + (risk_score_pct * 0.4))), 1)
        
        if h_prob >= 65:
            h_level = "CRITICAL"
        elif h_prob >= 40:
            h_level = "HIGH"
        elif h_prob >= 20:
            h_level = "MODERATE"
        else:
            h_level = "LOW"
            
        horizons.append(ForecastHorizon(
            horizon_days=days,
            predicted_production_tonnes=pred_prod,
            predicted_shortfall_tonnes=pred_shortfall,
            confidence_lower_tonnes=conf_lower,
            confidence_upper_tonnes=conf_upper,
            shortfall_probability_pct=h_prob,
            risk_level=h_level
        ))
        
    # Feature Importance (SHAP-like breakdown)
    # Sum normalized impacts
    raw_impacts = {
        "Equipment Uptime & Breakdown Hours": max(10.0, equipment_risk_weight * 100),
        "Monsoon Rain & Soil Saturation": max(5.0, rain_risk_weight * 100),
        "Mean Time Between Failures (MTBF)": max(5.0, mtbf_risk_weight * 100),
        "Haul Fleet & Dumper Ratio": max(4.0, fleet_shortage_weight * 100),
        "Grade Dilution & Seam Hardness": max(3.0, grade_risk_weight * 100),
        "Historical Variance Baseline": max(4.0, (1.0 - hist_compliance_mean) * 50)
    }
    total_imp = sum(raw_impacts.values())
    
    feature_importance: List[FeatureImportanceItem] = []
    descriptions = {
        "Equipment Uptime & Breakdown Hours": f"Current fleet availability at {uptime}% vs standard 85% threshold",
        "Monsoon Rain & Soil Saturation": f"Forecasted {rainfall}mm precipitation affecting opencast haul roads and blasting",
        "Mean Time Between Failures (MTBF)": f"MTBF currently at {mtbf} hrs indicates high unscheduled stoppage risk",
        "Haul Fleet & Dumper Ratio": f"{req.active_dumper_count} dumpers deployed vs {ideal_dumper_count} optimal matching capacity",
        "Grade Dilution & Seam Hardness": f"{req.grade_dilution_risk_pct}% estimated dilution at active extraction faces",
        "Historical Variance Baseline": f"Past 6-month fulfillment trend averaging {round(hist_compliance_mean*100, 1)}%"
    }
    
    for feat_name, feat_val in sorted(raw_impacts.items(), key=lambda x: x[1], reverse=True):
        norm_pct = round((feat_val / total_imp) * 100.0, 1)
        feature_importance.append(FeatureImportanceItem(
            feature=feat_name,
            impact_pct=norm_pct,
            direction="increase_risk" if norm_pct > 15 else "decrease_risk",
            description=descriptions.get(feat_name, "")
        ))

    # Revenue Risk in INR Crores (MOIL Manganese benchmark ~₹12,500/tonne = 0.00125 Crore/t)
    price_per_tonne_crore = 0.00125
    rev_risk_crores = round(horizons[0].predicted_shortfall_tonnes * price_per_tonne_crore, 2)
    
    # Natural Language Explanation
    h30 = horizons[0]
    explanation = (
        f"For {req.mine_name}, the AI model forecasts a {h30.shortfall_probability_pct}% probability "
        f"of producing {int(h30.predicted_production_tonnes):,} tonnes against the target of "
        f"{int(target):,} tonnes over the next 30 days (projected shortfall: {int(h30.predicted_shortfall_tonnes):,} tonnes, "
        f"revenue at risk: ₹{rev_risk_crores} Cr). The primary driver is '{feature_importance[0].feature}' "
        f"({feature_importance[0].impact_pct}% contribution), compounded by '{feature_importance[1].feature}' "
        f"({feature_importance[1].impact_pct}% contribution). Proactive equipment overhaul and rescheduling "
        f"blasting shifts prior to monsoon precipitation windows are strongly advised."
    )

    return ShortfallPredictionResponse(
        mine_id=req.mine_id,
        mine_name=req.mine_name,
        overall_risk_level=overall_risk_level,
        risk_score_pct=risk_score_pct,
        forecast_horizons=horizons,
        primary_bottleneck=primary_bottleneck,
        feature_importance=feature_importance,
        plain_language_explanation=explanation,
        estimated_revenue_risk_inr_crores=rev_risk_crores
    )
