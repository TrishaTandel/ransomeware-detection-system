from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.core.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)
    label = Column(String)

    prediction = Column(Integer)
    probability = Column(Float)

    model_version = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)