from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.api.interview import router as question_router
from app.core.config import settings
from app.db.database import Base, engine
from app.models.interview import *

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-interview-agent-pearl.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(question_router)


@app.get("/")
async def root():
    return {"message": "AI Interview Agent Backend Running 🚀"}