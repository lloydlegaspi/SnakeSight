"""Legacy AttenDenseNet entrypoint.

This module preserves the old script name while delegating runtime to the
FastAPI app in main.py.
"""

import os

import uvicorn

from main import app  # noqa: E402,F401


if __name__ == "__main__":
    host = os.getenv("FASTAPI_HOST", "0.0.0.0")
    port = int(os.getenv("FASTAPI_PORT", "8000"))
    reload = os.getenv("FASTAPI_RELOAD", "true").lower() == "true"

    uvicorn.run("main:app", host=host, port=port, reload=reload)
