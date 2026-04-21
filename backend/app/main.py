from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from prometheus_client import start_http_server
from app.core.database import Base, engine
from app.models import prediction



app = FastAPI(title="Ransomware Detection API")
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.on_event("startup")
def start_metrics():
    start_http_server(8001)