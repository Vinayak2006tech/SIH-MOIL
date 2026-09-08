import uuid
from typing import List
from app.models.schemas import (
    ShortfallPredictionRequest,
    ShortfallPredictionResponse,
    RecommendationResponse,
    RecommendationItem
)


def generate_corrective_recommendations(
    req: ShortfallPredictionRequest,
    pred: ShortfallPredictionResponse
) -> RecommendationResponse:
    """
    Rule-informed and ML-guided prescriptive optimization engine.
    Maps identified risk factors to high-ROI corrective action cards.
    """
    recs: List[RecommendationItem] = []
    
    # 1. Weather / Blasting Recommendation
    if req.forecast_rainfall_next_30d_mm > 100.0:
        recs.append(RecommendationItem(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            mine_id=req.mine_id,
            mine_name=req.mine_name,
            title="Reschedule Shift B Blasting Ahead of Heavy Rainfall Window",
            category="Blasting Optimization",
            urgency="CRITICAL" if req.forecast_rainfall_next_30d_mm > 150 else "HIGH",
            description=(
                f"Satellite radar forecasts {req.forecast_rainfall_next_30d_mm}mm precipitation over the "
                f"next 10 days. Pre-emptively advance deep-hole blasting in Seam 3 to dry-weather shifts "
                f"to prevent bench waterlogging and misfires."
            ),
            action_steps=[
                "Advance explosive loading to Shift A (06:00 - 14:00)",
                "Deploy dewatering pump units P-04 and P-07 along Pit 2 drainage sump",
                "Ensure explosive magazine safety cover and moisture sealing check"
            ],
            expected_risk_reduction_pct=24.5,
            expected_tonnage_gain=3200.0,
            estimated_roi_inr_lakhs=40.0,
            status="PENDING",
            target_shift="Shift B (Evening) -> Shift A (Morning)"
        ))
        
    # 2. Equipment Uptime / Maintenance Recommendation
    if req.current_equipment_uptime_pct < 80.0 or req.mean_time_between_failures_hrs < 120.0:
        recs.append(RecommendationItem(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            mine_id=req.mine_id,
            mine_name=req.mine_name,
            title="Fast-Track Preventive Overhaul on High-Stoppage Excavators",
            category="Maintenance Scheduling",
            urgency="HIGH",
            description=(
                f"Current fleet uptime of {req.current_equipment_uptime_pct}% is below the 85% target. "
                f"MTBF telemetry indicates hydraulic pressure decay in primary face shovel."
            ),
            action_steps=[
                "Schedule priority 4-hour hydraulic seal replacement during shift changeover",
                "Dispatch mobile maintenance workshop van M-02 to active face",
                "Engage standby diesel generator to ensure continuous ventilation/hoisting"
            ],
            expected_risk_reduction_pct=28.0,
            expected_tonnage_gain=4500.0,
            estimated_roi_inr_lakhs=56.25,
            status="PENDING",
            target_equipment="Excavator EX-04 / Hydraulic Shovel HS-01"
        ))

    # 3. Fleet Redeployment / Matching Ratio Recommendation
    ideal_dumpers = req.active_excavator_count * 3
    if req.active_dumper_count < ideal_dumpers:
        deficit = ideal_dumpers - req.active_dumper_count
        recs.append(RecommendationItem(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            mine_id=req.mine_id,
            mine_name=req.mine_name,
            title=f"Redeploy {deficit} Dumpers from Low-Utilization Haul Routes",
            category="Fleet Redeployment",
            urgency="MEDIUM",
            description=(
                f"Excavator idle waiting time is elevated due to dumper deficit ({req.active_dumper_count} active vs "
                f"{ideal_dumpers} required). Redeploy haulers from low-burden waste dumps to primary manganese ore circuit."
            ),
            action_steps=[
                f"Transfer {deficit} 35-tonne haul trucks (DT-08, DT-11) to primary crusher loop",
                "Optimize haul route bypass via East Ramp to shave 4.2 minutes per cycle",
                "Enable RFID dispatch tracking at weighbridge checkpoint"
            ],
            expected_risk_reduction_pct=18.5,
            expected_tonnage_gain=2800.0,
            estimated_roi_inr_lakhs=35.0,
            status="PENDING",
            target_equipment="Dumper Haul Fleet"
        ))
        
    # 4. Grade Blending & Quality Control Recommendation
    if req.grade_dilution_risk_pct > 7.0:
        recs.append(RecommendationItem(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            mine_id=req.mine_id,
            mine_name=req.mine_name,
            title="Adjust Ore Stacking & Blending to Safeguard High-Grade Contracts",
            category="Grade Blending",
            urgency="MEDIUM",
            description=(
                f"Dilution risk is {req.grade_dilution_risk_pct}%. Blend medium-grade ore from Seam 4 (38% Mn) "
                f"with high-grade ore from Balaghat Deep Lode (46% Mn) at 60:40 ratio to satisfy Ferro-alloy specs."
            ),
            action_steps=[
                "Calibrate auto-sampler at secondary screening plant",
                "Enforce selective face mucking to minimize silica shale contamination",
                "Update daily dispatch grade certification for MOIL marketing division"
            ],
            expected_risk_reduction_pct=15.0,
            expected_tonnage_gain=1800.0,
            estimated_roi_inr_lakhs=22.5,
            status="PENDING"
        ))

    # Calculate total simulated risk reduction if all recommendations applied
    total_risk_red = sum(r.expected_risk_reduction_pct for r in recs)
    simulated_risk = max(5.0, round(pred.risk_score_pct * (1.0 - min(0.75, total_risk_red / 100.0)), 1))

    return RecommendationResponse(
        mine_id=req.mine_id,
        mine_name=req.mine_name,
        total_recommendations=len(recs),
        recommendations=recs,
        simulated_mitigated_risk_pct=simulated_risk
    )
