# MOIL ReserveIQ ⛏️🛰️

**AI/ML-Powered Manganese Ore Reserve Estimation & Production Shortfall Prediction System**  
*Built for MOIL Limited (Under the Ministry of Steel, Government of India)*

---

## 📌 Problem Context & Executive Summary
**MOIL Limited** is India’s largest manganese ore producer, meeting over 50% of the nation's domestic steel industry requirement through key underground and opencast mines in Central India (Balaghat, Bhandara, and Nagpur districts). 

Traditionally, reserve estimation and production quota planning have relied on manual geological surveys, static paper drilling logs, and historical dispatch spreadsheets. This disconnect leads to:
1. **Reserve Estimation Uncertainty**: Discrepancies between inferred core samples and realized in-situ ore tonnage.
2. **Unplanned Production Shortfalls**: Sudden equipment breakdowns and monsoon ground saturation causing 10–25% monthly quota deficits.
3. **Reactive Interventions**: Delayed shift reallocations, leading to contractual penalties and blast misfires.

**MOIL ReserveIQ** unifies authentic sub-surface geology, operational fleet telemetry, and space-tech Earth Observation proxies into an explainable, prescriptive intelligence dashboard with **100% transparent data provenance**.

---

## 🏛️ Data Provenance & Traceability Architecture

MOIL ReserveIQ adheres to strict data integrity standards: **every number on the dashboard is traceable to its verified public source or explicitly marked as demonstration data.**

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      MOIL ReserveIQ Frontend                           │
 │  React 18 + Vite + TypeScript + Tailwind CSS + Leaflet + Recharts      │
 │  - Interactive Provenance Badges on all KPIs & Charts                  │
 │  - Data Provenance & Traceability Registry (/data-sources)             │
 └───────────────────▲────────────────────────────────▲───────────────────┘
                     │ (REST / Cookie JWT)            │
 ┌───────────────────▼────────────────────────────────▼───────────────────┐
 │                       Node.js / Express Backend                        │
 │  - Data Sources API (/api/data-sources)                                │
 │  - Authentic National Reserves (121.97 Mt) & Annual Records (19.07 L t)│
 │  - Strict Segregation of Synthetic Datasets                            │
 └───────────────────▲────────────────────────────────▲───────────────────┘
                     │                                │ (HTTP / JSON)
 ┌───────────────────▼──────────────┐   ┌─────────────▼───────────────────┐
 │      Authentic Data Layer        │   │       FastAPI ML Microservice   │
 │  - MOIL 64th Annual Report       │   │  - Ridge & RF Shortfall Models  │
 │  - IBM National Mineral Inventory│   │  - Model Feature Importances    │
 │  - Sentinel-2 & MODIS Telemetry  │   │  - UNFC Reserve Volume Engine   │
 │  - IMD Rainfall Correlation      │   │  - Prescriptive Action Engine   │
 └──────────────────────────────────┘   └─────────────────────────────────┘
```

### Verified Data Sources Registry

| Source ID | Dataset Name | Publisher / Origin | Provenance Type | Verification Status | Source Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src-usgs-manganese-2024` | Global Manganese Reserves & Mine Production | U.S. Geological Survey (USGS 2024/2025) | `PUBLIC_GOVERNMENT` | Verified Global Record (1,900 Mt Mn) | [pubs.usgs.gov/periodicals/mcs2024](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-manganese.pdf) |
| `src-imni-global-market` | International Seaborne Trade & CIF Pricing | International Manganese Institute (IMnI) | `PUBLIC_GOVERNMENT` | Verified Seaborne Index (36.8 Mt Trade) | [manganese.org/market-research](https://www.manganese.org/market-research) |
| `src-moes-isa-deepsea` | Deep-Sea Polymetallic Manganese Nodules | ISA & Ministry of Earth Sciences (MoES) | `PUBLIC_GOVERNMENT` | Verified Ocean Claim (380 Mt CIOB) | [isa.org.jm/exploration-contracts](https://www.isa.org.jm/exploration-contracts/polymetallic-nodules/) |
| `src-moil-ar-2025` | MOIL Annual Production & Sales Trajectory | MOIL Limited (Ministry of Steel) | `OFFICIAL_MOIL` | Verified Public Statutory Record | [moil.nic.in/annual-reports](https://www.moil.nic.in/annual-reports) |
| `src-ibm-nmi-manganese` | National Mineral Inventory (Manganese) | Indian Bureau of Mines (IBM) | `PUBLIC_GOVERNMENT` | Verified Public Record (121.97 Mt) | [ibm.gov.in/mineral-inventory](https://ibm.gov.in/index.php/page/mineral-inventory) |
| `src-copernicus-sentinel2` | Sentinel-2 MSI Multi-Spectral Telemetry | European Space Agency (ESA) | `PUBLIC_SATELLITE` | Open Earth Observation (10m) | [dataspace.copernicus.eu](https://browser.dataspace.copernicus.eu/) |
| `src-nasa-modis-central-india` | NASA MODIS Land Surface Temp & Rainfall | NASA EOSDIS / Land Processes DAAC | `PUBLIC_SATELLITE` | Open Earth Observation (250m) | [earthdata.nasa.gov](https://www.earthdata.nasa.gov/) |
| `src-imd-weather` | Central India District Precipitation Index | India Meteorological Department | `PUBLIC_WEATHER` | Open Meteorological Data | [mausam.imd.gov.in](https://mausam.imd.gov.in/) |
| `src-ministry-mines-leases` | MOIL Mining Leasehold Registry (MP/MH) | Ministry of Mines / MOIL Divisions | `OFFICIAL_MOIL` | Verified Statutory Lease Database | [mines.gov.in](https://mines.gov.in/) |
| `src-synthetic-boreholes` | Calibrated Diamond Core Drilling Assays | MOIL ReserveIQ Simulation Engine | `SYNTHETIC_DEMO` | Calibrated Demonstration Data | Internal Asset (`/data/synthetic/`) |
| `src-synthetic-equipment` | HEMM Fleet Machine Breakdown SCADA | MOIL ReserveIQ Reliability Engine | `SYNTHETIC_DEMO` | Calibrated Demonstration Data | Internal Asset (`/data/synthetic/`) |

---

## 🛰️ Earth Observation & Space-Tech Integration

| Satellite Sensor | Spatial / Temporal Res | Target Proxy Metric | Mining Operational Value |
| :--- | :--- | :--- | :--- |
| **Copernicus Sentinel-2 (MSI)** | 10m / 5-day revisit | **NDVI (Bands 4 & 8)** | Ground clearing monitoring, overburden dump vegetative disturbance. |
| **NASA MODIS / GPM Radar** | 250m / 1-day revisit | **Soil Moisture % & Rainfall** | Bench saturation proxy, pit slope slide warnings, blast window planning. |
| **MODIS MOD11A2** | 1km / 8-day composite | **Land Surface Temp (°C)** | Tailing pond thermal anomalies, underground shaft exhaust mapping. |

---

## 🧠 ML / Predictive Service Architecture

Located in `/ml-service`:
1. **`reserve_estimation.py`**:
   - Computes in-situ manganese ore volume: $\text{Reserves (Mt)} = \text{Area} \times \text{Thickness} \times \text{Bulk Density} \times \text{Core Recovery Factor}$.
   - Classifies reserves into **Proved (UNFC 111)**, **Probable (UNFC 122)**, and **Inferred (UNFC 333)** tiers based on borehole grid density ($\text{holes/km}^2$) and RQD rock mass hardness.
   - **Geostatistical Reserve Probability Field (Indicator Kriging)**: Generates 2D/3D spatial probability maps ($P(\text{Ore} \ge \text{Cutoff})$), Spherical variograms ($\text{Range} = 1,450\text{m}$, Anisotropy $2.24:1$ along Sausar strike $075^\circ$), and interactive Grade-Tonnage curves.
2. **`shortfall_prediction.py`**:
   - Time-series and operational regression model trained on authentic MOIL historical production records and IMD weather seasonality.
   - Computes **Model-Derived Feature Importance** attributions (Equipment Downtime %, Monsoon Anomaly, Haul Fleet Constraint, Grade Dilution).
   - Generates plain-language natural language explanations and 30/60/90-day forecast intervals with upper/lower confidence bounds.
3. **`recommendation_engine.py`**:
   - Prescriptive rule-and-model-informed engine mapping identified risk vectors to high-ROI corrective actions (e.g. advance blasting shift, redeploy dumpers, overhaul excavator hydraulic seals).
   - Maintains a **Closed-Loop Feedback Table** to measure realized tonnage gains vs projected benefits.
4. **`satellite_processor.py`**:
   - Ingests and processes multispectral band values into geotechnical pit stability indices.

---

## 🚀 Quickstart & Setup

### Option 1: Native Local Development

#### 1. Start Python ML Microservice
```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

#### 2. Start Node.js + Express Backend
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5001` with fallback in-memory store if MongoDB is not present.*

#### 3. Start React + Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with reverse proxy to `http://localhost:5001`.*

---

## 🧪 Verification & Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Director / Admin** | `vaishayvinayak@gmail.com` | `vinayak@2006` | Full Control, Data Ingestion, Fleet Management, Prescriptive Overrides |
| **Mine Planner** | `planner@balaghat.moil.gov.in` | `planner123` | Simulation & What-If Sandbox, Re-Estimation, Action Approvals |
| **Executive Viewer** | `auditor@steel.gov.in` | `auditor123` | Read-Only KPI Analytics, GIS Maps, Export Reports |

---

## 📊 SIH Hackathon Evaluation Highlights

- **Authentic Data Grounding**: Built using official MOIL annual reports (19.07 Lakh tonnes record output), IBM National Mineral Inventory (121.97 Mt reserves/resources), and Copernicus Sentinel-2 MSI data.
- **Explainable AI (XAI)**: Scikit-learn Random Forest model feature importances quantify exact drivers of production shortfalls (e.g. 40.9% weather saturation, 32.1% equipment downtime).
- **Interactive Provenance Badges**: Every chart, table, and metric displays an interactive provenance tag allowing judges to inspect publication dates, citations, and source URLs.
- **Closed-Loop Feedback**: Tracks AI recommendation adoption rate and validates realized tonnage gains against predicted ROI.
