from pydantic import BaseModel


class PredictResponse(BaseModel):
    prediction: int          # 0 or 1
    label: str               # Benign / Ransomware
    probability: float
    model_version: str