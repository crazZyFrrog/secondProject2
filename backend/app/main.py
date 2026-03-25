import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import ai, auth, projects, users

app = FastAPI(title="Landing Builder API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def _auto_create_sqlite() -> None:
    if os.getenv("AUTO_CREATE_TABLES") == "1" and settings.DATABASE_URL.startswith(
        "sqlite"
    ):
        Base.metadata.create_all(bind=engine)
