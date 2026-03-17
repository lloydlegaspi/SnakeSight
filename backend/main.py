import os
import traceback
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import model_handler
import analysis_helpers
from dotenv import load_dotenv

load_dotenv()

# --- App Setup ---
app = Flask(__name__)
CORS(app)

# --- Load Models on Startup ---
models = model_handler.load_all_models()

# --- API Endpoint ---
@app.route("/predict_all", methods=["POST"])
def predict_all():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    try:
        pil_img = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {e}"}), 400

    # Check for corresponding annotation file (for Test Mode)
    annotations_dir = os.getenv("ANNOTATIONS_DIR", "annotations")
    image_filename = secure_filename(file.filename)
    base_name, _ = os.path.splitext(image_filename)
    annotation_path = os.path.join("annotations", f"{base_name}.txt")

    gt_annotations = None
    if os.path.exists(annotation_path):
        print(f"Found annotation file: {annotation_path}")
        gt_annotations = analysis_helpers.parse_annotation_file(annotation_path)

    # --- Process with both models ---
    response = {}
    try:
        for name, model_data in models.items():
            result = model_handler.process_single_model(name, model_data, pil_img, gt_annotations)
            response[name] = result

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Model prediction failed: {e}"}), 500

    return jsonify(response)

# --- Run ---
if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    app.run(host=host, port=port, debug=debug)
