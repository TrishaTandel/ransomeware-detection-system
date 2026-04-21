import joblib
import numpy as np
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "model/model.pkl"
SELECTOR_PATH = BASE_DIR / "model/selector.pkl"
FEATURE_PATH = BASE_DIR / "model/features.json"

model = joblib.load("model/model.pkl")
selector = joblib.load("model/selector.pkl")
feature_names = joblib.load("model/feature_names.pkl")

# load expected features
with open(FEATURE_PATH) as f:
    FEATURE_ORDER = json.load(f)


def predict(features):

    # build feature vector safely
    values = []

    for feature in feature_names:
        values.append(features.get(feature, 0))  # missing → 0

    values = np.array(values).reshape(1, -1)

    # feature selection
    selected = selector.transform(values)

    prediction = model.predict(selected)[0]
    probability = model.predict_proba(selected)[0][1]

    return {
        "prediction": int(prediction),
        "label": "Ransomware" if prediction == 1 else "Benign",
        "probability": float(probability),
        "model_version": "1.0"
    }