from pydantic import BaseModel
from typing import Dict

class LoginRequest(BaseModel):
    username: str
    password: str

class PredictRequest(BaseModel):
    features: Dict[str, float]