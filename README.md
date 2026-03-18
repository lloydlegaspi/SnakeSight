# SnakeSight Documentation

## Overview
SnakeSight is an AI-powered Philippine snake identification platform built to support high-pressure emergency workflows. It is intended for use by medical professionals, toxicologists, and first responders to accelerate species identification and improve antivenom routing decisions.

The deployed inference model is **AttenDenseNet**, a DenseNet architecture enhanced with a Convolutional Block Attention Module (CBAM).

## Architecture

### Frontend (Next.js)
- Framework: Next.js App Router (TypeScript)
- UI Stack: Tailwind CSS and Shadcn UI patterns
- Role:
  - Guides users through image upload and analysis
  - Displays species prediction, confidence, venom-risk indicators, Grad-CAM heatmaps, and optional IoU outputs
  - Provides safety and scope messaging for clinical decision support

Primary frontend routes:
- `/` — Professional landing page and system overview
- `/classification` — Upload and inference workflow
- `/about` — Scope, limitations, and operational usage guidance

### Backend (FastAPI)
- Framework: FastAPI
- Inference engine: TensorFlow / Keras
- Model: AttenDenseNet only (single-model production path)
- Role:
  - Accepts multipart image uploads
  - Performs preprocessing and AttenDenseNet inference
  - Returns structured prediction payload including explainability fields

Primary backend endpoints:
- `GET /health` — Service health probe
- `POST /predict` — Single-model image inference endpoint

## Model: AttenDenseNet
AttenDenseNet combines:
- DenseNet feature extraction
- CBAM channel and spatial attention

This architecture improves model focus on clinically relevant visual regions and supports more interpretable inference through Grad-CAM overlays.

Expected backend artifacts:
- `backend/model/attendensenet.keras`
- `backend/model/metadata.json`

Optional explainability support:
- Annotation files for IoU analysis under `backend/annotations/annotations`

## Local Setup

### 1. Backend
From repository root:

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
python main.py
```

Backend default URL:
- `http://localhost:8000`

### 2. Frontend
From repository root:

```bash
cd frontend
cp .env.local.example .env.local
npm install --legacy-peer-deps
npm run dev
```

Frontend default URL:
- `http://localhost:3000`

## Azure App Service Deployment Strategy (Linux)

### Required backend deployment files
- `backend/startup.sh`
- `backend/runtime.txt`
- `backend/azure-startup-command.txt`
- `backend/azure-app-settings.example`

### Runtime pinning
- Python runtime pinned to **3.11** using `backend/runtime.txt`.
- This runtime target aligns with TensorFlow/Keras compatibility expectations for production deployment.

### Startup command
Use one of the following in Azure App Service configuration:

- Preferred command string:
  - `uvicorn main:app --host 0.0.0.0 --port 8000`
- Or set startup command to:
  - `bash startup.sh`

### Recommended Azure app settings
Use `backend/azure-app-settings.example` as baseline:
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
- `WEBSITES_PORT=8000`
- `PYTHONUNBUFFERED=1`
- `FASTAPI_HOST=0.0.0.0`
- `FASTAPI_PORT=8000`
- `ATTENDENSENET_MODEL_PATH=model/attendensenet.keras`
- `ATTENDENSENET_LAST_CONV=cbam4_residual`
- `METADATA_PATH=model/metadata.json`
- `ANNOTATIONS_DIR=annotations/annotations`

## Operational Notes
- SnakeSight is a **clinical decision-support tool**, not a standalone diagnostic authority.
- Final treatment decisions must follow institutional protocols, specialist judgment, and local toxicology guidance.
- Model predictions are limited to the deployment dataset scope and should be interpreted with caution for out-of-scope species.
