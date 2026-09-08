from app.models.schemas import (
    GeologicalFeatures,
    SatelliteFeatures,
    ReserveEstimationRequest,
    ShortfallPredictionRequest,
    ProductionHistoryPoint,
    SatellitePassRequest
)
from app.services.reserve_estimation import estimate_mine_reserves
from app.services.shortfall_prediction import predict_production_shortfall
from app.services.recommendation_engine import generate_corrective_recommendations
from app.services.satellite_processor import process_satellite_pass


def test_ml_pipeline():
    print("Testing Reserve Estimation...")
    res_req = ReserveEstimationRequest(
        mine_id="mine-balaghat-01",
        mine_name="Balaghat Underground Mine",
        area_sqkm=3.45,
        geology=GeologicalFeatures(
            seam_depth_m=385.0,
            seam_thickness_m=14.5,
            mn_grade_pct=46.2,
            fe_grade_pct=5.8,
            sio2_grade_pct=7.2,
            p_grade_pct=0.16,
            rock_hardness_rqd=82.0,
            borehole_density_per_sqkm=14.0,
            core_recovery_pct=91.0
        ),
        satellite=SatelliteFeatures(
            ndvi_index=0.34,
            soil_moisture_pct=28.5,
            rainfall_anomaly_mm=35.0,
            land_surface_temp_c=32.0,
            elevation_m=320.0
        )
    )
    res_res = estimate_mine_reserves(res_req)
    print(f" -> Total Reserves: {res_res.estimated_reserve_million_tonnes} Mt (Proved: {res_res.proved_reserve_million_tonnes} Mt)")
    print(f" -> Confidence: {res_res.confidence_score}% | Feasibility: {res_res.extraction_feasibility_score}%")

    print("\nTesting Shortfall Prediction...")
    sf_req = ShortfallPredictionRequest(
        mine_id="mine-balaghat-01",
        mine_name="Balaghat Underground Mine",
        target_monthly_tonnes=45000.0,
        current_equipment_uptime_pct=73.2,
        mean_time_between_failures_hrs=118.0,
        forecast_rainfall_next_30d_mm=145.0,
        historical_production=[
            ProductionHistoryPoint(
                month="2026-02",
                target_tonnes=45000,
                actual_tonnes=39600,
                equipment_uptime_pct=74.0,
                rainfall_mm=25.0,
                blasting_cycles=20,
                unplanned_downtime_hours=54.0
            )
        ],
        active_excavator_count=6,
        active_dumper_count=14,
        planned_blasting_shifts=20,
        grade_dilution_risk_pct=8.2
    )
    sf_res = predict_production_shortfall(sf_req)
    print(f" -> Risk Level: {sf_res.overall_risk_level} ({sf_res.risk_score_pct}%)")
    print(f" -> 30-Day Pred Production: {sf_res.forecast_horizons[0].predicted_production_tonnes} t (Shortfall: {sf_res.forecast_horizons[0].predicted_shortfall_tonnes} t)")
    print(f" -> Top Feature: {sf_res.feature_importance[0].feature} ({sf_res.feature_importance[0].impact_pct}%)")

    print("\nTesting Recommendations Engine...")
    rec_res = generate_corrective_recommendations(sf_req, sf_res)
    print(f" -> Generated {rec_res.total_recommendations} action cards.")
    for r in rec_res.recommendations:
        print(f"    * [{r.urgency}] {r.title} (Reduces risk by {r.expected_risk_reduction_pct}%)")

    print("\nTesting Satellite Telemetry...")
    sat_req = SatellitePassRequest(mine_id="mine-balaghat-01", latitude=21.8048, longitude=80.1849)
    sat_res = process_satellite_pass(sat_req)
    print(f" -> NDVI: {sat_res.ndvi}, Soil Moisture: {sat_res.soil_moisture_pct}%, Stability: {sat_res.geotechnical_pit_stability_risk}")

    print("\nALL ML MODULES PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    test_ml_pipeline()
