# Car Price Estimator - Implementation Guide

**Version:** 1.0  
**Last Updated:** November 27, 2025  
**Author:** Vuong Nguyen

---

## 📑 Table of Contents

1. [Implementation Overview](#implementation-overview)
2. [Framework & Technology Stack](#framework--technology-stack)
3. [Project Structure](#project-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Running Each File](#running-each-file)
6. [Command-Line Options & Configuration](#command-line-options--configuration)
   
---

## Implementation Overview

### Architecture Layers

The Car Price Estimator is built as a **3-tier application**:

```
┌─────────────────────────────────────┐
│      Presentation Tier              │
│   (Frontend - HTML/CSS/JavaScript)  │
│  - index.html                       │
│  - car_price_app.js                 │
└────────────────┬────────────────────┘
                 │ HTTP/JSON
┌────────────────▼────────────────────┐
│      Application Tier               │
│   (Backend - Python Socket Server)  │
│  - server.py                        │
│  - Request routing & validation     │
│  - Rate limiting & CORS             │
└────────────────┬────────────────────┘
                 │ joblib
┌────────────────▼────────────────────┐
│      Data/Model Tier                │
│   (ML Models & Encoders)            │
│  - best_model.pkl (CatBoost)        │
│  - *_encoder.pkl (10 encoders)      │
│  - cost_of_living_us_city.csv       │
└─────────────────────────────────────┘
```

### Implementation Phases

| Phase | Component | Status |
|-------|-----------|--------|
| **Phase 1** | Data Collection & Preparation | ✅ Complete |
| **Phase 2** | ML Model Development & Training | ✅ Complete |
| **Phase 3** | Model Serialization & Export | ✅ Complete |
| **Phase 4** | Backend API Development | ✅ Complete |
| **Phase 5** | Frontend UI Development | ✅ Complete |
| **Phase 6** | Integration & Testing | ✅ Complete |
| **Phase 7** | Deployment Ready | ✅ Complete |

---

## Framework & Technology Stack

### Backend Framework Specifications

**Custom HTTP Server Implementation**
- **Language:** Python 3.7+
- **Protocol:** HTTP/1.1
- **Architecture:** Synchronous multi-threaded socket server
- **Port:** 4390 (customizable)
- **Host:** 127.0.0.1 (localhost only)

### Frontend Framework Specifications

**Vanilla JavaScript (No Framework)**
- **HTML5:** Semantic markup
- **CSS3:** Grid layout, Flexbox, animations
- **ES6+ JavaScript:** Modern JS without build tools
- **API Client:** Fetch API (native browser)


### ML Framework Specifications

**CatBoost Gradient Boosting**
- **Model Type:** CatBoostRegressor
- **Training Platform:** Google Colab / Jupyter
- **Serialization Format:** Pickle (.pkl)
- **Supporting Libraries:**
  - Scikit-learn (preprocessing & metrics)
  - Pandas (data manipulation)
  - NumPy (numerical computing)
  - Joblib (model/encoder serialization)

---

## Project Structure

### Complete Directory Tree

```
car price estimator/
│
├── 📄 server.py                          # Main backend application
├── 📄 index.html                         # Frontend interface
├── 📄 car_price_app.js                   # Frontend logic
├── 📄 car_price_prediction.ipynb         # Model training notebook
├── 📄 cost_of_living_us_city.csv         # Location data reference
├── 📄 PROJECT_REPORT.md                  # Comprehensive documentation
├── 📄 IMPLEMENTATION_GUIDE.md             # This file
│
└── 📁 model_n_encoder/                   # ML Model artifacts
    ├── best_model.pkl                    # Trained CatBoost (main)
    ├── category_encoder.pkl              # Ordinal encoder
    ├── color_encoder.pkl                 # Ordinal encoder
    ├── fuel_encoder.pkl                  # Ordinal encoder
    ├── gear_box_encoder.pkl              # Ordinal encoder
    ├── drive_wheel_encoder.pkl           # Ordinal encoder
    ├── manufacturer_encoder.pkl          # Target encoder
    ├── model_encoder.pkl                 # Target encoder
    ├── city_encoder.pkl                  # Target encoder
    └── state_encoder.pkl                 # Target encoder
```

### File Descriptions

| File | Purpose | Size | Type |
|------|---------|------|------|
| `server.py` | HTTP server, API endpoints, request processing | ~350 lines | Python |
| `index.html` | HTML form interface, layout, styling | ~400 lines | HTML |
| `car_price_app.js` | Form handling, validation, API calls | ~280 lines | JavaScript |
| `car_price_prediction.ipynb` | Data pipeline, model training, evaluation | ~40 cells | Jupyter |
| `best_model.pkl` | Trained CatBoost regression model | ~50MB | Binary |
| `*_encoder.pkl` | Feature encoders (10 files) | ~5MB total | Binary |

---

## Step-by-Step Implementation

### Step 1: Data Collection & Preparation

**Files Involved:** `car_price_prediction.ipynb`, `cost_of_living_us_city.csv`

**Process:**
1. Download Kaggle Car Price Prediction dataset via `kagglehub`
2. Load CSV into Pandas DataFrame
3. Load cost-of-living CSV reference data
4. Expand dataset by 30% using stratified resampling
5. Assign random city/state combinations
6. Normalize prices using cost-of-living formula

**Output:** Enhanced dataset with ~8,000 records

---

### Step 2: Feature Engineering & Data Cleaning

**Files Involved:** `car_price_prediction.ipynb`

**Data Cleaning Steps:**

| Step | Operation | Rationale |
|------|-----------|-----------|
| 1 | Remove Price > $200k | Outliers outside training range |
| 2 | Exclude Prod. year < 1985 | Old vehicles are outliers |
| 3 | Decode Mileage string | Convert "50000km" → 50000 |
| 4 | Extract Turbo flag | Separate from Engine volume field |
| 5 | Convert Wheel to binary | "Left wheel"=0, "Right-hand"=1 |
| 6 | Encode Leather interior | "Yes"=1, "No"=0 |

**Result:** 18 final features optimized for model training

---

### Step 3: Encoding & Scaling

**Files Involved:** `car_price_prediction.ipynb`

**Encoding Strategy:**

```
High-Cardinality Features (many unique values):
├── Manufacturer (50+ values) → Target Encoding (smooth=20)
├── Model (300+ values) → Target Encoding (smooth=10)
├── City (50+ values) → Target Encoding (smooth='auto')
└── State (50 values) → Target Encoding (smooth='auto')

Medium-Cardinality Features (10-20 values):
├── Category → Ordinal Encoding
├── Color → Ordinal Encoding
├── Fuel Type → Ordinal Encoding
├── Gear Box Type → Ordinal Encoding
└── Drive Wheels → Ordinal Encoding

Low-Cardinality Features (2-3 values):
├── Leather interior → Binary (0/1)
├── Wheel → Binary (0/1)
└── Turbo → Binary (0/1)

Numeric Features:
├── Engine volume → StandardScaler
├── Mileage → StandardScaler
├── Cylinders → As-is
├── Airbags → As-is
└── Age, Mileage_per_year → StandardScaler
```

**Scaling:**
```python
scaler = StandardScaler()
numeric_cols = ['Manufacturer', 'Model', 'Engine volume', 'Mileage', 
                'City', 'State', 'Age', 'Mileage_per_year']
data_scaled[numeric_cols] = scaler.fit_transform(data_scaled[numeric_cols])
```

---

### Step 4: Model Selection & Training

**Files Involved:** `car_price_prediction.ipynb`

**Baseline Model Evaluation:**

```
Models Tested:
├── CatBoost ..................... Test R²: 0.78 ✅ SELECTED
├── XGBoost ...................... Test R²: 0.76
├── Random Forest ................ Test R²: 0.75
├── Gradient Boosting ............ Test R²: 0.58
├── AdaBoost ..................... Test R²: 0.68
├── Linear Regression ............ Test R²: 0.43
├── SVR .......................... Test R²: 0.02
└── KNN .......................... Test R²: 0.56
```

---

### Step 5: Hyperparameter Tuning

**Files Involved:** `car_price_prediction.ipynb`

**Tuning Strategy: RandomizedSearchCV**

---

### Step 6: Model & Encoder Serialization

**Files Involved:** `car_price_prediction.ipynb`

**Export Process:**

```python
import joblib as jb

# Save model
jb.dump(best_model, 'best_model.pkl')

# Save all encoders
jb.dump(category_encoder, 'category_encoder.pkl')
jb.dump(color_encoder, 'color_encoder.pkl')
jb.dump(fuel_encoder, 'fuel_encoder.pkl')
jb.dump(gear_box_encoder, 'gear_box_encoder.pkl')
jb.dump(drive_wheel_encoder, 'drive_wheel_encoder.pkl')
jb.dump(manufacturer_encoder, 'manufacturer_encoder.pkl')
jb.dump(model_encoder, 'model_encoder.pkl')
jb.dump(city_encoder, 'city_encoder.pkl')
jb.dump(state_encoder, 'state_encoder.pkl')
```

**Artifacts Generated:** 11 .pkl files (~55MB total)

---

### Step 7: Backend Server Implementation

**Files Involved:** `server.py`

**Architecture:**

```
HTTP Server (127.0.0.1:4390)
│
├── Socket Layer
│   └── AF_INET, SOCK_STREAM (IPv4, TCP)
│
├── Connection Handler
│   └── Threaded client connections
│
├── Request Parser
│   ├── Parse HTTP method, path, body
│   └── Handle multiline headers/body
│
├── Routing Engine
│   ├── GET / → Serve index.html
│   ├── GET /file.ext → Serve static assets
│   └── POST /api/predict → ML prediction
│
├── Rate Limiter
│   └── Track timestamps per IP, 1 req/sec
│
└── Response Builder
    └── HTTP/1.1 with appropriate headers/status
```

**Key Functions:**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `preprocessing_input()` | Preprocessing user input | Dict with car specifications | DataFrame |
| `make_prediction()` | Get price estimate | Preprocessed DataFrame | Dict with price |
| `parse_http_request()` | Parse raw HTTP | Raw bytes | method, path, body |
| `create_http_response()` | Build HTTP response | status code, type, body | HTTP bytes |
| `get_content_type()` | Get content of file based on file extension | filename | MIME string |
| `handle_client()` | Process single connection | socket, address | None |
| `check_rate_limit()` | Enforce 1 req/sec rule | IP address | boolean |

---

### Step 8: Frontend Interface Implementation

**Files Involved:** `index.html`, `car_price_app.js`

**HTML Structure:**

```
<form id="carForm">
├── Column 1: Basic Information
│   ├── Make selector (dropdown)
│   ├── Model selector (dynamic)
│   ├── Leather interior (checkbox)
│   ├── Production year (number input)
│   ├── Mileage (number input)
│   ├── Fuel type (dropdown)
│   ├── Color (dropdown)
│   ├── City (text input)
│   └── State (dropdown)
│
├── Column 2: Advanced Options
│   ├── Category (dropdown)
│   ├── Engine volume (number input)
│   ├── Cylinders (dropdown)
│   ├── Gear box type (dropdown)
│   ├── Drive wheels (dropdown)
│   ├── Wheel position (dropdown)
│   ├── Number of airbags (number input)
│   └── Turbo (radio buttons)
│
└── Submit button
    └── Triggers Fetch POST to /api/predict
```

---

## Running Each File

### 1. Running the Backend Server

python server.py
```

**Expected Output:**
```
```
============================================================
Car Price Estimator Server Started
Server running on: http://127.0.0.1:4390
Rate limit: 1 request per second per IP
Press Ctrl+C to stop the server
============================================================

model loaded successfully!
Load encoders successfull!
```

**Server Behavior:**
- Listens on port 4390
- Accepts connections on 127.0.0.1
- Loads model & encoders automatically
- Displays client requests as they arrive
- Continues until Ctrl+C is pressed

**Stopping the Server:**
```powershell
# Press Ctrl+C in the terminal
# Or run in another terminal:
taskkill /PID <process_id> /F
```

---

### 2. Accessing the Frontend

** Direct Browser Access**
```
1. Start the backend server (python server.py)
2. Open web browser
3. Navigate to: http://127.0.0.1:4390
4. Form loads automatically
5. Fill in car details
6. Click "Estimate Price"
```

**Frontend Files:**
- `index.html` - Served automatically on GET /
- `car_price_app.js` - Loaded via <script> tag
- CSS - Embedded in <style> tag

---

## Command-Line Options & Configuration

### Server Configuration Options

**Current Configuration (Hardcoded):**
```python
host = '127.0.0.1'      # Localhost only
port = 4390             # Custom port
rate_limit_per_second = 1  # One request per second per IP
```

**To Modify Configuration:**

#### Edit server.py directly

```python
# In server.py, __main__ section:
if __name__ == '__main__':
    host = '0.0.0.0'        # Change to accept external connections
    port = 5000             # Change port
    rate_limit_per_second = 2  # Allow 2 requests/second
    # ... rest of code
```
---

### Configurable Parameters

| Parameter | Current | Min | Max | Note |
|-----------|---------|-----|-----|------|
| Host | 127.0.0.1 | - | - | Change to 0.0.0.0 for external |
| Port | 4390 | 1024 | 65535 | Avoid privileged ports <1024 |
| Rate Limit | 1 req/sec | 0.1 | 100 | Per IP address |
| Connection Queue | 5 | 1 | 100 | Max pending connections |
| Socket Timeout | 1 sec | 0.1 | 10 | Accept loop timeout |
| Request Buffer | 4096 bytes | 1024 | 65536 | Max request size |

---

## Additional Resources

- **Python Documentation:** https://docs.python.org/3/
- **Pandas Guide:** https://pandas.pydata.org/docs/
- **CatBoost Documentation:** https://catboost.ai/en/docs/
- **JavaScript Reference:** https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **HTTP Protocol:** https://developer.mozilla.org/en-US/docs/Web/HTTP

---

**Last Updated:** November 27, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅

