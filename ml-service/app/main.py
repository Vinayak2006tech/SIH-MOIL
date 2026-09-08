from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import (
    ReserveEstimationRequest,
    ReserveEstimationResponse,
    ShortfallPredictionRequest,
    ShortfallPredictionResponse,
    RecommendationResponse,
    SatellitePassRequest,
    SatellitePassResponse
)
from app.services.reserve_estimation import estimate_mine_reserves
from app.services.shortfall_prediction import predict_production_shortfall
from app.services.recommendation_engine import generate_corrective_recommendations
from app.services.satellite_processor import process_satellite_pass

app = FastAPI(
    title="MOIL ReserveIQ ML Service",
    description="AI/ML Microservice for Manganese Ore Reserve Estimation, Shortfall Forecasting, and Prescriptive Mining Action Recommendations.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MOIL ReserveIQ ML Engine",
        "version": "1.0.0",
        "modules": [
            "reserve_estimation (JORC/UNFC Volumetric)",
            "shortfall_prediction (Time-Series & Risk Attribution)",
            "recommendation_engine (Prescriptive Decision AI)",
            "satellite_processor (Sentinel-2 / MODIS Telemetry)"
        ]
    }


@app.post("/predict/reserves", response_model=ReserveEstimationResponse)
def api_estimate_reserves(request: ReserveEstimationRequest):
    try:
        return estimate_mine_reserves(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reserve estimation error: {str(e)}")


@app.post("/predict/shortfall", response_model=ShortfallPredictionResponse)
def api_predict_shortfall(request: ShortfallPredictionRequest):
    try:
        return predict_production_shortfall(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shortfall prediction error: {str(e)}")


@app.post("/recommendations", response_model=RecommendationResponse)
def api_generate_recommendations(request: ShortfallPredictionRequest):
    try:
        pred = predict_production_shortfall(request)
        return generate_corrective_recommendations(request, pred)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")


@app.post("/satellite/pass", response_model=SatellitePassResponse)
def api_satellite_pass(request: SatellitePassRequest):
    try:
        return process_satellite_pass(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Satellite telemetry error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
