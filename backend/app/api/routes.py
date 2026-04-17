from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.schemas.request import LoginRequest, PredictRequest
from app.schemas.response import PredictResponse
from app.services.predictor import predict
from app.core.security import verify_password, create_access_token
from app.core.config import SECRET_KEY, ALGORITHM

router = APIRouter()
security = HTTPBearer()

# Demo user (replace with DB later)
fake_user = {
    "username": "admin",
    "password": "$2b$12$O9MSm2w7NaI0IYddz0.hD.YBNRkw7JKzZiE9Sw66yJN/IGmqKoqcq"  # hashed "admin123"
}

@router.post("/login")
def login(data: LoginRequest):
    if data.username != fake_user["username"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, fake_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/predict", response_model=PredictResponse)
def predict_route(
    data: PredictRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = predict(data.features)
    return result

@router.get("/health")
def health():
    return {"status": "ok"}