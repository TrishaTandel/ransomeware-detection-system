import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

print("Loading dataset...")
df = pd.read_csv("data/processed/processed.csv")

# ✅ Target column
target_col = "Benign"

# ✅ Only numeric features
X = df.select_dtypes(include=["int64", "float64"]).drop(columns=[target_col])
y = df[target_col]

# ✅ Save feature names
feature_names = X.columns.tolist()
joblib.dump(feature_names, "model/feature_names.pkl")

# ✅ Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# ✅ Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# ✅ Save model
joblib.dump(model, "model/model.pkl")

print("✅ Model trained successfully")