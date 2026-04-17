# create_dummy_model.py

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, chi2

X = np.random.rand(200, 10)
y = np.random.randint(0, 2, 200)

selector = SelectKBest(score_func=chi2, k=5)
X_selected = selector.fit_transform(X, y)

model = RandomForestClassifier()
model.fit(X_selected, y)

joblib.dump(model, "model/model.pkl")
joblib.dump(selector, "model/selector.pkl")

print("Dummy model created successfully")