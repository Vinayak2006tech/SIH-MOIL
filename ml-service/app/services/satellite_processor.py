from datetime import datetime, timezone
import random
from app.models.schemas import SatellitePassRequest, SatellitePassResponse


def process_satellite_pass(req: SatellitePassRequest) -> SatellitePassResponse:
    """
    Simulates & processes multimodal Earth Observation telemetry (Copernicus Sentinel-2 & NASA MODIS/GPM)
    for pit slope stability, soil saturation, and vegetative disturbance monitoring over MOIL mining leases.
    """
    # Deterministic pseudo-randomness based on mine_id coordinates
    seed_val = int(abs(req.latitude * 1000 + req.longitude * 100))
    random.seed(seed_val)
    
    ndvi = round(random.uniform(0.22, 0.48), 3)
    soil_moisture = round(random.uniform(22.0, 48.0), 1)
    precip_rate = round(random.uniform(0.0, 18.5), 1)
    lst = round(random.uniform(28.0, 41.5), 1)
    cloud_cover = round(random.uniform(2.0, 35.0), 1)
    
    # Geotechnical pit stability advisory
    if soil_moisture > 40.0 or precip_rate > 12.0:
        stability_risk = "Alert (High Saturated Bench Risk)"
        blasting_window = "Restricted - Advise postponing open bench blasting by 24-48h"
    elif soil_moisture > 30.0:
        stability_risk = "Advisory (Moderate Surface Moisture)"
        blasting_window = "Standard - Implement trench drainage prior to charging"
    else:
        stability_risk = "Safe (Optimum Dry Conditions)"
        blasting_window = "Favorable - Optimal conditions for standard production blasting"

    return SatellitePassResponse(
        mine_id=req.mine_id,
        sensor=req.satellite_sensor,
        acquisition_timestamp=datetime.now(timezone.utc).isoformat(),
        ndvi=ndvi,
        soil_moisture_pct=soil_moisture,
        precipitation_rate_mm=precip_rate,
        land_surface_temp_c=lst,
        cloud_cover_pct=cloud_cover,
        geotechnical_pit_stability_risk=stability_risk,
        recommended_blasting_window=blasting_window
    )
