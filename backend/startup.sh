#!/bin/bash
set -e

# Azure App Service startup command for Python Linux
exec uvicorn main:app --host 0.0.0.0 --port 8000
