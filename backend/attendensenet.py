import io
import os, traceback
import json
import base64
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from custom_layers import GlobalMeanPoolChannel, GlobalMaxPoolChannel, channel_attention, spatial_attention, cbam_block
from werkzeug.utils import secure_filename
import analysis_helpers

# ---------------- Config ---------------- #
MODEL_PATH = "model/Final89.keras"
METADATA_PATH = "model/metadata.json"

# ---------------- App ---------------- #
app = Flask(__name__)
CORS(app)

# ---------------- Load model + metadata ---------------- #
print("Loading model...")

custom_objects = {
    "GlobalMeanPoolChannel": GlobalMeanPoolChannel,
    "GlobalMaxPoolChannel": GlobalMaxPoolChannel,
    "channel_attention": channel_attention,
    "spatial_attention": spatial_attention,
    "cbam_block": cbam_block,
}
model = load_model(MODEL_PATH, custom_objects=custom_objects, compile=False) # Attendensenet

try:
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        CLASS_METADATA = json.load(f)
except FileNotFoundError:
    CLASS_METADATA = {}
    print("Warning: metadata.json not found. Predictions will use placeholder names.")

INPUT_SHAPE = (224, 224, 3)
IMG_H, IMG_W, IMG_C = INPUT_SHAPE

# ---------------- Helpers ---------------- #
def preprocess_image(img) -> np.ndarray:
    # Prepare image bytes / tensor depending on input type
    if isinstance(img, Image.Image):
        # Convert PIL Image to PNG bytes and decode with TF to keep a single code path
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        image_bytes = buf.getvalue()
        img_tensor = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    elif isinstance(img, (bytes, bytearray)):
        img_tensor = tf.image.decode_image(img, channels=3, expand_animations=False)
    elif isinstance(img, str):
        # treat as file path
        image_bytes = tf.io.read_file(img)
        img_tensor = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    else:
        # If it's already a tf.Tensor or numpy array, try to handle it
        try:
            img_tensor = tf.convert_to_tensor(img)
        except Exception:
            raise ValueError("Unsupported image input type for preprocessing")

    # Ensure shape and dtype, then resize
    img_tensor = tf.cast(img_tensor, tf.float32)
    img_resized = tf.image.resize(img_tensor, [INPUT_SHAPE[0], INPUT_SHAPE[1]])

    # Rescale to [0,1]
    img_rescaled = img_resized / 255.0

    # Normalize with ImageNet mean/std
    IMAGENET_MEAN = tf.constant([0.485, 0.456, 0.406], dtype=tf.float32)
    IMAGENET_STD = tf.constant([0.229, 0.224, 0.225], dtype=tf.float32)
    # Broadcast mean/std across H,W
    norm = (img_rescaled - IMAGENET_MEAN) / IMAGENET_STD

    # Add batch dim and return numpy
    norm_batched = tf.expand_dims(norm, axis=0)
    return norm_batched.numpy()

def get_top_k(preds: np.ndarray, k: int = 5):
    preds = preds.flatten()
    indices = np.argsort(preds)[::-1][:k]
    probs = preds[indices]
    return list(zip(indices.tolist(), probs.tolist()))

def load_class_metadata(index: int):
    s = CLASS_METADATA.get(str(index), {})
    return {
        "class_index": int(index),
        "common_name": s.get("common_name", f"class_{index}"),
        "scientific_name": s.get("scientific_name", ""),
        "family": s.get("family", ""),
        "description": s.get("description", ""),
        "is_venomous": s.get("is_venomous", False),
    }

def make_gradcam(orig_img: np.ndarray, class_index: int):
    try:
        # Prepare the resized image using tf.image.resize (same preprocessing path)
        arr = np.asarray(orig_img).astype("float32") / 255.0
        arr_tf = tf.convert_to_tensor(arr, dtype=tf.float32)
        arr_resized = tf.image.resize(arr_tf, [INPUT_SHAPE[0], INPUT_SHAPE[1]])

        IMAGENET_MEAN = tf.constant([0.485, 0.456, 0.406], dtype=tf.float32)
        IMAGENET_STD = tf.constant([0.229, 0.224, 0.225], dtype=tf.float32)
        norm_arr = (arr_resized - IMAGENET_MEAN) / IMAGENET_STD

        # Input tensor for the model (batch dim)
        input_tensor = tf.expand_dims(norm_arr, axis=0)

        last_conv = "cbam4_residual"
        grad_model = tf.keras.models.Model(inputs=model.inputs, outputs=[model.get_layer(last_conv).output, model.output])

        with tf.GradientTape() as tape:
            tape.watch(input_tensor)
            conv_outputs, predictions = grad_model(input_tensor, training=False)

            if isinstance(predictions, (list, tuple)):
                predictions = predictions[0]

            loss = predictions[:, class_index]

        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            raise RuntimeError("Gradients returned None.")

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(conv_outputs, pooled_grads), axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        max_val = tf.reduce_max(heatmap)
        if max_val > 1e-10:
            heatmap /= max_val

        heatmap_np = heatmap.numpy()

        # Resize heatmap to the model input (preprocessed) size so it overlays the preprocessed image
        heat_pil = Image.fromarray(np.uint8(heatmap_np * 255)).resize((IMG_W, IMG_H))
        heat_np_resized = np.asarray(heat_pil).astype("float32") / 255.0

        import matplotlib.cm as cm
        cmap = cm.get_cmap("jet")
        colored_heat = cmap(heat_np_resized)[:, :, :3]

        # Use the resized (preprocessed) image for overlay: arr_resized is [0,1]
        display_np = arr_resized.numpy()
        display_uint8 = (display_np * 255).astype("uint8")

        overlay = (0.5 * colored_heat * 255 + 0.5 * display_uint8).astype("uint8")
        overlay_pil = Image.fromarray(overlay)

        buf = io.BytesIO()
        overlay_pil.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception as e:
        traceback.print_exc()
        raise

# ---------------- ROUTES ---------------- #
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files["image"]
    try:
        pil_img = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {e}"}), 400

    # preprocess + predict
    input_batch = preprocess_image(pil_img)
    preds = model.predict(input_batch)
    top5 = get_top_k(preds, 5)

    results = []
    for idx, prob in top5:
        meta = load_class_metadata(idx)
        results.append({
            "class_index": int(idx),
            "common_name": meta.get("common_name", f"class_{idx}"),
            "scientific_name": meta.get("scientific_name", ""),
            "family": meta.get("family", ""),
            "is_venomous": meta.get("is_venomous", False),
            "description": meta.get("description", ""),
            "confidence": round(prob * 100, 2)
        })

    # Primary prediction
    top1_idx, top1_prob = top5[0]
    top1_meta = load_class_metadata(top1_idx)

    orig_arr = np.asarray(pil_img)
    gradcam_b64 = None
    try:
        gradcam_b64 = make_gradcam(orig_arr, int(top1_idx))
    except Exception as e:
        gradcam_b64 = None
        print("Grad-CAM failed:", e)

    response = {
        "top5": results,
        "primary": {
            "class_index": int(top1_idx),
            "common_name": top1_meta.get("common_name", ""),
            "scientific_name": top1_meta.get("scientific_name", ""),
            "family": top1_meta.get("family", ""),
            "is_venomous": top1_meta.get("is_venomous", False),
            "confidence": round(top1_prob * 100, 2),
            "description": top1_meta.get("description", "")
        },
        "alternatives": results[1:],
        "gradcam_image_base64": gradcam_b64
    }
    return jsonify(response)


@app.route("/predict_and_analyze", methods=["POST"])
def predict_and_analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    try:
        pil_img = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {e}"}), 400

    image_filename = secure_filename(file.filename)
    base_name, _ = os.path.splitext(image_filename)
    annotation_filename = f"{base_name}.txt"
    annotation_path = os.path.join("annotations", annotation_filename)

    # --- Standard Prediction Logic ---
    try:
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
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Model prediction failed: {e}"}), 500

    # --- Grad-CAM and IoU Analysis ---
    orig_arr = np.asarray(pil_img)
    gradcam_b64 = None
    iou_analysis = None
    last_conv_layer_name = "cbam4_residual"

    try:
        # Step 1: Always generate the standard Grad-CAM first
        gradcam_b64 = make_gradcam(orig_arr, int(top1_idx))
    except Exception as e:
        print(f"Grad-CAM failed: {e}")

    # Step 2: If an annotation file exists, perform analysis and draw on the heatmap
    if os.path.exists(annotation_path):
        print(f"Found annotation file: {annotation_filename}. Running IoU analysis...")
        try:
            # Parse annotations ONCE
            gt_annotations = analysis_helpers.parse_annotation_file(annotation_path)

            # Calculate IoU using the parsed annotations
            iou_analysis = analysis_helpers.calculate_iou_from_file(
                model=model,
                pil_img=pil_img,
                gt_annotations=gt_annotations, # Pass the data directly
                class_index=int(top1_idx),
                last_conv_name=last_conv_layer_name
            )

            # --- NEW DRAWING STEP ---
            # If we have a gradcam and annotations, draw polygons on it
            if gradcam_b64 and gt_annotations:
                print("Drawing polygons on Grad-CAM overlay...")
                # 1. Decode base64 to PIL Image
                gradcam_bytes = base64.b64decode(gradcam_b64)
                gradcam_pil = Image.open(io.BytesIO(gradcam_bytes))

                # 2. Draw polygons using the helper
                gradcam_with_polygons_pil = analysis_helpers.draw_polygons_on_image(gradcam_pil, gt_annotations)

                # 3. Re-encode the new image to base64 and OVERWRITE the old variable
                buf = io.BytesIO()
                gradcam_with_polygons_pil.save(buf, format="PNG")
                gradcam_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        except Exception as e:
            print(f"IoU analysis or drawing failed: {e}")
            traceback.print_exc()
            iou_analysis = {"error": "Analysis calculation failed on the server."}

    # --- Build final response ---
    response = {
        "top5": results,
        "primary": primary_prediction,
        "alternatives": results[1:],
        "gradcam_image_base64": gradcam_b64, # This now contains polygons if analysis was run
        "iou_analysis": iou_analysis
    }
    return jsonify(response)
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    try:
        pil_img = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {e}"}), 400

    image_filename = secure_filename(file.filename)
    base_name, _ = os.path.splitext(image_filename)
    annotation_filename = f"{base_name}.txt"
    annotation_path = os.path.join("annotations", annotation_filename)

    # --- Standard Prediction Logic ---
    try:
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
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Model prediction failed: {e}"}), 500

    # --- Grad-CAM and IoU Analysis ---
    orig_arr = np.asarray(pil_img)
    gradcam_b64 = None
    iou_analysis = None
    last_conv_layer_name = "cbam4_residual"  # Specific to this model

    try:
        gradcam_b64 = make_gradcam(orig_arr, int(top1_idx))
    except Exception as e:
        print(f"Grad-CAM failed: {e}")

    if os.path.exists(annotation_path):
        print(f"Found annotation file: {annotation_filename}. Running IoU analysis...")
        try:
            iou_analysis = analysis_helpers.calculate_iou_from_file(
                model=model,
                pil_img=pil_img,
                annotation_path=annotation_path,
                class_index=int(top1_idx),
                last_conv_name=last_conv_layer_name
            )
        except Exception as e:
            print(f"IoU analysis failed: {e}")
            traceback.print_exc()
            iou_analysis = {"error": "IoU calculation failed on the server."}

    # --- Build final response ---
    response = {
        "top5": results,
        "primary": primary_prediction,
        "alternatives": results[1:],
        "gradcam_image_base64": gradcam_b64,
        "iou_analysis": iou_analysis
    }
    return jsonify(response)

# ---------------- Run ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
