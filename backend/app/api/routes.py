from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials,HTTPBearer
from jose import JWTError, jwt
from app.schemas.request import LoginRequest, PredictRequest
from app.schemas.response import PredictResponse
from app.services.predictor import predict
from app.core.security import verify_password, create_access_token
from app.core.config import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.prediction import Prediction
from fastapi import UploadFile, File
from app.services.feature_extractor import extract_features
from fastapi import UploadFile, File

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
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = predict(data.features)

    # ✅ save to database
    record = Prediction(
        username=username,
        label=result["label"],
        prediction=result["prediction"],
        probability=result["probability"],
        model_version=result["model_version"]
    )

@router.post("/scan-file")
async def scan_file(file: UploadFile = File(...)):

    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        from app.services.feature_extractor import extract_features
        features = extract_features(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid file: {str(e)}")

    result = predict(features)
    return result

@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    records = db.query(Prediction).order_by(Prediction.id.desc()).all()

    return [
        {
           "id": r.id,
            "username": r.username,
            "label": r.label,
            "probability": r.probability,
            "created_at": r.created_at
        }
        for r in records
    ]