import pandas as pd
import joblib
import json
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.metrics import accuracy_score, classification_report

# Paths
DATA_PATH = Path("data/processed/processed.csv")
MODEL_DIR = Path("model")

MODEL_DIR.mkdir(exist_ok=True)

print("Loading processed dataset...")
df = pd.read_csv(DATA_PATH)

# -----------------------
# Split Features & Label
# -----------------------
# Separate features and label
label_column = df.columns[-1] 
X = df.drop(label_column, axis=1)
y = df[label_column]

# ✅ Keep only numeric columns
X = X.select_dtypes(include=["number"])

print("Numeric features used:", X.columns.tolist())

# -----------------------
# Train/Test Split
# -----------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------
# Feature Selection
# -----------------------
selector = SelectKBest(score_func=chi2, k=10)
X_train_selected = selector.fit_transform(X_train, y_train)
X_test_selected = selector.transform(X_test)

# -----------------------
# Model Training
# -----------------------
print("Training RandomForest model...")

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=12,
    random_state=42
)

model.fit(X_train_selected, y_train)

# -----------------------
# Evaluation
# -----------------------
preds = model.predict(X_test_selected)

accuracy = accuracy_score(y_test, preds)

print("\n✅ Model Accuracy:", accuracy)
print("\nClassification Report:")
print(classification_report(y_test, preds))

# save feature order
feature_names = list(X.columns)

with open("model/features.json", "w") as f:
    json.dump(feature_names, f)
joblib.dump(model, "model/model.pkl")
joblib.dump(feature_names, "model/feature_names.pkl")
joblib.dump(selector, "model/selector.pkl")

print("Model + selector + features saved")