import joblib
import numpy as np

model = joblib.load("model/model.pkl")
feature_names = joblib.load("model/feature_names.pkl")

def predict(features: dict):
    # ensure correct order
    values = [features.get(f, 0) for f in feature_names]

    values = np.array(values).reshape(1, -1)

    pred = model.predict(values)[0]
    prob = model.predict_proba(values).max()

    return {
        "label": "Malware" if pred == 1 else "Benign",
        "prediction": int(pred),
        "probability": float(prob),
        "model_version": "v1"
    }