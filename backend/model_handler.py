import io
import os
import json
import base64
import numpy as np
import traceback
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from custom_layers import GlobalMeanPoolChannel, GlobalMaxPoolChannel, channel_attention, spatial_attention, cbam_block
import analysis_helpers

# --- Configuration ---
INPUT_SHAPE = (224, 224, 3)
METADATA_PATH = os.getenv("METADATA_PATH", "model/metadata.json")

try:
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        CLASS_METADATA = json.load(f)
except FileNotFoundError:
    CLASS_METADATA = {}
    print("Warning: metadata.json not found.")

# --- Model Loading ---
def load_all_models():
    print("Loading models...")
    custom_objects = {
        "GlobalMeanPoolChannel": GlobalMeanPoolChannel,
        "GlobalMaxPoolChannel": GlobalMaxPoolChannel,
        "channel_attention": channel_attention,
        "spatial_attention": spatial_attention,
        "cbam_block": cbam_block,
    }

    attendensenet_path = os.getenv("ATTENDENSENET_MODEL_PATH", "model/attendensenet_v9.keras")
    densenet_path = os.getenv("DENSENET_MODEL_PATH", "model/baseline_densenet_85.keras")

    attendensenet_model = load_model("model/attendensenet_87.keras", custom_objects=custom_objects, compile=False)
    densenet_model = load_model("model/baseline_densenet_85.keras", custom_objects=custom_objects, compile=False)

    print("All models loaded successfully.")
    return {
        "attendensenet": {"model": attendensenet_model, "last_conv": "cbam4_residual"},
        "densenet": {"model": densenet_model, "last_conv": "conv5_block16_concat"}
    }

# --- Core Logic (Functions adapted from original scripts) ---
def preprocess_image(pil_img):
    img_tensor = tf.convert_to_tensor(np.array(pil_img), dtype=tf.float32)
    img_resized = tf.image.resize(img_tensor, [INPUT_SHAPE[0], INPUT_SHAPE[1]])
    img_rescaled = img_resized / 255.0
    IMAGENET_MEAN = tf.constant([0.485, 0.456, 0.406], dtype=tf.float32)
    IMAGENET_STD = tf.constant([0.229, 0.224, 0.225], dtype=tf.float32)
    norm = (img_rescaled - IMAGENET_MEAN) / IMAGENET_STD
    return tf.expand_dims(norm, axis=0).numpy()

def get_top_k(preds, k=5):
    preds = preds.flatten()
    indices = np.argsort(preds)[::-1][:k]
    probs = preds[indices]
    return list(zip(indices.tolist(), probs.tolist()))

def load_class_metadata(index):
    s = CLASS_METADATA.get(str(index), {})
    return {
        "class_index": int(index),
        "common_name": s.get("common_name", f"class_{index}"),
        "scientific_name": s.get("scientific_name", ""),
        "family": s.get("family", ""),
        "description": s.get("description", ""),
        "is_venomous": s.get("is_venomous", False),
    }

def process_single_model(model_name, model_data, pil_img, gt_annotations):
    """
    Runs prediction, Grad-CAM, and IoU for a single model.
    """
    model = model_data["model"]
    last_conv_layer = model_data["last_conv"]

    # --- Prediction ---
    input_batch = preprocess_image(pil_img)
    preds = model.predict(input_batch)
    top5 = get_top_k(preds, 5)

    results = []
    for idx, prob in top5:
        meta = load_class_metadata(idx)
        meta["confidence"] = round(prob * 100, 2)
        results.append(meta)

    primary_prediction = results[0]
    top1_idx = primary_prediction["class_index"]

    # --- Analysis ---
    gradcam_b64 = None
    iou_analysis = None

    try:
        # Generate raw heatmap for both Grad-CAM overlay and IoU
        raw_heatmap = analysis_helpers.generate_raw_heatmap(
            model, pil_img, int(top1_idx), last_conv_layer
        )

        # Create Grad-CAM overlay image from the heatmap
        import matplotlib.cm as cm
        cmap = cm.get_cmap("jet")
        heat_pil = Image.fromarray(np.uint8(raw_heatmap * 255)).resize((INPUT_SHAPE[1], INPUT_SHAPE[0]))
        colored_heat = cmap(np.asarray(heat_pil))[:, :, :3]

        display_img_resized = np.asarray(pil_img.resize((INPUT_SHAPE[1], INPUT_SHAPE[0]))).astype("uint8")
        overlay = (0.5 * colored_heat * 255 + 0.5 * display_img_resized).astype("uint8")

        buf = io.BytesIO()
        Image.fromarray(overlay).save(buf, format="PNG")
        gradcam_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        # Perform IoU analysis if annotations exist
        if gt_annotations:
            iou_analysis = analysis_helpers.calculate_iou_from_file(
                model=model,
                pil_img=pil_img,
                gt_annotations=gt_annotations,
                class_index=int(top1_idx),
                last_conv_name=last_conv_layer
            )
            # Draw polygons on the Grad-CAM image
            if gradcam_b64:
                gradcam_pil = Image.open(io.BytesIO(base64.b64decode(gradcam_b64)))
                gradcam_with_polygons = analysis_helpers.draw_polygons_on_image(gradcam_pil, gt_annotations)
                buf = io.BytesIO()
                gradcam_with_polygons.save(buf, format="PNG")
                gradcam_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    except Exception as e:
        print(f"Error during analysis for {model_name}: {e}")
        traceback.print_exc()

    return {
        "primary": primary_prediction,
        "alternatives": results[1:],
        "gradcam_image_base64": gradcam_b64,
        "iou_analysis": iou_analysis
    }
