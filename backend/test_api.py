import io
from types import SimpleNamespace

from fastapi.testclient import TestClient
from PIL import Image

import main as api_main


def make_test_image_bytes() -> bytes:
    image = Image.new("RGB", (24, 24), color=(12, 160, 90))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def test_health_endpoint() -> None:
    client = TestClient(api_main.app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_rejects_non_image_upload() -> None:
    client = TestClient(api_main.app)
    response = client.post(
        "/predict",
        files={"image": ("bad.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 400
    assert "image files" in response.json()["detail"].lower()


def test_predict_success_with_mocked_model(monkeypatch) -> None:
    def fake_get_model_bundle():
        return {"model": object(), "last_conv": "fake_conv", "name": "AttenDenseNet"}

    def fake_process_single_model(model_name, model_data, pil_img, gt_annotations):
        _ = model_name, model_data, pil_img, gt_annotations
        return {
            "primary": {
                "class_index": 6,
                "common_name": "Philippine Cobra",
                "scientific_name": "Naja philippinensis",
                "family": "Elapidae",
                "description": "Mocked prediction",
                "is_venomous": True,
                "confidence": 97.5,
            },
            "alternatives": [],
            "gradcam_image_base64": None,
            "iou_analysis": None,
        }

    monkeypatch.setattr(api_main, "get_model_bundle", fake_get_model_bundle)
    monkeypatch.setattr(
        api_main,
        "_get_model_handler",
        lambda: SimpleNamespace(process_single_model=fake_process_single_model),
    )

    client = TestClient(api_main.app)
    response = client.post(
        "/predict",
        files={"image": ("snake.png", make_test_image_bytes(), "image/png")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["model"] == "AttenDenseNet"
    assert "prediction" in payload
    assert payload["prediction"]["primary"]["common_name"] == "Philippine Cobra"
