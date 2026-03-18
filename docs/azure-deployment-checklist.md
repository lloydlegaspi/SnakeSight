# SnakeSight Azure Deployment Checklist (FastAPI on App Service Linux)

Use this checklist to deploy the SnakeSight backend from `backend/` to Azure App Service (Linux).

## 1. Pre-deployment validation (local)

- [ ] Confirm backend dependencies are up to date in `backend/requirements.txt`.
- [ ] Confirm API starts locally:
  - `cd backend`
  - `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] Verify health/documentation endpoints respond:
  - `http://localhost:8000/health`
  - `http://localhost:8000/docs`

## 2. Create Azure App Service (Linux)

In Azure Portal:

- [ ] Create or choose a Resource Group.
- [ ] Create a new App Service.
- [ ] Publish: `Code`
- [ ] Runtime stack: `Python 3.11`
- [ ] Operating system: `Linux`
- [ ] Region: choose nearest production users/operations team.
- [ ] Pricing plan: choose based on expected inference load and cold start tolerance.

## 3. Configure deployment source

Pick one:

- [ ] GitHub Actions deployment from your repo.
- [ ] Local Git deployment.
- [ ] Zip deploy (`backend/` contents as deployment artifact).

Important:

- [ ] Ensure deployment root contains `main.py` and `requirements.txt` for backend startup.
- [ ] If deploying monorepo root, set build/deploy path to `backend` in your pipeline.

## 4. Startup command and runtime settings

In App Service -> Configuration -> General settings:

- [ ] Startup Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] Stack version remains set to Python 3.11.

## 5. App Settings (Environment Variables)

In App Service -> Configuration -> Application settings, add:

- [ ] `WEBSITES_PORT` = `8000`
- [ ] `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`

Recommended for SnakeSight backend:

- [ ] `FASTAPI_HOST` = `0.0.0.0`
- [ ] `FASTAPI_PORT` = `8000`
- [ ] `FASTAPI_RELOAD` = `false`
- [ ] `ANNOTATIONS_DIR` = `/home/site/wwwroot/annotations/annotations` (adjust if your deployed structure differs)

After adding/editing settings:

- [ ] Click Save.
- [ ] Restart the App Service.

## 6. Health check configuration

In App Service -> Health check:

- [ ] Enable Health check.
- [ ] Health check path: set one of:
  - `/health` (recommended explicit status endpoint)
  - `/docs` (acceptable liveness fallback)
  - `/` (only if you expose a root endpoint)

Why this matters:

- [ ] Azure uses this path to verify the app instance is alive and route traffic only to healthy instances.

## 7. CORS and security hardening

- [ ] Restrict CORS origins in `backend/main.py` for production frontend domains (avoid `*` in production).
- [ ] Store secrets/configuration in App Settings, not in source files.
- [ ] Turn on HTTPS-only in App Service -> TLS/SSL settings.

## 8. Post-deployment smoke tests

After deployment, validate:

- [ ] `https://<your-app-name>.azurewebsites.net/health` returns `{"status":"ok"}`.
- [ ] `https://<your-app-name>.azurewebsites.net/docs` loads FastAPI docs.
- [ ] `POST /predict` works with multipart form-data field name `image`.
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to the deployed backend URL.

## 9. Monitoring and diagnostics

- [ ] Enable App Service logs (Application Logging + Web Server Logging).
- [ ] Use Log stream during initial deployment validation.
- [ ] Add alerts for 5xx rate, restart loops, and response latency.

## 10. Rollback readiness

- [ ] Keep prior known-good deployment artifact or commit tagged.
- [ ] Document exact app settings used in production.
- [ ] Verify a rollback path (swap slot or redeploy previous build).
