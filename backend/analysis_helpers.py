import numpy as np
import tensorflow as tf
from PIL import Image, ImageDraw

# --- Core Metric and BBox Helpers (Ported from Colab) ---

def iou(boxA, boxB):
    # boxes are x1,y1,x2,y2
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    interW = max(0, xB - xA)
    interH = max(0, yB - yA)
    interArea = interW * interH
    boxAArea = max(0, boxA[2] - boxA[0]) * max(0, boxA[3] - boxA[1])
    boxBArea = max(0, boxB[2] - boxB[0]) * max(0, boxB[3] - boxB[1])
    union = boxAArea + boxBArea - interArea + 1e-10
    return interArea / union

def normalize_if_needed(points, img_w, img_h):
    # If values look normalized (<=1), convert to pixels
    if max(points) <= 1.0 + 1e-6:
        normalized_poly = []
        for i in range(0, len(points), 2):
            normalized_poly.append(points[i] * img_w)
            normalized_poly.append(points[i+1] * img_h)
        return normalized_poly
    return points

def polygon_to_bbox(polygon):
    if not polygon or len(polygon) % 2 != 0: return (0,0,0,0)
    xs = polygon[0::2]
    ys = polygon[1::2]
    if not xs or not ys: return (0,0,0,0)
    x1, y1 = min(xs), min(ys)
    x2, y2 = max(xs), max(ys)
    return (float(x1), float(y1), float(x2), float(y2))

def heatmap_to_bbox(heatmap, threshold=0.35, min_area=50):
    if heatmap is None: return None
    mask = heatmap >= threshold
    inds = np.argwhere(mask)
    if inds.size == 0: return None
    ys, xs = inds[:,0], inds[:,1]
    x1, y1, x2, y2 = xs.min(), ys.min(), xs.max(), ys.max()
    area = (x2 - x1) * (y2 - y1)
    if area < min_area: return None # Filter out tiny activations
    return (float(x1), float(y1), float(x2), float(y2))

# --- Annotation File Parser ---

def parse_annotation_file(filepath):
    annotations = []
    with open(filepath, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) < 3: continue
            class_id = int(parts[0])
            polygon_coords = [float(p) for p in parts[1:]]
            annotations.append({"label": class_id, "segmentation": polygon_coords})
    return annotations

# --- Raw Heatmap Generation ---

def generate_raw_heatmap(model, pil_img, class_index, last_conv_name, target_size=(224, 224)):
    img_arr = np.asarray(pil_img.resize(target_size).convert("RGB")).astype("float32") / 255.0
    IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_arr = (img_arr - IMAGENET_MEAN) / IMAGENET_STD
    input_tensor = tf.convert_to_tensor(np.expand_dims(img_arr, axis=0), dtype=tf.float32)

    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        tape.watch(input_tensor)
        conv_outputs, predictions = grad_model(input_tensor, training=False)
        if isinstance(predictions, (list, tuple)):
            predictions = predictions[0]
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    if grads is None: return None

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(tf.multiply(conv_outputs, pooled_grads), axis=-1)
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.reduce_max(heatmap)
    if max_val > 1e-10:
        heatmap = heatmap / max_val

    heatmap_np = heatmap.numpy()
    heat_pil = Image.fromarray(np.uint8(heatmap_np * 255)).resize((pil_img.width, pil_img.height))
    return np.asarray(heat_pil).astype("float32") / 255.0

# --- NEW: Polygon Drawing Helper ---

def draw_polygons_on_image(img_pil, gt_annotations):
    """
    Draws ground-truth polygon outlines on a given PIL Image.
    """
    if not gt_annotations:
        return img_pil

    img_with_polygons = img_pil.copy().convert("RGB")
    draw = ImageDraw.Draw(img_with_polygons)
    img_w, img_h = img_with_polygons.size

    for ann in gt_annotations:
        if 'segmentation' in ann and ann['segmentation']:
            raw_poly = ann['segmentation']
            pixel_poly = normalize_if_needed(list(raw_poly), img_w, img_h)

            if len(pixel_poly) >= 6: # Need at least 3 points for a polygon
                polygon_points = [(pixel_poly[i], pixel_poly[i+1]) for i in range(0, len(pixel_poly), 2)]
                draw.polygon(polygon_points, outline='lime', width=3)

    return img_with_polygons

# --- MODIFIED: Main Orchestrator Function ---

def calculate_iou_from_file(model, pil_img, gt_annotations, class_index, last_conv_name):
    """
    Orchestrates the entire IoU calculation process using pre-parsed annotations.
    """
    raw_heatmap = generate_raw_heatmap(model, pil_img, class_index, last_conv_name)
    pred_bbox = heatmap_to_bbox(raw_heatmap)

    if not pred_bbox:
        return {"error": "Could not derive a bounding box from the model's heatmap."}

    img_w, img_h = pil_img.size
    iou_scores = {}
    label_map = {0: "Body", 1: "Head", 2: "Tail"}

    for ann in gt_annotations:
        pixel_poly = normalize_if_needed(ann['segmentation'], img_w, img_h)
        gt_bbox = polygon_to_bbox(pixel_poly)
        if gt_bbox == (0,0,0,0): continue
        score = iou(pred_bbox, gt_bbox)
        label_name = label_map.get(ann['label'], f"Part_{ann['label']}")
        iou_scores[label_name] = max(iou_scores.get(label_name, 0.0), score)

    return {"scores": iou_scores, "predicted_bbox": pred_bbox}
