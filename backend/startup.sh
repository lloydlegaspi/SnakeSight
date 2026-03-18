#!/bin/bash
set -euo pipefail

# Azure App Service startup command for Python Linux.
# Support launching from either repo root (/home/site/wwwroot) or backend folder.
if [ -f "/home/site/wwwroot/backend/main.py" ]; then
	cd /home/site/wwwroot/backend
elif [ -f "./backend/main.py" ]; then
	cd ./backend
fi

HOST="${FASTAPI_HOST:-0.0.0.0}"
PORT="${PORT:-${FASTAPI_PORT:-8000}}"

# Use module execution so uvicorn works even if console scripts are not on PATH.
exec python -m uvicorn main:app --host "$HOST" --port "$PORT"
