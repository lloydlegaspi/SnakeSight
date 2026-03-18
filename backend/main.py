import io
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent
DEFAULT_ANNOTATIONS_DIR = BACKEND_DIR / "annotations" / "annotations"

app = FastAPI(
    title="SnakeSight API",
    description="FastAPI backend for Philippine snake classification using AttenDenseNet (DenseNet + CBAM).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def get_model_bundle() -> dict[str, Any]:
    return _get_model_handler().load_attendensenet_model()


def _get_model_handler():
    import model_handler

    return model_handler


def _parse_annotation_file(annotation_path: Path) -> list[dict[str, Any]]:
    parsed: list[dict[str, Any]] = []
    with annotation_path.open("r", encoding="utf-8") as annotation_file:
        for line in annotation_file:
            parts = line.strip().split()
            if len(parts) < 3:
                continue
            parsed.append(
                {
                    "label": int(parts[0]),
                    "segmentation": [float(value) for value in parts[1:]],
                }
            )
    return parsed


def _resolve_annotations_path(filename: str | None) -> Path | None:
    if not filename:
        return None

    annotations_dir = Path(os.getenv("ANNOTATIONS_DIR", str(DEFAULT_ANNOTATIONS_DIR)))
    annotation_name = f"{Path(filename).stem}.txt"
    annotation_path = annotations_dir / annotation_name
    if annotation_path.exists():
        return annotation_path
    return None


def _parse_uploaded_image(file_bytes: bytes) -> Image.Image:
    try:
        return Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict")
async def predict(image: UploadFile = File(...)) -> dict[str, Any]:
    if not image.filename:
        raise HTTPException(status_code=400, detail="Image filename is missing.")

    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    file_bytes = await image.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    pil_img = _parse_uploaded_image(file_bytes)

    gt_annotations = None
    annotation_path = _resolve_annotations_path(image.filename)
    if annotation_path:
        gt_annotations = _parse_annotation_file(annotation_path)

    model_bundle = get_model_bundle()
    model_handler = _get_model_handler()

    try:
        prediction = model_handler.process_single_model(
            "attendensenet",
            model_bundle,
            pil_img,
            gt_annotations,
        )

        return {
            "model": model_bundle.get("name", "AttenDenseNet"),
            "prediction": prediction,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {exc}") from exc


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("FASTAPI_HOST", "0.0.0.0")
    port = int(os.getenv("FASTAPI_PORT", "8000"))
    reload = os.getenv("FASTAPI_RELOAD", "true").lower() == "true"

    uvicorn.run("main:app", host=host, port=port, reload=reload)
