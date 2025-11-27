# Car Price Estimator - Implementation Guide

**Version:** 1.0  
**Last Updated:** November 27, 2025  
**Author:** Development Team

---

## 📑 Table of Contents

1. [Implementation Overview](#implementation-overview)
2. [Framework & Technology Stack](#framework--technology-stack)
3. [Project Structure](#project-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Running Each File](#running-each-file)
6. [Command-Line Options & Configuration](#command-line-options--configuration)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)

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

**Why Custom Server?**
- No external dependencies (socket is built-in)
- Full control over request handling
- Educational & lightweight implementation
- Easy rate limiting implementation
- Direct model access without REST framework overhead

### Frontend Framework Specifications

**Vanilla JavaScript (No Framework)**
- **HTML5:** Semantic markup
- **CSS3:** Grid layout, Flexbox, animations
- **ES6+ JavaScript:** Modern JS without build tools
- **API Client:** Fetch API (native browser)

**Why No Framework?**
- Minimal dependencies
- Fast loading times
- Simple deployment
- Direct DOM manipulation

### ML Framework Specifications

**CatBoost Gradient Boosting**
- **Version:** Latest (installed via pip)
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
| `cost_of_living_us_city.csv` | City location data with cost indices | 50+ rows | CSV |
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

**Key Operations:**
```python
# Download data
path = kagglehub.dataset_download("deepcontractor/car-price-prediction-challenge")

# Expand & augment
df = pd.concat([df, df.sample(frac=0.3, random_state=32)])

# Normalize pricing
m = df['Score'].mean()
df['Price'] = df['Price'] * df['Score'] / m
```

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

**Feature Engineering:**

```python
# Derived Features
data['Age'] = datetime.now().year - data['Prod. year']
data['Mileage_per_year'] = data['Mileage'] / (data['Age'] + 1)

# Feature Selection (by MI score)
# Drop: Doors (low MI), Prod. year (correlated with Age), Luxury-score
```

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
├── CatBoost ..................... Test R²: 0.92 ✅ SELECTED
├── XGBoost ...................... Test R²: 0.91
├── Random Forest ................ Test R²: 0.90
├── Gradient Boosting ............ Test R²: 0.88
├── AdaBoost ..................... Test R²: 0.87
├── Linear Regression ............ Test R²: 0.80
├── SVR .......................... Test R²: 0.83
└── KNN .......................... Test R²: 0.85
```

**Why CatBoost?**
- Highest test R² score (0.92)
- Handles categorical features natively
- Robust to overfitting
- Fast training & prediction
- Good hyperparameter defaults

---

### Step 5: Hyperparameter Tuning

**Files Involved:** `car_price_prediction.ipynb`

**Tuning Strategy: RandomizedSearchCV**

```python
catboost_param_dist = {
    "iterations": [100, 200, 400, 800],
    "learning_rate": [0.01, 0.03, 0.05, 0.1, 0.2],
    "depth": [3, 5, 7, 9],
    "l2_leaf_reg": [1, 3, 5, 7, 9],
    "border_count": [32, 64, 128, 256],
    "random_strength": [0, 0.5, 1]
}

# 30 random iterations, 3-fold cross-validation
catboost_search = RandomizedSearchCV(
    estimator=CatBoostRegressor(verbose=0),
    param_distributions=catboost_param_dist,
    n_iter=30,
    n_jobs=-1,
    cv=3,
    verbose=2
)
catboost_search.fit(X_train, y_train)
best_model = catboost_search.best_estimator_
```

**Final Hyperparameters:** (After optimization)
- iterations: 400-800
- learning_rate: 0.05-0.1
- depth: 5-7
- l2_leaf_reg: 3-5
- border_count: 128-256
- random_strength: 0-0.5

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
| `preprocessing_input()` | Encode user input | Dict with car specs | DataFrame |
| `make_prediction()` | Get price estimate | Preprocessed DataFrame | Dict with price |
| `parse_http_request()` | Parse raw HTTP | Raw bytes | method, path, body |
| `create_http_response()` | Build HTTP response | status code, type, body | HTTP bytes |
| `get_content_type()` | Map extension → MIME type | filename | MIME string |
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

**JavaScript Features:**

```javascript
// Dynamic model population
makeSelect.addEventListener('change', function() {
    // Populate modelSelect based on selected manufacturer
});

// Real-time validation
yearInput.addEventListener('blur', function() {
    // Validate year between 1990 and current year
});

// Form submission & API call
form.addEventListener('submit', function(e) {
    // Collect all form data
    // Send POST request to /api/predict
    // Display results or error message
});
```

---

## Running Each File

### 1. Running the Backend Server

**Command (Windows PowerShell):**
```powershell
# Navigate to project directory
cd "C:\Users\vuong\Desktop\car price estimator"

# Run the server
python server.py
```

**Expected Output:**
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

**Method 1: Direct Browser Access**
```
1. Start the backend server (python server.py)
2. Open web browser
3. Navigate to: http://127.0.0.1:4390
4. Form loads automatically
5. Fill in car details
6. Click "Estimate Price"
```

**Method 2: Command Line (Windows)**
```powershell
# Open default browser
Start-Process "http://127.0.0.1:4390"
```

**Frontend Files:**
- `index.html` - Served automatically on GET /
- `car_price_app.js` - Loaded via <script> tag
- CSS - Embedded in <style> tag
- No build process needed

---

### 3. Running the Training Notebook

**Environment Setup:**
```powershell
# Install required packages
pip install kagglehub pandas numpy scikit-learn catboost xgboost seaborn matplotlib joblib

# Optional: Google Colab
# Use: from google.colab import drive
```

**Running in Google Colab:**
1. Upload `car_price_prediction.ipynb` to Google Drive
2. Open in Google Colab
3. Set up authentication:
   ```python
   from google.colab import drive
   drive.mount('/content/drive')
   ```
4. Run all cells sequentially
5. Models saved to `/content/drive/...`

**Running Locally (Jupyter):**
```powershell
# Install Jupyter
pip install jupyter

# Launch notebook
jupyter notebook car_price_prediction.ipynb

# Run cells in order using Shift+Enter
```

**Notebook Execution Order:**
1. Connect to drive (Colab only)
2. Download dataset from Kaggle
3. Load and explore data
4. Add location features
5. Clean and preprocess data
6. Encode features
7. Train baseline models
8. Hyperparameter tuning
9. Export best model and encoders

---

### 4. Testing Individual Components

**Test Backend API:**
```powershell
# Using Invoke-WebRequest (PowerShell)
$body = @{
    "Manufacturer" = "Toyota"
    "Model" = "Camry"
    "Prod. year" = 2018
    "Category" = "Sedan"
    "Leather interior" = $true
    "Fuel type" = "Petrol"
    "Engine volume" = 2.5
    "Mileage" = 45000
    "Cylinders" = 4
    "Gear box type" = "Automatic"
    "Drive wheels" = "Front"
    "Wheel" = "Left wheel"
    "Color" = "White"
    "Airbags" = 6
    "City" = "New York"
    "State" = "NY"
    "Turbo" = 0
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:4390/api/predict" `
                  -Method POST `
                  -Headers @{"Content-Type"="application/json"} `
                  -Body $body
```

**Test Frontend:**
```powershell
# Simple form test
# 1. Fill form with valid data
# 2. Check browser console for API errors (F12)
# 3. Verify response displayed correctly
```

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

#### Option 1: Edit server.py directly

```python
# In server.py, __main__ section:
if __name__ == '__main__':
    host = '0.0.0.0'        # Change to accept external connections
    port = 5000             # Change port
    rate_limit_per_second = 2  # Allow 2 requests/second
    # ... rest of code
```

#### Option 2: Command-line arguments (implementation needed)

**Proposed Enhancement:**
```python
# server_with_args.py
import sys

if __name__ == '__main__':
    # Example usage:
    # python server.py --host 0.0.0.0 --port 8000 --rate-limit 2
    
    host = '127.0.0.1'
    port = 4390
    rate_limit = 1
    
    # Parse command-line arguments
    for i, arg in enumerate(sys.argv[1:]):
        if arg == '--host' and i+1 < len(sys.argv):
            host = sys.argv[i+2]
        elif arg == '--port' and i+1 < len(sys.argv):
            port = int(sys.argv[i+2])
        elif arg == '--rate-limit' and i+1 < len(sys.argv):
            rate_limit = float(sys.argv[i+2])
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

### Environment Variables (Proposed)

**Future Enhancement:**
```bash
# Set before running server
set CAR_PRICE_HOST=0.0.0.0
set CAR_PRICE_PORT=8000
set CAR_PRICE_RATE_LIMIT=2
set CAR_PRICE_DEBUG=true

# Run server
python server.py
```

---

### CLI Usage Examples

**Basic Usage:**
```powershell
# Start with defaults
python server.py
```

**With Custom Port:**
```powershell
# Would need implementation, e.g.:
# python server.py --port 5000
```

**With Debug Logging:**
```powershell
# Would need implementation, e.g.:
# python server.py --debug
```

**Check Dependencies:**
```powershell
# Verify required packages
python -c "import pandas, numpy, sklearn, catboost, joblib; print('All dependencies OK')"
```

**Run Tests:**
```powershell
# Test model loading
python -c "
import joblib as jb
model = jb.load('./model_n_encoder/best_model.pkl')
encoder = jb.load('./model_n_encoder/category_encoder.pkl')
print('Model loaded successfully')
"
```

---

## Development Workflow

### Local Development Setup

**Step 1: Clone/Download Project**
```powershell
# Navigate to desired directory
cd C:\Users\vuong\Desktop

# Files already present in: car price estimator/
# No clone needed
```

**Step 2: Install Dependencies**
```powershell
# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install pandas numpy scikit-learn catboost joblib
```

**Step 3: Verify Model Files**
```powershell
# Check if model directory exists
Test-Path "model_n_encoder/best_model.pkl"

# If missing, run training notebook to regenerate
```

**Step 4: Start Development Server**
```powershell
# Run backend
python server.py

# In another terminal, open frontend
Start-Process "http://127.0.0.1:4390"
```

### Testing During Development

**Unit Tests (Proposed):**
```python
# test_preprocessing.py
def test_preprocessing_input():
    test_data = {...}  # Sample input
    result = preprocessing_input(test_data)
    assert result.shape == (1, 18)
    assert not result.isnull().any().any()

def test_make_prediction():
    preprocessed = ...
    result = make_prediction(preprocessed)
    assert 'price' in result
    assert result['price'] > 0
```

**Manual Testing Checklist:**
- [ ] Model loads without errors
- [ ] All encoders load successfully
- [ ] Frontend accessible at http://127.0.0.1:4390
- [ ] Form validation works (try invalid inputs)
- [ ] API returns correct JSON on valid input
- [ ] Rate limiting blocks rapid requests
- [ ] Static files (CSS, JS) load correctly
- [ ] Price results display with proper formatting

---

### Debugging Tips

**Server Troubleshooting:**
```powershell
# Port already in use?
Get-NetTCPConnection -LocalPort 4390

# Kill process on port
taskkill /PID <process_id> /F

# Check model file exists
ls "model_n_encoder/best_model.pkl"

# Test model loading
python -c "import joblib; joblib.load('model_n_encoder/best_model.pkl')"
```

**Frontend Troubleshooting:**
```javascript
// Check browser console (F12)
// Look for:
// - Network errors (red responses)
// - JavaScript errors (red X)
// - API response format

// Test API manually in console
fetch('/api/predict', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...})
}).then(r => r.json()).then(d => console.log(d))
```

---

## Development Checklist

### Pre-Deployment Verification

- [ ] **Backend Server**
  - [ ] Server starts without errors
  - [ ] Model loads successfully
  - [ ] All 10 encoders load
  - [ ] Port 4390 accessible
  - [ ] No warnings or exceptions

- [ ] **Frontend**
  - [ ] index.html loads correctly
  - [ ] CSS renders properly
  - [ ] JavaScript executes without errors
  - [ ] Form fields functional
  - [ ] Validation messages display

- [ ] **API Integration**
  - [ ] POST /api/predict receives requests
  - [ ] Returns valid JSON responses
  - [ ] Prices are reasonable values
  - [ ] Error handling works
  - [ ] Rate limiting enforced

- [ ] **Data**
  - [ ] cost_of_living_us_city.csv present
  - [ ] 50+ cities available for selection
  - [ ] All US states selectable
  - [ ] 31 manufacturers with 300+ models

- [ ] **Performance**
  - [ ] Prediction latency < 500ms
  - [ ] Form submission smooth
  - [ ] No memory leaks over 1 hour
  - [ ] Handles concurrent requests

---

## Deployment Considerations

### For Production Deployment

**Changes Needed:**

1. **Network Configuration**
   ```python
   # Change from localhost to public IP
   host = '0.0.0.0'  # or specific IP
   port = 80 or 443  # Standard HTTP/HTTPS
   ```

2. **HTTPS Support**
   ```python
   # Add SSL/TLS wrapper
   import ssl
   context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
   context.load_cert_chain('cert.pem', 'key.pem')
   # server_socket = context.wrap_socket(server_socket)
   ```

3. **Production Server**
   ```powershell
   # Replace custom server with:
   # - Gunicorn (Python WSGI)
   # - Flask with production WSGI server
   # - FastAPI with Uvicorn
   # - Node.js Express wrapper
   ```

4. **Logging & Monitoring**
   ```python
   # Add logging module
   import logging
   logging.basicConfig(filename='server.log', level=logging.INFO)
   logging.info(f'Client {client_ip} requested prediction')
   ```

5. **Database Integration**
   - Store predictions in SQLite/PostgreSQL
   - Track model performance
   - Log user interactions

---

## File Execution Summary Table

| File | Type | Run Command | Purpose | Dependencies |
|------|------|-------------|---------|--------------|
| `server.py` | Python | `python server.py` | Start backend | pandas, catboost, joblib |
| `index.html` | HTML | Browse to http://127.0.0.1:4390 | Load UI | None (served by server.py) |
| `car_price_app.js` | JavaScript | Auto-loaded by index.html | Handle frontend logic | None |
| `car_price_prediction.ipynb` | Jupyter | `jupyter notebook car_price_prediction.ipynb` | Train models | All ML libraries |
| `cost_of_living_us_city.csv` | CSV | Read by server.py on startup | Location reference | None |

---

## Quick Start Commands

```powershell
# One-line quick start:
cd "C:\Users\vuong\Desktop\car price estimator"; python server.py

# Install all dependencies:
pip install pandas numpy scikit-learn catboost xgboost joblib

# Test model loading:
python -c "import joblib; print('✓ Model:', type(joblib.load('model_n_encoder/best_model.pkl')))"

# Open in browser (after starting server):
Start-Process "http://127.0.0.1:4390"
```

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

